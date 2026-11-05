'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Industry = {
  tab: string;
  icon: string;
  eyebrow: string;
  heading: string;
  body: string;
  features: string[];
  cta: string;
  metricVal: string;
  metricLabel: string;
  metricDesc: string;
  spots: string[];
  badge: string;
};

// In-situ render for each tab (public/media/img/insitu-*.jpg).
const ROOM: Record<string, string> = {
  Education: 'education', Offices: 'offices', Leisure: 'leisure', Healthcare: 'healthcare', Hospitality: 'hospitality', Public: 'public',
};

const industries: Industry[] = [
  {
    tab: 'Education', icon: 'ti-school',
    eyebrow: 'Schools · Colleges · Universities',
    heading: 'PROTECTING PUPILS\nAND STAFF.',
    body: 'From secondary school toilets to university common rooms, Vape Sense gives pastoral leaders, safeguarding officers, and facilities teams the real-time visibility they need to act quickly.',
    features: ['Discreet sensors in toilets & changing rooms', 'Instant alerts to safeguarding leads', 'Tamper detection on all hardware', 'Event history to support safeguarding records'],
    cta: 'Get education pricing',
    metricVal: '<60s', metricLabel: 'ALERT TIME', metricDesc: 'From vape cloud to staff notification',
    spots: ['Pupil toilets', 'Changing rooms', 'Stairwells'],
    badge: 'Safeguarding ready',
  },
  {
    tab: 'Offices', icon: 'ti-building',
    eyebrow: 'Managed offices · Co-working · HQs',
    heading: 'CLEAN AIR,\nCLEAR POLICY.',
    body: 'Protect your no-smoking policy across breakout areas, stairwells, and private offices. Vape Sense gives facilities and HR teams documented evidence and continuous air-quality data.',
    features: ['Enforce no-vaping policies with evidence', 'Monitor air quality for wellbeing reports', 'Multi-floor coverage from one dashboard', 'Role-based access for facilities and HR'],
    cta: 'Get office pricing',
    metricVal: '1', metricLabel: 'DASHBOARD', metricDesc: 'For every floor, via one hub',
    spots: ['Restrooms', 'Stairwells', 'Back-of-house'],
    badge: 'Data stays on site',
  },
  {
    tab: 'Leisure', icon: 'ti-swimming',
    eyebrow: 'Gyms · Sports halls · Leisure centres',
    heading: 'SAFE SPACES\nFOR MEMBERS.',
    body: 'Changing rooms and shower areas are the hardest places to monitor in a leisure facility. Vape Sense protects members and gives operators the documentation needed for enforcement.',
    features: ['Changing room & shower area monitoring', 'Shower steam recognised and blocked', 'Tamper and cover alerts in busy zones', 'Continuous air-quality data'],
    cta: 'Get leisure pricing',
    metricVal: '0', metricLabel: 'CAMERAS', metricDesc: 'Safe for changing rooms',
    spots: ['Changing rooms', 'Toilets', 'Stairwells'],
    badge: 'Member protection',
  },
  {
    tab: 'Healthcare', icon: 'ti-heart-rate-monitor',
    eyebrow: 'Hospitals · Care homes · Clinics',
    heading: 'DIGNITY FIRST.\nSAFETY ALWAYS.',
    body: 'Smoking and vaping in patient washrooms is a safety risk and a policy headache. Vape Sense measures air only, so it can sit on the ceiling of a patient washroom without capturing anything personal.',
    features: ['Air only — fit for patient washrooms', 'Smoke reported separately from vape', 'Shower steam recognised and blocked', 'Data stays on the site network'],
    cta: 'Get healthcare pricing',
    metricVal: '0', metricLabel: 'CAMERAS', metricDesc: 'Nothing that identifies a patient',
    spots: ['Patient washrooms', 'Staff restrooms', 'Stairwells'],
    badge: 'Privacy-safe',
  },
  {
    tab: 'Hospitality', icon: 'ti-soup',
    eyebrow: 'Hotels · Restaurants · Event venues',
    heading: 'GUEST EXPERIENCE\nPROTECTED.',
    body: 'One guest complaint about vaping can damage your reviews. Vape Sense helps hospitality operators act before guests notice, maintaining the air quality and premium experience they expect.',
    features: ['Non-smoking guest room monitoring', 'Discreet hardware preserving aesthetics', 'Instant duty-manager alerts', 'Hairspray and shower steam blocked'],
    cta: 'Get hospitality pricing',
    metricVal: '<60s', metricLabel: 'ALERT TIME', metricDesc: 'To housekeeping or the duty manager',
    spots: ['Guest rooms', 'Shared bathrooms', 'Back-of-house'],
    badge: 'Guest experience',
  },
  {
    tab: 'Public', icon: 'ti-building-community',
    eyebrow: 'Libraries · Transport · Councils',
    heading: 'PUBLIC BUILDINGS,\nPUBLIC DUTY.',
    body: 'Local authorities and public amenity buildings have a duty to provide clean, safe environments. Vape Sense provides the infrastructure to meet that duty and respond with evidence.',
    features: ['Multi-building estate management', 'Duty of care documentation', 'Secure remote access for estate teams', 'CSV export of alarms and readings'],
    cta: 'Get public sector pricing',
    metricVal: '1', metricLabel: 'HUB', metricDesc: 'One dashboard for the whole estate',
    spots: ['Public restrooms', 'Waiting areas', 'Staff facilities'],
    badge: 'Fleet-wide updates',
  },
];

function BarFill({ width }: { width: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.width = '0%';
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => { el.style.width = `${width}%`; });
    });
    return () => cancelAnimationFrame(raf);
  }, [width]);
  return <div ref={ref} className="ind-bar-fill" />;
}

export default function IndustriesSection() {
  const [active, setActive] = useState(0);
  const d = industries[active];

  return (
    <section className="industries" id="industries">
      <h2 className="sr-only">Industries</h2>
      <div className="w">
        <div className="ind-header">
          <span className="section-tag" style={{ color: 'var(--c4)' }}>Industries</span>
          <div className="section-heading" style={{ color: 'var(--c0)' }}>
            YOUR SECTOR.
            <br />
            YOUR SOLUTION.
          </div>
          <p className="section-sub" style={{ color: 'var(--c6)', marginBottom: 20 }}>
            Select your building type to see where Vape Sense goes and why it fits.
          </p>
        </div>

        <div className="ind-tabs" role="tablist" aria-label="Industry sectors">
          {industries.map((ind, i) => (
            <button
              key={ind.tab}
              className={`ind-tab${active === i ? ' active' : ''}`}
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
            >
              <i className={`ti ${ind.icon}`} /> {ind.tab}
            </button>
          ))}
        </div>

        <div className="ind-panel">
          <div className="ind-content">
            <div className="ind-main" key={active}>
              <div className="ind-eyebrow">{d.eyebrow}</div>
              <div className="ind-heading">
                {d.heading.split('\n').map((line, i) => (
                  <span key={i}>{line}{i === 0 && <br />}</span>
                ))}
              </div>
              <p className="ind-body">{d.body}</p>
              <div className="ind-features">
                {d.features.map((f) => (
                  <div key={f} className="ind-feature">
                    <div className="ind-check"><i className="ti ti-check" /></div>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/contact" className="ind-cta">{d.cta} →</Link>
            </div>

            <div className="ind-visual" key={`v-${active}`}>
              <Image src={`/media/img/insitu-${ROOM[d.tab]}.jpg`} width={1200} height={900} alt={`Vape Sense installed in a ${d.tab.toLowerCase()} setting`} sizes="(max-width: 900px) 92vw, 40vw" />
            </div>

            <div className="ind-metrics" key={`m-${active}`}>
              <div className="ind-metric-label">{d.metricLabel}</div>
              <div className="ind-metric-val">{d.metricVal}</div>
              <p className="ind-metric-desc">{d.metricDesc}</p>
              <div className="ind-metric-label" style={{ marginTop: 6 }}>TYPICAL PLACEMENTS</div>
              {d.spots.map((spot) => (
                <div key={spot} className="ind-bar-row">
                  <div className="ind-bar-labels">
                    <span className="ind-bar-label">{spot}</span>
                    <span className="ind-bar-val"><i className="ti ti-check" /></span>
                  </div>
                  <div className="ind-bar-track"><BarFill width={100} /></div>
                </div>
              ))}
              <div className="ind-badge">
                <i className="ti ti-shield-check" />
                {d.badge}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
