'use client';

// The Detection animation (Animation/explode-viewer/src/pages/DetectionPage.tsx), driven by the
// homepage incident simulation instead of its own 10-second loop: smoke rises during "Detect",
// and the red alarm pulses during "Alert".
import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { StudioLights, clamp01, cloneMaterials, ease, findOpenings, softDot, useProduct } from './product';
import { CLEAR_AT, DETECT_AT, SMOKE_START } from './detectionTimeline';

const SMOKE_RISE = 4.5; // seconds for a puff to reach the ceiling
const SMOKE_COUNT = 700;
const INTO_VENTS = 0.55; // share of the plume drawn into the vent slots; the rest spreads along the ceiling
const RINGS = 3;
const SMOKE_GREY = 0.45; // smoke colour (0 black - 1 white), drawn over the white page
const SMOKE_OPACITY = 0.35; // peak opacity of one puff
const FILL = 0.88; // share of the panel's shorter side the device spans; higher = bigger device
const CAMERA_DROP = 0.5; // how far below the device the camera sits (looking up at it)
const tmpDir = new THREE.Vector3();
const SOURCE = new THREE.Vector3(0.16, -0.75, 0.12); // where the vape cloud is exhaled, relative to the device

// startedAt: performance.now() when the simulation started, or null when idle.
type Props = { startedAt: number | null };

// The model's native orientation is the installed one: front (-Y, vents) faces the floor.
function Scene({ startedAt }: Props) {
  const product = useProduct();
  const rings = useRef<(THREE.Mesh | null)[]>([]);

  const setup = useMemo(() => {
    const { parts, boxes } = product;
    const caseMaterials: THREE.MeshStandardMaterial[] = [];
    const enclosure = parts.get('Whole_Case')!;
    cloneMaterials(enclosure, (m) => {
      m.emissive = new THREE.Color('#ff2d2d');
      m.emissiveIntensity = 0;
      caseMaterials.push(m);
    });
    const caseBox = boxes.get('Whole_Case')!;
    const ceilingY = (boxes.get('Ceiling') ?? caseBox).max.y;
    const front = caseBox.min.y;
    const centre = caseBox.getCenter(new THREE.Vector3());

    // Vent slots on the downward-facing front, found by ray-casting through the wall.
    const grid = findOpenings(enclosure, caseBox, front, 1, 0.0008, 0.004, 0.003);
    const vents: THREE.Vector3[] = [];
    grid.open.forEach((isOpen, k) => isOpen && vents.push(grid.at(Math.floor(k / grid.rows), k % grid.rows)));
    if (!vents.length) vents.push(centre.clone().setY(front));

    // Each puff: exhaled at SOURCE, rises and drifts, then either enters a vent slot or hits the
    // ceiling and spreads outwards along it.
    const r = Math.random;
    const start = new Float32Array(SMOKE_COUNT * 3);
    const ctrl = new Float32Array(SMOKE_COUNT * 3);
    const end = new Float32Array(SMOKE_COUNT * 3);
    const delay = new Float32Array(SMOKE_COUNT);
    const source = centre.clone().add(SOURCE).setY(front + SOURCE.y);
    for (let i = 0; i < SMOKE_COUNT; i++) {
      const s = source.clone().add(new THREE.Vector3((r() - 0.5) * 0.06, (r() - 0.5) * 0.04, (r() - 0.5) * 0.06));
      let e: THREE.Vector3;
      if (r() < INTO_VENTS) e = vents[Math.floor(r() * vents.length)].clone().setY(front - 0.002);
      else {
        const a = r() * Math.PI * 2;
        const rad = 0.12 + r() * 0.3;
        e = new THREE.Vector3(centre.x + Math.cos(a) * rad, ceilingY - 0.01 - r() * 0.02, centre.z + Math.sin(a) * rad);
      }
      const c = new THREE.Vector3(s.x + (e.x - s.x) * 0.3, e.y - 0.12 - r() * 0.08, s.z + (e.z - s.z) * 0.3);
      s.toArray(start, i * 3);
      c.toArray(ctrl, i * 3);
      e.toArray(end, i * 3);
      delay[i] = r() * 2.5;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(SMOKE_COUNT * 3), 3));
    // RGBA per puff: grey smoke whose alpha fades it in and out (normal blending, so it shows on white).
    const colors = new Float32Array(SMOKE_COUNT * 4);
    for (let i = 0; i < SMOKE_COUNT; i++) colors.set([SMOKE_GREY, SMOKE_GREY, SMOKE_GREY, 0], i * 4);
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4));
    const material = new THREE.PointsMaterial({
      size: 0.05,
      map: softDot(),
      vertexColors: true,
      transparent: true,
      depthWrite: false,
    });
    const ringMaterials = Array.from(
      { length: RINGS },
      () =>
        new THREE.MeshBasicMaterial({ color: '#ff3b3b', transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }),
    );
    const ringSize = Math.max(caseBox.max.x - caseBox.min.x, caseBox.max.z - caseBox.min.z);
    const radius = caseBox.getSize(new THREE.Vector3()).length() / 2; // fits the device from any angle
    return { caseMaterials, start, ctrl, end, delay, geometry, material, ringMaterials, ringSize, ceilingY, centre, radius };
  }, [product]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    // Idle: park the timeline before the smoke starts.
    const t = startedAt === null ? 0 : (performance.now() - startedAt) / 1000;

    // Smoke puffs rise along their curves, swirling a little, fading in and out.
    const pos = setup.geometry.attributes.position.array as Float32Array;
    const col = setup.geometry.attributes.color.array as Float32Array;
    for (let i = 0; i < SMOKE_COUNT; i++) {
      const life = clamp01((t - SMOKE_START - setup.delay[i]) / SMOKE_RISE);
      const s = ease(life);
      const j = i * 3;
      for (let k = 0; k < 3; k++)
        pos[j + k] = (1 - s) * (1 - s) * setup.start[j + k] + 2 * (1 - s) * s * setup.ctrl[j + k] + s * s * setup.end[j + k];
      const swirl = (1 - s) * 0.02;
      pos[j] += Math.sin(life * 7 + i) * swirl;
      pos[j + 2] += Math.cos(life * 6 + i * 1.3) * swirl;
      col[i * 4 + 3] = life > 0 && life < 1 ? Math.sin(life * Math.PI) * SMOKE_OPACITY : 0;
    }
    setup.geometry.attributes.position.needsUpdate = true;
    setup.geometry.attributes.color.needsUpdate = true;

    // Alert: a red pulse on the case and rings rippling out across the ceiling.
    const detected = t >= DETECT_AT && t < CLEAR_AT;
    const glow = detected ? 0.05 + 0.04 * Math.sin((t - DETECT_AT) * 8) : 0;
    for (const m of setup.caseMaterials) m.emissiveIntensity = THREE.MathUtils.lerp(m.emissiveIntensity, glow, 0.2);
    rings.current.forEach((ring, k) => {
      if (!ring) return;
      const period = 1.6;
      const local = t - DETECT_AT - k * (period / RINGS);
      const active = detected && local >= 0 && t < CLEAR_AT - 0.4;
      const p = active ? (local % period) / period : 0;
      ring.scale.setScalar(setup.ringSize * (0.7 + p * 3));
      setup.ringMaterials[k].opacity = active ? 0.7 * (1 - p) : 0;
    });

    // Camera below and to the side, looking up at the device's centre so it is always centred.
    // Distance is set from the narrower of the two view angles, so the device fills the same share
    // of the panel whatever its shape and is never cropped.
    const camera = state.camera as THREE.PerspectiveCamera;
    const angle = 0.75 + Math.sin(time * 0.1) * 0.12;
    tmpDir.set(Math.sin(angle), -CAMERA_DROP, Math.cos(angle)).normalize();
    const vHalf = THREE.MathUtils.degToRad(camera.fov) / 2;
    const hHalf = Math.atan(Math.tan(vHalf) * camera.aspect);
    const dist = setup.radius / (Math.tan(Math.min(vHalf, hHalf)) * FILL);
    camera.position.copy(setup.centre).addScaledVector(tmpDir, dist);
    camera.lookAt(setup.centre);
  });

  return (
    <>
      <primitive object={product.root} />
      {setup.ringMaterials.map((m, k) => (
        <mesh
          key={k}
          ref={(r) => void (rings.current[k] = r)}
          position={[setup.centre.x, setup.ceilingY - 0.001, setup.centre.z]}
          rotation={[Math.PI / 2, 0, 0]}
          material={m}
        >
          <ringGeometry args={[0.47, 0.5, 96]} />
        </mesh>
      ))}
      <points geometry={setup.geometry} material={setup.material} frustumCulled={false} />
      {/* Up-lights so the downward-facing front reads light grey on the white page. */}
      <directionalLight position={[0.4, -1, 0.5]} intensity={2.4} />
      <directionalLight position={[-0.6, -1, -0.3]} intensity={0.9} />
    </>
  );
}

export default function DetectionScene({ startedAt, visible }: Props & { visible: boolean }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      frameloop={visible ? 'always' : 'never'} // don't render while scrolled out of view
      gl={{ alpha: true, antialias: true }} // transparent: the page shows through
      camera={{ fov: 36, near: 0.01, far: 20, position: [0.6, -0.5, 0.8] }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <StudioLights />
      <Suspense fallback={null}>
        <Scene startedAt={startedAt} />
      </Suspense>
    </Canvas>
  );
}
