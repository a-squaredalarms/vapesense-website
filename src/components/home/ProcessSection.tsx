'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { phaseAt, type Phase } from './device3d/detectionTimeline';

// WebGL only works in the browser, so skip server rendering for the 3D scene.
import SafeScene from './device3d/SafeScene';
import { PhoneAlert } from '@/components/ProductProof';
const DetectionScene = dynamic(() => import('./device3d/DetectionScene'), { ssr: false });

type StepState = 'idle' | 'active' | 'done';

const PHASE_LABEL: Record<Phase, string> = {
  monitoring: 'Monitoring air quality',
  analysing: 'Analysing particles…',
  detected: 'Vape detected',
};

// visual: 'device' shows the 3D sensor beside the simulation (home page); 'phone' shows the staff
// phone receiving the alert instead (How It Works, where the hero already shows the device).
export default function ProcessSection({ visual = 'device' }: { visual?: 'device' | 'phone' }) {
  const [steps, setSteps] = useState<StepState[]>(['idle', 'idle', 'idle']);
  const [connDone, setConnDone] = useState([false, false]);
  const [feeds, setFeeds] = useState([false, false, false, false]);
  const [status, setStatus] = useState('Ready — scroll into view to begin');
  const [elapsed, setElapsed] = useState('');
  const [dotState, setDotState] = useState<'idle' | 'running' | 'done'>('idle');
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>('monitoring');
  const [sceneVisible, setSceneVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef = useRef(0);
  const layoutRef = useRef<HTMLDivElement>(null);
  const autoStarted = useRef(false);

  const resetSim = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    tickRef.current = 0;
    setSteps(['idle', 'idle', 'idle']);
    setConnDone([false, false]);
    setFeeds([false, false, false, false]);
    setStatus('Ready — press Run simulation to begin');
    setElapsed('');
    setDotState('idle');
    setRunning(false);
    setStartedAt(null);
    setPhase('monitoring');
  }, []);

  const startSim = useCallback(() => {
    if (running) return;
    // Replaying after a finished run: clear the old run first.
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSteps(['idle', 'idle', 'idle']);
    setConnDone([false, false]);
    setFeeds([false, false, false, false]);
    setElapsed('');
    setRunning(true);
    setDotState('running');
    const start = performance.now();
    setStartedAt(start);
    setPhase('monitoring');
    tickRef.current = 0;

    // Steps follow the same clock as the 3D scene (time since start), so they stay in sync even
    // if the browser delays timer ticks. State is derived from the elapsed second, not counted.
    intervalRef.current = setInterval(() => {
      const t = Math.floor((performance.now() - start) / 1000);
      if (t === tickRef.current) return;
      tickRef.current = t;
      setElapsed(`${t}s elapsed`);
      setPhase(phaseAt(t));
      setFeeds([t >= 3, t >= 6, t >= 10, t >= 11]);
      setConnDone([t >= 5, t >= 9]);

      if (t >= 13) {
        setSteps(['done', 'done', 'done']);
        setStatus('COMPLETE — incident logged in 13 seconds');
        setDotState('done');
        setRunning(false);
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
      } else if (t >= 9) {
        setSteps(['done', 'done', 'active']);
        setStatus('ALERTING — notifying duty staff');
      } else if (t >= 5) {
        setSteps(['done', 'active', 'idle']);
        setStatus('VERIFYING — cross-referencing sensor array');
      } else if (t >= 1) {
        setSteps(['active', 'idle', 'idle']);
        setStatus('DETECTING — sensor S-07 triggered');
      }
    }, 200);
  }, [running]);

  // Start the simulation the first time the section scrolls into view, and only render the
  // 3D scene while it is on screen.
  useEffect(() => {
    const el = layoutRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setSceneVisible(entry.isIntersecting);
        if (entry.intersectionRatio >= 0.5 && !autoStarted.current) {
          autoStarted.current = true;
          startSim();
        }
      },
      { threshold: [0, 0.5] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [startSim]);

  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const stepData = [
    {
      label: 'Detect',
      desc: 'The ceiling sensor notices someone vaping in the room.',
      logs: ['[ 14:31:53 ] Floor 2 East washroom · checking'],
    },
    {
      label: 'Verify',
      desc: 'It makes sure it’s really vaping — hairspray, steam and dust are ignored.',
      logs: ['[ 14:31:55 ] Vaping confirmed · not a false alarm'],
    },
    {
      label: 'Alert',
      desc: 'The staff you chose for that room get an instant alert with the location and what happened.',
      logs: ['[ 14:31:56 ] Alert sent → Head of Year 9, duty staff'],
    },
  ];

  const feedData = [
    { color: '#D4870A', title: 'Vaping spotted', sub: 'Floor 2 East washroom' },
    { color: 'var(--c1)', title: 'Vaping confirmed', sub: 'Not spray, steam or dust' },
    { color: '#3BB273', title: 'Staff alerted', sub: 'Head of Year 9 + duty staff' },
    { color: '#3BB273', title: 'Incident logged', sub: 'Ref #VS-2024-0847' },
  ];

  return (
    <section className="process" id="process">
      <h2 className="sr-only">How It Works</h2>
      <div className="w">
        <div className="proc-header">
          <span className="section-tag" style={{ color: 'var(--c4)' }}>How it works</span>
          <div className="section-heading" style={{ color: 'var(--c0)' }}>
            WATCH A LIVE
            <br />
            INCIDENT UNFOLD.
          </div>
          <p className="section-sub" style={{ color: 'var(--c6)' }}>
            Watch a simulated vape incident, from the first puff to the alert on a staff phone.
          </p>
        </div>

        <div className="proc-layout" ref={layoutRef}>
        <div className="proc-frame">
          <div className="proc-topbar">
            <span className="proc-topbar-label">INCIDENT SIMULATION — SCHOOL BUILDING A</span>
            <div className="proc-topbar-btns">
              <button
                className="btn btn-ghost-c1"
                onClick={resetSim}
                disabled={!running && steps[0] === 'idle'}
                style={!running && steps[0] === 'idle' ? { opacity: .4, cursor: 'default' } : {}}
              >
                Reset
              </button>
              <button className="btn btn-solid-c1" onClick={startSim} disabled={running}>
                {running ? 'Running…' : dotState === 'done' ? 'Replay' : 'Run simulation'}
              </button>
            </div>
          </div>

          <div className="proc-body">
            <div className="proc-pipeline">
              {stepData.map((s, i) => (
                <div key={i} className={`proc-step${steps[i] !== 'idle' ? ' ' + steps[i] : ''}`}>
                  <div className="proc-step-left">
                    <div className={`proc-circle${steps[i] === 'active' ? ' active' : steps[i] === 'done' ? ' done' : ''}`}>
                      {steps[i] === 'done' ? <i className="ti ti-check" style={{ fontSize: 17 }} /> : i + 1}
                    </div>
                    {i < 2 && (
                      <div className={`proc-connector${connDone[i] ? ' done' : ''}`} />
                    )}
                  </div>
                  <div className="proc-step-content">
                    <div className="proc-step-label">{s.label}</div>
                    <p className="proc-step-desc">{s.desc}</p>
                    <div className="proc-log">
                      {s.logs.map((line, li) => (
                        <span key={li} className="proc-log-line">
                          {line}
                          {li === s.logs.length - 1 && <span className="cursor" />}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="proc-alert-feed">
              <div className="feed-title">LIVE ALERT FEED</div>
              {feedData.map((f, i) => (
                <div key={i} className={`feed-item${feeds[i] ? ' show' : ''}`}>
                  <div className="feed-item-row">
                    <div className="feed-dot" style={{ background: f.color }} />
                    <span className="feed-item-title">{f.title}</span>
                    <span className="feed-item-time">14:31</span>
                  </div>
                  <span className="feed-item-sub">{f.sub}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="proc-footer">
            <div className={`proc-status-dot${dotState === 'running' ? ' running' : dotState === 'done' ? ' done' : ''}`} />
            <span className="proc-status-text">{status}</span>
            <span className="proc-elapsed">{elapsed}</span>
          </div>
        </div>

        {visual === 'phone' ? (
          <div className="proc-scene proc-phone" aria-hidden="true">
            <div className="vhero-glow" aria-hidden="true" />
            <PhoneAlert solo show={steps[2] !== 'idle'} room="Floor 2 East washroom" time="14:31" />
          </div>
        ) : (
        <div className="proc-scene" aria-hidden="true">
          <SafeScene><DetectionScene startedAt={startedAt} visible={sceneVisible} /></SafeScene>
          <div className={`proc-scene-chip ${phase}`}>
            <span className="dot" />
            {PHASE_LABEL[phase]}
          </div>
          <div className={`proc-scene-alert${phase === 'detected' ? ' show' : ''}`}>
            <div className="proc-scene-alert-app">Vape Sense · now</div>
            <div className="proc-scene-alert-title">Vape detected</div>
            <div className="proc-scene-alert-body">Floor 2 East washroom. Duty staff notified.</div>
          </div>
        </div>
        )}
        </div>
      </div>
    </section>
  );
}
