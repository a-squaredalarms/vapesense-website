import type { Metadata } from 'next';
import Link from 'next/link';
import { Chapter, CheckList, CtaBanner } from '@/components/PageBlocks';
import { VisualHero, FramedImage, FramedVideo, IMG, type Img } from '@/components/Media';

export const metadata: Metadata = {
  title: 'Example Deployments — How VapeSense Fits Real Buildings',
  description:
    'Illustrative VapeSense deployments for a secondary school, a hospital, a hotel and a multi-building estate: where the sensors go, who gets alerted, and what a typical day looks like.',
  alternates: { canonical: '/case-studies' },
};

// Illustrative scenarios only — replace with real customer case studies (with permission) as they become available.
const scenarios = [
  {
    id: 'school', video: undefined as string | undefined, image: { src: '/media/img/insitu-education.jpg', w: 1200, h: 900, alt: 'Vape Sense on the ceiling of a school toilet block' } as Img | undefined,
    tag: 'Education',
    title: 'A secondary school with three toilet blocks',
    setup: 'One hub in the IT office. A sensor in each pupil toilet block, both changing rooms and the main stairwell.',
    product: 'VapeSense Hub + Sensors',
    story: [
      ['08:00', 'The schedule switches every sensor on for the school day. Teachers on duty have the dashboard installed as an app on their phones.'],
      ['10:42', 'Before PE, a cloud of body spray fills the boys’ changing room. VapeSense recognises it’s only body spray and ignores it. Nobody’s phone buzzes.'],
      ['11:17', 'A vape cloud appears in the first-floor toilets. Within a minute, the duty teacher gets a push alert: “Toilets 1F — Vape — High”.'],
      ['15:30', 'The head of year reviews the week’s event history and sees most events cluster around break in one block. Supervision is adjusted.'],
      ['18:00', 'Sensors rest for the evening — and stay idle through half-term.'],
    ],
    fit: ['Teachers get view-only access; IT manages configuration', 'Schedule matches the school day and holidays', 'Every event logged with room, time and severity'],
  },
  {
    id: 'hospital', video: undefined as string | undefined, image: { src: '/media/img/insitu-healthcare.jpg', w: 1200, h: 900, alt: 'Vape Sense on the ceiling of a hospital patient washroom' } as Img | undefined,
    tag: 'Healthcare',
    title: 'A hospital ward with patient washrooms',
    setup: 'A standalone unit in the ward’s most problematic patient washroom as a pilot, then sensors on a hub across the floor.',
    product: 'VapeSense Standalone → Hub',
    story: [
      ['Week 1', 'The pilot unit goes in on the ceiling, away from the shower. Shower steam is recognised and blocked from day one.'],
      ['Week 2', 'A smoking event triggers an alert reported as smoke, not vape, so the nurse in charge knows exactly what to expect.'],
      ['Month 2', 'With confidence in the alerts, the trust adds sensors to the remaining washrooms and moves to a hub.'],
    ],
    fit: ['Air only — appropriate for patient washrooms', 'Smoke reported separately from vape', 'Data stays on the hospital network'],
  },
  {
    id: 'hotel', video: undefined as string | undefined, image: { src: '/media/img/insitu-hospitality.jpg', w: 1200, h: 900, alt: 'Vape Sense on the ceiling of a hotel bedroom' } as Img | undefined,
    tag: 'Hospitality',
    title: 'A hotel protecting its non-smoking rooms',
    setup: 'Sensors in guest rooms on the floors with the most smoke complaints, reporting to a hub behind reception.',
    product: 'VapeSense Hub + Sensors',
    story: [
      ['Evening', 'A guest uses hairspray and takes a hot shower. Both are blocked — no alert, no knock on the door.'],
      ['Late', 'Someone vapes in room 412. The duty manager gets an alert with the room and time, and housekeeping is ready before the next guest arrives.'],
      ['Next day', 'The event history provides a timestamped record of what happened and when.'],
    ],
    fit: ['Hairspray and steam blocked', 'Alerts to the duty manager’s phone', 'Tamper alert if a unit is opened'],
  },
  {
    id: 'estate', video: undefined as string | undefined, image: { src: '/media/img/insitu-public.jpg', w: 1200, h: 900, alt: 'Vape Sense on the ceiling of a public waiting area' } as Img | undefined,
    tag: 'Public sector',
    title: 'A council managing several public buildings',
    setup: 'Sensors in public restrooms across a library, a leisure centre and civic offices, managed centrally.',
    product: 'VapeSense Hub + Sensors',
    story: [
      ['Setup', 'Each sensor finds the hub on the network and enrols itself. The estates team names every room in the dashboard.'],
      ['Daily', 'Alerts go to the on-site staff for each building, while the estates team sees everything in one feed through secure remote access.'],
      ['Quarterly', 'A software update is rolled out to every sensor from one screen — with automatic rollback if anything fails.'],
    ],
    fit: ['One dashboard for the whole estate', 'Secure remote access from anywhere', 'CSV export for reporting'],
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <VisualHero
        tag="Example deployments"
        title={<>A DAY WITH<br /><span className="accent">VAPE SENSE.</span></>}
        sub={<>What VapeSense looks like in a real building: where the sensors go, who gets the alert, and what gets quietly ignored.<span className="scenario-note" style={{ display: 'block', width: 'fit-content' }}>Illustrative scenarios based on how VapeSense works — not customer results.</span></>}
        video={{ name: '07-network', label: 'One building, every room' }}
      />

      {scenarios.map((sc, i) => (
        <section key={sc.id} id={sc.id} className={`content-section ${i % 2 ? 'tint' : 'light'}`}>
          <div className="content-inner two-col-wide">
            <div>
              <Chapter n={`0${i + 1}`} label={sc.tag} />
              <h2 className="cs-heading" style={{ color: 'var(--c0)' }}>{sc.title}</h2>
              <p className="story-lead">{sc.setup}</p>
              <div className="story-steps wide">
                {sc.story.map(([when, what]) => (
                  <div key={when} className="story-step">
                    <div className="story-step-n">{when}</div>
                    <div><p>{what}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: 'sticky', top: 'calc(var(--nav-height) + 20px)' }}>
            {sc.video ? <FramedVideo name={sc.video} label={sc.tag} /> : sc.image && <FramedImage image={sc.image} label={sc.tag} light cover />}
            <div className="cs-card" style={{ marginTop: 10 }}>
              <div className="cs-card-tag">Setup</div>
              <div className="cs-card-title">{sc.product}</div>
              <CheckList items={sc.fit} />
              <Link href="/contact" className="cs-card-link">Discuss your building →</Link>
            </div>
            </div>
          </div>
        </section>
      ))}

      <CtaBanner
        heading="YOUR BUILDING"
        accent="NEXT."
        sub="Tell us about your rooms and your team. We’ll map out what your own deployment would look like."
        primary={{ href: '/contact', label: 'Get a quote' }}
        secondary={{ href: '/about', label: 'About us' }}
      />
    </>
  );
}
