import type { Metadata } from 'next';
import Link from 'next/link';
import { POSTS, formatDate } from '@/lib/blog';
import Image from 'next/image';
import { CtaBanner } from '@/components/PageBlocks';
import { VisualHero, IMG } from '@/components/Media';

export const metadata: Metadata = {
  title: 'Blog — Vape Detection Guides for Schools & Buildings',
  description:
    'Practical guides on stopping vaping in school toilets, avoiding vape detector false alarms, privacy questions to ask, and where to place a vape sensor.',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  const posts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <VisualHero
        tag="Blog"
        title={<>FIELD NOTES ON<br /><span className="accent">CLEANER AIR.</span></>}
        sub="Practical guides for the people who keep schools, hospitals, hotels and offices safe — from placing your first sensor to choosing a detector that doesn’t cry wolf."
        image={IMG.studio}
      />
      <section className="content-section tint">
        <div className="content-inner">
          <div className="post-grid three">
            {posts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="media-card">
                <div className="media-card-visual">
                  <Image src={p.cover.src} width={p.cover.w} height={p.cover.h} alt={p.cover.alt} className={p.cover.src.endsWith('.png') ? 'contain' : undefined} sizes="(max-width: 900px) 92vw, 45vw" />
                  <span className="media-card-tag">{p.category}</span>
                </div>
                <div className="media-card-body">
                <div className="post-meta">
                  <span>{formatDate(p.date)}</span>
                  <span>{p.readMinutes} min read</span>
                </div>
                <h2 className="post-title">{p.title}</h2>
                <p className="post-excerpt">{p.description}</p>
                <span className="cs-card-link">Read the guide →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBanner
        heading="RATHER SEE IT"
        accent="THAN READ ABOUT IT?"
        sub="Book a live demo and we’ll show you a vape cloud alert — and a can of hairspray being ignored."
        secondary={{ href: '/how-it-works', label: 'How it works' }}
      />
    </>
  );
}
