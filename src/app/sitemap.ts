import type { MetadataRoute } from 'next';
import { POSTS } from '@/lib/blog';
import { absoluteUrl } from '@/lib/site';

// Generated once at build time (the site is a static export).
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, number, MetadataRoute.Sitemap[number]['changeFrequency']][] = [
    ['/', 1, 'monthly'],
    ['/products', 0.9, 'monthly'],
    ['/products/vapesense', 0.9, 'monthly'],
    ['/products/vapesense-hub', 0.9, 'monthly'],
    ['/products/specifications', 0.7, 'monthly'],
    ['/how-it-works', 0.9, 'monthly'],
    ['/technology', 0.7, 'monthly'],
    ['/industries', 0.8, 'monthly'],
    ['/privacy-and-security', 0.8, 'monthly'],
    ['/faq', 0.7, 'monthly'],
    ['/blog', 0.7, 'weekly'],
    ['/case-studies', 0.5, 'monthly'],
    ['/about', 0.5, 'yearly'],
    ['/contact', 0.6, 'yearly'],
    ['/privacy-policy', 0.2, 'yearly'],
  ];
  return [
    ...pages.map(([path, priority, changeFrequency]) => ({ url: absoluteUrl(path), priority, changeFrequency })),
    ...POSTS.map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: p.date, priority: 0.6, changeFrequency: 'yearly' as const })),
  ];
}
