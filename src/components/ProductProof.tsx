import Image from 'next/image';

// "What you get": a phone showing a push alert, and the certification bar.
// Dashboard screenshots are deliberately not shown on the public site.

// `show` (optional) controls when the alert appears, e.g. in step with a simulation.
// Left out, the alert loops on its own.
export function PhoneAlert({ solo = false, show, room = 'Pupil Toilets · 1F', time = '11:17' }: { solo?: boolean; show?: boolean; room?: string; time?: string }) {
  const controlled = show !== undefined;
  return (
    <div className={`phone${solo ? ' solo' : ''}${controlled ? ' controlled' : ''}${show ? ' alerting' : ''}`} aria-label={`Phone lock screen showing a VapeSense push alert: Vape detected, ${room}`} role="img">
      <div className="phone-screen">
        <div className="phone-notch" aria-hidden="true" />
        <div className="phone-time">{time}</div>
        <div className="phone-date">Wednesday 4 November</div>
        <div className="phone-note">
          <div className="phone-note-head">
            <Image src="/icon.png" width={40} height={40} alt="" className="phone-app" />
            <span>VAPESENSE</span>
            <span className="phone-now">now</span>
          </div>
          <strong>Vape detected</strong>
          <p>{room} — high severity.</p>
        </div>
      </div>
    </div>
  );
}

export function CertBar({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const items = [
    { mark: 'CE', label: 'Radio Equipment Directive' },
    { mark: 'RoHS', label: 'Restricted substances' },
    { mark: 'WEEE', label: 'Recyclable electronics' },
    { mark: '0', label: 'Cameras or microphones' },
    { mark: '<60s', label: 'From vape to staff alert' },
    { mark: '<5W', label: 'Typical power draw' },
  ];
  return (
    <div className={`certbar ${tone}`}>
      {items.map((i) => (
        <div key={i.mark + i.label} className="cert">
          <span className="cert-mark">{i.mark}</span>
          <span className="cert-label">{i.label}</span>
        </div>
      ))}
    </div>
  );
}
