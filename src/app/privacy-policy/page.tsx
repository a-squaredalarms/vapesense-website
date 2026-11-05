import type { Metadata } from 'next';
import Link from 'next/link';
import { LEGAL, SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  alternates: { canonical: '/privacy-policy' },
  description: 'Vape Sense privacy policy — what we collect, why, and your rights. This website uses no cookies and no tracking.',
};

const ga = Boolean(SITE.gaId);
const mail = <a href={`mailto:${SITE.email}`} style={{ color: 'var(--c1)' }}>{SITE.email}</a>;

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="page-hero">
        <div className="page-hero-grid" aria-hidden="true" />
        <div className="page-hero-inner">
          <span className="page-hero-tag">Legal</span>
          <h1>PRIVACY <span className="accent">POLICY.</span></h1>
          <p className="page-hero-sub">
            Last updated: {LEGAL.policyUpdated}. In short: {ga ? 'analytics cookies are only set if you accept them' : 'this website uses no cookies and no tracking'},
            and we only use your details to reply to you.
          </p>
        </div>
      </div>

      <section className="content-section light">
        <div className="content-inner">
          <div className="prose">
            <h2>1. Who we are</h2>
            <p>
              This website is run by {LEGAL.entity} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), the company behind
              Vape Sense, a vape and smoke detection system for schools, healthcare, hospitality and
              commercial buildings. We are the data controller for the personal data described in
              this policy.
            </p>
            {(LEGAL.companyNumber || LEGAL.address || LEGAL.icoNumber) && (
              <p>
                {LEGAL.companyNumber && <>Company number: {LEGAL.companyNumber}. </>}
                {LEGAL.address && <>Registered office: {LEGAL.address}. </>}
                {LEGAL.icoNumber && <>ICO registration number: {LEGAL.icoNumber}.</>}
              </p>
            )}
            <p>You can contact us about anything in this policy at {mail}.</p>

            <h2>2. What we collect</h2>
            <h3>2.1 When you browse this website</h3>
            <p>
              Like every website, our hosting provider receives the technical information your
              browser sends when it loads a page (such as your IP address, browser type and the page
              requested) so that it can deliver the page and keep the service secure. We do not use
              advertising tools and we do not build profiles of visitors.
            </p>
            {ga && (
              <p>
                If you accept analytics cookies, we use Google Analytics to understand how the site is
                used: pages viewed, how you arrived (for example from a search), your approximate
                location (country or city), device and browser type, and whether you sent an
                enquiry. Google Analytics does not store your full IP address.
              </p>
            )}

            <h3>2.2 When you contact us</h3>
            <p>If you send us an enquiry through the contact form or by email, we collect what you give us:</p>
            <ul>
              <li>Your name and email address</li>
              <li>Phone number (if provided)</li>
              <li>Organisation name and building type</li>
              <li>Details about your site, such as the number of rooms</li>
              <li>The content of your message</li>
            </ul>

            <h3>2.3 Vape Sense customers</h3>
            <p>
              Vape Sense systems run on the customer&apos;s own network, and the data they produce stays
              on the customer&apos;s site. Where we provide support or services that involve that data,
              we act as a data processor on the customer&apos;s behalf under our agreement with them.
            </p>
            <p>
              Vape Sense sensors read the air only. They contain no camera or microphone and do not
              capture images, audio or anything that identifies a person.
            </p>

            <h2>3. How we use your data</h2>
            <ul>
              <li>To reply to your enquiry, arrange a demonstration or prepare a quote</li>
              <li>To provide and support the products and services you buy from us</li>
              <li>To meet our legal and regulatory obligations</li>
            </ul>
            <p>We do not sell your data, and we do not send marketing emails unless you have asked us to.</p>

            <h2>4. Legal basis</h2>
            <ul>
              <li><strong>Legitimate interests</strong> — to respond to enquiries you send us</li>
              <li><strong>Contract</strong> — to take steps you ask for before a contract, and to deliver it</li>
              <li><strong>Legal obligation</strong> — where the law requires us to keep or share data</li>
              <li><strong>Consent</strong> — for analytics cookies and any marketing, which you can withdraw at any time</li>
            </ul>

            <h2>5. Who we share it with</h2>
            <p>We use a small number of service providers, who may only use your data to provide their service to us:</p>
            <ul>
              <li><strong>Web3Forms</strong> — delivers messages from our contact form to our email inbox</li>
              <li><strong>Our email provider</strong> — stores the enquiries and emails we receive</li>
              <li><strong>GitHub Pages</strong> — hosts this website</li>
              {ga && <li><strong>Google Analytics</strong> (Google Ireland Ltd) — website statistics, only if you accept analytics cookies</li>}
            </ul>
            <p>
              Some of these providers may process data outside the UK. Where they do, we rely on
              appropriate safeguards such as the UK International Data Transfer Agreement or an
              adequacy decision. We may also disclose data where the law requires it.
            </p>

            <h2>6. How long we keep it</h2>
            <p>
              We keep enquiries for up to 3 years after our last contact with you, so that we can
              follow up and keep a record of quotes. Customer records are kept for as long as our
              contract and the law require.
            </p>

            <h2 id="cookies">7. Cookies</h2>
            {ga ? (
              <>
                <p>
                  We only set analytics cookies if you click &quot;Accept&quot; on our cookie bar. If you
                  click &quot;Reject&quot;, or do nothing, no analytics cookies are set and Google Analytics
                  is not loaded. You can change your choice at any time with the &quot;Cookie
                  settings&quot; link at the bottom of every page.
                </p>
                <ul>
                  <li><strong>_ga, _ga_*</strong> — Google Analytics: tell visits apart so we can count them. Kept for up to 2 years. Only with your consent.</li>
                  <li><strong>Your cookie choice</strong> — stored in your browser so we don&apos;t ask again on every page. Strictly necessary; it contains no personal data.</li>
                </ul>
                <p>We do not use advertising or cross-site tracking cookies.</p>
              </>
            ) : (
              <p>
                This website does not set any cookies, and it does not use analytics, advertising or
                tracking technologies. That is why you won&apos;t see a cookie banner. If we ever add
                anything that needs your consent, we will update this policy and ask you first.
              </p>
            )}

            <h2>8. Security</h2>
            <p>
              The website is served over an encrypted (HTTPS) connection, and enquiries are sent to
              us encrypted. Access to enquiries is limited to the people who need it to respond.
            </p>

            <h2>9. Your rights</h2>
            <p>Under UK data protection law (the UK GDPR and the Data Protection Act 2018) you have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Ask us to delete your data</li>
              <li>Restrict or object to how we use it</li>
              <li>Receive your data in a portable format</li>
              <li>Withdraw consent at any time, where we rely on consent</li>
            </ul>
            <p>To use any of these rights, email {mail}. We will reply within one month.</p>

            <h2>10. Complaints</h2>
            <p>
              If you are unhappy with how we have handled your data, please tell us first at {mail}.
              You also have the right to complain to the Information Commissioner&apos;s Office (ICO)
              at <a href="https://ico.org.uk" style={{ color: 'var(--c1)' }}>ico.org.uk</a>.
            </p>

            <h2>11. Changes to this policy</h2>
            <p>
              We will update this page if anything changes, and show the date of the latest version at
              the top. See also our <Link href="/privacy-and-security" style={{ color: 'var(--c1)' }}>privacy &amp; security overview</Link> of the Vape Sense product.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
