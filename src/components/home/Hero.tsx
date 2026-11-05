import HeroDevice from './device3d/HeroDevice';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero" id="hero">
            <div className="hero-grid" aria-hidden="true" />
      <div className="hero-scan" aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-copy">
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-dot" aria-hidden="true" />
            <span>System status — operational</span>
          </div>
          <h1>
            SMARTER
            <br />
            <span className="h-vape">VAPE</span>
            <br />
            <span className="h-det">DETECTION.</span>
          </h1>
          <p className="hero-body">
            Vape Sense detects vaping and smoking the moment they happen — using air, not cameras —
            and ignores the hairspray, steam and dust that fool other detectors. Staff get an alert
            in under 60 seconds.
          </p>
          <div className="hero-ctas">
            <Link href="/contact" className="btn btn-solid-c1">
              BOOK A FREE DEMO
            </Link>
            <Link href="/how-it-works" className="btn btn-ghost-play">
              <i className="ti ti-player-play" /> SEE HOW IT WORKS
            </Link>
          </div>
          <div className="hero-trust">
            <div className="trust-pill">
              <div className="trust-sq" />
              <span>No cameras</span>
            </div>
            <div className="trust-pill">
              <div className="trust-sq" />
              <span>No microphones</span>
            </div>
            <div className="trust-pill">
              <div className="trust-sq" />
              <span>Blocks false alarms</span>
            </div>
            <div className="trust-pill">
              <div className="trust-sq" />
              <span>Alerts in &lt;60s</span>
            </div>
          </div>
        </div>

        <div className="hero-card">
          <div className="hero-device" aria-hidden="true">
            <HeroDevice />
          </div>
        </div>
      </div>
    </section>
  );
}
