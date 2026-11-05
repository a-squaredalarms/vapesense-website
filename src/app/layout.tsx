import type { Metadata } from 'next';
import { Barlow, Barlow_Condensed, JetBrains_Mono } from 'next/font/google';
// Icons are bundled with the site (not loaded from a CDN), so no third party sees page views.
import '@tabler/icons-webfont/dist/tabler-icons.min.css';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import JsonLd from '@/components/JsonLd';
import { SITE } from '@/lib/site';

const barlow = Barlow({
  variable: '--font-barlow',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
});

const barlowCondensed = Barlow_Condensed({
  variable: '--font-barlow-condensed',
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Vape Sense — Vape & Smoke Detection Without Cameras or False Alarms',
    template: '%s | Vape Sense',
  },
  description: SITE.description,
  keywords: [
    'vape detector',
    'vape detector for schools',
    'vape detection without cameras',
    'bathroom vape sensor',
    'vape detector no false alarms',
    'school vape alarm',
    'smoke detector for toilets',
  ],
  applicationName: SITE.name,
  ...(SITE.googleVerification ? { verification: { google: SITE.googleVerification } } : {}),
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: 'en_GB',
    url: '/',
    title: 'Vape Sense — Catches the vape and the smoke. Ignores the hairspray.',
    description: SITE.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vape Sense — Vape & smoke detection without cameras',
    description: SITE.description,
  },
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/vape-logo.png`,
  email: SITE.email,
  description: SITE.description,
  slogan: SITE.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-GB"
      className={`${barlow.variable} ${barlowCondensed.variable} ${jetbrainsMono.variable}`}
      style={
        {
          '--ff-h': 'var(--font-barlow-condensed), sans-serif',
          '--ff-b': 'var(--font-barlow), sans-serif',
          '--ff-m': 'var(--font-jetbrains-mono), monospace',
        } as React.CSSProperties
      }
    >
      <body>
        <JsonLd data={orgJsonLd} />
        <Nav />
        <main>{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
