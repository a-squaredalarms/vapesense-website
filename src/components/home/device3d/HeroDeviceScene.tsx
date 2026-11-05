'use client';

// Opening frame of the Explode animation (Animation/explode-viewer): the closed device,
// turned slightly and gently swaying.
import { Suspense, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { cloneMaterials, fitDistance, posed, posedBounds, useProduct } from './product';

// Default view (home page): turned 20 degrees, so a little of the side shows without the device looking wide.
// Other pages can pass their own yaw (turn, radians) and tilt.
export type DeviceAngle = { yaw?: number; tilt?: number; align?: 'right' | 'center' };
const DEFAULT_ANGLE = { yaw: -Math.PI / 9, tilt: 0.12 };
const FRAME_MARGIN = 1.04; // just above 1 so the swaying device fills the card without clipping
// Lens angle: lower is flatter. 14 sits between the animation's 20 and a flat telephoto look.
const FOV = 14;
// Only the enclosure is lit normally. Everything behind it (inner parts and the back plate) is only
// seen through the vents, so it is darkened - otherwise the vents look like there is a light inside.
const SHELL = 'Whole_Case';
const CASE_COLOR = '#dfe2e5'; // white plastic (slightly below pure white so the lighting has room)
const INSIDE_BRIGHTNESS = 0.2; // colour multiplier
const INSIDE_REFLECTION = 0.05; // environment light on inside parts

function Device({ yaw = DEFAULT_ANGLE.yaw, tilt = DEFAULT_ANGLE.tilt, align = 'right' }: DeviceAngle) {
  const START_POSE = useMemo(() => posed(yaw, tilt), [yaw, tilt]);
  const product = useProduct();
  const group = useRef<THREE.Group>(null);
  const bounds = useMemo(() => posedBounds([...product.boxes.values()], START_POSE), [product, START_POSE]);
  const centre = useMemo(() => bounds.getCenter(new THREE.Vector3()).setZ(0), [bounds]);
  const sway = useMemo(() => new THREE.Quaternion(), []);
  const euler = useMemo(() => new THREE.Euler(), []);

  // Material changes below apply only to this scene's own copy of the model (cloneMaterials gives
  // each part fresh materials), so the detection scene further down the page is unaffected.
  useMemo(() => {
    // The CAD export makes the enclosure mid-grey metal; the real case is white plastic.
    const enclosure = product.parts.get(SHELL);
    if (enclosure)
      cloneMaterials(enclosure, (m) => {
        m.color.set(CASE_COLOR);
        m.metalness = 0;
        m.roughness = 0.5;
      });
    for (const [name, part] of product.parts) {
      // Leave the case and its stainless screws (on the outside) at full brightness.
      if (name === SHELL || name.startsWith('Screw')) continue;
      cloneMaterials(part, (m) => {
        m.color?.multiplyScalar(INSIDE_BRIGHTNESS);
        m.envMapIntensity = INSIDE_REFLECTION;
      });
    }
  }, [product]);

  useFrame((state) => {
    if (group.current) {
      sway.setFromEuler(euler.set(0, Math.sin(state.clock.elapsedTime * 0.4) * 0.1, 0));
      group.current.quaternion.copy(START_POSE).premultiply(sway);
    }
    // Fit the device, then slide the camera left by half the spare width so the device sits
    // against the right edge of the hero column (when the column is wider than the device).
    const camera = state.camera as THREE.PerspectiveCamera;
    const dist = fitDistance(camera, bounds, FRAME_MARGIN);
    // Width of view at the device's front face (same depth fitDistance measures from).
    const visibleWidth = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * camera.aspect * (dist - bounds.max.z);
    const deviceWidth = (bounds.max.x - bounds.min.x) * FRAME_MARGIN;
    const shift = align === 'right' ? Math.max(0, visibleWidth - deviceWidth) / 2 : 0;
    camera.position.set(centre.x - shift, centre.y, dist);
    camera.lookAt(centre.x - shift, centre.y, centre.z);
  });

  return (
    <group ref={group} quaternion={START_POSE}>
      <primitive object={product.root} />
    </group>
  );
}

// Lighting for a white plastic case with an embossed V. The V is only a fraction of a millimetre
// proud of the face, so it shows through a strong light skimming across the face from the left
// (casting tiny shadows on its edges) with fairly little even fill light to wash it out.
const LIGHT = {
  ambient: 0.12,
  environment: 0.45, // soft studio reflections; higher = flatter, lower = more contrast
  key: { position: [0.4, 1, 0.6] as const, intensity: 1.4 }, // from above
  rake: { position: [-1, 0.25, 0.12] as const, intensity: 3.2 }, // grazing the front face from the left
  front: { position: [0.3, -0.2, 1] as const, intensity: 0.5 }, // gentle fill so the face stays white
};

// Directional light with a shadow sized to the ~12 cm device (so walls shade the parts inside
// and the V casts its edge shadows).
function ShadowLight({ position, intensity }: { position: readonly [number, number, number]; intensity: number }) {
  return (
    <directionalLight
      position={[...position]}
      intensity={intensity}
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-bias={-0.0002}
      shadow-normalBias={0.0003}
      shadow-camera-left={-0.12}
      shadow-camera-right={0.12}
      shadow-camera-top={0.12}
      shadow-camera-bottom={-0.12}
      shadow-camera-near={0.5}
      shadow-camera-far={2}
    />
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={LIGHT.ambient} />
      <ShadowLight {...LIGHT.key} />
      <ShadowLight {...LIGHT.rake} />
      <directionalLight position={[...LIGHT.front.position]} intensity={LIGHT.front.intensity} />
      <Environment files="/textures/studio_small_03_1k.hdr" environmentIntensity={LIGHT.environment} />
    </>
  );
}

export default function HeroDeviceScene(angle: DeviceAngle) {
  const [dpr, setDpr] = useState(() => Math.min(2, window.devicePixelRatio));
  return (
    <Canvas
      shadows
      dpr={dpr}
      gl={{ alpha: true, antialias: true, toneMapping: THREE.NeutralToneMapping }} // keeps whites white
      camera={{ position: [0, 0, 1], fov: FOV, near: 0.05, far: 20 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onFallback={() => setDpr(1)} />
      <Lights />
      <Suspense fallback={null}>
        <Device {...angle} />
      </Suspense>
    </Canvas>
  );
}
