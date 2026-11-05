import type { Metadata } from 'next';
import Link from 'next/link';
import ProcessSection from '@/components/home/ProcessSection';
import { Chapter, CheckList, CtaBanner, AlertsVsBlocked } from '@/components/PageBlocks';
import { VisualHero, FramedVideo, InstallSteps } from '@/components/Media';
import HeroDevice from '@/components/home/device3d/HeroDevice';

export const metadata: Metadata = {
  title: 'How Vape Sense Works — From First Puff to Staff Alert',
  description: 'How VapeSense alerts staff to vaping and smoking in under 60 seconds, ignores hairspray, steam and dust, and gives your team everything they need to respond.',
  alternates: { canonical: '/how-it-works' },
};

export default function HowItWorksPage() {
  return (
    <>
      <VisualHero
        tag="How it works"
        title={<>DETECT. DECIDE.<br /><span className="accent">ALERT.</span></>}
        sub="From the first puff to a staff phone in under 60 seconds — with hairspray, steam and dust filtered out along the way."
        ctas={[{ href: '/contact', label: 'See it live' }, { href: '#detect-vs-block', label: 'Detect vs block', ghost: true }]}
        visual={
          <div className="vhero-device" role="img" aria-label="The Vape Sense sensor, seen from the side">
            {/* Same device as the home hero, turned the other way and tilted a little more */}
            <HeroDevice yaw={Math.PI / 6} tilt={0.3} align="center" />
          </div>
        }
      />

      <ProcessSection visual="phone" />

      <section className="content-section light">
        <div className="content-inner">
          <div className="section-head">
            <Chapter n="01" label="One puff, one minute" />
            <h2 className="cs-heading">FROM PUFF TO PHONE<br />IN UNDER A MINUTE.</h2>
            <p className="story-lead">
              A pupil steps into a cubicle and takes a puff. Here is what happens in the next minute —
              and why a can of hairspray in the same room never bothers anyone.
            </p>
          </div>
          <ol className="timeline5">
            {[
              { t: 'Puff', title: 'Someone vapes', desc: 'In a toilet, changing room or stairwell — anywhere staff can’t watch.' },
              { t: 'Spot', title: 'Vape Sense notices', desc: 'The ceiling sensor picks it up straight away. No camera, no microphone.' },
              { t: 'Check', title: 'It makes sure', desc: 'Hairspray, steam and dust are recognised and ignored. Only real incidents go further.' },
              { t: '<60 s', title: 'The right staff are alerted', desc: 'Only the people you chose for that room get the alert, with the room and whether it’s vape or smoke.' },
              { t: 'After', title: 'It’s on record', desc: 'Every incident is logged, so you can spot patterns and back up your policies.' },
            ].map((step, i) => (
              <li key={step.title} className={i === 2 ? 'key' : ''}>
                <span className="tl-time">{step.t}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="content-section tint" id="detect-vs-block">
        <div className="content-inner">
          <Chapter n="02" label="The difference" />
          <div className="cs-heading" style={{ color: 'var(--c0)' }}>CATCHES THE VAPE.<br />IGNORES THE HAIRSPRAY.</div>
          <p className="story-lead">
            This is what separates VapeSense from detectors that cry wolf. It is built to catch real
            vaping and smoking every time, while ignoring the everyday look-alikes that make cheaper
            detectors useless.
          </p>
          <AlertsVsBlocked />
          <Link href="/blog/why-vape-detectors-false-alarm" className="cs-card-link">Why other detectors false alarm →</Link>
        </div>
      </section>

      <section className="content-section dark">
        <div className="content-inner">
          <div className="feature" style={{ marginBottom: 28 }}>
            <div className="feature-copy">
          <Chapter n="03" label="After the alert" tone="dark" />
          <h2 className="cs-heading" style={{ color: 'var(--cw)' }}>BUILT FOR THE<br />PEOPLE WHO RESPOND.</h2>
          <p className="story-lead">Every alert lands on one timeline your team can look back through — so you can act on patterns, not just incidents.</p>
            </div>
            <div className="feature-media"><FramedVideo name="07-network" label="Alerts from every room, in one place" /></div>
          </div>
          <div className="stat-grid">
            {[
              { val: '<60s', lbl: 'Cloud to alert', desc: 'Push to phones, tablets and computers — no app store — plus email.' },
              { val: '0', lbl: 'Cloud accounts needed', desc: 'Your data stays on your own site. Export reports whenever you need them.' },
              { val: '1:1', lbl: 'Room to responder', desc: 'Choose who is alerted for each room — the head of girls for the girls’ toilets, the PE team for the changing rooms.' },
            ].map((s) => (
              <div key={s.lbl} className="stat-card dark">
                <span className="stat-val">{s.val}</span>
                <span className="stat-label" style={{ color: 'var(--c3)' }}>{s.lbl}</span>
                <p className="stat-desc" style={{ color: 'rgba(255,255,255,.45)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <CheckList tone="dark" items={[
            'Choose which staff are alerted for each sensor — no more alerting everyone',
            'Schedule active hours and rest sensors over weekends and holidays',
            'Adjust sensitivity from the dashboard — no site visit',
            'See at a glance that every sensor is online and working',
            'Check in securely from home or another site',
          ]} />
        </div>
      </section>

      <section className="content-section light">
        <div className="content-inner">
          <div className="section-head">
            <Chapter n="04" label="Getting started" />
            <h2 className="cs-heading">UP AND RUNNING<br />IN FOUR STEPS.</h2>
            <p className="story-lead">
              A qualified electrician fits each sensor to the ceiling. Then you name the room, add your
              staff, set your hours and press the test button.
            </p>
          </div>
          <InstallSteps />
          <Link href="/blog/where-to-place-a-vape-sensor" className="cs-card-link" style={{ marginTop: 28 }}>Where to place a sensor →</Link>
        </div>
      </section>

      <CtaBanner
        heading="READY TO SEE IT"
        accent="LIVE?"
        sub="We’ll run a live demonstration — a vape alert, and a can of hairspray being ignored — and answer your team’s questions."
        secondary={{ href: '/technology', label: 'Why Vape Sense' }}
      />
    </>
  );
}
