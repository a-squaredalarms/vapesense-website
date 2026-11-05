'use client';

import dynamic from 'next/dynamic';
import SafeScene from './home/device3d/SafeScene';

// WebGL only runs in the browser, so the live scene is loaded client-side.
const NetworkScene = dynamic(() => import('./home/device3d/NetworkScene'), { ssr: false });

export default function NetworkAnimation() {
  return (
    <div className="network-anim" role="img" aria-label="Animation: a vape sensor in a school washroom alerts the office hub and staff walk to the washroom">
      <SafeScene>
        <NetworkScene />
      </SafeScene>
    </div>
  );
}
