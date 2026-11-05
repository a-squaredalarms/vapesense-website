import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Challenge from '@/components/home/Challenge';
import JsonLd from '@/components/JsonLd';
import { Chapter, CheckList, CtaBanner, AlertsVsBlocked, SpecTable } from '@/components/PageBlocks';
import { VisualHero, FactStrip, Feature, FramedVideo, FramedImage, InstallSteps, IMG } from '@/components/Media';
import { SITE, SPECS, absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'VapeSense Standalone — All-in-One Vape & Smoke Detector',
  description:
    'A self-contained ceiling vape and smoke detector for a single room. Its own dashboard, push and email alerts, users and scheduling. No cameras, no hub required.',
  alternates: { canonical: '/products/vapesense' },
};

export default function VapeSensePage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'VapeSense Standalone',
          description: metadata.description,
          brand: { '@type': 'Brand', name: SITE.name },
          category: 'Vape and smoke detector',
          image: absoluteUrl(IMG.studio.src),
          url: absoluteUrl('/products/vapesense'),
        }}
      />

      <VisualHero
        tag="VapeSense Standalone"
        title={<>ONE ROOM.<br /><span className="accent">FULLY</span> COVERED.</>}
        sub="A self-contained vape and smoke detector with its own dashboard, alerts, users and schedule. Mount it, connect it, and your most problematic room is covered — no hub required."
        ctas={[{ href: '/contact?type=quote', label: 'Request a quote' }, { href: '/products/specifications', label: 'Specifications', ghost: true }]}
        image={IMG.studio}
      />
      <FactStrip facts={[
        { val: '<60s', lbl: 'CLOUD TO STAFF ALERT' },
        { val: '~30m²', lbl: 'COVERAGE PER ROOM' },
        { val: '0', lbl: 'CAMERAS OR MICROPHONES' },
        { val: '240V', lbl: 'HARD-WIRED · NO BATTERIES' },
      ]} />

      <Challenge />

      <Feature
        tone="dark"
        media={<FramedImage image={IMG.ceilingLive} label="VapeSense Standalone on a washroom ceiling" cover />}
      >
        <Chapter n="01" label="Everything in one box" tone="dark" />
        <h2 className="cs-heading" style={{ color: 'var(--cw)' }}>EVERYTHING<br />IN ONE BOX.</h2>
        <p className="story-lead">
          The Standalone unit does the whole job on its own. It spots the incident, alerts your staff
          and keeps the record — no hub, no server, no cloud account.
        </p>
        <CheckList tone="dark" items={[
          'Catches vaping and smoking, ignores sprays, steam and dust',
          'Simple dashboard with every alert, its room and the full history',
          'Push alerts to unlimited staff devices, plus email',
          'Role-based users, scheduling and secure remote access built in',
          'Tamper alert if the case is opened or a screw removed',
        ]} />
      </Feature>

      <Feature
        tone="dark"
        flip
        media={<FramedVideo name="05-install" label="Ceiling-mounted · 2.4–3.5 m" />}
      >
        <Chapter n="02" label="Ideal for" />
        <h2 className="cs-heading" style={{ color: 'var(--c0)' }}>START WITH YOUR<br />HARDEST ROOM.</h2>
        <p className="story-lead">
          Most sites begin with the one room that causes the most concern — the toilet block, the
          changing room, the back-of-house washroom. Prove it there, then grow.
        </p>
        <CheckList items={['A single washroom or changing room', 'A small site with one problem area', 'A pilot before a wider rollout']} />
        <Link href="/products/vapesense-hub" className="cs-card-link">Ready for more rooms? See the hub system →</Link>
      </Feature>

      <section className="content-section dark">
        <div className="content-inner">
          <div className="feature">
            <div className="feature-copy">
              <Chapter n="03" label="What it reacts to" />
              <h2 className="cs-heading" style={{ color: 'var(--c0)' }}>CAUGHT IN SECONDS.<br />NEVER FOOLED BY SPRAY.</h2>
              <p className="story-lead">
                The moment someone vapes, VapeSense knows — and it knows the difference between a
                vape and a can of deodorant. Staff get an alert with the exact room, fast enough to
                act on.
              </p>
            </div>
            <div className="feature-media"><FramedVideo name="04-detection" label="Live detection" /></div>
          </div>
          <AlertsVsBlocked tone="dark" />
        </div>
      </section>

      <section className="content-section light">
        <div className="content-inner">
          <div className="section-head">
            <Chapter n="04" label="Up and running" />
            <h2 className="cs-heading" style={{ color: 'var(--c0)' }}>FROM CEILING TO FIRST ALERT.</h2>
            <p className="story-lead">Four steps for a qualified electrician, then name the room, add your staff and press the test button.</p>
          </div>
          <InstallSteps />
        </div>
      </section>

      <section className="content-section dark">
        <div className="content-inner feature flip">
          <div className="feature-copy">
            <Chapter n="05" label="Key data" tone="dark" />
            <SpecTable tone="dark" rows={[
              ['Detects', SPECS.detects],
              ['Time to alert', SPECS.latency],
              ['Coverage', SPECS.coverage],
              ['Network', SPECS.network],
              ['Supply', SPECS.supply],
              ['Dimensions', SPECS.dimensions],
              ['Compliance', SPECS.compliance],
            ]} />
            <Link href="/products/specifications" className="btn btn-ghost-c1">All specifications</Link>
          </div>
          <div className="feature-media" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="vhero-glow" aria-hidden="true" />
            <Image src={IMG.product.src} width={IMG.product.w} height={IMG.product.h} alt={IMG.product.alt} className="vhero-img" style={{ maxWidth: 440 }} sizes="(max-width: 900px) 80vw, 440px" />
          </div>
        </div>
      </section>

      <CtaBanner
        heading="COVER YOUR"
        accent="FIRST ROOM."
        sub="Tell us about the space. We’ll quote a Standalone unit and show you how it would alert your team."
        primary={{ href: '/contact?type=quote', label: 'Request a quote' }}
        secondary={{ href: '/contact', label: 'Book a demo' }}
      />
    </>
  );
}
