import Image from 'next/image';
import Link from 'next/link';
import { Chapter, CheckList } from '@/components/PageBlocks';
import { PhoneAlert, CertBar } from '@/components/ProductProof';

// Home page sections below the hero (the hero itself is unchanged).

export function HomeProof() {
  return (
    <section className="content-section dark home-proof">
      <div className="content-inner feature">
        <div className="feature-copy">
          <Chapter n="✓" label="What your team gets" tone="dark" />
          <h2 className="cs-heading">THE ALERT.<br />ON EVERY PHONE.</h2>
          <p className="story-lead">
            The moment it matters, the right staff know — with the room and what happened. No app to
            install, no screens to watch.
          </p>
          <CheckList tone="dark" items={[
            'Alerts on any phone, tablet or computer, plus e-mail',
            'Only the staff you chose for that room — the exact room, and whether it’s vape or smoke',
            'One simple dashboard for every room on site',
            'A full history to spot patterns and support your policies',
          ]} />
        </div>
        <div className="feature-media phone-stage">
          <div className="vhero-glow" aria-hidden="true" />
          <PhoneAlert solo />
        </div>
      </div>
    </section>
  );
}

const SECTORS = [
  { id: 'education', title: 'Schools', sub: 'Toilets · changing rooms' },
  { id: 'healthcare', title: 'Healthcare', sub: 'Patient washrooms' },
  { id: 'hospitality', title: 'Hotels', sub: 'Non-smoking rooms' },
  { id: 'offices', title: 'Offices', sub: 'Restrooms' },
  { id: 'leisure', title: 'Leisure', sub: 'Changing rooms' },
  { id: 'public', title: 'Public & transit', sub: 'Waiting areas · WCs' },
];

export function SectorCards() {
  return (
    <section className="content-section light">
      <div className="content-inner">
        <div className="section-split">
          <div>
            <Chapter n="✓" label="Where it goes" />
            <h2 className="cs-heading">BUILT FOR THE ROOMS<br />YOU CAN’T WATCH.</h2>
          </div>
          <Link href="/industries" className="cs-card-link">All industries →</Link>
        </div>
        <div className="sector-cards">
          {SECTORS.map((s) => (
            <Link key={s.id} href={`/industries#${s.id}`} className="sector-card">
              <Image src={`/media/img/insitu-${s.id}.jpg`} width={1200} height={900} alt={`Vape Sense installed in ${s.title.toLowerCase()}`} sizes="(max-width: 600px) 92vw, (max-width: 1100px) 46vw, 31vw" />
              <div className="sector-card-text">
                <strong>{s.title}</strong>
                <span>{s.sub}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductChoice() {
  return (
    <section className="content-section tint">
      <div className="content-inner">
        <div className="section-head center">
          <Chapter n="✓" label="Choose your setup" />
          <h2 className="cs-heading">ONE ROOM, OR<br />THE WHOLE SITE.</h2>
          <p className="story-lead">Same sensor, same accuracy. Start with one room and add a hub when you grow.</p>
        </div>
        <div className="choice">
          <Link href="/products/vapesense" className="choice-card">
            <div className="choice-visual"><Image src="/media/img/hero-studio.png" width={1096} height={836} alt="VapeSense Standalone sensor" sizes="(max-width: 900px) 80vw, 420px" /></div>
            <span className="choice-tag">Standalone</span>
            <h3>VapeSense Standalone</h3>
            <p>One self-contained unit for one room — its own dashboard, alerts, users and schedule.</p>
            <ul><li>Best for a single room or a pilot</li><li>No hub required</li></ul>
            <span className="cs-card-link">Explore Standalone →</span>
          </Link>
          <Link href="/products/vapesense-hub" className="choice-card featured">
            <div className="choice-visual"><Image src="/media/img/sector-education.jpg" width={960} height={720} alt="Sensors in every washroom reporting to one hub" sizes="(max-width: 900px) 80vw, 420px" /></div>
            <span className="choice-tag">Building-wide</span>
            <h3>VapeSense Hub system</h3>
            <p>Sensors in every room, one hub: one dashboard, one alert feed and one schedule for the whole site.</p>
            <ul><li>Best for schools and campuses</li><li>Add rooms any time</li></ul>
            <span className="cs-card-link">Explore the Hub →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HomeTrust() {
  return (
    <section className="content-section light home-trust">
      <div className="content-inner">
        <CertBar />
      </div>
    </section>
  );
}
