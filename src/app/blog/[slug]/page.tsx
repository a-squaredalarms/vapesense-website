import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { POSTS, getPost, formatDate, type Block } from '@/lib/blog';
import { SITE, absoluteUrl } from '@/lib/site';
import JsonLd from '@/components/JsonLd';
import Image from 'next/image';
import { CtaBanner } from '@/components/PageBlocks';
import { VisualHero } from '@/components/Media';

export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      images: [{ url: post.cover.src, width: post.cover.w, height: post.cover.h, alt: post.cover.alt }],
    },
  };
}

function renderBlock(b: Block, i: number) {
  switch (b.type) {
    case 'h2': return <h2 key={i}>{b.text}</h2>;
    case 'h3': return <h3 key={i}>{b.text}</h3>;
    case 'p': return <p key={i}>{b.text}</p>;
    case 'ul': return <ul key={i}>{b.items.map((t) => <li key={t}>{t}</li>)}</ul>;
    case 'quote': return <blockquote key={i} className="pull-quote">{b.text}</blockquote>;
    case 'cta':
      return (
        <p key={i}>
          <strong>{b.text}</strong>{' '}
          <Link href={b.href}>{b.label} →</Link>
        </p>
      );
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          image: absoluteUrl(post.cover.src),
          description: post.description,
          datePublished: post.date,
          dateModified: post.date,
          keywords: post.keywords.join(', '),
          mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
          author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
          publisher: { '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: absoluteUrl('/vape-logo.png') } },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: absoluteUrl('/blog') },
            { '@type': 'ListItem', position: 3, name: post.title, item: absoluteUrl(`/blog/${post.slug}`) },
          ],
        }}
      />

      <VisualHero
        crumbs={
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span><Link href="/blog">Blog</Link><span>/</span><span>{post.category}</span>
          </nav>
        }
        tag={`${formatDate(post.date)} · ${post.readMinutes} min read`}
        title={<span style={{ fontSize: '0.78em', display: 'block' }}>{post.title}</span>}
        sub={post.description}
        image={post.cover}
        frame={post.category}
      />

      <section className="content-section light">
        <article className="article">
          <div className="article-takeaways">
            <strong>Key takeaways</strong>
            <div className="prose"><ul>{post.takeaways.map((t) => <li key={t}>{t}</li>)}</ul></div>
          </div>
          <div className="prose">{post.body.map(renderBlock)}</div>
        </article>
      </section>

      <section className="content-section tint">
        <div className="content-inner">
          <span className="cs-tag" style={{ color: 'var(--c4)' }}>Keep reading</span>
          <div className="post-grid three">
            {related.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="media-card">
                <div className="media-card-visual">
                  <Image src={p.cover.src} width={p.cover.w} height={p.cover.h} alt={p.cover.alt} className={p.cover.src.endsWith('.png') ? 'contain' : undefined} sizes="(max-width: 900px) 92vw, 45vw" />
                  <span className="media-card-tag">{p.category}</span>
                </div>
                <div className="media-card-body">
                  <div className="post-meta"><span>{p.readMinutes} min read</span></div>
                  <h2 className="post-title">{p.title}</h2>
                  <span className="cs-card-link">Read the guide →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        heading="READY TO TRY IT"
        accent="IN YOUR BUILDING?"
        sub="Book a demo and we’ll walk through your rooms, your network and how alerts would reach your staff."
        secondary={{ href: '/products', label: 'Explore products' }}
      />
    </>
  );
}
