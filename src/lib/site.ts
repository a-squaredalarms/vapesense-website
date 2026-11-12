// Site-wide facts used by metadata, structured data and page copy.
// Buyer-level facts only; the full datasheet is shared on request.

export const SITE = {
  name: 'Vape Sense',
  url: 'https://vape-sense.com',
  tagline: 'Catches the vape and the smoke. Ignores the hairspray.',
  description:
    'Privacy-safe vape and smoke detection for schools, hospitals, hotels and offices. No cameras, no microphones — VapeSense reads the air, blocks false alarms from steam, sprays and dust, and alerts staff in under 60 seconds.',
  email: 'info@vape-sense.com',
  company: 'A-Squared (A2) Ltd',
  // Google Search Console "HTML tag" code: only the content="..." value. Leave empty if you
  // verify the domain with a DNS record instead.
  googleVerification: '',
  // Google Analytics 4 Measurement ID (G-XXXXXXXXXX). Empty = no analytics and no cookie bar.
  gaId: 'G-ZRBCVPG5X9',
};

// Legal details shown in the privacy policy. Fill these in before going live; empty ones are left out.
export const LEGAL = {
  entity: 'A-Squared (A2) Ltd', // full registered name
  companyNumber: '', // Companies House number
  address: '', // registered office address
  icoNumber: '', // ICO data protection registration number
  policyUpdated: '5 November 2026',
};

export const SPECS = {
  detects: 'Vaping, smoking and tampering',
  latency: '< 60 s',
  supply: '240 V AC, hard-wired by an electrician',
  power: '< 5 W typical',
  network: 'Wi-Fi or wired Ethernet',
  dimensions: '137 × 122 × 41 mm',
  weight: 'approx. 300 g',
  coverage: 'One enclosed room up to approx. 30 m²',
  mountingHeight: '2.4 – 3.5 m ceiling',
  compliance: 'CE (RED, RoHS), WEEE',
};

export function absoluteUrl(path = '/') {
  return `${SITE.url}${path}`;
}
