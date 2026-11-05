'use client';

// Live version of the "one school, every washroom" animation (ported from Animation/explode-viewer
// NetworkPage), without any captions, labels or dashboard text. A two-storey school floor plan:
// one washroom sensor detects vaping, the alert flies to the office hub, on to staff phones,
// and the staff walk to the washroom. Loops every 11 s.

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const W = 30; // building length (x), metres
const D = 14; // building depth (z)
const FLOOR_GAP = 6; // visual spacing between the two plans
const WALL_H = 1.1; // cut-away wall height
const CORRIDOR = 1.6; // half-width of the central corridor
type RoomType = 'class' | 'washroom' | 'office' | 'stairs';
const PLAN: Record<number, { north: [number, RoomType][]; south: [number, RoomType][] }> = {
  0: {
    north: [[7, 'class'], [7, 'class'], [4, 'washroom'], [6, 'office'], [6, 'class']],
    south: [[6, 'class'], [4, 'stairs'], [7, 'class'], [4, 'washroom'], [9, 'class']],
  },
  1: {
    north: [[7, 'class'], [7, 'class'], [4, 'washroom'], [6, 'class'], [6, 'class']],
    south: [[6, 'class'], [4, 'stairs'], [7, 'class'], [4, 'washroom'], [9, 'class']],
  },
};
const FLOOR_COLOUR: Record<RoomType, string> = { class: '#e4e9ed', washroom: '#a9cfe8', office: '#c9c2e6', stairs: '#cdd4da' };

const LOOP = 11;
const DETECT_AT = 2.4;
const TO_HUB = [2.8, 3.9];
const TO_STAFF = [3.9, 5.0];
const RESPOND = [5.4, 9.0];
const RESET = [10.2, 11];

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t: number) => THREE.MathUtils.clamp(t, 0, 1);

function fitDistance(camera: THREE.PerspectiveCamera, box: THREE.Box3, margin: number) {
  const size = box.getSize(new THREE.Vector3());
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
  return Math.max(size.x / 2 / Math.tan(hFov / 2), size.y / 2 / Math.tan(vFov / 2)) * margin + box.max.z;
}

type Room = { x0: number; x1: number; z0: number; z1: number; floor: number; type: RoomType };

function buildRooms() {
  const rooms: Room[] = [];
  for (const floor of [0, 1]) {
    for (const [side, list] of [
      [1, PLAN[floor].north],
      [-1, PLAN[floor].south],
    ] as const) {
      let x = -W / 2;
      for (const [w, type] of list) {
        const [z0, z1] = side > 0 ? [CORRIDOR, D / 2] : [-D / 2, -CORRIDOR];
        rooms.push({ x0: x, x1: x + w, z0, z1, floor, type });
        x += w;
      }
    }
  }
  return rooms;
}

const floorY = (floor: number) => floor * FLOOR_GAP;
const centreOf = (r: Room, y = 0) => new THREE.Vector3((r.x0 + r.x1) / 2, floorY(r.floor) + y, (r.z0 + r.z1) / 2);
const arc = (a: THREE.Vector3, b: THREE.Vector3, lift: number) =>
  new THREE.QuadraticBezierCurve3(a, a.clone().lerp(b, 0.5).add(new THREE.Vector3(0, lift, 0)), b);
const sensorPos = (r: Room) => centreOf(r, WALL_H + 0.5);

// The alert trail lives at module scope: a fixed-size buffer that the frame loop fills in place.
const TRAIL_PTS = 40;
const trailGeometry = new THREE.BufferGeometry();
trailGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array((TRAIL_PTS + 1) * 3), 3));
trailGeometry.setDrawRange(0, 0);
const trail = new THREE.Line(trailGeometry, new THREE.LineBasicMaterial({ color: '#ff5a5a', transparent: true, opacity: 0.6 }));

const STAFF_STARTS = [
  { start: new THREE.Vector3(-11, floorY(1) + 0.4, 0), floor: 1 },
  { start: new THREE.Vector3(9, floorY(1) + 0.4, 0), floor: 1 },
  { start: new THREE.Vector3(4, floorY(0) + 0.4, 0), floor: 0 },
];

function School() {
  const { rooms, washrooms, alerting, hub, stairs } = useMemo(() => {
    const rooms = buildRooms();
    const washrooms = rooms.filter((r) => r.type === 'washroom');
    const office = rooms.find((r) => r.type === 'office')!;
    return {
      rooms,
      washrooms,
      alerting: washrooms.find((r) => r.floor === 1 && r.z0 > 0)!,
      hub: centreOf(office, WALL_H + 0.6),
      stairs: rooms.filter((r) => r.type === 'stairs'),
    };
  }, []);

  const doorway = useMemo(() => centreOf(alerting, 0.4).setZ(CORRIDOR - 0.4), [alerting]);
  const staffPaths = useMemo(
    () =>
      STAFF_STARTS.map((s) => {
        if (s.floor === 1) return new THREE.CatmullRomCurve3([s.start, doorway.clone().setZ(0), doorway]);
        const st = centreOf(stairs[0], 0.4);
        const up = centreOf(stairs.find((r) => r.floor === 1)!, 0.4);
        return new THREE.CatmullRomCurve3([s.start, st.clone().setZ(0), st, up, up.clone().setZ(0), doorway.clone().setZ(0), doorway]);
      }),
    [stairs, doorway],
  );
  const hubPath = useMemo(() => arc(sensorPos(alerting), hub, 4), [alerting, hub]);
  const phonePaths = useMemo(() => STAFF_STARTS.map((s) => arc(hub, s.start.clone().setY(s.start.y + 0.6), 3)), [hub]);

  const packet = useRef<THREE.Mesh>(null);
  const phonePackets = useRef<(THREE.Mesh | null)[]>([]);
  const staffDots = useRef<(THREE.Mesh | null)[]>([]);
  const sensorRings = useRef<(THREE.Mesh | null)[]>([]);
  const ringMats = useMemo(
    () =>
      washrooms.map(
        () =>
          new THREE.MeshBasicMaterial({
            color: '#34d399',
            transparent: true,
            opacity: 0.6,
            depthWrite: false,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
          }),
      ),
    [washrooms],
  );
  const wallMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#cfd6df', transparent: true, opacity: 0.55, roughness: 0.6 }), []);
  const box = useMemo(() => new THREE.Box3(new THREE.Vector3(-W / 2, -2, -D / 2), new THREE.Vector3(W / 2, FLOOR_GAP + 3, D / 2)), []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const t = time % LOOP;
    const detected = t >= DETECT_AT && t < RESET[0];

    // Calm green rings on every sensor; red pulses on the one that detects.
    washrooms.forEach((w, k) => {
      const ring = sensorRings.current[k];
      if (!ring) return;
      const alarm = detected && w === alerting;
      const p = (time * (alarm ? 1.4 : 0.5) + k * 0.3) % 1;
      ring.scale.setScalar(alarm ? 0.6 + p * 2.6 : 0.6 + p * 0.8);
      ringMats[k].color.set(alarm ? '#ff3b3b' : '#34d399');
      ringMats[k].opacity = (alarm ? 0.9 : 0.4) * (1 - p);
    });

    // Alert flies sensor → office hub, leaving a fading trail.
    const toHub = clamp01((t - TO_HUB[0]) / (TO_HUB[1] - TO_HUB[0]));
    if (packet.current) {
      packet.current.visible = toHub > 0 && toHub < 1;
      packet.current.position.copy(hubPath.getPoint(ease(toHub)));
    }
    // Fill the fixed-size trail buffer and only draw the part travelled so far.
    if (toHub > 0 && toHub < 1) {
      const pts = hubPath.getPoints(TRAIL_PTS);
      const n = Math.max(2, Math.floor(ease(toHub) * TRAIL_PTS));
      const pos = trailGeometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < n; i++) pos.setXYZ(i, pts[i].x, pts[i].y, pts[i].z);
      pos.needsUpdate = true;
      trailGeometry.setDrawRange(0, n);
    } else {
      trailGeometry.setDrawRange(0, 0);
    }

    // Then hub → each staff member's phone.
    const toStaff = clamp01((t - TO_STAFF[0]) / (TO_STAFF[1] - TO_STAFF[0]));
    phonePaths.forEach((path, k) => {
      const m = phonePackets.current[k];
      if (!m) return;
      m.visible = toStaff > 0 && toStaff < 1;
      m.position.copy(path.getPoint(ease(toStaff)));
    });

    // Staff walk to the washroom, flashing red once their phone buzzes.
    const walk = ease(clamp01((t - RESPOND[0]) / (RESPOND[1] - RESPOND[0])));
    staffPaths.forEach((path, k) => {
      const dot = staffDots.current[k];
      if (!dot) return;
      dot.position.copy(t < RESET[0] ? path.getPoint(walk) : STAFF_STARTS[k].start);
      const buzzed = t >= TO_STAFF[1] && t < RESET[0];
      (dot.material as THREE.MeshStandardMaterial).emissive.set(buzzed && Math.sin(time * 12) > 0 ? '#ff3b3b' : '#4cc9ff');
    });

    // Slow orbit around the building.
    const camera = state.camera as THREE.PerspectiveCamera;
    const dist = fitDistance(camera, box, 0.9);
    const angle = 0.6 + Math.sin(time * 0.08) * 0.25;
    camera.position.set(Math.sin(angle) * dist, dist * 0.75, Math.cos(angle) * dist);
    camera.lookAt(0, FLOOR_GAP / 2, 0);
  });

  return (
    <>
      {[0, 1].map((f) => (
        <mesh key={f} position={[0, floorY(f) - 0.15, 0]} receiveShadow>
          <boxGeometry args={[W + 0.6, 0.3, D + 0.6]} />
          <meshStandardMaterial color="#9aa6ae" roughness={0.9} />
        </mesh>
      ))}
      {rooms.map((r, i) => {
        const w = r.x1 - r.x0;
        const d = r.z1 - r.z0;
        const c = centreOf(r);
        return (
          <group key={i}>
            <mesh position={[c.x, c.y + 0.01, c.z]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[w - 0.15, d - 0.15]} />
              <meshStandardMaterial color={FLOOR_COLOUR[r.type]} roughness={0.8} />
            </mesh>
            <mesh position={[c.x, c.y + WALL_H / 2, r.z0 > 0 ? r.z1 : r.z0]} material={wallMat}>
              <boxGeometry args={[w, WALL_H, 0.12]} />
            </mesh>
            <mesh position={[r.x1, c.y + WALL_H / 2, c.z]} material={wallMat}>
              <boxGeometry args={[0.12, WALL_H, d]} />
            </mesh>
            <mesh position={[r.x0 + (w - 1.2) / 2, c.y + WALL_H / 2, r.z0 > 0 ? r.z0 : r.z1]} material={wallMat}>
              <boxGeometry args={[w - 1.2, WALL_H, 0.12]} />
            </mesh>
          </group>
        );
      })}

      {washrooms.map((w, k) => (
        <group key={k} position={sensorPos(w)}>
          <mesh>
            <cylinderGeometry args={[0.45, 0.45, 0.18, 32]} />
            <meshStandardMaterial color="#e9ecef" roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.25 - WALL_H / 2, 0]}>
            <cylinderGeometry args={[0.03, 0.03, WALL_H + 0.3, 8]} />
            <meshBasicMaterial color="#4b5563" />
          </mesh>
          <mesh ref={(m) => void (sensorRings.current[k] = m)} rotation={[-Math.PI / 2, 0, 0]} material={ringMats[k]}>
            <ringGeometry args={[0.9, 1.0, 64]} />
          </mesh>
        </group>
      ))}
      <mesh position={hub}>
        <boxGeometry args={[1.4, 0.9, 0.1]} />
        <meshStandardMaterial color="#0b1220" emissive="#4cc9ff" emissiveIntensity={0.6} />
      </mesh>

      <mesh ref={packet} visible={false}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshBasicMaterial color="#ff5a5a" toneMapped={false} />
      </mesh>
      <primitive object={trail} />
      {STAFF_STARTS.map((_, k) => (
        <mesh key={`p${k}`} ref={(m) => void (phonePackets.current[k] = m)} visible={false}>
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshBasicMaterial color="#ffb020" toneMapped={false} />
        </mesh>
      ))}
      {STAFF_STARTS.map((s, k) => (
        <mesh key={`s${k}`} ref={(m) => void (staffDots.current[k] = m)} position={s.start}>
          <capsuleGeometry args={[0.3, 0.5, 6, 12]} />
          <meshStandardMaterial color="#1e293b" emissive="#4cc9ff" emissiveIntensity={0.9} />
        </mesh>
      ))}
    </>
  );
}

export default function NetworkScene() {
  return (
    <Canvas shadows dpr={[1, 2]} gl={{ alpha: true, antialias: true }} camera={{ fov: 32, near: 0.5, far: 400, position: [30, 30, 30] }}>
      {/* Studio-style lighting without an external environment map */}
      <ambientLight intensity={0.55} />
      <hemisphereLight args={['#dfe8ee', '#0b1013', 0.8]} />
      <directionalLight position={[0.5, 1, 0.4]} intensity={2} castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-1, 0.4, 0.5]} intensity={1.2} />
      <School />
    </Canvas>
  );
}
