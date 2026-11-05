import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
// Labels are not shown on the website, so <Html> renders nothing.
const Html = (_props: Record<string, unknown>) => null
import * as THREE from 'three'
import { StudioLights, clamp01, ease, fitDistance, GLOW } from '../product'
import { Caption } from '../Caption'

// A stylised two-storey school, in metres. Floors are drawn pulled apart so both plans are visible.
const W = 30 // building length (x)
const D = 14 // building depth (z)
const FLOOR_GAP = 6 // visual spacing between the two plans
const WALL_H = 1.1 // cut-away wall height
const CORRIDOR = 1.6 // half-width of the central corridor
type RoomType = 'class' | 'washroom' | 'office' | 'stairs'
// Rooms along each side of the corridor: [width, type]. +z side then -z side.
const PLAN: Record<number, { north: [number, RoomType][]; south: [number, RoomType][] }> = {
  0: {
    north: [[7, 'class'], [7, 'class'], [4, 'washroom'], [6, 'office'], [6, 'class']],
    south: [[6, 'class'], [4, 'stairs'], [7, 'class'], [4, 'washroom'], [9, 'class']],
  },
  1: {
    north: [[7, 'class'], [7, 'class'], [4, 'washroom'], [6, 'class'], [6, 'class']],
    south: [[6, 'class'], [4, 'stairs'], [7, 'class'], [4, 'washroom'], [9, 'class']],
  },
}
const FLOOR_COLOUR: Record<RoomType, string> = { class: '#1b1e24', washroom: '#173a5c', office: '#2b2440', stairs: '#22262d' }

const LOOP = 11
// Timeline (seconds into the loop)
const DETECT_AT = 2.4 // one washroom sensor detects vaping...
const TO_HUB = [2.8, 3.9] // ...the alert flies to the office...
const TO_STAFF = [3.9, 5.0] // ...and on to staff phones...
const RESPOND = [5.4, 9.0] // ...who head to the washroom
const RESET = [10.2, 11]

type Room = { x0: number; x1: number; z0: number; z1: number; floor: number; type: RoomType }

function buildRooms() {
  const rooms: Room[] = []
  for (const floor of [0, 1]) {
    for (const [side, list] of [
      [1, PLAN[floor].north],
      [-1, PLAN[floor].south],
    ] as const) {
      let x = -W / 2
      for (const [w, type] of list) {
        const [z0, z1] = side > 0 ? [CORRIDOR, D / 2] : [-D / 2, -CORRIDOR]
        rooms.push({ x0: x, x1: x + w, z0, z1, floor, type })
        x += w
      }
    }
  }
  return rooms
}

const floorY = (floor: number) => floor * FLOOR_GAP
const centreOf = (r: Room, y = 0) => new THREE.Vector3((r.x0 + r.x1) / 2, floorY(r.floor) + y, (r.z0 + r.z1) / 2)
// Arc between two points, bulging upwards.
const arc = (a: THREE.Vector3, b: THREE.Vector3, lift: number) =>
  new THREE.QuadraticBezierCurve3(a, a.clone().lerp(b, 0.5).add(new THREE.Vector3(0, lift, 0)), b)

const sensorPos = (r: Room) => centreOf(r, WALL_H + 0.5)

function NetworkScene({ onPhase }: { onPhase: (p: number) => void }) {
  const phase = useRef(-1)
  const { rooms, washrooms, alerting, hub, stairs } = useMemo(() => {
    const rooms = buildRooms()
    const washrooms = rooms.filter((r) => r.type === 'washroom')
    const office = rooms.find((r) => r.type === 'office')!
    return {
      rooms,
      washrooms,
      alerting: washrooms.find((r) => r.floor === 1 && r.z0 > 0)!, // north washroom, first floor
      hub: centreOf(office, WALL_H + 0.6),
      stairs: rooms.filter((r) => r.type === 'stairs'),
    }
  }, [])

  // Staff start in the corridors and walk to the washroom (via the stairs if they're downstairs).
  const staff = useMemo(
    () => [
      { start: new THREE.Vector3(-11, floorY(1) + 0.4, 0), floor: 1 },
      { start: new THREE.Vector3(9, floorY(1) + 0.4, 0), floor: 1 },
      { start: new THREE.Vector3(4, floorY(0) + 0.4, 0), floor: 0 },
    ],
    [],
  )
  const doorway = useMemo(() => centreOf(alerting, 0.4).setZ(CORRIDOR - 0.4), [alerting])
  const staffPaths = useMemo(
    () =>
      staff.map((s) => {
        if (s.floor === 1) return new THREE.CatmullRomCurve3([s.start, doorway.clone().setZ(0), doorway])
        const st = centreOf(stairs[0], 0.4)
        const up = centreOf(stairs.find((r) => r.floor === 1)!, 0.4)
        return new THREE.CatmullRomCurve3([s.start, st.clone().setZ(0), st, up, up.clone().setZ(0), doorway.clone().setZ(0), doorway])
      }),
    [staff, stairs, doorway],
  )
  const hubPath = useMemo(() => arc(sensorPos(alerting), hub, 4), [alerting, hub])
  const phonePaths = useMemo(() => staff.map((s) => arc(hub, s.start.clone().setY(s.start.y + 0.6), 3)), [staff, hub])

  const packet = useRef<THREE.Mesh>(null)
  const phonePackets = useRef<(THREE.Mesh | null)[]>([])
  const staffDots = useRef<(THREE.Mesh | null)[]>([])
  const sensorRings = useRef<(THREE.Mesh | null)[]>([])
  const trailGeometry = useMemo(() => new THREE.BufferGeometry(), [])
  const trail = useMemo(() => new THREE.Line(trailGeometry, new THREE.LineBasicMaterial({ color: '#ff5a5a', transparent: true, opacity: 0.6 })), [trailGeometry])
  const ringMats = useMemo(
    () =>
      washrooms.map(
        () => new THREE.MeshBasicMaterial({ color: '#34d399', transparent: true, opacity: 0.6, depthWrite: false, side: THREE.DoubleSide, ...GLOW }),
      ),
    [washrooms],
  )

  useFrame((state) => {
    const time = state.clock.elapsedTime
    const t = time % LOOP
    const detected = t >= DETECT_AT && t < RESET[0]
    const next = t < DETECT_AT ? 0 : t < TO_STAFF[1] ? 1 : t < RESET[0] ? 2 : 0
    if (next !== phase.current) {
      phase.current = next
      onPhase(next)
    }

    // Sensor status rings: calm green breathing everywhere, red pulses at the one that detects.
    washrooms.forEach((w, k) => {
      const ring = sensorRings.current[k]
      if (!ring) return
      const alarm = detected && w === alerting
      const p = ((time * (alarm ? 1.4 : 0.5) + k * 0.3) % 1)
      ring.scale.setScalar(alarm ? 0.6 + p * 2.6 : 0.6 + p * 0.8)
      ringMats[k].color.set(alarm ? '#ff3b3b' : '#34d399')
      ringMats[k].opacity = (alarm ? 0.9 : 0.4) * (1 - p)
    })

    // Alert packet flies sensor -> office, with a fading trail.
    const toHub = clamp01((t - TO_HUB[0]) / (TO_HUB[1] - TO_HUB[0]))
    if (packet.current) {
      packet.current.visible = toHub > 0 && toHub < 1
      packet.current.position.copy(hubPath.getPoint(ease(toHub)))
    }
    const trailPts = toHub > 0 && toHub < 1 ? hubPath.getPoints(40).slice(0, Math.max(2, Math.floor(ease(toHub) * 40))) : []
    trailGeometry.setFromPoints(trailPts)

    // Then office -> each staff member's phone.
    const toStaff = clamp01((t - TO_STAFF[0]) / (TO_STAFF[1] - TO_STAFF[0]))
    phonePaths.forEach((path, k) => {
      const m = phonePackets.current[k]
      if (!m) return
      m.visible = toStaff > 0 && toStaff < 1
      m.position.copy(path.getPoint(ease(toStaff)))
    })

    // Staff walk to the washroom; they flash red once their phone buzzes.
    const walk = ease(clamp01((t - RESPOND[0]) / (RESPOND[1] - RESPOND[0])))
    staffPaths.forEach((path, k) => {
      const dot = staffDots.current[k]
      if (!dot) return
      dot.position.copy(t < RESET[0] ? path.getPoint(walk) : staff[k].start)
      const buzzed = t >= TO_STAFF[1] && t < RESET[0]
      ;(dot.material as THREE.MeshStandardMaterial).emissive.set(buzzed && Math.sin(time * 12) > 0 ? '#ff3b3b' : '#4cc9ff')
    })

    // Slow orbit around the building.
    const camera = state.camera as THREE.PerspectiveCamera
    const box = new THREE.Box3(new THREE.Vector3(-W / 2, -2, -D / 2), new THREE.Vector3(W / 2, FLOOR_GAP + 3, D / 2))
    const dist = fitDistance(camera, box, 0.95)
    const angle = 0.6 + Math.sin(time * 0.08) * 0.25
    camera.position.set(Math.sin(angle) * dist, dist * 0.75, Math.cos(angle) * dist)
    camera.lookAt(0, FLOOR_GAP / 2, 0)
  })

  const wallMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#cfd6df', transparent: true, opacity: 0.55, roughness: 0.6 }), [])
  return (
    <>
      {[0, 1].map((f) => (
        <group key={f}>
          {/* Floor slab */}
          <mesh position={[0, floorY(f) - 0.15, 0]} receiveShadow>
            <boxGeometry args={[W + 0.6, 0.3, D + 0.6]} />
            <meshStandardMaterial color="#0e1013" roughness={0.9} />
          </mesh>
          <Html position={[-W / 2 - 1.5, floorY(f) + 0.5, D / 2]} center className="plan-label">
            {f === 0 ? 'Ground floor' : 'First floor'}
          </Html>
        </group>
      ))}
      {rooms.map((r, i) => {
        const w = r.x1 - r.x0
        const d = r.z1 - r.z0
        const c = centreOf(r)
        return (
          <group key={i}>
            <mesh position={[c.x, c.y + 0.01, c.z]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[w - 0.15, d - 0.15]} />
              <meshStandardMaterial color={FLOOR_COLOUR[r.type]} roughness={0.8} />
            </mesh>
            {/* Walls: back wall plus the wall shared with the next room (cut away to WALL_H). */}
            <mesh position={[c.x, c.y + WALL_H / 2, r.z0 > 0 ? r.z1 : r.z0]} material={wallMat}>
              <boxGeometry args={[w, WALL_H, 0.12]} />
            </mesh>
            <mesh position={[r.x1, c.y + WALL_H / 2, c.z]} material={wallMat}>
              <boxGeometry args={[0.12, WALL_H, d]} />
            </mesh>
            {/* Corridor wall with a door gap */}
            <mesh position={[r.x0 + (w - 1.2) / 2, c.y + WALL_H / 2, r.z0 > 0 ? r.z0 : r.z1]} material={wallMat}>
              <boxGeometry args={[w - 1.2, WALL_H, 0.12]} />
            </mesh>
            {r.type === 'office' && (
              // Labelled at the building's front edge: the office sits under the first floor, which would cover it.
              <Html position={[c.x, c.y + 0.3, r.z0 > 0 ? D / 2 + 1.4 : -D / 2 - 1.4]} center className="plan-label office">
                Office · dashboard
              </Html>
            )}
          </group>
        )
      })}

      {washrooms.map((w, k) => {
        const p = sensorPos(w)
        return (
          <group key={k} position={p}>
            {/* The sensor: a small white puck on a stalk marking the washroom ceiling. */}
            <mesh>
              <cylinderGeometry args={[0.45, 0.45, 0.18, 32]} />
              <meshStandardMaterial color="#e9ecef" roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.25 - WALL_H / 2, 0]}>
              <cylinderGeometry args={[0.03, 0.03, WALL_H + 0.3, 8]} />
              <meshBasicMaterial color="#4b5563" />
            </mesh>
            <mesh ref={(r) => void (sensorRings.current[k] = r)} rotation={[-Math.PI / 2, 0, 0]} material={ringMats[k]}>
              <ringGeometry args={[0.9, 1.0, 64]} />
            </mesh>
          </group>
        )
      })}
      <mesh position={hub}>
        <boxGeometry args={[1.4, 0.9, 0.1]} />
        <meshStandardMaterial color="#0b1220" emissive="#4cc9ff" emissiveIntensity={0.6} />
      </mesh>

      <mesh ref={packet} visible={false}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshBasicMaterial color="#ff5a5a" toneMapped={false} />
      </mesh>
      <primitive object={trail} />
      {staff.map((_, k) => (
        <mesh key={k} ref={(m) => void (phonePackets.current[k] = m)} visible={false}>
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshBasicMaterial color="#ffb020" toneMapped={false} />
        </mesh>
      ))}
      {staff.map((s, k) => (
        <mesh key={k} ref={(m) => void (staffDots.current[k] = m)} position={s.start}>
          <capsuleGeometry args={[0.3, 0.5, 6, 12]} />
          <meshStandardMaterial color="#1e293b" emissive="#4cc9ff" emissiveIntensity={0.9} />
        </mesh>
      ))}
    </>
  )
}

const FEED = [
  { time: '13:05:12', text: 'Vape detected · Washroom 1N, first floor', level: 'red' },
  { time: '13:05:13', text: 'Alert sent to 3 staff on duty', level: 'amber' },
  { time: '13:05:40', text: 'Ms Patel responding · ETA 40 s', level: 'blue' },
]

export function NetworkPage() {
  const [phase, setPhase] = useState(0)
  return (
    <div className="page">
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 32, near: 0.5, far: 400, position: [30, 30, 30] }}>
        <StudioLights />
        <Suspense fallback={null}>
          <NetworkScene onPhase={setPhase} />
        </Suspense>
      </Canvas>
      <div className={`dashboard ${phase >= 1 ? 'show' : ''}`}>
        <div className="dashboard-title">
          <span className="dot" /> VapeSense dashboard
        </div>
        {FEED.slice(0, phase >= 2 ? 3 : phase >= 1 ? 2 : 0).map((f) => (
          <div key={f.time} className={`feed ${f.level}`}>
            <span className="feed-time">{f.time}</span>
            {f.text}
          </div>
        ))}
      </div>
      <Caption
        eyebrow="Network"
        title="One school. Every washroom."
        text="Each sensor reports over the school network. When one detects vaping, the dashboard and the right staff know within a second, and know exactly where to go."
      />
    </div>
  )
}
