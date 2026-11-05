'use client';

import { useState, useEffect, useRef } from 'react';

type Card = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  desc: string;
  bars: { l: string; r: string; w: number }[];
  impactLabel: string;
  impactVal: string;
  impactColor: string;
  dots: { lit: boolean; color: string }[];
};

const cards: Card[] = [
  {
    id: '01',
    icon: 'ti-eye-off',
    title: 'Hidden incidents',
    subtitle: 'Toilets · changing rooms · restricted areas',
    desc: 'Vaping in toilets, changing rooms, and off-camera areas goes undetected until a complaint is raised — by which point the incident is over and staff have nothing to act on.',
    bars: [
      { l: 'Without sensors → Only if reported', r: 'Low', w: 8 },
      { l: 'With Vape Sense → Every event alerted', r: 'High', w: 95 },
    ],
    impactLabel: 'CAMERAS NEEDED',
    impactVal: '0',
    impactColor: 'var(--c1)',
    dots: [
      ...Array(12).fill({ lit: false, color: '' }),
      ...Array(6).fill({ lit: true, color: 'var(--c1)' }),
    ],
  },
  {
    id: '02',
    icon: 'ti-bell-x',
    title: 'False alarms',
    subtitle: 'Hairspray · steam · dust · fans',
    desc: 'Detectors that only count particles go off for deodorant, shower steam and dust. Staff soon stop responding. Vape Sense recognises those look-alikes and blocks them.',
    bars: [
      { l: 'Particle-only sensor → Alerts on sprays & steam', r: 'High', w: 85 },
      { l: 'Vape Sense → Sprays & steam blocked', r: 'Low', w: 10 },
    ],
    impactLabel: 'LOOK-ALIKES BLOCKED',
    impactVal: '5',
    impactColor: '#D4870A',
    dots: [
      ...Array(5).fill({ lit: true, color: '#D4870A' }),
      ...Array(13).fill({ lit: false, color: '' }),
    ],
  },
  {
    id: '03',
    icon: 'ti-clock-pause',
    title: 'Delayed staff response',
    subtitle: 'Duty of care · accountability · response time',
    desc: 'Without real-time alerts, staff cannot respond promptly. By the time someone reports it, the evidence is gone, the person has left, and your duty-of-care record shows nothing.',
    bars: [
      { l: 'Without alerts → Staff find out late, if at all', r: 'Slow', w: 88 },
      { l: 'With Vape Sense → Alert in under 60 s', r: '<60s', w: 9 },
    ],
    impactLabel: 'ALERT TIME (S)',
    impactVal: '<60',
    impactColor: '#C0392B',
    dots: [
      ...Array(12).fill({ lit: true, color: '#C0392B' }),
      ...Array(6).fill({ lit: false, color: '' }),
    ],
  },
];

function BarFill({ width, active }: { width: number; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.style.width = active ? `${width}%` : '0%';
    });
  }, [active, width]);
  return <div ref={ref} className="ch-bar-fill" />;
}

export default function Challenge() {
  const [openId, setOpenId] = useState('01');

  return (
    <section className="challenge" id="challenge">
      <h2 className="sr-only">The Challenge</h2>
      <div className="w">
        <div className="ch-header">
          <span className="section-tag" style={{ color: 'var(--c4)' }}>The challenge</span>
          <div className="section-heading" style={{ color: 'var(--c0)' }}>
            THREE PROBLEMS.
            <br />
            ONE PLATFORM.
          </div>
          <p className="section-sub">
            Click each challenge to understand the real cost of undetected vaping in your building.
          </p>
        </div>

        <div className="ch-cards">
          {cards.map((card) => {
            const isOpen = openId === card.id;
            return (
              <div
                key={card.id}
                className={`ch-card${isOpen ? ' open' : ''}`}
                onClick={() => setOpenId(isOpen ? '' : card.id)}
                role="button"
                aria-expanded={isOpen}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setOpenId(isOpen ? '' : card.id);
                }}
              >
                <div className="ch-header-row">
                  <span className="ch-num">{card.id}</span>
                  <div className="ch-icon-box">
                    <i className={`ti ${card.icon}`} />
                  </div>
                  <div className="ch-title-block">
                    <div className="ch-title">{card.title}</div>
                    <div className="ch-subtitle">{card.subtitle}</div>
                  </div>
                  <i className="ti ti-plus ch-toggle" />
                </div>
                <div className="ch-body">
                  <div className="ch-body-inner">
                    <div>
                      <p className="ch-desc">{card.desc}</p>
                      <div className="ch-bars">
                        {card.bars.map((b) => (
                          <div key={b.l} className="ch-bar-row">
                            <div className="ch-bar-labels">
                              <span className="ch-bar-label-l">{b.l}</span>
                              <span className="ch-bar-label-r">{b.r}</span>
                            </div>
                            <div className="ch-bar-track">
                              <BarFill width={b.w} active={isOpen} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="ch-cta" onClick={(e) => e.stopPropagation()}>
                        HOW WE SOLVE THIS →
                      </button>
                    </div>
                    <div className="ch-impact">
                      <span className="ch-impact-label">{card.impactLabel}</span>
                      <span className="ch-impact-val" style={{ color: card.impactColor }}>
                        {card.impactVal}
                      </span>
                      <div className="ch-dots">
                        {card.dots.map((d, i) => (
                          <div
                            key={i}
                            className={`ch-dot${d.lit ? '' : ' unlit'}`}
                            style={d.lit ? { background: d.color } : {}}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
