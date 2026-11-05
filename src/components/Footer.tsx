import Image from 'next/image';
import Link from 'next/link';
import { SITE } from '@/lib/site';
import { CookieSettingsLink } from './CookieConsent';

export default function Footer() {
  return (
    <footer className="vs-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              <Image
                src="/light-color-logo.png"
                alt="Vape Sense"
                width={239}
                height={120}
                className="footer-logo-image"
              />
            </div>
            <p className="footer-desc">
              Privacy-safe vape and smoke detection. No cameras. No microphones. Catches vape &amp;
              smoke — blocks hairspray, steam &amp; dust.
            </p>
          </div>
          <div>
            <div className="footer-col-title">Products</div>
            <div className="footer-links">
              <Link href="/products">All products</Link>
              <Link href="/products/vapesense">Vape Sense</Link>
              <Link href="/products/vapesense-hub">VapeSense Hub system</Link>
              <Link href="/products/specifications">Specifications</Link>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Platform</div>
            <div className="footer-links">
              <Link href="/how-it-works">How It Works</Link>
              <Link href="/technology">Why Vape Sense</Link>
              <Link href="/industries">Industries</Link>
              <Link href="/privacy-and-security">Privacy &amp; Security</Link>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Resources</div>
            <div className="footer-links">
              <Link href="/blog">Blog</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/case-studies">Example deployments</Link>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <div className="footer-links">
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <CookieSettingsLink />
            </div>
          </div>
        </div>
        <div className="footer-base">
          <span className="footer-copy">© {new Date().getFullYear()} Vape Sense. All rights reserved.</span>
          <div className="footer-socials">
            <div className="social-btn" role="button" aria-label="LinkedIn">
              <i className="ti ti-brand-linkedin" />
            </div>
            <div className="social-btn" role="button" aria-label="X / Twitter">
              <i className="ti ti-brand-x" />
            </div>
            <div className="social-btn" role="button" aria-label="Instagram">
              <i className="ti ti-brand-instagram" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
