'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const PROBLEMS = [
  {
    num: '01',
    tab: 'Hidden Incidents',
    icon: 'ti-eye-off',
    category: 'Safeguarding & Security',
    headingLines: ["You don't know", "it's happening."],
    desc: "Vaping in toilets, changing rooms, and off-camera areas goes completely undetected. By the time a complaint is raised, the incident is over, the person is gone, and there's nothing to act on.",
    metrics: [
      { label: 'Cameras allowed in washrooms', value: 'None' },
      { label: 'With Vape Sense', value: 'Air-only alerts' },
    ],
    statLabel: 'CAMERAS',
    statValue: '0',
    statSub: 'where vaping actually happens — and none in Vape Sense either',
  },
  {
    num: '02',
    tab: 'False Alarms',
    icon: 'ti-bell-x',
    category: 'Trust & Adoption',
    headingLines: ['Cheap detectors', 'cry wolf.'],
    desc: "Basic sensors only count particles, so hairspray, deodorant, shower steam and dust all look like vaping. After a few wasted trips to the toilet block, staff stop responding — and the system becomes worse than useless.",
    metrics: [
      { label: 'Common false triggers', value: 'Sprays · steam · dust' },
      { label: 'With Vape Sense', value: 'Blocked' },
    ],
    statLabel: 'LOOK-ALIKES BLOCKED',
    statValue: '5',
    statSub: 'sprays, steam, dust, fans and candles — recognised and suppressed',
  },
  {
    num: '03',
    tab: 'Delayed Response',
    icon: 'ti-clock-pause',
    category: 'Duty of Care',
    headingLines: ['By the time you know,', "it's too late."],
    desc: "Without real-time alerts, staff cannot respond promptly. By the time someone reports it, the evidence is gone, the person has left, and your duty-of-care record shows nothing.",
    metrics: [
      { label: 'Without alerts', value: 'Only if reported' },
      { label: 'With Vape Sense', value: 'Alert in <60s' },
    ],
    statLabel: 'ALERT TIME',
    statValue: '<60s',
    statSub: 'from vape cloud to staff phone, with room and severity',
  },
];

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1400;
          const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}</span>;
}

export default function HomeChallenge() {
  const [active, setActive] = useState(0);
  const p = PROBLEMS[active];

  return (
    <section className="hch">
      <div className="hch-inner">

        {/* TOP: heading + stat card */}
        <div className="hch-top">
          <div>
            <div className="hch-tag">The challenge</div>
            <div className="hch-h1">Vaping happens.</div>
            <div className="hch-h2">Here&apos;s what stops it.</div>
            <p className="hch-desc">
              Hidden incidents. Detectors that cry wolf. Responses that come too late. Whether you need
              to cover one room or an entire building — this is the story Vape Sense was built to change.
            </p>
          </div>
          <div className="hch-stat-card">
            <span className="hch-stat-num"><AnimatedCounter target={60} /></span>
            <span className="hch-stat-lbl">Seconds or less from<br />vape cloud to staff alert</span>
          </div>
        </div>

        {/* TABS */}
        <div className="hch-tabs" role="tablist">
          {PROBLEMS.map((prob, i) => (
            <button
              key={i}
              className={`hch-tab${active === i ? ' active' : ''}`}
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
            >
              <div className="hch-tab-num">Problem {prob.num}</div>
              <i className={`ti ${prob.icon} hch-tab-icon`} aria-hidden="true" />
              <div className="hch-tab-title">{prob.tab}</div>
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="hch-content">
          <div className="hch-left">
            <div className="hch-eyebrow">Problem {p.num} — {p.category}</div>
            <h2 className="hch-problem-h">
              {p.headingLines[0]}<br />{p.headingLines[1]}
            </h2>
            <p className="hch-problem-desc">{p.desc}</p>
            <div className="hch-metrics">
              {p.metrics.map((m) => (
                <div key={m.label} className="hch-metric">
                  <span className="hch-metric-label">{m.label}</span>
                  <span className="hch-metric-value">{m.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hch-right">
            <div>
              <div className="hch-right-stat-label">{p.statLabel}</div>
              <div className="hch-right-stat-num">{p.statValue}</div>
              <div className="hch-right-stat-sub">{p.statSub}</div>
            </div>
            <hr className="hch-divider" />
            <div>
              <div className="hch-solved-label">Solved by</div>
              <div className="hch-product-links">
                <Link href="/products/vapesense" className="hch-product-link">
                  <span className="hch-product-dot" aria-hidden="true" />
                  <span className="hch-product-body">
                    <span className="hch-product-name">VapeSense Standalone</span>
                    <span className="hch-product-sub">Single-room solution</span>
                  </span>
                  <i className="ti ti-arrow-right hch-product-arrow" aria-hidden="true" />
                </Link>
                <Link href="/products/vapesense-hub" className="hch-product-link">
                  <span className="hch-product-dot" aria-hidden="true" />
                  <span className="hch-product-body">
                    <span className="hch-product-name">VapeSense Hub system</span>
                    <span className="hch-product-sub">Building-wide network</span>
                  </span>
                  <i className="ti ti-arrow-right hch-product-arrow" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
