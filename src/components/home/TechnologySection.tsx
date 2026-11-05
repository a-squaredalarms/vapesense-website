const cards = [
  { n: '01', icon: 'ti-activity', title: 'Vape detection', text: 'Real-time aerosol event identification across all monitored zones.' },
  { n: '02', icon: 'ti-mist', title: 'Steam & smoke', text: 'Smoke is told apart from vape, while steam, hairspray and dust are recognised and blocked.' },
  { n: '03', icon: 'ti-wind', title: 'Air-quality monitoring', text: 'Continuous ambient tracking with indexed scoring and trend history.' },
  { n: '04', icon: 'ti-shield-lock', title: 'Tamper & cover alerts', text: 'Instant alerts if the case is opened or someone tries to cover the sensor.' },
  { n: '05', icon: 'ti-bell-ringing', title: 'Instant alerts', text: 'Push and email alerts to staff phones the moment an event is confirmed.' },
  { n: '06', icon: 'ti-topology-star', title: 'Central hub', text: 'Sensors in every room report to one central hub. Your data stays on site.' },
];

export default function TechnologySection() {
  return (
    <section className="technology" id="technology">
      <h2 className="sr-only">Technology</h2>
      <div className="w">
        <div className="tech-header">
            <span className="section-tag" style={{ color: 'var(--c2)' }}>Technology</span>
            <div className="section-heading" style={{ color: 'var(--cw)' }}>
              ONE SYSTEM.
              <br />
              EVERY SIGNAL.
            </div>
            <p className="section-sub" style={{ color: 'rgba(255,255,255,.38)' }}>
              Six detection layers, brought together by one central hub.
            </p>
          </div>
        <div className="tech-grid">
          {cards.map((c) => (
            <div key={c.n} className="tech-card">
              <div className="tech-num">{c.n}</div>
              <div className="tech-icon">
                <i className={`ti ${c.icon}`} />
              </div>
              <div className="tech-title">{c.title}</div>
              <p className="tech-text">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
