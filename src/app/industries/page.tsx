import type { Metadata } from 'next';
import Link from 'next/link';
import IndustriesSection from '@/components/home/IndustriesSection';
import { Chapter, CheckList } from '@/components/PageBlocks';
import NetworkAnimation from '@/components/NetworkAnimation';
import { VisualHero, FramedImage, type Img } from '@/components/Media';

export const metadata: Metadata = {
  title: 'Vape Detectors for Schools, Hospitals, Hotels & Offices',
  description: 'Where VapeSense fits: school toilets and changing rooms, hospital and care-home washrooms, non-smoking hotel rooms, office restrooms, leisure centres and public buildings.',
  alternates: { canonical: '/industries' },
};

const sectors = [
  {
    id: 'education', image: { src: '/media/img/insitu-education.jpg', w: 1200, h: 900, alt: 'Vape Sense on the ceiling of a school toilet block, above the cubicles' } as Img, icon: 'ti-school', title: 'Education', sub: 'Schools · Colleges · Universities',
    desc: 'Stop vaping in pupil toilets, changing rooms and stairwells — without cameras, and without false alarms.',
    story: 'Vaping in schools happens in the places staff can’t supervise and cameras can’t go. VapeSense gives pastoral and safeguarding teams a timely alert with the room and severity, so they can respond while it matters — and an event history to spot patterns by block and period.',
    where: ['Pupil toilets and toilet blocks', 'Changing rooms', 'Stairwells and quiet corridors', 'Halls of residence and shared facilities'],
    fit: ['Schedule matched to the school day; rest over holidays', 'Teachers get view-only alerts; IT manages configuration', 'Blocks deodorant and body spray before PE'],
  },
  {
    id: 'healthcare', image: { src: '/media/img/insitu-healthcare.jpg', w: 1200, h: 900, alt: 'Vape Sense on the ceiling of a hospital patient washroom with grab rails and pull-cord' } as Img, icon: 'ti-heart-rate-monitor', title: 'Healthcare', sub: 'Hospitals · Care homes · Clinics',
    desc: 'Discreet detection in patient and staff washrooms, where privacy is non-negotiable.',
    story: 'Smoking and vaping in hospital and care-home washrooms is a safety risk and a policy headache. VapeSense measures air only, so it can sit on the ceiling of a patient washroom without capturing anything personal — and it tells smoke apart from vape.',
    where: ['Patient washrooms', 'Staff restrooms', 'Stairwells and enclosed waiting areas'],
    fit: ['Smoke reported separately from vape', 'Steam from showers recognised and blocked', 'Data stays on the site network'],
  },
  {
    id: 'hospitality', image: { src: '/media/img/insitu-hospitality.jpg', w: 1200, h: 900, alt: 'Vape Sense on the ceiling of a hotel bedroom' } as Img, icon: 'ti-bed', title: 'Hospitality', sub: 'Hotels · Serviced apartments · Venues',
    desc: 'Protect non-smoking rooms and shared bathrooms — and know before the next guest does.',
    story: 'One room that smells of smoke or vape can cost a deep clean and a review. VapeSense alerts housekeeping or the duty manager when it happens, so you can act on the day — with a timestamped record of the event.',
    where: ['Non-smoking guest rooms', 'Shared and public bathrooms', 'Back-of-house areas'],
    fit: ['Hairspray and shower steam blocked', 'Alerts to the duty manager’s phone', 'Event history with room and time'],
  },
  {
    id: 'offices', image: { src: '/media/img/insitu-offices.jpg', w: 1200, h: 900, alt: 'Vape Sense on the ceiling of an office washroom' } as Img, icon: 'ti-building', title: 'Offices', sub: 'Offices · Commercial property · HQs',
    desc: 'Enforce no-vaping policies in restrooms and back-of-house with data, not suspicion.',
    story: 'Restroom vaping in a workplace is hard to raise without evidence. VapeSense gives facilities teams a clear record of when and where events happen, alongside continuous air-quality data for the same rooms.',
    where: ['Restrooms', 'Stairwells', 'Back-of-house and plant areas'],
    fit: ['Incident history and reports', 'Role-based access for facilities and HR', 'One hub for every floor'],
  },
  {
    id: 'leisure', image: { src: '/media/img/insitu-leisure.jpg', w: 1200, h: 900, alt: 'Vape Sense on the ceiling of a leisure centre changing room with lockers' } as Img, icon: 'ti-swimming', title: 'Leisure', sub: 'Gyms · Sports halls · Leisure centres',
    desc: 'Cover changing rooms and shower areas where staff can’t patrol.',
    story: 'Changing rooms are among the hardest spaces to supervise in a leisure facility — and among the steamiest. VapeSense learns each room’s normal air, so shower steam doesn’t set it off but a vape cloud does.',
    where: ['Changing rooms', 'Toilets near pools and sports halls', 'Stairwells'],
    fit: ['Works in humid, steamy rooms', 'Steam and body spray blocked', 'Mount at least 1 m from extract fans'],
  },
  {
    id: 'public', image: { src: '/media/img/insitu-public.jpg', w: 1200, h: 900, alt: 'Vape Sense on the ceiling of a station waiting area' } as Img, icon: 'ti-building-community', title: 'Public & transit', sub: 'Libraries · Transport · Councils',
    desc: 'Clean, safe facilities across multi-building estates, managed from one place.',
    story: 'Public buildings and transport hubs have restrooms and waiting areas spread across a large estate. A VapeSense hub brings every sensor into one dashboard and one alert feed, with fleet-wide updates from a single screen.',
    where: ['Public restrooms', 'Enclosed waiting areas', 'Staff facilities'],
    fit: ['Central users, schedule and config', 'Secure remote access for estate teams', 'Tamper alerts on every unit'],
  },
];

export default function IndustriesPage() {
  return (
    <>
      <VisualHero
        tag="Industries"
        title={<>YOUR SECTOR.<br /><span className="accent">YOUR</span> SOLUTION.</>}
        sub="VapeSense is built for the rooms where vaping is hardest to supervise and cameras can’t go — school toilets, hospital washrooms, hotel rooms, changing rooms and more."
        ctas={[{ href: '/contact', label: 'Speak to an expert' }, { href: '#education', label: 'Explore sectors', ghost: true }]}
        visual={<NetworkAnimation />}
      />

      <section className="content-section light">
        <div className="content-inner">
          <div className="card-grid">
            {sectors.map((s) => (
              <div key={s.title} className="cs-card">
                <div style={{ fontSize: 22, color: 'var(--c1)', marginBottom: 10 }}>
                  <i className={`ti ${s.icon}`} />
                </div>
                <div className="cs-card-tag">{s.sub}</div>
                <div className="cs-card-title">{s.title}</div>
                <p className="cs-card-body">{s.desc}</p>
                <Link href={`#${s.id}`} className="cs-card-link">Learn more →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section tint">
        <div className="content-inner">
          {sectors.map((s, i) => (
            <div key={s.id} id={s.id} className={`sector-detail feature${i % 2 ? ' flip' : ''}`}>
              <div className="feature-copy">
                <Chapter n={`0${i + 1}`} label={s.sub} />
                <h2 className="cs-heading" style={{ color: 'var(--c0)' }}>{s.title}</h2>
                <p className="story-lead">{s.story}</p>
                <div className="sector-lists">
                  <div>
                    <div className="cs-card-tag">Where sensors go</div>
                    <CheckList items={s.where} />
                  </div>
                  <div>
                    <div className="cs-card-tag">Why it fits</div>
                    <CheckList items={s.fit} />
                  </div>
                </div>
              </div>
              <div className="feature-media">
                <FramedImage image={s.image} label={s.title} light cover />
              </div>
            </div>
          ))}
        </div>
      </section>

      <IndustriesSection />

      <section className="cta-section">
        <div className="cta-grid-bg" aria-hidden="true" />
        <div className="cta-inner">
          <div className="cta-heading">DON&apos;T SEE<br /><span className="accent">YOUR SECTOR?</span></div>
          <p className="cta-sub">If people vape or smoke where they shouldn’t, VapeSense can help. Talk to us and we&apos;ll show you how it fits your building.</p>
          <div className="cta-btns">
            <Link href="/contact" className="btn btn-solid-c1">SPEAK TO AN EXPERT</Link>
            <Link href="/contact" className="btn btn-ghost-w">REQUEST A QUOTE</Link>
          </div>
        </div>
      </section>
    </>
  );
}
