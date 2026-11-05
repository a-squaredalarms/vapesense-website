// Blog posts. Each body is a list of simple blocks so posts stay easy to edit without touching page code.
// Claims are kept to what the VapeSense docs verify — no invented statistics.

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'quote'; text: string }
  | { type: 'cta'; text: string; href: string; label: string };

export type Post = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string; // ISO date
  readMinutes: number;
  cover: { src: string; w: number; h: number; alt: string };
  keywords: string[];
  takeaways: string[];
  body: Block[];
};

export const POSTS: Post[] = [
  {
    slug: 'stop-vaping-in-school-toilets-without-cameras',
    cover: { src: '/media/img/sector-education.jpg', w: 960, h: 720, alt: 'Vape sensors in every washroom across two school floors' },
    title: 'How to stop vaping in school toilets — without cameras',
    description:
      'Toilets are where school vaping happens, and the one place you can’t put a camera. Here is how air-based vape detection gives staff the moment they need, while keeping pupils’ privacy intact.',
    category: 'Schools',
    date: '2026-09-08',
    readMinutes: 6,
    keywords: ['vape detector for schools', 'vaping in school toilets', 'bathroom vape sensor', 'school vape alarm'],
    takeaways: [
      'Vaping concentrates where supervision can’t go: toilets, changing rooms and stairwells.',
      'Cameras are off the table in those spaces — air sensing is not.',
      'What staff need is a timely, trustworthy alert, not more corridor patrols.',
      'False alarms destroy trust faster than missed events. Choose a detector that blocks them.',
    ],
    body: [
      { type: 'p', text: 'Ask any head of year where vaping happens and you will get the same answer: the toilets. Then the changing rooms. Then the stairwell nobody walks past between lessons. These are exactly the spaces where staff can’t stand guard and where cameras are rightly prohibited.' },
      { type: 'p', text: 'The result is a familiar loop. A pupil vapes, the cloud fades in minutes, and by the time someone reports a smell the room is empty. There is nothing to act on and nothing to record — only frustration for staff and a growing sense among pupils that the rules aren’t real.' },
      { type: 'h2', text: 'Why the usual fixes fall short' },
      { type: 'ul', items: [
        'Patrols pull staff away from teaching and pastoral work, and pupils simply learn the timetable.',
        'Locking toilets during lessons creates safeguarding and dignity problems of its own.',
        'Cameras cannot legally or ethically be placed where vaping actually happens.',
        'Cheap “vape alarms” that trigger on body spray are quickly ignored — or unplugged.',
      ] },
      { type: 'h2', text: 'Detect the air, not the person' },
      { type: 'p', text: 'Vaping changes the air in a room, and that is something a sensor can notice without seeing or hearing anyone. VapeSense reads the air in the room — and nothing else.' },
      { type: 'quote', text: 'No camera. No microphone. Just the alert that matters.' },
      { type: 'p', text: 'Because it only reads air, it can be mounted on the ceiling of a pupil toilet or changing room without capturing anything that identifies a child. When a real vape or smoke cloud is confirmed, staff receive a push notification or email with the location and severity — typically in under 60 seconds.' },
      { type: 'h2', text: 'The part most schools underestimate: false alarms' },
      { type: 'p', text: 'The first week with a detector that cries wolf is the last week anyone takes it seriously. Deodorant before PE, steam from a hand dryer area, dust from a cleaner’s trolley — a basic particle sensor sees all of these as “a cloud”.' },
      { type: 'p', text: 'VapeSense is built to tell these apart from the real thing. Sprays, steam and dust are recognised and ignored, so the only alerts that reach staff are vaping, smoking or someone tampering with the sensor.' },
      { type: 'cta', text: 'See exactly what VapeSense alerts on — and what it blocks.', href: '/how-it-works', label: 'How it works' },
      { type: 'h2', text: 'Making alerts useful on the ground' },
      { type: 'ul', items: [
        'Schedule active hours to match the school day, and rest sensors over weekends and holidays.',
        'Give teachers a view-only login and keep configuration with IT through role-based access.',
        'Use the event history to spot patterns — which block, which period — and target supervision.',
        'Pair detection with education and support. A sensor tells you when; your pastoral team decides what next.',
      ] },
      { type: 'h2', text: 'Start with one block' },
      { type: 'p', text: 'Most schools begin with a standalone unit in the toilet block that causes the most concern. Once the team trusts the alerts, adding sensors and a central hub brings every room into one dashboard, one alert feed and one set of staff logins.' },
      { type: 'cta', text: 'Want to try it in your hardest-to-supervise space?', href: '/contact', label: 'Book a demo' },
    ],
  },
  {
    slug: 'why-vape-detectors-false-alarm',
    cover: { src: '/media/img/sector-healthcare.jpg', w: 960, h: 720, alt: 'Ceiling sensor detecting a real vape cloud' },
    title: 'Why vape detectors false alarm — and how to stop hairspray and steam setting yours off',
    description:
      'Hairspray, deodorant, shower steam and dust are the most common causes of vape detector false alarms. Learn why cheap detectors get fooled, and what to ask before you buy one.',
    category: 'Buyer’s guide',
    date: '2026-09-29',
    readMinutes: 7,
    keywords: ['vape detector false alarms', 'vape detector hairspray', 'vape sensor steam', 'vape detector no false alarms'],
    takeaways: [
      'False alarms are the number one reason detection systems get ignored.',
      'Cheap detectors can’t tell a vape from body spray, steam or dust.',
      'A good detector adapts to each room — a steamy changing room is not a quiet office.',
      'One incident should equal one alert — not fifty.',
    ],
    body: [
      { type: 'p', text: 'Every facilities manager who has lived with a bad vape detector has the same story. The alarm goes off, someone walks to the toilet block, and it’s a Year 9 with a can of body spray. By the third time, nobody walks.' },
      { type: 'p', text: 'False alarms are not a minor irritation. They are the single biggest reason detection systems fail, because a system staff have learned to ignore is worse than no system at all.' },
      { type: 'h2', text: 'Why simple sensors get fooled' },
      { type: 'p', text: 'A basic detector goes off whenever the air changes enough. The trouble is that lots of everyday things change the air for a moment:' },
      { type: 'ul', items: [
        'Aerosol sprays such as hairspray, deodorant and body spray',
        'Steam from showers, kettles and hand-dryer areas',
        'Dust from cleaning, building work or a busy changing room',
        'Air movement from fans and draughts stirring up what is already there',
        'Candles or incense some distance away',
      ] },
      { type: 'p', text: 'To a basic detector, all of these look like “something happened”. And a one-size-fits-all setting makes it worse: too sensitive and a dusty room alarms all day; not sensitive enough and you miss real vaping in a clean one.' },
      { type: 'h2', text: 'Telling the difference' },
      { type: 'p', text: 'The answer is a detector that asks “what is this?” rather than just “did something happen?”. VapeSense is built to do exactly that.' },
      { type: 'ul', items: [
        'Vaping — alert.',
        'Smoking — alert, reported separately from vaping.',
        'Hairspray, deodorant and body spray — ignored.',
        'Shower and kettle steam — ignored.',
        'Dust, fans and draughts — ignored.',
      ] },
      { type: 'p', text: 'The look-alikes can still be logged, so you can see the system doing its job, but nobody’s phone buzzes.' },
      { type: 'cta', text: 'See the full list of what alerts and what gets blocked.', href: '/how-it-works', label: 'Detect vs block' },
      { type: 'h2', text: 'Every room is different' },
      { type: 'p', text: 'A science lab, a steamy shower room and a quiet office each have different “normal” air. VapeSense adapts to each room by itself, which is why it works straight out of the box with no setting up per room.' },
      { type: 'h2', text: 'One puff, one alert' },
      { type: 'p', text: 'The last source of noise is repetition. A single vape cloud can hang around for minutes and set a basic detector off again and again. VapeSense treats it as one incident and sends one alert. Every alert also shows how serious it is, so staff can prioritise.' },
      { type: 'h2', text: 'What to ask any supplier' },
      { type: 'ul', items: [
        'Which everyday sources does your detector ignore — and can you show me?',
        'Does it adapt to each room, or need setting up room by room?',
        'Will one cloud produce one alert, or many?',
        'Can sensitivity be tuned from the dashboard without a site visit?',
      ] },
      { type: 'cta', text: 'Bring your worst room. We’ll show you how VapeSense handles it.', href: '/contact', label: 'Book a demo' },
    ],
  },
  {
    slug: 'vape-detector-privacy-questions',
    cover: { src: '/media/img/sk-iso.png', w: 757, h: 784, alt: 'Line drawing of the camera-free Vape Sense sensor' },
    title: 'Vape detectors and privacy: 7 questions to ask before you buy',
    description:
      'Putting a sensor in a toilet or changing room raises fair privacy questions. Here are seven questions to ask any vape detector supplier — and how VapeSense answers them.',
    category: 'Privacy & security',
    date: '2026-10-14',
    readMinutes: 5,
    keywords: ['vape detection without cameras', 'vape detector privacy', 'vape sensor GDPR', 'privacy safe vape detector'],
    takeaways: [
      'The safest data is data you never collect: no images, no audio.',
      'Know where readings are stored and who can reach them.',
      'Encryption, secure devices and role-based access are table stakes.',
      'You should be able to export — and own — your data.',
    ],
    body: [
      { type: 'p', text: 'When a school, hospital or hotel considers a sensor for its toilets, the first question from governors, staff and parents is rarely about accuracy. It’s “what does it record?”. That is the right instinct. Here are the questions worth asking, and the answers you should expect.' },
      { type: 'h2', text: '1. Does it contain a camera or microphone?' },
      { type: 'p', text: 'This should be a flat no. VapeSense contains neither. It reads the air and nothing that can identify a person. That is what makes it appropriate for washrooms and changing rooms where cameras are prohibited.' },
      { type: 'h2', text: '2. Where is the data stored?' },
      { type: 'p', text: 'Many systems stream every reading to a vendor cloud. VapeSense runs on your own network: the sensors, dashboard and alert engine live on site, and there is no mandatory cloud account.' },
      { type: 'h2', text: '3. How is it reached from outside the building?' },
      { type: 'p', text: 'Remote access is optional. When enabled, it is secure and needs no port-forwarding, no static IP and no firewall changes.' },
      { type: 'h2', text: '4. Is traffic encrypted?' },
      { type: 'p', text: 'Everything should be encrypted end to end. With VapeSense it is, and each sensor is individually secured, so one device can’t see another’s data.' },
      { type: 'h2', text: '5. Who can see what?' },
      { type: 'p', text: 'Look for role-based access. VapeSense has three roles: Admins manage users and updates, IT staff manage sensors and configuration, and teachers or staff get a view-only dashboard and alerts.' },
      { type: 'h2', text: '6. Can a new device join without permission?' },
      { type: 'p', text: 'It shouldn’t. Only approved VapeSense sensors can join your system.' },
      { type: 'h2', text: '7. Can we get our data out?' },
      { type: 'p', text: 'Your data should be yours. VapeSense lets you export your alert history and reports at any time.' },
      { type: 'quote', text: 'Detection without surveillance.' },
      { type: 'p', text: 'Privacy obligations vary by country and sector, so always involve your data protection lead. A detector that never captures personal data in the first place makes that conversation much shorter.' },
      { type: 'cta', text: 'Read the full privacy and security breakdown.', href: '/privacy-and-security', label: 'Privacy & security' },
    ],
  },
  {
    slug: 'where-to-place-a-vape-sensor',
    cover: { src: '/media/img/step3d-1.jpg', w: 1400, h: 723, alt: 'Vape Sense mounting plate and fixings ready for the ceiling' },
    title: 'Where to place a vape sensor: a practical guide for washrooms and changing rooms',
    description:
      'Placement makes or breaks vape detection. A practical guide to mounting height, coverage, extract fans and the spots to avoid — based on the VapeSense installation guide.',
    category: 'Installation',
    date: '2026-10-27',
    readMinutes: 5,
    keywords: ['vape sensor placement', 'where to install vape detector', 'vape detector installation', 'washroom vape sensor'],
    takeaways: [
      'Vapour and smoke rise — mount on the ceiling where room air collects.',
      'One sensor per enclosed room, up to about 30 m².',
      'Keep at least 1 m from extract fans and vents.',
      'Never above showers, sinks or hand dryers, and never within reach.',
    ],
    body: [
      { type: 'p', text: 'You can buy the best detector on the market and still miss events if it is in the wrong place. The good news is that the rules are simple, and they all follow from one fact: vape aerosol and smoke rise towards the ceiling.' },
      { type: 'h2', text: 'The golden rules' },
      { type: 'ul', items: [
        'Mount on the ceiling, near the centre of the room or above the cubicle row.',
        'Ceiling height between 2.4 and 3.5 m.',
        'One sensor per enclosed room, covering up to approximately 30 m².',
        'Check for a good Wi-Fi signal at the mounting point first — or use Ethernet.',
      ] },
      { type: 'h2', text: 'Spots to avoid' },
      { type: 'ul', items: [
        'Within 1 m of extract fans, air-conditioning or heating vents — they pull the cloud away before it is measured.',
        'Directly above showers, sinks or hand dryers.',
        'Inside cubicles, corners or recesses where the air is still.',
        'Anywhere that can be reached without a ladder.',
      ] },
      { type: 'h2', text: 'A typical washroom' },
      { type: 'p', text: 'In a standard pupil or staff washroom, the sensor goes on the ceiling over the walkway in front of the cubicles — where air from every cubicle naturally collects — and well away from the extract fan. In a changing room, aim for the centre of the main space, not above the showers.' },
      { type: 'h2', text: 'Installation and power' },
      { type: 'p', text: 'VapeSense is hard-wired to mains power and must be installed by a qualified electrician. It uses under 5 W, fits to a ceiling plate and is locked in place with security screws. If anyone opens, covers or removes it, staff get a tamper alert.' },
      { type: 'h3', text: 'Fit the sensor last' },
      { type: 'p', text: 'During building work, keep the vents clear of dust and fit the sensor at the end. Note each sensor’s room as you go — you will name it during setup so alerts arrive with the right location.' },
      { type: 'h2', text: 'Standalone or hub?' },
      { type: 'p', text: 'For a single room or a pilot, a standalone unit does everything on its own. For several rooms, install the hub first; each sensor then joins it by itself.' },
      { type: 'cta', text: 'Planning a rollout? We can help you map sensor positions.', href: '/contact', label: 'Talk to us' },
    ],
  },
];

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
