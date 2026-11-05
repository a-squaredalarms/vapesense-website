// Google Analytics 4, loaded only after the visitor accepts analytics cookies.
// Nothing here runs (and no banner shows) until SITE.gaId is filled in.
import { SITE } from './site';

export type Consent = 'granted' | 'denied';
const KEY = 'vs-cookie-consent';
export const OPEN_SETTINGS_EVENT = 'vs-open-cookie-settings';

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

export const analyticsEnabled = () => Boolean(SITE.gaId);

// The stored choice. Remembering it is strictly necessary, so it needs no consent itself.
export function readConsent(): Consent | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

export function saveConsent(c: Consent) {
  try {
    localStorage.setItem(KEY, c);
  } catch {
    // Storage blocked (e.g. private mode): the choice lasts for this page view only.
  }
  if (c === 'granted') loadAnalytics();
  else removeAnalyticsCookies();
}

let loaded = false;
export function loadAnalytics() {
  if (loaded || !SITE.gaId || typeof window === 'undefined') return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js expects the arguments object itself, not an array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  // Page views on client-side navigation are picked up by GA4's enhanced measurement.
  window.gtag('config', SITE.gaId, { anonymize_ip: true });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(SITE.gaId)}`;
  document.head.appendChild(s);
}

// After a visitor withdraws consent, clear the GA cookies already set (_ga, _ga_<id>).
function removeAnalyticsCookies() {
  const host = location.hostname;
  const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`];
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0].trim();
    if (!name.startsWith('_ga')) return;
    domains.forEach((d) => {
      document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ''}`;
    });
  });
  if (loaded) location.reload(); // stop the already-running script
}

// Records a conversion (e.g. a contact form sent). Does nothing without consent.
export function trackEvent(name: string, params: Record<string, string> = {}) {
  window.gtag?.('event', name, params);
}
