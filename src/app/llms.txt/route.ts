// /llms.txt — a plain-text summary of the site for AI assistants and AI search engines.
// Built from the same data as the pages, so it stays in sync. Buyer-level facts only.
import { SITE, SPECS, absoluteUrl } from '@/lib/site';
import { POSTS } from '@/lib/blog';
import { ALL_FAQS } from '@/lib/faq';

export const dynamic = 'force-static';

const PAGES: [string, string, string][] = [
  ['/', 'Home', 'What Vape Sense is and who it is for'],
  ['/products/vapesense', 'Vape Sense sensor', 'The standalone ceiling-mounted vape and smoke sensor'],
  ['/products/vapesense-hub', 'VapeSense Hub system', 'Multi-room system with one dashboard and alert feed'],
  ['/products/specifications', 'Specifications', 'Buyer-level product specifications'],
  ['/how-it-works', 'How it works', 'What it alerts on, what it ignores, and how staff are notified'],
  ['/technology', 'Why Vape Sense', 'Why schools, hospitals and businesses choose it'],
  ['/industries', 'Industries', 'Schools, healthcare, hotels, offices, leisure and public buildings'],
  ['/privacy-and-security', 'Privacy & security', 'No cameras, no microphones, data stays on site'],
  ['/case-studies', 'Example deployments', 'Typical rollouts by sector'],
  ['/faq', 'FAQ', 'Common questions from buyers'],
  ['/contact', 'Contact', 'Book a demo or request a quote'],
];

export function GET() {
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    `${SITE.name} is a privacy-safe vape and smoke detector made by ${SITE.company}, a UK company. It is designed for places where vaping happens but cameras are not allowed: school toilets and changing rooms, hospital washrooms, hotel rooms, office toilets and stairwells.`,
    '',
    '## Key facts',
    '',
    '- Detects vaping, cigarette smoke and tampering with the sensor.',
    `- Alerts staff in ${SPECS.latency.replace('<', 'under')}, by push notification and email, with the room name and severity.`,
    '- Ignores hairspray, deodorant, body spray, steam, dust and other everyday look-alikes, so it avoids false alarms.',
    '- No camera and no microphone: it reads the air only, so it is suitable for toilets and changing rooms.',
    '- Runs on the customer’s own network with no mandatory cloud account; data stays on site.',
    '- Role-based access for admins, IT staff and view-only staff; alert history can be exported.',
    `- Coverage: ${SPECS.coverage}. Mounting: ${SPECS.mountingHeight}. Power: ${SPECS.supply}.`,
    `- Network: ${SPECS.network}. Compliance: ${SPECS.compliance}.`,
    '- Available as a standalone unit for one room, or as a multi-room system with a hub.',
    `- Sales and demos: ${SITE.email} or ${absoluteUrl('/contact')}`,
    '',
    '## Pages',
    '',
    ...PAGES.map(([path, title, desc]) => `- [${title}](${absoluteUrl(path)}): ${desc}`),
    '',
    '## Guides and articles',
    '',
    ...[...POSTS]
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((p) => `- [${p.title}](${absoluteUrl(`/blog/${p.slug}`)}): ${p.description}`),
    '',
    '## Frequently asked questions',
    '',
    ...ALL_FAQS.flatMap((f) => [`### ${f.q}`, '', f.a, '']),
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
