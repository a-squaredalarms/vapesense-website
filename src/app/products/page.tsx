import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Chapter, CheckList, CtaBanner, AlertsVsBlocked } from '@/components/PageBlocks';
import { VisualHero, IMG } from '@/components/Media';
import HeroDevice from '@/components/home/device3d/HeroDevice';

export const metadata: Metadata = {
  title: 'Products — VapeSense Standalone or Hub System',
  description:
    'Two ways to cover your site: VapeSense Standalone for a single room, or the VapeSense Hub system — a Satellite in every room, run from one Hub and one dashboard.',
  alternates: { canonical: '/products' },
};

const range: { tag: string; title: string; best: string; body: string; includes: string[]; href: string; cta: string; visual: React.ReactNode }[] = [
  {
    tag: 'Single room',
    title: 'VapeSense Standalone',
    best: 'Best for: one room, a small site or a pilot',
    body: 'Everything in one unit: detection, dashboard, staff alerts, users and scheduling. Fit it and your first room is covered.',
    href: '/products/vapesense',
    includes: ['1 × VapeSense Standalone — no Hub needed'],
    cta: 'Explore Standalone',
    visual: <Image src={IMG.studio.src} width={IMG.studio.w} height={IMG.studio.h} alt={IMG.studio.alt} className="contain" sizes="(max-width: 900px) 92vw, 45vw" />,
  },
  {
    tag: 'Whole building',
    title: 'VapeSense Hub system',
    best: 'Best for: schools, campuses and multi-room sites',
    body: 'A VapeSense Satellite in every room, all reporting to one Hub. One dashboard, one alert feed, one set of staff logins and one schedule for the whole site — and you can add rooms at any time.',
    includes: ['1 × VapeSense Hub — runs the whole system', 'VapeSense Satellites — one per room'],
    href: '/products/vapesense-hub',
    cta: 'Explore the Hub system',
    visual: <Image src="/media/img/sector-education.jpg" width={960} height={720} alt="Satellites across two floors of a school reporting to one Hub" sizes="(max-width: 900px) 92vw, 45vw" />,
  },
];

export default function ProductsPage() {
  return (
    <>
      <VisualHero
        tag="Products"
        title={<>ONE ROOM.<br /><span className="accent">OR EVERY</span> ROOM.</>}
        sub="Start with the room that worries you most. Grow to a whole campus. Every VapeSense product catches vaping and smoking — and ignores the sprays and steam that fool other detectors."
        ctas={[{ href: '/contact?type=quote', label: 'Request a quote' }, { href: '/products/specifications', label: 'Specifications', ghost: true }]}
        image={IMG.studio}
      />

      <section className="content-section light">
        <div className="content-inner">
          <div className="section-head">
            <Chapter n="01" label="Choose your starting point" />
            <h2 className="cs-heading" style={{ color: 'var(--c0)' }}>TWO WAYS TO COVER YOUR SITE.</h2>
          </div>
          <div className="product-tiles two">
            {range.map((p) => (
              <Link key={p.title} href={p.href} className="media-card">
                <div className="media-card-visual">
                  {p.visual}
                  <span className="media-card-tag">{p.tag}</span>
                </div>
                <div className="media-card-body">
                  <h3 className="cs-card-title">{p.title}</h3>
                  <div className="product-tile-best">{p.best}</div>
                  <p className="cs-card-body">{p.body}</p>
                  <ul className="product-includes">
                    {p.includes.map((i) => <li key={i}><i className="ti ti-package" aria-hidden="true" />{i}</li>)}
                  </ul>
                  <div style={{ flex: 1 }} />
                  <span className="cs-card-link">{p.cta} →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section dark">
        <div className="content-inner feature">
          <div className="feature-copy">
            <Chapter n="02" label="Included with every unit" tone="dark" />
            <h2 className="cs-heading" style={{ color: 'var(--cw)' }}>EVERYTHING YOU NEED.<br />NOTHING YOU DON’T.</h2>
            <p className="story-lead">
              No cloud account to set up and no extra hardware to work out. Each system arrives ready
              to fit, with everything your team needs to respond.
            </p>
            <CheckList tone="dark" items={[
              'Instant alerts to staff phones, tablets and computers, plus e-mail',
              'Choose who is alerted for each room',
              'An easy dashboard with every alert and its room',
              'Tamper and offline alerts, so nobody can quietly switch it off',
              'Schedules for school hours, weekends and holidays',
              'Automatic updates and secure access from anywhere',
            ]} />
          </div>
          <div className="feature-media vhero-device" role="img" aria-label="The Vape Sense sensor">
            <div className="vhero-glow" aria-hidden="true" />
            <HeroDevice yaw={-Math.PI / 5} tilt={0.18} align="center" />
          </div>
        </div>
      </section>

      <section className="content-section tint">
        <div className="content-inner">
          <div className="section-head">
            <Chapter n="03" label="Same accuracy in every unit" />
            <h2 className="cs-heading" style={{ color: 'var(--c0)' }}>IT KNOWS THE DIFFERENCE.</h2>
            <p className="story-lead">Only the incidents that matter reach your staff — so they keep trusting the alerts.</p>
          </div>
          <AlertsVsBlocked />
        </div>
      </section>

      <CtaBanner
        heading="NOT SURE WHICH"
        accent="FITS YOUR SITE?"
        sub="Tell us how many rooms you need to cover. We’ll recommend the simplest setup that does the job."
        primary={{ href: '/contact?type=quote', label: 'Request a quote' }}
        secondary={{ href: '/contact', label: 'Book a demo' }}
      />
    </>
  );
}
