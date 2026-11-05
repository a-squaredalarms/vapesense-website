// FAQ content. Answers stay at buyer level: what it does, not how it does it.
export type Faq = { q: string; a: string };

export const FAQ_GROUPS: { title: string; items: Faq[] }[] = [
  {
    title: 'Detection',
    items: [
      { q: 'What does VapeSense alert on?', a: 'Vaping and cigarette or combustion smoke. It also alerts if the enclosure is tampered with, and if a sensor goes offline.' },
      { q: 'Won’t hairspray or a hot shower set it off?', a: 'No. VapeSense is built to tell the difference between vaping and everyday look-alikes such as hairspray, deodorant, body spray, steam, dust, fans and candles. They never reach staff as a false alarm.' },
      { q: 'Will it work in a dusty or busy room?', a: 'Yes. Each sensor adapts to its own room by itself, so it works in clean, dusty, steamy or busy rooms with no setting up.' },
      { q: 'How quickly are staff alerted?', a: 'Typically in under 60 seconds from the moment a vape or smoke cloud appears. Each alert includes the location, the type of event and a severity grade.' },
      { q: 'Can it identify who was vaping?', a: 'No, and that is deliberate. VapeSense detects events in the air, never individuals. It tells staff where and when, so they can respond in person.' },
    ],
  },
  {
    title: 'Privacy & security',
    items: [
      { q: 'Does it have a camera or microphone?', a: 'No. VapeSense only reads the air. There is no camera, microphone, audio or video of any kind.' },
      { q: 'Do I need the internet or a cloud account?', a: 'There is no cloud account and your data stays on site. Units use your normal internet connection for updates and alerts, and need no changes to your firewall.' },
      { q: 'How is the data kept secure?', a: 'Everything is encrypted, each sensor is individually secured, only approved sensors can join your system, and remote access is secure without opening your network. We share full security details with your IT team on request.' },
      { q: 'Who can see what?', a: 'Role-based access: Admins manage users and updates, IT staff manage sensors and configuration, and teachers or staff get a view-only dashboard and alerts.' },
      { q: 'Can I get the data out?', a: 'Yes. Export your alert history and reports at any time.' },
    ],
  },
  {
    title: 'Alerts & everyday use',
    items: [
      { q: 'Can different staff get alerts for different rooms?', a: 'Yes. You choose who is alerted for each sensor — for example, the head of girls for the girls’ toilets and the PE team for the changing rooms — so the nearest, most relevant person responds.' },
      { q: 'How are staff notified?', a: 'By push notification to their phone, tablet or computer, and by email. There is no app-store download, any number of staff devices can be registered, and a built-in test button checks the whole delivery chain.' },
      { q: 'Can I access it from outside the building?', a: 'Yes. Secure remote access is built in, so you can check in from home or a district office with no firewall changes.' },
      { q: 'Can I stop it monitoring overnight or during holidays?', a: 'Yes. Set active hours and weekly windows, and rest sensors entirely over weekends, half-terms and holidays.' },
      { q: 'What happens if someone opens or covers the sensor?', a: 'Staff get a tamper alert straight away if anyone opens, covers or removes a sensor — and an alert if a sensor goes offline for any reason.' },
    ],
  },
  {
    title: 'Installation & products',
    items: [
      { q: 'How is VapeSense powered and installed?', a: 'It is hard-wired to mains power and fitted to the ceiling by a qualified electrician. It uses very little power — under 5 W.' },
      { q: 'How many sensors do I need?', a: 'One per enclosed room, covering up to approximately 30 m². Mount it on the ceiling near the centre of the room, at least 1 m from extract fans.' },
      { q: 'Wi-Fi or Ethernet?', a: 'Either. Each unit works on your Wi-Fi or a wired network connection, and Wi-Fi set-up is done from a phone.' },
      { q: 'Can I start small and expand?', a: 'Yes. Begin with a single standalone unit, then add a Hub and Satellites as you add rooms — central users, scheduling and updates come with the hub.' },
      { q: 'How do updates work?', a: 'Updates are delivered automatically to every sensor. Nobody needs to visit the units.' },
    ],
  },
];

export const ALL_FAQS = FAQ_GROUPS.flatMap((g) => g.items);
