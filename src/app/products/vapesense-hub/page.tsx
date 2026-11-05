import type { Metadata } from 'next';
import Image from 'next/image';
import JsonLd from '@/components/JsonLd';
import { Chapter, CheckList, CtaBanner } from '@/components/PageBlocks';
import { VisualHero, FactStrip, Feature, FramedVideo, FramedImage, IMG } from '@/components/Media';
import { SITE, absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'VapeSense Hub System — Building-Wide Vape Detection',
  description:
    'Cover every washroom, changing room and stairwell. VapeSense Satellites report to one Hub: one dashboard, one alert feed, central users, schedules and updates for the whole site.',
  alternates: { canonical: '/products/vapesense-hub' },
};

const why = [
  { icon: 'ti-layout-dashboard', title: 'One dashboard, one alert feed', body: 'Every room in one place. Staff don’t juggle ten logins.' },
  { icon: 'ti-users', title: 'The right person, every time', body: 'Choose who is alerted for each room, so the nearest responder goes — not the whole staff room.' },
  { icon: 'ti-calendar-time', title: 'One schedule, one config', body: 'School hours and detection sensitivity set once for the estate.' },
  { icon: 'ti-refresh', title: 'Always up to date', body: 'Every sensor is updated from one screen. Nobody climbs a ladder.' },
  { icon: 'ti-world', title: 'Check in from anywhere', body: 'Secure access to the whole site from home or another building.' },
  { icon: 'ti-lock', title: 'Secure by design', body: 'Encrypted throughout, and your data stays on your own site.' },
];

const nodes = [
  { name: 'Satellite 1', room: 'Pupil toilets, 1F' },
  { name: 'Satellite 2', room: 'Changing room' },
  { name: 'Satellite N', room: 'Stairwell' },
];

export default function VapeSenseHubPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'VapeSense Hub system',
          description: metadata.description,
          brand: { '@type': 'Brand', name: SITE.name },
          category: 'Vape and smoke detection system',
          image: absoluteUrl(IMG.studio.src),
          url: absoluteUrl('/products/vapesense-hub'),
        }}
      />

      <VisualHero
        tag="VapeSense Hub system"
        title={<>EVERY ROOM.<br /><span className="accent">ONE</span> VIEW.</>}
        sub="A Satellite in every washroom, changing room and stairwell, all reporting to one Hub. One dashboard, one alert feed, one set of logins and one update button for your entire site."
        ctas={[{ href: '/contact', label: 'Talk to us about a rollout' }, { href: '/products/specifications', label: 'Specifications', ghost: true }]}
        video={{ name: '07-network', label: 'One school · every washroom' }}
      />
      <FactStrip facts={[
        { val: '1', lbl: 'DASHBOARD FOR EVERY ROOM' },
        { val: '+1', lbl: 'ADD ROOMS ANY TIME' },
        { val: 'AUTO', lbl: 'NEW SENSORS JOIN BY THEMSELVES' },
        { val: '1', lbl: 'SET OF STAFF LOGINS' },
      ]} />

      <Feature tone="dark" media={<FramedImage image={IMG.ceiling} label="One sensor in every room" cover />}>
        <Chapter n="01" label="The problem with many single units" />
        <h2 className="cs-heading" style={{ color: 'var(--c0)' }}>TEN ROOMS SHOULDN’T<br />MEAN TEN SYSTEMS.</h2>
        <p className="story-lead">
          One sensor in one room is simple. Twelve standalone sensors across a school is twelve
          dashboards, twelve sets of logins and twelve schedules to keep in sync. That’s where most
          rollouts stall.
        </p>
        <p className="story-lead">
          The Hub fixes that. It sits safely in an office or comms room, and every sensor reports to
          it — all day, every room, one timeline.
        </p>
      </Feature>

      <section className="content-section dark">
        <div className="content-inner">
          <div className="section-head">
            <Chapter n="02" label="How it fits together" tone="dark" />
            <h2 className="cs-heading" style={{ color: 'var(--cw)' }}>HUB AND SPOKE.</h2>
          </div>
          <div className="arch" role="img" aria-label="Diagram: sensors in each room send encrypted data to one central hub">
            <div className="arch-hub">
              <strong>VapeSense Hub</strong>
              <span>Dashboard · Alerts · Users &amp; roles · Schedule · Updates · Reports</span>
            </div>
            <div className="arch-links"><div>Encrypted</div><div>Encrypted</div><div>Encrypted</div></div>
            <div className="arch-nodes">
              {nodes.map((n) => (
                <div key={n.name} className="arch-node">
                  <Image src={IMG.studio.src} width={IMG.studio.w} height={IMG.studio.h} alt="" className="arch-node-img" sizes="160px" />
                  <strong>{n.name}</strong>
                  <span>{n.room}</span>
                </div>
              ))}
            </div>
          </div>
          <CheckList tone="dark" items={[
            'New sensors join the hub by themselves — no configuration needed',
            'Every sensor’s health is visible at a glance, so you know the whole site is covered',
            'Staff get one alert feed for the whole site, with the room and type of incident',
            'Add sensors at any time without adding management overhead',
          ]} />
        </div>
      </section>

      <section className="content-section light">
        <div className="content-inner">
          <div className="section-head">
            <Chapter n="03" label="Why a hub beats a pile of units" />
            <h2 className="cs-heading" style={{ color: 'var(--c0)' }}>SET IT ONCE. APPLY IT EVERYWHERE.</h2>
          </div>
          <div className="card-grid">
            {why.map((w) => (
              <div key={w.title} className="cs-card">
                <div style={{ fontSize: 26, color: 'var(--c1)', marginBottom: 10 }}><i className={`ti ${w.icon}`} /></div>
                <h3 className="cs-card-title">{w.title}</h3>
                <p className="cs-card-body">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Feature tone="dark" flip media={<FramedVideo name="09-schedule" label="School-hours schedule" />}>
        <Chapter n="04" label="Only when it matters" tone="dark" />
        <h2 className="cs-heading" style={{ color: 'var(--cw)' }}>ONE CALENDAR<br />FOR THE WHOLE SITE.</h2>
        <p className="story-lead">
          Set active hours and weekly windows once on the hub, and every sensor follows them. Rest the
          whole fleet over weekends, half-terms and holidays — no out-of-hours noise.
        </p>
        <CheckList tone="dark" items={['Recurring weekly windows, e.g. Mon–Fri 08:00–17:00', 'Holiday and date-range rest periods', 'Sensitivity adjusted centrally, no site visits']} />
      </Feature>

      <Feature tone="tint" media={<FramedImage image={IMG.step2} label="Each sensor fitted by an electrician" light />}>
        <Chapter n="05" label="A typical rollout" />
        <h2 className="cs-heading" style={{ color: 'var(--c0)' }}>FROM ONE BLOCK<br />TO THE WHOLE CAMPUS.</h2>
        <div className="story-steps">
          {[
            ['Survey', 'Agree which rooms need cover — one sensor per enclosed room up to about 30 m².'],
            ['Hub first', 'Install and power the hub in a secure office or comms room on the same network.'],
            ['Sensors', 'An electrician fits each sensor and notes the room — it becomes the alert location.'],
            ['Go live', 'Sensors join the hub by themselves. Add staff, set the schedule and send a test alert to every phone.'],
          ].map(([t, d], i) => (
            <div key={t} className="story-step">
              <div className="story-step-n">0{i + 1}</div>
              <div><h3>{t}</h3><p>{d}</p></div>
            </div>
          ))}
        </div>
      </Feature>

      <CtaBanner
        heading="PLANNING A"
        accent="SITE-WIDE ROLLOUT?"
        sub="Send us a floor plan or a room list. We’ll suggest sensor positions and quote the full system."
        primary={{ href: '/contact', label: 'Talk to sales' }}
        secondary={{ href: '/blog/where-to-place-a-vape-sensor', label: 'Placement guide' }}
      />
    </>
  );
}
