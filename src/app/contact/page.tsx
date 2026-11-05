'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SITE } from '@/lib/site';
import { trackEvent } from '@/lib/analytics';

// Enquiries are sent through Web3Forms (https://web3forms.com), which emails them to SITE.email.
// It works on static hosting such as GitHub Pages. The access key is public by design; set it in
// .env.local as NEXT_PUBLIC_WEB3FORMS_KEY. Without a key, the form falls back to opening an email.
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? '';

type Route = 0 | 1 | 2;
type Status = 'idle' | 'sending' | 'sent' | 'error';

const SECTORS = ['Education', 'Healthcare / Care home', 'Hospitality / Hotel', 'Office / Commercial', 'Leisure / Gym', 'Retail', 'Public building / Transit'];

const DEMO_TYPES = [
  { label: 'Video call', icon: 'ti-video' },
  { label: 'On-site visit', icon: 'ti-building' },
  { label: 'Phone call', icon: 'ti-phone' },
];

const QUOTE_TYPES = [
  { label: 'Standalone', icon: 'ti-circle-dot' },
  { label: 'Hub system', icon: 'ti-topology-star' },
  { label: 'Not sure yet', icon: 'ti-help' },
];

const ROUTES = [
  { key: 'demo', label: 'Book a Demo', desc: 'See it catch a vape live', icon: 'ti-calendar' },
  { key: 'quote', label: 'Request a Quote', desc: 'Pricing for your building', icon: 'ti-file-invoice' },
  { key: 'question', label: 'Ask a Question', desc: 'Anything else', icon: 'ti-message' },
];

const CONTACT_METHODS = [
  { icon: 'ti-mail', label: 'Email us', value: SITE.email, meta: 'Sales, demos, quotes and support', href: `mailto:${SITE.email}` },
  { icon: 'ti-file-description', label: 'Datasheet & install guide', value: 'For your IT team and electrician', meta: 'Sent with every quote, or on request', href: `mailto:${SITE.email}?subject=${encodeURIComponent('Vape Sense datasheet request')}` },
];

const TRUST = [
  { icon: 'ti-camera-off', text: 'No cameras or microphones' },
  { icon: 'ti-shield-check', text: 'Ignores hairspray, steam and dust' },
  { icon: 'ti-clock-bolt', text: 'Staff alerted in under 60 seconds' },
  { icon: 'ti-receipt-off', text: 'Free demo, no-obligation quote' },
];

// Readable "Label: value" lines from the form, skipping empty fields and the spam trap.
function formLines(form: HTMLFormElement) {
  const lines: [string, string][] = [];
  new FormData(form).forEach((v, k) => {
    const value = String(v).trim();
    if (value && k !== 'botcheck') lines.push([k, value]);
  });
  return lines;
}

function ContactPage() {
  // Buttons elsewhere on the site link to /contact?type=quote (or demo / question).
  const type = useSearchParams().get('type');
  const routeFor = (t: string | null) => ROUTES.findIndex((r) => r.key === t);
  const [route, setRoute] = useState<Route>(() => Math.max(0, routeFor(type)) as Route);
  const [seenType, setSeenType] = useState(type);
  const [demoType, setDemoType] = useState(0);
  const [quoteType, setQuoteType] = useState(0);
  const [status, setStatus] = useState<Status>('idle');

  // Switch tab when the link changes while already on this page (e.g. the nav buttons).
  if (type !== seenType) {
    setSeenType(type);
    const i = routeFor(type);
    if (i >= 0) {
      setRoute(i as Route);
      setStatus('idle');
    }
  }

  function switchRoute(r: Route) {
    setRoute(r);
    setStatus('idle');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const extra = route === 0 ? ` — ${DEMO_TYPES[demoType].label}` : route === 1 ? ` — ${QUOTE_TYPES[quoteType].label}` : '';
    const subject = `Vape Sense website: ${ROUTES[route].label}${extra}`;
    const lines = formLines(form);

    if (!WEB3FORMS_KEY) {
      // No form service configured (e.g. local development): hand over to the visitor's email app.
      const body = [subject, '', ...lines.map(([k, v]) => `${k}: ${v}`)].join('\n');
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus('sent');
      return;
    }

    setStatus('sending');
    const data = Object.fromEntries(lines);
    try {
      // Sent as plain form data, not JSON: JSON triggers a CORS pre-check that Web3Forms rejects.
      const body = new FormData();
      body.append('access_key', WEB3FORMS_KEY);
      body.append('subject', subject);
      body.append('from_name', 'Vape Sense website');
      if (data['Email']) body.append('replyto', data['Email']);
      body.append('Enquiry type', ROUTES[route].label + extra);
      for (const [k, v] of lines) body.append(k, v);
      if ((form.elements.namedItem('botcheck') as HTMLInputElement | null)?.checked) body.append('botcheck', 'on');
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) throw new Error(json.message ?? 'Send failed');
      form.reset();
      setStatus('sent');
      // Shows as a conversion in Google Analytics (only if the visitor accepted analytics).
      trackEvent('generate_lead', { enquiry_type: ROUTES[route].key });
    } catch {
      setStatus('error');
    }
  }

  const sending = status === 'sending';
  const firstName = (id: string, ph: string) => (
    <div className="form-field">
      <label className="form-label" htmlFor={id}>First name</label>
      <input className="form-input" id={id} name="First name" type="text" placeholder={ph} autoComplete="given-name" required />
    </div>
  );
  const lastName = (id: string, ph: string) => (
    <div className="form-field">
      <label className="form-label" htmlFor={id}>Last name</label>
      <input className="form-input" id={id} name="Last name" type="text" placeholder={ph} autoComplete="family-name" />
    </div>
  );
  const email = (id: string, ph: string, full = false) => (
    <div className={`form-field${full ? ' contact-field-full' : ''}`}>
      <label className="form-label" htmlFor={id}>Work email</label>
      <input className="form-input" id={id} name="Email" type="email" placeholder={ph} autoComplete="email" required />
    </div>
  );
  const phone = (id: string) => (
    <div className="form-field">
      <label className="form-label" htmlFor={id}>Phone <span className="form-optional">(optional)</span></label>
      <input className="form-input" id={id} name="Phone" type="tel" placeholder="+44 7700 000000" autoComplete="tel" />
    </div>
  );
  const org = (id: string, ph: string) => (
    <div className="form-field">
      <label className="form-label" htmlFor={id}>Organisation</label>
      <input className="form-input" id={id} name="Organisation" type="text" placeholder={ph} autoComplete="organization" required />
    </div>
  );
  const sector = (id: string) => (
    <div className="form-field">
      <label className="form-label" htmlFor={id}>Building type</label>
      <select className="form-input form-select" id={id} name="Building type" defaultValue="">
        <option value="">Select sector…</option>
        {SECTORS.map((s) => <option key={s}>{s}</option>)}
      </select>
    </div>
  );
  // Hidden from people; bots that tick it are rejected by Web3Forms.
  const spamTrap = <input type="checkbox" name="botcheck" className="contact-botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" />;
  const privacyNote = (
    <p className="contact-privacy">
      We only use your details to reply to this enquiry. See our <Link href="/privacy-policy">privacy policy</Link>.
    </p>
  );
  const submit = (label: string, note: React.ReactNode) => (
    <div className="contact-submit-row">
      <button type="submit" className="contact-btn-submit" disabled={sending}>
        {sending ? 'Sending…' : label} {!sending && <i className="ti ti-arrow-right" aria-hidden="true" />}
      </button>
      <span className="contact-submit-note">{note}</span>
    </div>
  );

  return (
    <div className="contact-page">

      {/* HERO */}
      <div className="contact-hero">
        <div className="contact-hero-grid" aria-hidden="true" />
        <div className="hero-scan" aria-hidden="true" />
        <div className="contact-hero-inner">
          <div style={{ animation: 'fadeUp .4s ease both' }}>
            <div className="contact-hero-tag">
              <span className="contact-hero-dot" aria-hidden="true" />
              We reply within 1 business day
            </div>
            <h1 className="contact-hero-h">
              See it catch<br /><span className="accent">a vape.</span>
            </h1>
            <p className="contact-hero-sub">
              Book a free demo and watch Vape Sense alert on a vape — and ignore a can of hairspray in
              the same room. Or tell us about your building and we&apos;ll put together a quote.
            </p>
          </div>
          <div className="contact-hero-stats" style={{ animation: 'fadeUp .4s .1s ease both' }}>
            {[
              { val: '<1 day', lbl: 'RESPONSE TIME' },
              { val: '0', lbl: 'OBLIGATION' },
              { val: 'Free', lbl: 'DEMO & QUOTE' },
            ].map((s) => (
              <div key={s.lbl} className="contact-hero-stat">
                <span className="contact-hero-stat-val">{s.val}</span>
                <span className="contact-hero-stat-lbl">{s.lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROUTE STRIP */}
      <div className="contact-route-strip">
        <div className="contact-route-inner" role="tablist">
          {ROUTES.map((r, i) => (
            <button
              key={r.key}
              className={`contact-route-item${route === i ? ' active' : ''}`}
              onClick={() => switchRoute(i as Route)}
              role="tab"
              aria-selected={route === i}
            >
              <div className="contact-route-icon">
                <i className={`ti ${r.icon}`} aria-hidden="true" />
              </div>
              <div>
                <div className="contact-route-label">{r.label}</div>
                <div className="contact-route-desc">{r.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN BODY */}
      <div className="contact-body">

        {/* FORM PANEL */}
        <div className="contact-form-panel">
          {status === 'sent' ? (
            <div className="contact-success" role="status">
              <div className="contact-success-check">
                <i className="ti ti-check" aria-hidden="true" />
              </div>
              <div className="contact-success-h">{WEB3FORMS_KEY ? 'Thanks — we’ve got it.' : 'Almost done.'}</div>
              <p className="contact-success-sub">
                {WEB3FORMS_KEY ? (
                  <>We&apos;ll be in touch within 1 business day. Need us sooner? Email{' '}
                    <a href={`mailto:${SITE.email}`} style={{ color: 'var(--c1)' }}>{SITE.email}</a>.</>
                ) : (
                  <>Your email app should have opened with your enquiry ready — just press send. If nothing
                    opened, email us at <a href={`mailto:${SITE.email}`} style={{ color: 'var(--c1)' }}>{SITE.email}</a>.</>
                )}
              </p>
              <button type="button" className="contact-success-ref" onClick={() => setStatus('idle')}>Send another enquiry</button>
            </div>
          ) : (
            <>
              {status === 'error' && (
                <div className="contact-error" role="alert">
                  <i className="ti ti-alert-triangle" aria-hidden="true" />
                  <span>
                    Sorry, that didn&apos;t send. Please try again, or email us at{' '}
                    <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
                  </span>
                </div>
              )}

              {/* DEMO FORM */}
              {route === 0 && (
                <form onSubmit={handleSubmit}>
                  {spamTrap}
                  <div className="contact-form-head">
                    <div className="contact-form-eyebrow">Book a free demo</div>
                    <div className="contact-form-title">See Vape Sense<br />live in action.</div>
                  </div>
                  <input type="hidden" name="Demo format" value={DEMO_TYPES[demoType].label} />
                  <div className="contact-type-row" role="group" aria-label="Preferred demo format">
                    {DEMO_TYPES.map((t, i) => (
                      <button key={t.label} type="button" className={`contact-type-btn${demoType === i ? ' active' : ''}`} onClick={() => setDemoType(i)} aria-pressed={demoType === i}>
                        <i className={`ti ${t.icon}`} aria-hidden="true" />
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <div className="contact-field-grid">
                    {firstName('d-fname', 'James')}
                    {lastName('d-lname', 'Wilson')}
                    {email('d-email', 'j.wilson@school.ac.uk')}
                    {phone('d-phone')}
                    {org('d-org', 'Westfield Academy')}
                    {sector('d-sector')}
                    <div className="form-field contact-field-full">
                      <label className="form-label" htmlFor="d-msg">Where is vaping a problem for you? <span className="form-optional">(optional)</span></label>
                      <textarea className="form-input form-textarea" id="d-msg" name="Message" placeholder="e.g. Mainly the Year 9–11 toilets and the sports hall changing rooms…" />
                    </div>
                  </div>
                  {privacyNote}
                  {submit('Book my demo', <>We&apos;ll confirm within 1 business day<br />with available times.</>)}
                </form>
              )}

              {/* QUOTE FORM */}
              {route === 1 && (
                <form onSubmit={handleSubmit}>
                  {spamTrap}
                  <div className="contact-form-head">
                    <div className="contact-form-eyebrow">Request a quote</div>
                    <div className="contact-form-title">Pricing built<br />for your building.</div>
                  </div>
                  <input type="hidden" name="Product interest" value={QUOTE_TYPES[quoteType].label} />
                  <div className="contact-type-row" role="group" aria-label="Product interest">
                    {QUOTE_TYPES.map((t, i) => (
                      <button key={t.label} type="button" className={`contact-type-btn${quoteType === i ? ' active' : ''}`} onClick={() => setQuoteType(i)} aria-pressed={quoteType === i}>
                        <i className={`ti ${t.icon}`} aria-hidden="true" />
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <div className="contact-field-grid">
                    {firstName('q-fname', 'Sarah')}
                    {lastName('q-lname', 'Thompson')}
                    {email('q-email', 's.thompson@company.com')}
                    {phone('q-phone')}
                    {org('q-org', 'Company or school name')}
                    {sector('q-sector')}
                    <div className="form-field">
                      <label className="form-label" htmlFor="q-rooms">Rooms to cover</label>
                      <input className="form-input" id="q-rooms" name="Rooms to cover" type="number" placeholder="e.g. 8" min={1} />
                    </div>
                    <div className="form-field">
                      <label className="form-label" htmlFor="q-sites">Number of sites</label>
                      <input className="form-input" id="q-sites" name="Number of sites" type="number" placeholder="e.g. 1" min={1} />
                    </div>
                    <div className="form-field contact-field-full">
                      <label className="form-label" htmlFor="q-msg">Anything else we should know? <span className="form-optional">(optional)</span></label>
                      <textarea className="form-input form-textarea" id="q-msg" name="Message" placeholder="e.g. Timescales, budget, or rooms you're most worried about…" />
                    </div>
                  </div>
                  {privacyNote}
                  {submit('Get my quote', <>No obligation. A quote specific<br />to your building.</>)}
                </form>
              )}

              {/* QUESTION FORM */}
              {route === 2 && (
                <form onSubmit={handleSubmit}>
                  {spamTrap}
                  <div className="contact-form-head">
                    <div className="contact-form-eyebrow">Ask a question</div>
                    <div className="contact-form-title">Ask us<br />anything.</div>
                  </div>
                  <div className="contact-field-grid">
                    {firstName('e-fname', 'Alex')}
                    {lastName('e-lname', 'Davies')}
                    {email('e-email', 'alex@company.com', true)}
                    <div className="form-field contact-field-full">
                      <label className="form-label" htmlFor="e-subject">Topic</label>
                      <select className="form-input form-select" id="e-subject" name="Topic" defaultValue="">
                        <option value="">Select a topic…</option>
                        {['Product question', 'Installation', 'Existing customer support', 'Partnership / reseller', 'Press / media', 'Other'].map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="form-field contact-field-full">
                      <label className="form-label" htmlFor="e-msg">Your message</label>
                      <textarea className="form-input form-textarea" id="e-msg" name="Message" placeholder="Type your question here…" required />
                    </div>
                  </div>
                  {privacyNote}
                  {submit('Send message', <>We aim to reply within<br />1 business day.</>)}
                </form>
              )}
            </>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="contact-right-panel">

          <div className="contact-live-status">
            <div className="cls-bar">
              <span className="cls-label">WHAT HAPPENS NEXT</span>
              <div className="cls-live">
                <span className="cls-dot" aria-hidden="true" />
                Online
              </div>
            </div>
            {[
              { k: '1. You get in touch', v: 'Demo, quote or question' },
              { k: '2. We reply', v: 'Within 1 business day' },
              { k: '3. Live demo', v: 'Vape alert vs hairspray' },
              { k: '4. Your quote', v: 'Sized to your rooms' },
            ].map((r) => (
              <div key={r.k} className="cls-row">
                <span className="cls-k">{r.k}</span>
                <span className="cls-v">{r.v}</span>
              </div>
            ))}
          </div>

          <ul className="contact-trust">
            {TRUST.map((t) => (
              <li key={t.text}><i className={`ti ${t.icon}`} aria-hidden="true" />{t.text}</li>
            ))}
          </ul>

          <div className="contact-methods">
            {CONTACT_METHODS.map((c) => (
              <a key={c.label} href={c.href} className="contact-method">
                <div className="contact-method-icon">
                  <i className={`ti ${c.icon}`} aria-hidden="true" />
                </div>
                <div className="contact-method-body">
                  <div className="contact-method-label">{c.label}</div>
                  <div className="contact-method-value">{c.value}</div>
                  <div className="contact-method-meta">{c.meta}</div>
                </div>
              </a>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

// useSearchParams needs a Suspense boundary so the page can still be built as static HTML.
export default function ContactPageWrapper() {
  return (
    <Suspense>
      <ContactPage />
    </Suspense>
  );
}
