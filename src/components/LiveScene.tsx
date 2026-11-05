'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, type ComponentType } from 'react';
import SafeScene from './home/device3d/SafeScene';

// Live 3D animations from the Vape Sense animation project (src/scenes), embedded directly.
// All wording (captions, panels, labels) is switched off; only the 3D scene shows.

// Each scene's code loads only when that scene is first shown.
const load = (p: () => Promise<Record<string, unknown>>, key: string) =>
  dynamic(() => p().then((m) => m[key] as ComponentType), { ssr: false });

const SCENES: Record<string, ComponentType> = {
  detection: load(() => import('@/scenes/pages/DetectionPage'), 'DetectionPage'),
  install: load(() => import('@/scenes/pages/InstallPage'), 'InstallPage'),
  network: load(() => import('@/scenes/pages/NetworkPage'), 'NetworkPage'),
  schedule: load(() => import('@/scenes/pages/SchedulePage'), 'SchedulePage'),
};

export type SceneName = keyof typeof SCENES;

export default function LiveScene({ name, label, className = '' }: { name: SceneName; label: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const Scene = SCENES[name];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Mount when close to the screen; unmount when well away, so only a few 3D scenes run at once.
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: '300px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`live-scene ${className}`} role="img" aria-label={label}>
      {near && (
        <SafeScene>
          <Scene />
        </SafeScene>
      )}
    </div>
  );
}
