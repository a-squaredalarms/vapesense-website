import type { Metadata } from 'next';
import Image from 'next/image';
import { Chapter, CheckList, CtaBanner } from '@/components/PageBlocks';
import { VisualHero, FactStrip, IMG } from '@/components/Media';

export const metadata: Metadata = {
  title: 'Privacy & Security — Vape Detection Without Cameras',
  description:
    'VapeSense has no camera and no microphone. Your data stays on your own site, everything is encrypted, and it needs no changes to your firewall.',
  alternates: { canonical: '/privacy-and-security' },
};

export default function PrivacySecurityPage() {
  return (
    <>
      <VisualHero
        tag="Privacy & security"
        title={<>DETECTION WITHOUT<br /><span className="accent">SURVEILLANCE.</span></>}
        sub="Vaping happens in the places you can’t watch — and shouldn’t. VapeSense was designed so you never have to choose between safety and privacy."
        ctas={[{ href: '/contact', label: 'Ask a privacy question' }, { href: '/blog/vape-detector-privacy-questions', label: '7 questions to ask', ghost: true }]}
        image={IMG.front}
      />
      <FactStrip facts={[
        { val: '0', lbl: 'CAMERAS' },
        { val: '0', lbl: 'MICROPHONES' },
        { val: '100%', lbl: 'ENCRYPTED' },
        { val: '0', lbl: 'FIREWALL CHANGES' },
      ]} />

      <section className="content-section light">
        <div className="content-inner two-col">
          <div>
            <Chapter n="01" label="What it never captures" />
            <div className="cs-heading" style={{ color: 'var(--c0)' }}>NOTHING TO SEE.<br />NOTHING TO HEAR.</div>
            <p className="story-lead">
              A toilet, a changing room, a hospital washroom. These are spaces where people have every
              right to privacy. So VapeSense reads only one thing: the air.
            </p>
            <CheckList items={[
              'No camera — no images or video, ever',
              'No microphone — no audio of any kind',
              'Reads the air and nothing else',
              'Nothing that identifies a person',
              'Suitable for washrooms and changing rooms where cameras are prohibited',
            ]} />
          </div>
          <div>
            <Chapter n="02" label="Where your data lives" />
            <div className="cs-heading" style={{ color: 'var(--c0)' }}>ON YOUR SITE.<br />IN YOUR HANDS.</div>
            <p className="story-lead">
              Readings and events stay on your own network, on the sensor or hub. There is no
              mandatory cloud account and no vendor holding your history.
            </p>
            <CheckList items={[
              'Self-hosted on your local network',
              'No mandatory third-party cloud',
              'Export your alert history whenever you need it',
              'Nothing from outside can connect in to your network',
            ]} />
          </div>
        </div>
      </section>

      <section className="content-section dark">
        <div className="content-inner two-col-wide">
          <div>
            <Chapter n="03" label="How it’s protected" tone="dark" />
            <div className="cs-heading" style={{ color: 'var(--cw)' }}>SECURE BY DESIGN.</div>
            <p className="story-lead">
              A sensor network is only as trustworthy as its weakest device. VapeSense is built so
              your IT team doesn’t have to worry about it.
            </p>
            <CheckList tone="dark" items={[
              'Everything between sensors, hub and staff is encrypted',
              'Each sensor is individually secured — one can’t see another’s data',
              'Only approved sensors can join your system',
              'Role-based access: Admin, IT staff and view-only Teacher / Staff',
              'Automatic updates, so security fixes reach every unit',
              'Tamper alert if anyone opens, covers or removes a sensor',
            ]} />
          </div>
          <div>
            <Chapter n="04" label="For your IT team" tone="dark" />
            <div className="cs-heading" style={{ color: 'var(--cw)' }}>NO SURPRISES<br />FOR IT.</div>
            <CheckList tone="dark" items={[
              'Runs on your existing Wi-Fi or wired network',
              'No port-forwarding and no inbound firewall rules',
              'Secure remote access without a VPN or static IP',
              'No third-party cloud account required',
            ]} />
            <p className="story-lead" style={{ fontSize: 18, color: 'rgba(255,255,255,.6)' }}>
              We share the full network and security details directly with your IT team, along with
              the datasheet and installation guide.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section tint">
        <div className="content-inner feature flip">
          <div className="feature-media" style={{ display: 'flex', justifyContent: 'center' }}>
            <Image src={IMG.lineIso.src} width={IMG.lineIso.w} height={IMG.lineIso.h} alt={IMG.lineIso.alt} style={{ width: '100%', maxWidth: 380, height: 'auto' }} sizes="380px" />
          </div>
          <div className="feature-copy">
          <Chapter n="05" label="The honest part" />
          <div className="cs-heading" style={{ color: 'var(--c0)' }}>WHAT IT TELLS YOU — AND WHAT IT DOESN’T.</div>
          <p className="story-lead">
            VapeSense tells staff that vaping or smoking happened, where, when and how severe. It never
            tells them who. The response is always human — and that is how it should be.
          </p>
          <p className="story-lead" style={{ fontSize: 18 }}>
            Privacy obligations differ by country and sector. Involve your data protection lead before
            deployment; we are happy to provide the information they need for their assessment.
          </p>
          </div>
        </div>
      </section>

      <CtaBanner
        heading="QUESTIONS ABOUT"
        accent="PRIVACY?"
        sub="Your governors, DPO or IT team can ask us anything. We’ll give straight answers and the documents they need."
        primary={{ href: '/contact', label: 'Contact us' }}
        secondary={{ href: '/blog/vape-detector-privacy-questions', label: '7 questions to ask' }}
      />
    </>
  );
}
