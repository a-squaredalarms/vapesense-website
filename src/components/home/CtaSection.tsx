import Link from 'next/link';

const TRUST = [
  { icon: 'ti-camera-off', label: 'No cameras' },
  { icon: 'ti-calendar', label: 'Free demo' },
  { icon: 'ti-shield-check', label: 'Blocks false alarms' },
  { icon: 'ti-lock', label: 'No obligation quote' },
];

export default function CtaSection({ previous = false }: { previous?: boolean }) {
  return (
    <section className="cta-section" id="cta">
      <div className="cta-grid-bg" aria-hidden="true" />
      <div className="cta-glow" aria-hidden="true" />

      <div className="cta-inner">
        <div className="cta-badge">
          <span className="cta-badge-dot" aria-hidden="true" />
          Detection without surveillance
        </div>

        <h2 className="cta-heading">
          {previous ? (
            <>Ready to make your<br />building <span className="cta-accent">safer?</span></>
          ) : (
            <>See it catch a vape.<br /><span className="cta-accent">Watch it ignore hairspray.</span></>
          )}
        </h2>

        <p className="cta-sub">
          {previous
            ? 'Talk to our team and see how Vape Sense fits your building, team, and budget — no obligation.'
            : 'A live demo in your building type, with your team’s questions answered. No obligation.'}
        </p>

        <div className="cta-btns">
          <Link href="/contact" className="cta-btn-primary">
            <i className="ti ti-calendar" aria-hidden="true" />
            Book a demo
          </Link>
          <Link href="/contact" className="cta-btn-secondary">
            <i className="ti ti-file-invoice" aria-hidden="true" />
            Request a quote
          </Link>
        </div>

        <div className="cta-trust">
          {TRUST.map((t) => (
            <div key={t.label} className="cta-trust-item">
              <i className={`ti ${t.icon}`} aria-hidden="true" />
              {t.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
