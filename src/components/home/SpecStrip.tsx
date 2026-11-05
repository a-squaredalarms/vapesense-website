const CURRENT = [
  { val: '<60s', lbl: 'CLOUD TO STAFF ALERT' },
  { val: '~30m²', lbl: 'COVERAGE PER SENSOR' },
  { val: '0', lbl: 'CAMERAS OR MICROPHONES' },
  { val: 'CE', lbl: 'RED · ROHS · WEEE' },
];

export default function SpecStrip({ specs = CURRENT }: { specs?: { val: string; lbl: string }[] }) {
  return (
    <div className="spec-strip" aria-label="Key platform metrics">
      <div className="spec-inner">
        {specs.map((s) => (
          <div key={s.lbl} className="spec-cell">
            <span className={`spec-val${s.val === '∞' ? ' spec-val-symbol' : ''}`}>{s.val}</span>
            <span className="spec-lbl">{s.lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
