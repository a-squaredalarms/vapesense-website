'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { OPEN_SETTINGS_EVENT, analyticsEnabled, loadAnalytics, readConsent, saveConsent, type Consent } from '@/lib/analytics';

// Cookie bar: analytics stays off until the visitor accepts. Reject is as easy as accept,
// and "Cookie settings" in the footer reopens this bar to change the choice.
export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!analyticsEnabled()) return;
    const c = readConsent();
    if (c === 'granted') loadAnalytics();
    // Shown after the first paint so it doesn't flash during server rendering.
    else if (c === null) queueMicrotask(() => setOpen(true));
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, reopen);
  }, []);

  if (!open) return null;

  const choose = (c: Consent) => {
    saveConsent(c);
    setOpen(false);
  };

  return (
    <div className="cookie-bar" role="dialog" aria-live="polite" aria-label="Cookie preferences">
      <div className="cookie-bar-inner">
        <p>
          We&apos;d like to use Google Analytics cookies to see how people use this site, so we can
          improve it. They&apos;re only set if you accept. <Link href="/privacy-policy#cookies">Read more</Link>
        </p>
        <div className="cookie-bar-btns">
          <button type="button" className="btn btn-ghost-w" onClick={() => choose('denied')}>Reject</button>
          <button type="button" className="btn btn-solid-c1" onClick={() => choose('granted')}>Accept</button>
        </div>
      </div>
    </div>
  );
}

// Footer link that reopens the bar. Hidden while analytics isn't set up.
export function CookieSettingsLink() {
  const [show, setShow] = useState(false);
  useEffect(() => queueMicrotask(() => setShow(analyticsEnabled())), []);
  if (!show) return null;
  return (
    <button type="button" className="footer-link-btn" onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))}>
      Cookie settings
    </button>
  );
}
