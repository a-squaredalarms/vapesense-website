import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — Book a Demo or Request a Quote',
  description:
    'Book a live VapeSense demo, request a quote for your building, or ask a technical question. See a vape alert — and a can of hairspray being ignored.',
  alternates: { canonical: '/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
