import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Chapter, CheckList, CtaBanner, AlertsVsBlocked } from '@/components/PageBlocks';
import { VisualHero, FactStrip, Feature, FramedVideo, FramedImage, IMG } from '@/components/Media';

// Why Vape Sense: the reasons to buy, written for decision-makers.
// Deliberately no internals, component names, measurements or detection method — the full technical
// pack is shared on request through sales.

export const metadata: Metadata = {
  title: 'Why Vape Sense — Accurate, Tamper-Proof, Privacy-Safe Vape Detection',
  description:
    'Why schools, hospitals and businesses choose Vape Sense: alerts staff can trust, no false alarms from sprays or steam, tamper alerts, no cameras or microphones, and simple day-to-day running.',
  alternates: { canonical: '/technology' },
};

const reasons = [
  { icon: 'ti-target-arrow', title: 'Alerts you can trust', body: 'Vaping and smoking are caught. Hairspray, steam and dust are not mistaken for them.' },
  { icon: 'ti-bolt', title: 'Fast enough to act on', body: 'Staff are told in under 60 seconds, with the exact room — while it still matters.' },
  { icon: 'ti-shield-lock', title: 'Hard to beat', body: 'Open it, cover it or take it down and staff are alerted straight away.' },
  { icon: 'ti-camera-off', title: 'Privacy-safe', body: 'No cameras, no microphones. Fit for toilets and changing rooms.' },
  { icon: 'ti-adjustments', title: 'Easy to run', body: 'Schedules, staff access and sensitivity are all set from one simple dashboard.' },
  { icon: 'ti-trending-up', title: 'Grows with you', body: 'Start with one room. Add sensors and a hub when you are ready for more.' },
];

export default function WhyVapeSensePage() {
  return (
    <>
      <VisualHero
        tag="Why Vape Sense"
        title={<>BUILT TO BE<br /><span className="accent">TRUSTED.</span></>}
        sub="A vape detector is only worth having if staff believe its alerts. Vape Sense is built around that one idea — so every alert is real, fast and worth responding to."
        ctas={[{ href: '/contact', label: 'Book a free demo' }, { href: '/products', label: 'See the products', ghost: true }]}
        image={IMG.studio}
      />
      <FactStrip facts={[
        { val: '<60s', lbl: 'FROM VAPE TO STAFF ALERT' },
        { val: '0', lbl: 'CAMERAS OR MICROPHONES' },
        { val: '~30m²', lbl: 'COVERED PER SENSOR' },
        { val: '1', lbl: 'DASHBOARD FOR EVERY ROOM' },
      ]} />

      <section className="content-section light">
        <div className="content-inner">
          <div className="section-head">
            <Chapter n="01" label="Six reasons" />
            <h2 className="cs-heading" style={{ color: 'var(--c0)' }}>WHY SITES<br />CHOOSE VAPE SENSE.</h2>
          </div>
          <div className="card-grid">
            {reasons.map((r) => (
              <div key={r.title} className="cs-card">
                <div style={{ fontSize: 26, color: 'var(--c1)', marginBottom: 10 }}><i className={`ti ${r.icon}`} aria-hidden="true" /></div>
                <h3 className="cs-card-title">{r.title}</h3>
                <p className="cs-card-body">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Feature tone="dark" media={<FramedVideo name="04-detection" label="Animation: a vape cloud detected in a washroom" />}>
        <Chapter n="02" label="Accuracy" tone="dark" />
        <h2 className="cs-heading">NO MORE<br />CRYING WOLF.</h2>
        <p className="story-lead">
          Cheap detectors go off for body spray, a hot shower or a dusty floor. After a few wasted trips,
          staff stop responding. Vape Sense is built to know the difference, so when it alerts, it’s real.
        </p>
        <CheckList tone="dark" items={[
          'Catches vaping and smoking — and tells you which',
          'Ignores hairspray, deodorant, steam and dust',
          'Works in clean, dusty, humid or busy rooms, with no setting up per room',
          'One incident means one alert, not a flood of notifications',
        ]} />
      </Feature>

      <section className="content-section tint">
        <div className="content-inner">
          <div className="section-head">
            <Chapter n="03" label="What it reacts to" />
            <h2 className="cs-heading" style={{ color: 'var(--c0)' }}>CATCHES THE VAPE.<br />IGNORES THE HAIRSPRAY.</h2>
          </div>
          <AlertsVsBlocked />
          <Link href="/how-it-works" className="cs-card-link">See how an alert reaches your staff →</Link>
        </div>
      </section>

      <Feature tone="dark" flip media={<FramedImage image={IMG.ceilingLive} label="Locked to the ceiling" cover />}>
        <Chapter n="04" label="Tamper-proof" tone="dark" />
        <h2 className="cs-heading">CAN’T BE COVERED.<br />CAN’T BE REMOVED.</h2>
        <p className="story-lead">
          The first thing some people try is beating the detector. Vape Sense is locked to the ceiling
          and watches out for itself, so any attempt becomes an alert of its own.
        </p>
        <CheckList tone="dark" items={[
          'Alert if the sensor is opened, covered or removed',
          'Alert if a sensor stops reporting for any reason',
          'Locked in place with security screws',
          'Sealed, discreet white enclosure that blends into any ceiling',
        ]} />
      </Feature>

      <section className="content-section light">
        <div className="content-inner two-col-wide">
          <div>
            <Chapter n="05" label="Privacy & security" />
            <h2 className="cs-heading" style={{ color: 'var(--c0)' }}>SAFE FOR THE<br />ROOMS THAT MATTER.</h2>
            <p className="story-lead">
              Toilets and changing rooms are exactly where vaping happens — and exactly where cameras
              aren’t allowed. Vape Sense was designed for these spaces from day one.
            </p>
            <CheckList items={[
              'No camera, no microphone — nothing that identifies a person',
              'Your data stays on your own site, not in someone else’s cloud',
              'Encrypted throughout, with no changes to your firewall',
              'Staff only see what their role allows',
              'Automatic software updates keep every unit up to date',
            ]} />
            <Link href="/privacy-and-security" className="cs-card-link">Privacy & security in full →</Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Image src={IMG.lineIso.src} width={IMG.lineIso.w} height={IMG.lineIso.h} alt={IMG.lineIso.alt} style={{ width: '100%', maxWidth: 380, height: 'auto' }} sizes="380px" />
          </div>
        </div>
      </section>

      <Feature tone="dark" media={<FramedVideo name="09-schedule" label="Animation: sensors following the school timetable" />}>
        <Chapter n="06" label="Easy to run" tone="dark" />
        <h2 className="cs-heading">NO EXPERTS<br />NEEDED.</h2>
        <p className="story-lead">
          Once it’s on the ceiling, Vape Sense looks after itself. Your team gets alerts and a simple
          dashboard; nobody needs to become a specialist.
        </p>
        <CheckList tone="dark" items={[
          'Set active hours and rest sensors over weekends and holidays',
          'Adjust sensitivity from the dashboard — no site visit',
          'Check in from home or another site, securely',
          'Alerts to any phone, tablet or computer — no app to install',
        ]} />
      </Feature>

      <CtaBanner
        heading="NEED DETAILS FOR"
        accent="YOUR IT TEAM?"
        sub="We’ll share the datasheet, installation guide and security information directly with your team, and answer their questions on a call."
        primary={{ href: '/contact?type=quote', label: 'Request the technical pack' }}
        secondary={{ href: '/contact', label: 'Book a demo' }}
      />
    </>
  );
}
