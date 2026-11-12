import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';

// Generated once at build time (the site is a static export).
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      // Named explicitly so AI search and assistants (ChatGPT, Claude, Perplexity, Gemini, Apple) can cite the site.
      {
        userAgent: [
          'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
          'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
          'PerplexityBot', 'Perplexity-User',
          'Google-Extended', 'Applebot', 'Applebot-Extended', 'Bingbot',
        ],
        allow: '/',
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
