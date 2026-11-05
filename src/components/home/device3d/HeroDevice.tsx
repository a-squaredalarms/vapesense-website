'use client';

import dynamic from 'next/dynamic';

// WebGL only works in the browser, so skip server rendering for the 3D scene.
import SafeScene from './SafeScene';
import type { DeviceAngle } from './HeroDeviceScene';
const HeroDeviceScene = dynamic(() => import('./HeroDeviceScene'), { ssr: false });

export default function HeroDevice(angle: DeviceAngle) {
  return <SafeScene><HeroDeviceScene {...angle} /></SafeScene>;
}
