import type { Metadata } from 'next';
import { Chapter, CtaBanner } from '@/components/PageBlocks';
import { VisualHero, Feature, FramedImage, IMG } from '@/components/Media';

export const metadata: Metadata = {
  title: 'About — Safer Spaces Without Surveillance',
  description:
    'Why we built VapeSense: vaping happens where cameras can’t go, and cheap detectors cry wolf. Our mission is safer spaces without surveillance and without false alarms.',
  alternates: { canonical: '/about' },
};

const values = [
  { icon: 'ti-eye-off', title: 'Privacy first', body: 'Our sensors read air, not people. No cameras, no audio, no biometric data. If a feature needs to watch someone, we won’t build it.' },
  { icon: 'ti-target-arrow', title: 'Trust over noise', body: 'A detector staff ignore is worse than none. We would rather block a hairspray cloud than ever send a pointless alert.' },
  { icon: 'ti-scale', title: 'Honest claims', body: 'We say “detects” and “alerts”, never “identifies”. We are clear about what the technology can and can’t do, and that the response is always human.' },
  { icon: 'ti-home-shield', title: 'Your data, your site', body: 'Everything runs on your own network. No mandatory cloud, no lock-in, and you can export your records any time.' },
];

export default function AboutPage() {
  return (
    <>
      <VisualHero
        tag="About"
        title={<>SAFER SPACES.<br /><span className="accent">NO SURVEILLANCE.</span></>}
        sub="VapeSense started with a simple, stubborn problem: vaping happens in exactly the rooms nobody can — or should — watch."
        ctas={[{ href: '/contact', label: 'Talk to us' }, { href: '/how-it-works', label: 'How it works', ghost: true }]}
        image={IMG.studio}
      />

      <section className="content-section light">
        <div className="content-inner" style={{ maxWidth: 900 }}>
          <Chapter n="01" label="The problem" />
          <div className="cs-heading" style={{ color: 'var(--c0)' }}>THE ROOMS YOU CAN’T WATCH.</div>
          <p className="story-lead">
            Toilets. Changing rooms. Stairwells. Hotel bathrooms. Hospital washrooms. They are the places
            where vaping and smoking happen most, and the places where cameras are rightly off-limits.
          </p>
          <p className="story-lead">
            The options on offer weren’t good enough. Patrols took staff away from their real work.
            Locked doors created new problems. And the detectors that existed went off every time
            someone used deodorant — so within weeks, nobody listened to them.
          </p>

          <Chapter n="02" label="The idea" />
          <div className="cs-heading" style={{ color: 'var(--c0)', marginTop: 6 }}>A DETECTOR STAFF CAN BELIEVE.</div>
          <p className="story-lead">
            The problem was never just spotting vaping. It was spotting vaping without crying wolf.
            So we set out to build a detector that knows the difference between a vape and a can of
            deodorant — one that staff would trust enough to act on every single time.
          </p>
          <blockquote className="pull-quote">Catch the vape and the smoke. Ignore the hairspray.</blockquote>
          <p className="story-lead">
            That became VapeSense: a ceiling sensor that alerts staff to vaping, smoking and tampering in
            under 60 seconds, ignores the look-alikes that fool cheaper devices, and keeps your data on
            your own site.
          </p>

        </div>
      </section>

      <Feature tone="dark" media={<FramedImage image={IMG.ceiling} label="Built for real buildings" cover />}>
        <Chapter n="03" label="Built to last" tone="dark" />
        <h2 className="cs-heading" style={{ color: 'var(--cw)' }}>ENGINEERED FOR<br />REAL BUILDINGS.</h2>
        <p className="story-lead">
          VapeSense is hard-wired, locked to the ceiling and tamper-protected. It keeps itself up to
          date automatically, and scales from a single pilot room to a whole campus run from one hub.
        </p>
      </Feature>

      <section className="content-section tint">
        <div className="content-inner">
          <Chapter n="04" label="What we stand for" />
          <div className="cs-heading" style={{ color: 'var(--c0)' }}>FOUR PROMISES.</div>
          <div className="tech-grid cols-2" style={{ marginTop: 24 }}>
            {values.map((v) => (
              <div key={v.title} className="cs-card" style={{ padding: 26 }}>
                <div style={{ fontSize: 34, color: 'var(--c1)', marginBottom: 12 }}><i className={`ti ${v.icon}`} /></div>
                <h3 className="cs-card-title">{v.title}</h3>
                <p className="cs-card-body">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        heading="LET’S TALK ABOUT"
        accent="YOUR BUILDING."
        sub="Tell us which rooms keep you up at night. We’ll show you how VapeSense would work there."
        secondary={{ href: '/how-it-works', label: 'How it works' }}
      />
    </>
  );
}
