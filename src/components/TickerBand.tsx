const items = [
  'No cameras. No microphones.',
  'Catches vape & smoke',
  'Blocks hairspray, steam & dust',
  'Alerts in under 60 seconds',
  'Data stays on site',
  'One room or a whole campus',
];

export default function TickerBand() {
  const doubled = [...items, ...items];
  return (
    <div className="ticker-band" aria-hidden="true">
      <div className="ticker-inner">
        {doubled.map((item, i) => (
          <span key={i}>
            <span className="ticker-item">{item}</span>
            <span className="ticker-sep">{"//"}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
