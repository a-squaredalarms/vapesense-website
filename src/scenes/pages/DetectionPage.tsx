import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { StudioLights, clamp01, cloneMaterials, ease, findOpenings, softDot, useProduct, GLOW } from '../product'
import { Caption } from '../Caption'

const LOOP = 10 // seconds
// Timeline (seconds into the loop)
const SMOKE_START = 0.6
const SMOKE_RISE = 3.4 // seconds for a puff to reach the ceiling
const DETECT_AT = 3.4
const CLEAR_AT = 8.8
const SMOKE_COUNT = 700
const INTO_VENTS = 0.55 // share of the plume drawn into the vent slots; the rest spreads along the ceiling
const RINGS = 3
const SOURCE = new THREE.Vector3(0.16, -0.75, 0.12) // where the vape cloud is exhaled, relative to the device

type Phase = 'monitoring' | 'analysing' | 'detected'

// The model's native orientation is the installed one: front (-Y, vents) faces the floor.
function DetectionScene({ onPhase }: { onPhase: (p: Phase) => void }) {
  const product = useProduct()
  const phase = useRef<Phase>('monitoring')
  const rings = useRef<(THREE.Mesh | null)[]>([])

  const setup = useMemo(() => {
    const { parts, boxes } = product
    const caseMaterials: THREE.MeshStandardMaterial[] = []
    const enclosure = parts.get('Whole_Case')!
    cloneMaterials(enclosure, (m) => {
      m.emissive = new THREE.Color('#ff2d2d')
      m.emissiveIntensity = 0
      caseMaterials.push(m)
    })
    const caseBox = boxes.get('Whole_Case')!
    const ceilingY = (boxes.get('Ceiling') ?? caseBox).max.y
    const front = caseBox.min.y
    const centre = caseBox.getCenter(new THREE.Vector3())

    // Vent slots on the downward-facing front, found by ray-casting through the wall.
    const grid = findOpenings(enclosure, caseBox, front, 1, 0.0008, 0.004, 0.003)
    const vents: THREE.Vector3[] = []
    grid.open.forEach((isOpen, k) => isOpen && vents.push(grid.at(Math.floor(k / grid.rows), k % grid.rows)))
    if (!vents.length) vents.push(centre.clone().setY(front))

    // Each puff: exhaled at SOURCE, rises and drifts, then either enters a vent slot or hits the ceiling
    // and spreads outwards along it (a "ceiling jet").
    const r = Math.random
    const start = new Float32Array(SMOKE_COUNT * 3)
    const ctrl = new Float32Array(SMOKE_COUNT * 3)
    const end = new Float32Array(SMOKE_COUNT * 3)
    const delay = new Float32Array(SMOKE_COUNT)
    const source = centre.clone().add(SOURCE).setY(front + SOURCE.y)
    for (let i = 0; i < SMOKE_COUNT; i++) {
      const s = source.clone().add(new THREE.Vector3((r() - 0.5) * 0.06, (r() - 0.5) * 0.04, (r() - 0.5) * 0.06))
      let e: THREE.Vector3
      if (r() < INTO_VENTS) e = vents[Math.floor(r() * vents.length)].clone().setY(front - 0.002)
      else {
        const a = r() * Math.PI * 2
        const rad = 0.12 + r() * 0.3
        e = new THREE.Vector3(centre.x + Math.cos(a) * rad, ceilingY - 0.01 - r() * 0.02, centre.z + Math.sin(a) * rad)
      }
      // Rises mostly straight up from the source before bending towards its destination.
      const c = new THREE.Vector3(s.x + (e.x - s.x) * 0.3, e.y - 0.12 - r() * 0.08, s.z + (e.z - s.z) * 0.3)
      s.toArray(start, i * 3)
      c.toArray(ctrl, i * 3)
      e.toArray(end, i * 3)
      delay[i] = r() * 1.6
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(SMOKE_COUNT * 3), 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(SMOKE_COUNT * 3), 3))
    const material = new THREE.PointsMaterial({
      size: 0.05,
      map: softDot(),
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      ...GLOW,
    })
    const ringMaterials = Array.from(
      { length: RINGS },
      () =>
        new THREE.MeshBasicMaterial({ color: '#ff3b3b', transparent: true, opacity: 0, depthWrite: false, ...GLOW, side: THREE.DoubleSide }),
    )
    const ringSize = Math.max(caseBox.max.x - caseBox.min.x, caseBox.max.z - caseBox.min.z)
    return { caseMaterials, start, ctrl, end, delay, geometry, material, ringMaterials, ringSize, ceilingY, front, centre, source }
  }, [product])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    const t = time % LOOP
    const next: Phase = t >= SMOKE_START && t < DETECT_AT ? 'analysing' : t >= DETECT_AT && t < CLEAR_AT ? 'detected' : 'monitoring'
    if (next !== phase.current) {
      phase.current = next
      onPhase(next)
    }

    // Smoke puffs rise along their curves, swirling a little, fading in and out.
    const pos = setup.geometry.attributes.position.array as Float32Array
    const col = setup.geometry.attributes.color.array as Float32Array
    for (let i = 0; i < SMOKE_COUNT; i++) {
      const life = clamp01((t - SMOKE_START - setup.delay[i]) / SMOKE_RISE)
      const s = ease(life)
      const j = i * 3
      for (let k = 0; k < 3; k++)
        pos[j + k] = (1 - s) * (1 - s) * setup.start[j + k] + 2 * (1 - s) * s * setup.ctrl[j + k] + s * s * setup.end[j + k]
      const swirl = (1 - s) * 0.02
      pos[j] += Math.sin(life * 7 + i) * swirl
      pos[j + 2] += Math.cos(life * 6 + i * 1.3) * swirl
      const a = life > 0 && life < 1 ? Math.sin(life * Math.PI) * 0.05 : 0
      col[j] = col[j + 1] = col[j + 2] = a
    }
    setup.geometry.attributes.position.needsUpdate = true
    setup.geometry.attributes.color.needsUpdate = true

    // Alert: a red pulse on the case and rings rippling out across the ceiling.
    const detected = t >= DETECT_AT && t < CLEAR_AT
    const glow = detected ? 0.05 + 0.04 * Math.sin((t - DETECT_AT) * 8) : 0
    for (const m of setup.caseMaterials) m.emissiveIntensity = THREE.MathUtils.lerp(m.emissiveIntensity, glow, 0.2)
    rings.current.forEach((ring, k) => {
      if (!ring) return
      const period = 1.6
      const local = t - DETECT_AT - k * (period / RINGS)
      const active = detected && local >= 0 && t < CLEAR_AT - 0.4
      const p = active ? (local % period) / period : 0
      ring.scale.setScalar(setup.ringSize * (0.7 + p * 3))
      setup.ringMaterials[k].opacity = active ? 0.7 * (1 - p) : 0
    })

    // Camera below and to the side, looking up so both the plume and the device are in frame.
    const camera = state.camera as THREE.PerspectiveCamera
    const back = Math.pow(Math.max(1, 1.3 / camera.aspect), 0.7)
    const angle = 0.75 + Math.sin(time * 0.1) * 0.12
    const c = setup.centre
    camera.position.set(c.x + Math.sin(angle) * 0.72 * back, setup.ceilingY - 0.36 * back, c.z + Math.cos(angle) * 0.72 * back)
    camera.lookAt(c.x + 0.03, setup.ceilingY - 0.11, c.z + 0.02)
  })

  return (
    <>
      <primitive object={product.root} />
      {/* A dark ceiling so the device reads as mounted, not floating. */}
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
      {/* Up-light so the downward-facing front reads. */}
      <directionalLight position={[0.4, -1, 0.5]} intensity={1.2} />
    </>
  )
}

const STATUS: Record<Phase, string> = {
  monitoring: 'Monitoring air quality',
  analysing: 'Analysing particles…',
  detected: 'Vape detected',
}

export function DetectionPage() {
  const [phase, setPhase] = useState<Phase>('monitoring')
  return (
    <div className="page">
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 36, near: 0.01, far: 20, position: [0.6, -0.5, 0.8] }}>
        <StudioLights />
        <Suspense fallback={null}>
          <DetectionScene onPhase={setPhase} />
        </Suspense>
      </Canvas>
      <div className={`status-chip ${phase}`}>
        <span className="dot" />
        {STATUS[phase]}
      </div>
      <div className={`alert-card ${phase === 'detected' ? 'show' : ''}`}>
        <div className="alert-app">VapeSense · now</div>
        <div className="alert-title">Vape detected</div>
        <div className="alert-body">Bathroom, 2nd floor. Staff have been notified.</div>
      </div>
      <Caption
        eyebrow="Detection"
        title="Caught in seconds."
        text="Vape aerosol rises to the ceiling and is drawn straight into the vents. VapeSense tells it apart from steam, dust and deodorant, then alerts staff with the exact location."
      />
    </div>
  )
}
