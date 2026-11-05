import type { ReactNode } from 'react';

// On the website the animations run without any wording, so captions render nothing.
export function Caption(_props: { eyebrow: string; title: string; text: string; children?: ReactNode }) {
  return null;
}
