import Image from 'next/image';
import Link from 'next/link';
import { AlertsVsBlocked, Chapter } from '@/components/PageBlocks';
import { POSTS, formatDate } from '@/lib/blog';
import { ALL_FAQS } from '@/lib/faq';
import JsonLd from '@/components/JsonLd';

// The turning point of the home page story: after the problem, show what makes VapeSense different.
export function DetectBlockSection() {
  return (
    <section className="content-section light" id="detect-vs-block">
      <div className="content-inner">
        <div className="two-col" style={{ alignItems: 'end' }}>
          <div>
            <Chapter n="✓" label="The difference" />
            <h2 className="cs-heading" style={{ color: 'var(--c0)', fontSize: 44 }}>
              CATCHES THE VAPE.<br />IGNORES THE HAIRSPRAY.
            </h2>
          </div>
          <p className="story-lead" style={{ marginBottom: 14 }}>
            Other detectors go off for body spray and shower steam, and staff soon stop listening.
            VapeSense knows the difference, so every alert that reaches your team is worth acting on.
          </p>
        </div>
        <AlertsVsBlocked />
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
          <Link href="/how-it-works" className="btn btn-solid-c1">See how it works</Link>
          <Link href="/privacy-and-security" className="btn btn-ghost-c4">Privacy &amp; security</Link>
        </div>
      </div>
    </section>
  );
}

const HOME_FAQ_QUESTIONS = [
  'Does it have a camera or microphone?',
  'Won’t hairspray or a hot shower set it off?',
  'How quickly are staff alerted?',
  'Can I start small and expand?',
];

export function HomeFaq() {
  const faqs = HOME_FAQ_QUESTIONS.map((q) => ALL_FAQS.find((f) => f.q === q)).filter((f) => f !== undefined);
  return (
    <section className="content-section light">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        }}
      />
      <div className="content-inner two-col-wide">
        <div>
          <Chapter n="?" label="Common questions" />
          <h2 className="cs-heading" style={{ color: 'var(--c0)' }}>THE THINGS<br />EVERYONE ASKS.</h2>
          {faqs.map((f) => (
            <details key={f.q} className="faq-item">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
          <Link href="/faq" className="cs-card-link" style={{ marginTop: 18 }}>All questions →</Link>
        </div>
        <div className="stat-card light" style={{ alignSelf: 'stretch' }}>
          <span className="stat-val">0</span>
          <span className="stat-label" style={{ color: 'var(--c4)' }}>Cameras · microphones · cloud accounts</span>
          <p className="stat-desc" style={{ color: '#5a5c5d' }}>
            VapeSense reads the air and nothing else. Your data stays on your own site, and you can
            export your history whenever you like.
          </p>
        </div>
      </div>
    </section>
  );
}

export function BlogTeaser() {
  const latest = [...POSTS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  return (
    <section className="content-section dark">
      <div className="content-inner">
        <Chapter n="→" label="From the blog" tone="dark" />
        <h2 className="cs-heading" style={{ color: 'var(--cw)' }}>GUIDES FOR THE<br />PEOPLE ON THE GROUND.</h2>
        <div className="post-grid three">
          {latest.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="media-card dark">
              <div className="media-card-visual">
                <Image src={p.cover.src} width={p.cover.w} height={p.cover.h} alt={p.cover.alt} className={p.cover.src.endsWith('.png') ? 'contain' : undefined} sizes="(max-width: 900px) 92vw, 45vw" />
                <span className="media-card-tag">{p.category}</span>
              </div>
              <div className="media-card-body">
                <div className="post-meta"><span>{formatDate(p.date)}</span></div>
                <h3 className="post-title">{p.title}</h3>
                <p className="post-excerpt">{p.description}</p>
                <span className="cs-card-link">Read the guide →</span>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/blog" className="btn btn-ghost-w" style={{ marginTop: 20 }}>All articles</Link>
      </div>
    </section>
  );
}
