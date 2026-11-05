import type { Metadata } from 'next';
import { Chapter, CtaBanner, SpecTable } from '@/components/PageBlocks';
import { VisualHero, FactStrip, DimensionDrawing, IMG } from '@/components/Media';

export const metadata: Metadata = {
  title: 'Specifications — VapeSense Vape & Smoke Detector',
  description:
    'VapeSense at a glance: detects vaping, smoking and tampering; alerts in under 60 s; covers one room up to ~30 m²; hard-wired 240 V; Wi-Fi or Ethernet; 137 × 122 × 41 mm; CE marked.',
  alternates: { canonical: '/products/specifications' },
};

// Buyer-level facts only. Sensing hardware, measurement ranges and network internals are shared
// with customers on request (datasheet), not published.
const groups: { title: string; rows: [string, string][] }[] = [
  { title: 'Detection', rows: [
    ['Alerts on', 'Vaping, smoking, tampering, sensor offline'],
    ['Ignores', 'Steam, aerosol sprays, dust, fans, candles at a distance'],
    ['Time to alert', 'Under 60 seconds'],
    ['Set-up per room', 'None — adapts to each room by itself'],
    ['Alerts sent to', 'Phones, tablets and computers (no app needed), plus e-mail'],
  ] },
  { title: 'Management', rows: [
    ['Dashboard', 'Web browser, on site or remote'],
    ['Staff roles', 'Admin, IT staff, view-only staff'],
    ['Scheduling', 'Active hours, weekends and holidays'],
    ['Updates', 'Automatic, over the air'],
    ['Reports', 'Alert history and export'],
  ] },
  { title: 'Installation', rows: [
    ['Power', '240 V AC, hard-wired by a qualified electrician'],
    ['Consumption', 'Under 5 W typical'],
    ['Connection', 'Wi-Fi or wired Ethernet'],
    ['Mounting', 'Ceiling, 2.4 – 3.5 m'],
    ['Coverage', 'One enclosed room up to approx. 30 m²'],
  ] },
  { title: 'Physical & compliance', rows: [
    ['Dimensions (W × H × D)', '137 × 122 × 41 mm incl. mounting plate'],
    ['Weight', 'Approx. 300 g'],
    ['Enclosure', 'White, discreet, locked with security screws'],
    ['Environment', 'Indoor use, 0 to +40 °C'],
    ['Compliance', 'CE (RED, RoHS), WEEE'],
  ] },
];

export default function SpecificationsPage() {
  return (
    <>
      <VisualHero
        tag="Specifications"
        title={<>THE <span className="accent">NUMBERS.</span></>}
        sub="The key facts for planning your installation. The full datasheet is available to customers and installers on request. Specifications subject to change without notice."
        ctas={[{ href: '/contact?type=quote', label: 'Request the datasheet' }]}
        image={IMG.lineIso}
      />
      <FactStrip facts={[
        { val: '137×122', lbl: 'MM · 41 MM DEEP' },
        { val: '<5W', lbl: 'TYPICAL CONSUMPTION' },
        { val: '<60s', lbl: 'TIME TO ALERT' },
        { val: 'CE', lbl: 'RED · ROHS · WEEE' },
      ]} />

      <section className="content-section light">
        <div className="content-inner">
          <div className="section-head">
            <Chapter n="01" label="Dimensions" />
            <h2 className="cs-heading" style={{ color: 'var(--c0)' }}>COMPACT. DISCREET.<br />LOCKED DOWN.</h2>
            <p className="story-lead">Small enough to go unnoticed, solid enough to stay put. Depth includes the mounting plate.</p>
          </div>
          <DimensionDrawing />
        </div>
      </section>

      <section className="content-section tint">
        <div className="content-inner two-col">
          {[groups.slice(0, 2), groups.slice(2)].map((col, i) => (
            <div key={i}>
              {col.map((g) => (
                <div key={g.title}>
                  <h2 className="spec-group">{g.title}</h2>
                  <SpecTable rows={g.rows} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
      <CtaBanner
        heading="NEED THE FULL"
        accent="DATASHEET?"
        sub="Customers and installers can request the datasheet, installation guide and EU Declaration of Conformity. We’ll send them over with a quote."
        primary={{ href: '/contact?type=quote', label: 'Request documents' }}
        secondary={{ href: '/blog/where-to-place-a-vape-sensor', label: 'Placement guide' }}
      />
    </>
  );
}
