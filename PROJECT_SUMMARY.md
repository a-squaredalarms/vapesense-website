# Vape Sense Website — Project Summary

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16.2.6 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + custom CSS (`globals.css`) |
| UI Components | React 19.2.4 |
| Icons | Tabler Icons (`ti-*` classes via CDN) |
| Fonts | Barlow Condensed, Barlow, JetBrains Mono (Google Fonts) |
| Bundler | Webpack (Turbopack disabled — incompatible with darwin/arm64) |

---

## Running the Project

```bash
npm install && npm run dev
```

Runs on `http://localhost:3000`

> **Apple Silicon note:** `--webpack` flag is set in `package.json` to avoid Turbopack crashing on darwin/arm64.
> If `lightningcss` is blocked by macOS Gatekeeper, run:
> `xattr -dr com.apple.quarantine node_modules`

---

## File Structure

```
src/
├── app/
│   ├── globals.css           # All site-wide + page-specific CSS
│   ├── layout.tsx            # Root layout (Nav + Footer wrappers)
│   ├── page.tsx              # Home page
│   ├── contact/page.tsx      # Contact page (multi-tab form)
│   ├── technology/page.tsx
│   ├── how-it-works/page.tsx
│   ├── industries/page.tsx
│   ├── case-studies/page.tsx
│   └── privacy-policy/page.tsx
├── components/
│   ├── Nav.tsx               # Site navigation
│   ├── Footer.tsx            # Site footer
│   ├── TickerBand.tsx        # Scrolling ticker
│   └── home/                 # Home page section components
│       ├── Hero.tsx
│       ├── Challenge.tsx
│       ├── TechnologySection.tsx
│       ├── HardwareSection.tsx
│       ├── DashboardSection.tsx
│       ├── ProcessSection.tsx
│       ├── IndustriesSection.tsx
│       ├── SpecStrip.tsx
│       └── CtaSection.tsx
public/
├── vape-sense-writing-logo.png   # Nav logo (text)
├── light-color-logo.png          # Footer logo (coloured)
└── vape-logo.png                 # Icon-only logo
```

---

## CSS Design Tokens (`globals.css`)

| Variable | Value / Role |
|---|---|
| `--c0` | Darkest background |
| `--c1` | Brand accent (primary) |
| `--c2`–`--c6` | Tonal scale |
| `--cw` | White |
| `--site-width` | `90rem` — max content width |
| `--ff-h` | Barlow Condensed (headings) |
| `--ff-b` | Barlow (body) |
| `--ff-m` | JetBrains Mono (mono/labels) |

Width-constrained sections always use:
```css
max-width: var(--site-width);
margin: 0 auto;
```

---

## Pages & Routes

| Route | Description |
|---|---|
| `/` | Home — hero, tech, hardware, dashboard, process, industries, CTA |
| `/technology` | Technology detail page |
| `/how-it-works` | Process explanation page |
| `/industries` | Sector-specific use cases |
| `/case-studies` | Customer case studies |
| `/contact` | Multi-tab contact page |
| `/privacy-policy` | Legal privacy policy |

> The `/about` page was deleted. All nav and footer references to it have been removed.

---

## Contact Page (`/contact/page.tsx`)

A fully client-side React page with three tab routes:

- **Book a Demo** — preferred format selector (video / on-site / phone) + form
- **Request a Quote** — product type selector + form
- **General Enquiry** — freeform message form

### State
```ts
const [route, setRoute] = useState<Route>(0);   // 0 | 1 | 2
const [demoType, setDemoType] = useState(0);
const [quoteType, setQuoteType] = useState(0);
const [sent, setSent] = useState(false);
```

On submit, `sent` becomes `true` and the form is replaced by a success state showing a generated reference number (`VS-2024-XXXX`).

### Layout structure
```
.contact-page
├── .contact-hero              (dark, full-width)
│   └── .contact-hero-inner   (max-width: --site-width)
├── .contact-route-strip       (border, full-width)
│   └── .contact-route-inner  (3-col grid, max-width: --site-width)
└── .contact-body              (2-col grid, max-width: --site-width)
    ├── .contact-form-panel    (form / success state)
    └── .contact-right-panel   (live status, contact methods, offices)
```

---

## Navigation (`Nav.tsx`)

Links: Technology · Industries · How It Works · Contact

CTA buttons in nav: "Request Quote" → `/contact` | "Book Demo" → `/contact`

---

## Key Decisions Made

- Turbopack replaced with Webpack for Apple Silicon compatibility
- About page deleted entirely (no redirect needed — no external links)
- Contact page rebuilt from a provided HTML reference design, re-implemented in React/TypeScript with existing CSS variables and form classes
- All content sections use consistent `max-width: var(--site-width); margin: 0 auto` for width alignment
