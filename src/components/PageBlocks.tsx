import Link from 'next/link';
import type { ReactNode } from 'react';

// Shared building blocks for inner pages, so every page tells its story with the same rhythm:
// hero → chapters → call to action.

export function PageHero({ tag, title, sub, children }: { tag: string; title: ReactNode; sub: ReactNode; children?: ReactNode }) {
  return (
    <div className="page-hero">
      <div className="page-hero-grid" aria-hidden="true" />
      <div className="page-hero-inner">
        <span className="page-hero-tag">{tag}</span>
        <h1>{title}</h1>
        <p className="page-hero-sub">{sub}</p>
        {children}
      </div>
    </div>
  );
}

export function Chapter({ n, label, tone = 'light' }: { n: string; label: string; tone?: 'light' | 'dark' }) {
  return (
    <span className="chapter-mark" style={{ color: tone === 'dark' ? 'var(--c2)' : 'var(--c4)' }}>
      <span className="chapter-num">{n}</span> {label}
    </span>
  );
}

export function CtaBanner({
  heading,
  accent,
  sub,
  primary = { href: '/contact', label: 'Book a demo' },
  secondary,
}: {
  heading: string;
  accent: string;
  sub: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="cta-section">
      <div className="cta-grid-bg" aria-hidden="true" />
      <div className="cta-inner">
        <h2 className="cta-heading">
          {heading}
          <br />
          <span className="accent">{accent}</span>
        </h2>
        <p className="cta-sub">{sub}</p>
        <div className="cta-btns">
          <Link href={primary.href} className="btn btn-solid-c1">{primary.label}</Link>
          {secondary && <Link href={secondary.href} className="btn btn-ghost-w">{secondary.label}</Link>}
        </div>
        <div className="cta-trust">
          <div className="cta-trust-item"><i className="ti ti-camera-off" aria-hidden="true" /> No cameras</div>
          <div className="cta-trust-item"><i className="ti ti-microphone-off" aria-hidden="true" /> No microphones</div>
          <div className="cta-trust-item"><i className="ti ti-shield-check" aria-hidden="true" /> Blocks false alarms</div>
        </div>
      </div>
    </section>
  );
}

export function CheckList({ items, tone = 'light' }: { items: string[]; tone?: 'light' | 'dark' }) {
  return (
    <ul className={`check-list ${tone}`}>
      {items.map((i) => (
        <li key={i}>
          <i className="ti ti-check" aria-hidden="true" />
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}

export function SpecTable({ rows, tone = 'light' }: { rows: [string, string][]; tone?: 'light' | 'dark' }) {
  return (
    <table className={`spec-table ${tone}`}>
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k}>
            <th scope="row">{k}</th>
            <td>{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// The core "detect vs block" story, used on the home page, How It Works and the product pages.
export function AlertsVsBlocked({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const alerts = [
    { icon: 'ti-cloud', name: 'Vaping', why: 'E-cigarettes and disposable vapes, including flavoured ones' },
    { icon: 'ti-flame', name: 'Smoking', why: 'Cigarettes and other smoke, reported separately from vaping' },
    { icon: 'ti-lock-open', name: 'Tampering', why: 'Anyone trying to open, cover or remove the sensor' },
  ];
  const blocked = [
    { icon: 'ti-spray', name: 'Hairspray & deodorant', why: 'Everyday sprays don’t send staff running' },
    { icon: 'ti-droplet', name: 'Shower & kettle steam', why: 'Works in showers and humid changing rooms' },
    { icon: 'ti-wind', name: 'Dust, fans & draughts', why: 'Cleaning and busy rooms stay quiet' },
    { icon: 'ti-candle', name: 'Candles at a distance', why: 'A faint trace isn’t treated as an incident' },
  ];
  return (
    <div className={`avb ${tone}`}>
      <div className="avb-col avb-alert">
        <div className="avb-head"><i className="ti ti-bell-ringing" aria-hidden="true" /> Staff are alerted</div>
        {alerts.map((a) => (
          <div key={a.name} className="avb-row">
            <i className={`ti ${a.icon}`} aria-hidden="true" />
            <div><strong>{a.name}</strong><span>{a.why}</span></div>
          </div>
        ))}
      </div>
      <div className="avb-col avb-block">
        <div className="avb-head"><i className="ti ti-bell-off" aria-hidden="true" /> Recognised and blocked</div>
        {blocked.map((a) => (
          <div key={a.name} className="avb-row">
            <i className={`ti ${a.icon}`} aria-hidden="true" />
            <div><strong>{a.name}</strong><span>{a.why}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
