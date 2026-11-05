import type { Metadata } from 'next';
import TickerBand from '@/components/TickerBand';
import Hero from '@/components/home/Hero';
import HomeChallenge from '@/components/home/HomeChallenge';
import SpecStrip from '@/components/home/SpecStrip';
import ProcessSection from '@/components/home/ProcessSection';
import IndustriesSection from '@/components/home/IndustriesSection';
import HardwareSection from '@/components/home/HardwareSection';
import CtaSection from '@/components/home/CtaSection';
import { DetectBlockSection, HomeFaq, BlogTeaser } from '@/components/home/StorySections';
import { HomeProof, HomeTrust } from '@/components/home/HomeSections';

export const metadata: Metadata = {
  title: { absolute: 'Vape Sense — Vape & Smoke Detection Without Cameras or False Alarms' },
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <TickerBand />
      <Hero />
      <SpecStrip />
      {/* The story: the problem → the difference → see it happen → where it goes → what to buy → what you get → answers → act */}
      <HomeChallenge />
      <DetectBlockSection />
      <ProcessSection />
      <IndustriesSection />
      <HardwareSection />
      <HomeProof />
      <HomeFaq />
      <BlogTeaser />
      <HomeTrust />
      <CtaSection previous />
    </>
  );
}
