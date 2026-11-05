import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import LiveScene, { type SceneName } from './LiveScene';

// Animation names used by pages → live scene names. Only exterior views are shown on the site.
const SCENE_FOR: Record<string, SceneName> = {
  '04-detection': 'detection', '05-install': 'install', '07-network': 'network', '09-schedule': 'schedule',
};

// Visual building blocks for inner pages: product renders, framed animations and diagrams.
// Images live in /public/media/img.

export type Img = { src: string; w: number; h: number; alt: string };

export const IMG = {
  studio: { src: '/media/img/hero-studio.png', w: 1096, h: 836, alt: 'Vape Sense sensor, white ceiling-mounted enclosure with intake vents' },
  product: { src: '/media/img/product.png', w: 671, h: 730, alt: 'Vape Sense sensor seen from an angle' },
  front: { src: '/media/img/front.png', w: 886, h: 790, alt: 'Front of the Vape Sense sensor' },
  lineIso: { src: '/media/img/sk-iso.png', w: 757, h: 784, alt: 'Line drawing of the Vape Sense sensor' },
  lineFront: { src: '/media/img/sk-front.png', w: 1182, h: 1055, alt: 'Front-view technical drawing of the Vape Sense sensor' },
  lineSide: { src: '/media/img/sk-side.png', w: 610, h: 1811, alt: 'Side-view technical drawing of the Vape Sense sensor' },
  ceiling: { src: '/media/img/inst-3.jpg', w: 900, h: 675, alt: 'Vape Sense mounted flush on a ceiling' },
  ceilingLive: { src: '/media/img/inst-4.jpg', w: 900, h: 675, alt: 'Vape Sense on a ceiling, monitoring the air' },
  plate: { src: '/media/img/inst-1.jpg', w: 900, h: 675, alt: 'Mounting plate fixed to the ceiling with the cable through it' },
  fitting: { src: '/media/img/inst-2.jpg', w: 900, h: 675, alt: 'Sensor being fitted onto its ceiling plate' },
  step1: { src: '/media/img/step3d-1.jpg', w: 1400, h: 723, alt: 'Mounting plate, mains cable and fixing screws' },
  step2: { src: '/media/img/step3d-2.jpg', w: 1400, h: 723, alt: 'Sensor lined up with the wired mounting plate' },
  step3: { src: '/media/img/step3d-3.jpg', w: 1400, h: 723, alt: 'Sensor pushed home and locked with side security screws' },
  step4: { src: '/media/img/step3d-4.jpg', w: 1400, h: 723, alt: 'Sensor connecting to Wi-Fi from a phone' },
} satisfies Record<string, Img>;

/* ── Dark split hero: words left, product visual right ── */
export function VisualHero({
  tag,
  title,
  sub,
  ctas,
  image,
  video,
  crumbs,
  frame,
  bare,
  visual,
}: {
  tag: string;
  title: ReactNode;
  sub: ReactNode;
  ctas?: { href: string; label: string; ghost?: boolean }[];
  image?: Img;
  video?: { name: string; label: string };
  crumbs?: ReactNode;
  frame?: string;
  bare?: boolean;
  visual?: ReactNode;
}) {
  return (
    <section className="vhero">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-scan" aria-hidden="true" />
      <div className="vhero-inner">
        <div className="vhero-copy">
          {crumbs}
          <span className="vhero-tag"><span className="vhero-dot" aria-hidden="true" />{tag}</span>
          <h1>{title}</h1>
          <p className="vhero-sub">{sub}</p>
          {ctas && (
            <div className="vhero-ctas">
              {ctas.map((c) => (
                <Link key={c.label} href={c.href} className={c.ghost ? 'btn btn-ghost-w' : 'btn btn-solid-c1'}>{c.label}</Link>
              ))}
            </div>
          )}
        </div>
        <div className={`vhero-visual${video || frame ? ' is-video' : ''}`}>
          <div className="vhero-glow" aria-hidden="true" />
          {visual ? (
            visual
          ) : video ? (
            <LiveScene name={SCENE_FOR[video.name] ?? 'detection'} label={video.label} />
          ) : image && frame ? (
            <FramedImage image={image} label={frame} cover />
          ) : image ? (
            <Image src={image.src} width={image.w} height={image.h} alt={image.alt} priority className="vhero-img" sizes="(max-width: 900px) 90vw, 46vw" />
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* ── HUD-style frame around a clip or screenshot ── */
export function MediaFrame({ label, children, light = false }: { label?: string; children: ReactNode; light?: boolean }) {
  return (
    <figure className={`media-frame${light ? ' light' : ''}`}>
      <span className="mf-corner tl" aria-hidden="true" />
      <span className="mf-corner tr" aria-hidden="true" />
      <span className="mf-corner bl" aria-hidden="true" />
      <span className="mf-corner br" aria-hidden="true" />
      {children}
      {label && <figcaption><span className="mf-rec" aria-hidden="true" />{label}</figcaption>}
    </figure>
  );
}

// Live animation only — no frame caption or wording.
export function FramedVideo({ name, label }: { name: string; label: string; light?: boolean }) {
  const scene = SCENE_FOR[name] ?? 'detection';
  return <LiveScene name={scene} label={label} className={scene === 'install' ? 'contained' : ''} />;
}

/* ── Full-width animation hero (no text on screen; the h1 stays for search engines) ── */
export function SceneHero({ scene, label, title }: { scene: SceneName; label: string; title: string }) {
  return (
    <section className="scene-hero">
      <h1 className="sr-only">{title}</h1>
      <LiveScene name={scene} label={label} className="full" />
    </section>
  );
}

export function FramedImage({ image, label, light, cover }: { image: Img; label?: string; light?: boolean; cover?: boolean }) {
  return (
    <MediaFrame label={label} light={light}>
      <Image src={image.src} width={image.w} height={image.h} alt={image.alt} className={cover ? 'mf-img cover' : 'mf-img'} sizes="(max-width: 900px) 92vw, 50vw" />
    </MediaFrame>
  );
}

/* ── Text + visual row; flip to put the visual on the left ── */
export function Feature({
  tone = 'dark',
  flip = false,
  media,
  children,
  id,
}: {
  tone?: 'dark' | 'light' | 'tint';
  flip?: boolean;
  media: ReactNode;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section className={`content-section ${tone}`} id={id}>
      <div className={`content-inner feature${flip ? ' flip' : ''}`}>
        <div className="feature-copy">{children}</div>
        <div className="feature-media">{media}</div>
      </div>
    </section>
  );
}

/* ── Four illustrated install steps ── */
export function InstallSteps({ tone = 'light' }: { tone?: 'dark' | 'light' }) {
  const steps: { img: Img; title: string; body: string }[] = [
    { img: IMG.step1, title: 'Fix the plate', body: 'Screw the mounting plate to the ceiling over the mains cable.' },
    { img: IMG.step2, title: 'Wire it', body: 'A qualified electrician connects it to mains power, plus a network cable if you prefer wired.' },
    { img: IMG.step3, title: 'Lock it', body: 'Push the sensor home and fit the security screws. From now on, any tampering raises an alert.' },
    { img: IMG.step4, title: 'Connect it', body: 'Join your Wi-Fi from a phone, or plug in a network cable.' },
  ];
  return (
    <ol className={`install-steps ${tone}`}>
      {steps.map((s, i) => (
        <li key={s.title}>
          <div className="install-img">
            <Image src={s.img.src} width={s.img.w} height={s.img.h} alt={s.img.alt} sizes="(max-width: 600px) 92vw, (max-width: 1100px) 46vw, 23vw" />
            <span className="install-n">{String(i + 1).padStart(2, '0')}</span>
          </div>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

/* ── Dimensioned technical drawing ── */
export function DimensionDrawing() {
  return (
    <div className="dims">
      <figure className="dims-view">
        <div className="dims-box">
          <Image src={IMG.lineFront.src} width={IMG.lineFront.w} height={IMG.lineFront.h} alt={IMG.lineFront.alt} sizes="(max-width: 900px) 70vw, 420px" />
          <span className="dim-h"><b>137 mm</b></span>
          <span className="dim-v"><b>122 mm</b></span>
        </div>
        <figcaption>Front view</figcaption>
      </figure>
      <figure className="dims-view side">
        <div className="dims-box">
          <Image src={IMG.lineSide.src} width={IMG.lineSide.w} height={IMG.lineSide.h} alt={IMG.lineSide.alt} sizes="120px" />
          <span className="dim-h"><b>41</b></span>
        </div>
        <figcaption>Side view</figcaption>
      </figure>
    </div>
  );
}

/* ── Big number strip used under heroes ── */
export function FactStrip({ facts }: { facts: { val: string; lbl: string }[] }) {
  return (
    <div className="spec-strip" aria-label="Key facts">
      <div className="spec-inner">
        {facts.map((f) => (
          <div key={f.lbl} className="spec-cell">
            <span className="spec-val">{f.val}</span>
            <span className="spec-lbl">{f.lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
