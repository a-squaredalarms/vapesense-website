import type { Metadata } from 'next';
import { FAQ_GROUPS, ALL_FAQS } from '@/lib/faq';
import JsonLd from '@/components/JsonLd';
import { CtaBanner } from '@/components/PageBlocks';
import { VisualHero, IMG } from '@/components/Media';

export const metadata: Metadata = {
  title: 'FAQ — Vape Detector Questions Answered',
  description:
    'Does VapeSense have a camera? Will hairspray set it off? How fast are alerts? Answers to the most common questions about vape and smoke detection, privacy, installation and setup.',
  alternates: { canonical: '/faq' },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: ALL_FAQS.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }}
      />
      <VisualHero
        tag="FAQ"
        title={<>GOOD QUESTIONS.<br /><span className="accent">STRAIGHT ANSWERS.</span></>}
        sub="Everything governors, IT teams, facilities managers and staff usually ask before they put a sensor on the ceiling."
        ctas={[{ href: '/contact', label: 'Ask us directly' }]}
        image={IMG.product}
      />
      <section className="content-section light">
        <div className="content-inner" style={{ maxWidth: 900 }}>
          {FAQ_GROUPS.map((g) => (
            <div key={g.title} className="faq-group">
              <h2>{g.title}</h2>
              {g.items.map((f) => (
                <details key={f.q} className="faq-item">
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          ))}
        </div>
      </section>
      <CtaBanner
        heading="STILL HAVE"
        accent="A QUESTION?"
        sub="Ask us anything — technical, practical or about privacy. We’ll answer it straight."
        primary={{ href: '/contact', label: 'Contact us' }}
        secondary={{ href: '/privacy-and-security', label: 'Privacy & security' }}
      />
    </>
  );
}
