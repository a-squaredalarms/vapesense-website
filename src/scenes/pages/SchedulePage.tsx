import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { StudioLights, cloneMaterials, posed, posedBounds, useFramedCamera, useProduct, GLOW } from '../product'

const POSE = posed(-Math.PI / 6, 0.12)
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
// Each loop plays two weeks: one in 24/7 mode, one on the school-hours schedule.
const WEEK_SECONDS = 9
const LOOP = WEEK_SECONDS * 2
type Mode = '24/7' | 'schedule'
// The example schedule: weekdays 07:00-18:00 (covers early arrivals, clubs and cleaners).
const SCHEDULE = { days: [0, 1, 2, 3, 4], from: 7, to: 18 }
const isActive = (mode: Mode, day: number, hour: number) =>
  mode === '24/7' || (SCHEDULE.days.includes(day) && hour >= SCHEDULE.from && hour < SCHEDULE.to)

type Hud = { cursor: HTMLDivElement | null; clock: HTMLDivElement | null; status: HTMLDivElement | null }

function ScheduleScene({ onMode, hud }: { onMode: (m: Mode) => void; hud: React.RefObject<Hud> }) {
  const product = useProduct()
  const mode = useRef<Mode | null>(null)
  const ring = useRef<THREE.Mesh>(null)
  const ringMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#4cc9ff', transparent: true, opacity: 0, depthWrite: false, ...GLOW }),
    [],
  )

  const setup = useMemo(() => {
    const caseMats: THREE.MeshStandardMaterial[] = []
    const enclosure = product.parts.get('Whole_Case')
    if (enclosure)
      cloneMaterials(enclosure, (m) => {
        m.emissive = new THREE.Color('#4cc9ff')
        m.emissiveIntensity = 0
        caseMats.push(m)
      })
    const bounds = posedBounds([product.box], POSE)
    return { caseMats, bounds: bounds.clone().translate(new THREE.Vector3(0, -0.06, 0)).expandByVector(new THREE.Vector3(0, 0.06, 0)) }
  }, [product])
  useFramedCamera(setup.bounds, 2.3)

  const level = useRef(0)
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime
    const t = time % LOOP
    const m: Mode = t < WEEK_SECONDS ? '24/7' : 'schedule'
    if (m !== mode.current) {
      mode.current = m
      onMode(m)
    }
    const weekPos = (t % WEEK_SECONDS) / WEEK_SECONDS // 0..1 through Mon 00:00 .. Sun 24:00
    const dayF = weekPos * 7
    const day = Math.floor(dayF)
    const hour = (dayF - day) * 24
    const active = isActive(m, day, hour)

    // Active: soft cyan breathing glow and a sensing ring. Standby: dark and still.
    level.current = THREE.MathUtils.damp(level.current, active ? 1 : 0, 6, delta)
    const breath = 0.5 + 0.5 * Math.sin(time * 2.5)
    for (const mat of setup.caseMats) mat.emissiveIntensity = level.current * (0.02 + breath * 0.03)
    if (ring.current) {
      const p = (time * 0.8) % 1
      ring.current.scale.setScalar(0.068 + p * 0.02) // a halo just outside the case
      ringMat.opacity = level.current * 0.45 * (1 - p)
    }

    const H = hud.current
    if (!H) return
    if (H.cursor) {
      H.cursor.style.left = `${(hour / 24) * 100}%`
      H.cursor.style.top = `${(day / 7) * 100}%`
    }
    if (H.clock) {
      const hh = Math.floor(hour)
      const mm = Math.floor((hour - hh) * 60 / 15) * 15
      H.clock.textContent = `${DAYS[day]} ${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
    }
    if (H.status) {
      H.status.className = `status-chip ${active ? 'monitoring' : 'standby'}`
      H.status.lastChild!.textContent = active ? (m === '24/7' ? 'Active · monitoring 24/7' : 'Active · inside schedule') : 'Standby · outside schedule'
    }
  })

  return (
    <>
      {/* Offset right of centre so the headline on the left stays clear. */}
      <group position={[0.06, 0, 0]}>
        <group quaternion={POSE}>
          <primitive object={product.root} />
        </group>
        <mesh ref={ring} material={ringMat}>
          <ringGeometry args={[0.975, 1, 96]} />
        </mesh>
      </group>
    </>
  )
}

export function SchedulePage() {
  const [mode, setMode] = useState<Mode>('24/7')
  const hud = useRef<Hud>({ cursor: null, clock: null, status: null })
  return (
    <div className="page schedule-page">
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 20, near: 0.01, far: 20, position: [0, 0, 1] }}>
        <StudioLights />
        <Suspense fallback={null}>
          <ScheduleScene onMode={setMode} hud={hud} />
        </Suspense>
      </Canvas>

      <div className="day-top">
        <div className="eyebrow">Schedule</div>
        <h1 className="schedule-title">Always on, or on your hours.</h1>
        <p className="schedule-text">
          Run VapeSense around the clock, or set the hours it monitors. Outside the schedule it rests in standby and
          wakes automatically.
        </p>
        <div className="status-chip monitoring" ref={(el) => void (hud.current.status = el)}>
          <span className="dot" />
          <span>Active</span>
        </div>
      </div>

      <div className="schedule-panel">
        <div className="schedule-head">
          <div className="mode-toggle">
            <span className={mode === '24/7' ? 'on' : ''}>24/7</span>
            <span className={mode === 'schedule' ? 'on' : ''}>School hours</span>
          </div>
          <div className="schedule-clock" ref={(el) => void (hud.current.clock = el)}>
            Mon 00:00
          </div>
        </div>
        <div className="week">
          <div className="hours">
            {[0, 6, 12, 18, 24].map((h) => (
              <span key={h} style={{ left: `${(h / 24) * 100}%` }}>
                {String(h).padStart(2, '0')}:00
              </span>
            ))}
          </div>
          {DAYS.map((d, day) => (
            <div key={d} className="week-row">
              <span className="week-day">{d}</span>
              <div className="cells">
                {Array.from({ length: 24 }, (_, h) => (
                  <i key={h} className={isActive(mode, day, h) ? 'active' : ''} />
                ))}
              </div>
            </div>
          ))}
          <div className="week-cursor-area">
            <div className="week-cursor" ref={(el) => void (hud.current.cursor = el)} />
          </div>
        </div>
      </div>
    </div>
  )
}
