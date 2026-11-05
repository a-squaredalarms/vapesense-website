import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { DepthOfField, EffectComposer, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import * as THREE from 'three'
import { clamp01, clusterOpenings, easeOut, ease, findOpenings, localDelta, makeRaycastable, makeScrew, screwOutward, useProduct, GLOW } from '../product'
import { Caption } from '../Caption'
import { Bathroom } from './Bathroom'

const LOOP = 12.8 // seconds
// Timeline (seconds into the loop)
const PLATE_UP = [0.6, 2.0] // mount plate rises over the hanging cable...
const PLATE_SCREWS = [2.1, 3.8] // ...and four screws fix it to the ceiling
const BODY_IN = [4.0, 4.8] // sensor is brought up to just below the ceiling...
const WIRE = [4.6, 5.5] // ...the mains and Ethernet cables are connected inside it...
const BODY_UP = [5.7, 7.1] // ...it's pushed up onto the mount...
const SIDE_SCREWS = [7.3, 9.0] // ...the side screws are tightened...
const ONLINE = [9.2, 11.6] // ...and it joins the school network
const RESET = [11.9, 12.8]
const WIFI_RINGS = 3
const SCREW_TRAVEL = 0.035 // ceiling screws start this far below their holes
const SIDE_BACKOUT = 0.008 // side screws sit this far out until tightened
const SCREW_TURNS = 4
const PLATE_DROP = 0.18 // metres below the ceiling at the start
const BODY_DROP = 0.34
const BODY_HOLD = 0.1 // gap below the ceiling while wiring
// Cables dropping out of the ceiling hole: mains (7 mm 3-core flex) and a blue Cat6 Ethernet lead.
const CABLES = [
  { name: 'mains', colour: '#e4e4e2', radius: 0.0035, length: 0.13, offsetX: -0.0045, phase: 0 },
  { name: 'ethernet', colour: '#2f6fd6', radius: 0.0029, length: 0.11, offsetX: 0.0045, phase: 1.7 },
] as const

const STEPS = [
  'Fix the mount over the mains feed',
  'Connect mains and Ethernet',
  'Push the sensor onto the mount',
  'Tighten the side screws',
  'Online on school Wi-Fi or Ethernet',
]

// The mount plate's openings, found by casting rays straight down through it: the biggest is the cable
// cut-out, the small round ones are the four ceiling screw holes.
function findPlateHoles(plate: THREE.Object3D, box: THREE.Box3) {
  const clusters = clusterOpenings(findOpenings(plate, box, box.max.y, -1, 0.001, 0.005, 0.003))
  const cutout = clusters[0]?.centre ?? box.getCenter(new THREE.Vector3())
  const screwHoles = clusters
    .slice(1)
    .filter((c) => c.cells >= 4 && c.cells <= 60)
    .slice(0, 4)
    .map((c) => c.centre)
  // Underside of the plate's flat, where the countersunk heads sit: ray up from just beside a hole.
  makeRaycastable(plate)
  const ray = new THREE.Raycaster(undefined, new THREE.Vector3(0, 1, 0))
  ray.firstHitOnly = true
  const probe = screwHoles[0] ?? cutout
  ray.set(new THREE.Vector3(probe.x + 0.0045, box.min.y - 0.01, probe.z), new THREE.Vector3(0, 1, 0))
  const underside = ray.intersectObject(plate, true)[0]?.point.y ?? box.max.y - 0.003
  return { cutout, screwHoles, underside }
}

const spinAboutY = (turns: number) => new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), turns * Math.PI * 2)

// The model's native orientation is the installed one: front (-Y) faces the floor, mount plate on top.
function InstallScene({ onStep }: { onStep: (i: number) => void }) {
  const product = useProduct()
  const step = useRef(0)
  const ring = useRef<THREE.Mesh>(null)
  const cableMeshes = useRef<(THREE.Mesh | null)[]>([])
  const cableEnds = useRef<(THREE.Group | null)[]>([])
  const wifi = useRef<(THREE.Mesh | null)[]>([])
  const wifiMaterials = useMemo(
    () =>
      Array.from(
        { length: WIFI_RINGS },
        () => new THREE.MeshBasicMaterial({ color: '#4cc9ff', transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, ...GLOW }),
      ),
    [],
  )
  const ringMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#38bdf8', transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, ...GLOW }),
    [],
  )

  const setup = useMemo(() => {
    const { root, parts, boxes } = product
    const up = new THREE.Vector3(0, 1, 0)
    const moves = [...parts.values()].map((object) => ({
      object,
      home: object.position.clone(),
      homeQ: object.quaternion.clone(),
      up: localDelta(root, object, up), // one metre straight up, in the part's own space
      isPlate: object.name === 'Ceiling',
      // Side screws: their outward direction in their own space, for backing out / driving in.
      out: object.name.startsWith('Screw') ? localDelta(root, object, screwOutward(object)) : null,
      screwIndex: object.name.startsWith('Screw') ? Number(object.name.split('_')[1]) - 1 : -1,
    }))
    const plateBox = boxes.get('Ceiling')!
    const ceilingY = plateBox.max.y
    const holes = findPlateHoles(parts.get('Ceiling')!, plateBox)
    const hole = holes.cutout.clone().setY(ceilingY)
    // Ceiling screws: M4-ish countersunk wood screws pointing up through the plate into the ceiling.
    const flip = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI) // head faces the floor
    const ceilingScrews = holes.screwHoles.map((h) => {
      const screw = makeScrew(0.03)
      screw.scale.setScalar(1.35)
      return { screw, home: new THREE.Vector3(h.x, holes.underside, h.z), flip }
    })
    // Where the cables land: the back of the enclosure.
    const housing = boxes.get('Whole_Case')!
    const centre = housing.getCenter(new THREE.Vector3())
    const terminals = {
      mains: centre.clone().setY(housing.max.y - 0.004),
      ethernet: centre.clone().setY(housing.max.y + 0.002),
    }
    const caseBox = boxes.get('Whole_Case')!
    const caseCentre = caseBox.getCenter(new THREE.Vector3())
    const ringSize = Math.max(caseBox.max.x - caseBox.min.x, caseBox.max.z - caseBox.min.z)
    return { moves, ceilingY, hole, terminals, caseCentre, caseBottom: caseBox.min.y, ringSize, ceilingScrews }
  }, [product])

  const sheaths = useMemo(() => CABLES.map((c) => new THREE.MeshStandardMaterial({ color: c.colour, roughness: 0.55 })), [])
  const tmp = useMemo(() => ({ a: new THREE.Vector3(), b: new THREE.Vector3(), c: new THREE.Vector3(), d: new THREE.Vector3(), dir: new THREE.Vector3() }), [])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    const t = time % LOOP
    const reset = easeOut(clamp01((t - RESET[0]) / (RESET[1] - RESET[0])))
    const plate = -PLATE_DROP * (1 - easeOut(clamp01((t - PLATE_UP[0]) / (PLATE_UP[1] - PLATE_UP[0])))) - PLATE_DROP * reset
    const bodyIn = easeOut(clamp01((t - BODY_IN[0]) / (BODY_IN[1] - BODY_IN[0])))
    const bodyUp = easeOut(clamp01((t - BODY_UP[0]) / (BODY_UP[1] - BODY_UP[0])))
    // A small settle right as it clicks home.
    const settle = t > BODY_UP[1] ? -0.0015 * Math.exp(-(t - BODY_UP[1]) * 10) * Math.sin((t - BODY_UP[1]) * 40) : 0
    const body = THREE.MathUtils.lerp(-BODY_DROP, -BODY_HOLD, bodyIn) * (1 - bodyUp) + settle - BODY_DROP * reset
    // Each screw in a set gets its own slot of the window, so they go in one after another.
    const screwProgress = (window: number[], i: number, n: number) => {
      const slot = (window[1] - window[0]) / n
      return ease(clamp01((t - window[0] - i * slot) / (slot * 0.9)))
    }
    for (const m of setup.moves) {
      m.object.position.copy(m.home).addScaledVector(m.up, m.isPlate ? plate : body)
      if (m.out) {
        const tight = screwProgress(SIDE_SCREWS, m.screwIndex, 4) * (1 - reset)
        m.object.position.addScaledVector(m.out, SIDE_BACKOUT * (1 - tight))
        m.object.quaternion.copy(m.homeQ).multiply(spinAboutY(-tight * SCREW_TURNS))
      }
    }
    setup.ceilingScrews.forEach((c, i) => {
      const driven = screwProgress(PLATE_SCREWS, i, setup.ceilingScrews.length)
      c.screw.visible = t > PLATE_SCREWS[0] - 0.3 || driven > 0
      c.screw.position.copy(c.home)
      c.screw.position.y += plate - SCREW_TRAVEL * (1 - driven)
      c.screw.quaternion.copy(spinAboutY(driven * SCREW_TURNS)).multiply(c.flip)
    })

    // Cables hang and sway from the ceiling hole, then each end follows its terminal in the sensor.
    const wire = ease(clamp01((t - WIRE[0]) / (WIRE[1] - WIRE[0]))) * (1 - reset)
    const calm = t > PLATE_UP[0] - 0.2 && t < PLATE_SCREWS[1] ? 0.15 : 1 // hold still while the plate threads over them
    CABLES.forEach((spec, k) => {
      const swayX = Math.sin(time * 0.9 + spec.phase) * 0.008 * calm
      const swayZ = Math.sin(time * 0.6 + 1 + spec.phase) * 0.005 * calm
      const hole = tmp.dir.copy(setup.hole).setX(setup.hole.x + spec.offsetX).clone()
      const hanging = tmp.a.set(hole.x + swayX, hole.y - spec.length, hole.z + swayZ)
      const terminal = tmp.b.copy(setup.terminals[spec.name]).setY(setup.terminals[spec.name].y + body)
      const end = tmp.c.lerpVectors(hanging, terminal, wire)
      // Slack bows out to the side once connected, until the sensor is pushed home.
      const bow = wire * (1 - bodyUp) * (k === 0 ? 0.025 : -0.02)
      const mid = tmp.d.lerpVectors(hole, end, 0.5)
      mid.x += swayX * 0.5 + bow
      const curve = new THREE.CatmullRomCurve3([hole.clone().setY(hole.y + 0.01), hole.clone().setY(hole.y - 0.01), mid, end.clone()])
      const mesh = cableMeshes.current[k]
      if (mesh) {
        mesh.geometry.dispose()
        mesh.geometry = new THREE.TubeGeometry(curve, 48, spec.radius, 10, false)
      }
      // The free end (stripped cores / RJ45 plug) shows until it's plugged in.
      const endGroup = cableEnds.current[k]
      if (endGroup) {
        endGroup.visible = wire < 0.95
        endGroup.position.copy(end)
        endGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), curve.getTangent(1))
      }
    })

    // Online: Wi-Fi rings ripple out under the ceiling from the installed sensor.
    const online = t >= ONLINE[0] && t < RESET[0]
    wifi.current.forEach((m, k) => {
      if (!m) return
      const period = 1.4
      const local = t - ONLINE[0] - k * (period / WIFI_RINGS)
      const p = online && local >= 0 ? (local % period) / period : 0
      m.scale.setScalar(setup.ringSize * (0.7 + p * 2.4))
      wifiMaterials[k].opacity = online && local >= 0 ? 0.6 * (1 - p) : 0
    })

    const clickT = (t - BODY_UP[1]) / 0.8
    if (ring.current) {
      ring.current.scale.setScalar(setup.ringSize * (0.6 + clamp01(clickT) * 0.9))
      ringMaterial.opacity = clickT > 0 && clickT < 1 ? 0.8 * (1 - clickT) : 0
    }

    const next = t < BODY_IN[0] ? 0 : t < BODY_UP[0] ? 1 : t < SIDE_SCREWS[0] ? 2 : t < ONLINE[0] ? 3 : 4
    if (next !== step.current) {
      step.current = next
      onStep(next)
    }

    // Camera roughly where someone standing in the room would look up from (0.6 m below the ceiling,
    // 1 m to the side), aimed a little below the device so the washroom fills the lower part of the
    // frame. It backs off on narrow screens so the action still fits.
    const camera = state.camera as THREE.PerspectiveCamera
    const back = Math.pow(Math.max(1, 1.3 / camera.aspect), 0.7)
    const angle = 0.7 + Math.sin(time * 0.12) * 0.15
    const target = new THREE.Vector3(0, setup.ceilingY - 0.2, 0)
    camera.position.set(Math.sin(angle) * 1.05 * back, setup.ceilingY - 0.75 * back, Math.cos(angle) * 1.05 * back)
    camera.lookAt(target)
  })

  const CORE_COLOURS = ['#8b5a2b', '#2f5fd0', '#c8b400']
  return (
    <>
      <primitive object={product.root} />
      {setup.ceilingScrews.map((c, i) => (
        <primitive key={i} object={c.screw} />
      ))}
      <Bathroom ceilingY={setup.ceilingY} />
      {/* Shallow focus like a phone photo looking up: device and nearby ceiling sharp, room soft. */}
      <EffectComposer multisampling={4}>
        <DepthOfField target={[0, setup.ceilingY - 0.03, 0]} worldFocusDistance={0} worldFocusRange={0.9} bokehScale={2.5} resolutionScale={1} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
      {/* Cable hole cut in the ceiling tile */}
      <mesh position={[setup.hole.x, setup.ceilingY - 0.0001, setup.hole.z]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.009, 32]} />
        <meshBasicMaterial color="#050505" />
      </mesh>

      {CABLES.map((spec, k) => (
        <mesh key={spec.name} ref={(m) => void (cableMeshes.current[k] = m)} material={sheaths[k]} castShadow>
          <tubeGeometry />
        </mesh>
      ))}
      {/* Mains: stripped brown / blue / green-yellow cores. */}
      <group ref={(g) => void (cableEnds.current[0] = g)}>
        {CORE_COLOURS.map((c, i) => {
          const a = (i / 3) * Math.PI * 2
          return (
            <mesh key={c} position={[Math.cos(a) * 0.0015, -0.007, Math.sin(a) * 0.0015]}>
              <cylinderGeometry args={[0.0011, 0.0011, 0.014, 10]} />
              <meshStandardMaterial color={c} roughness={0.5} />
            </mesh>
          )
        })}
      </group>
      {/* Ethernet: clear RJ45 plug with gold contacts. */}
      <group ref={(g) => void (cableEnds.current[1] = g)}>
        <mesh position={[0, -0.008, 0]}>
          <boxGeometry args={[0.0118, 0.016, 0.0075]} />
          <meshPhysicalMaterial color="#e8f1f8" roughness={0.15} transmission={0.6} thickness={0.004} />
        </mesh>
        <mesh position={[0, -0.0145, 0.0025]}>
          <boxGeometry args={[0.009, 0.003, 0.0012]} />
          <meshStandardMaterial color="#d4a94a" metalness={1} roughness={0.3} />
        </mesh>
      </group>

      {wifiMaterials.map((m, k) => (
        <mesh
          key={k}
          ref={(r) => void (wifi.current[k] = r)}
          position={[setup.caseCentre.x, setup.caseBottom - 0.004, setup.caseCentre.z]}
          rotation={[Math.PI / 2, 0, 0]}
          material={m}
        >
          <ringGeometry args={[0.47, 0.5, 96]} />
        </mesh>
      ))}
      <mesh
        ref={ring}
        position={[setup.caseCentre.x, setup.ceilingY - 0.0006, setup.caseCentre.z]}
        rotation={[Math.PI / 2, 0, 0]}
        material={ringMaterial}
      >
        <ringGeometry args={[0.48, 0.5, 96]} />
      </mesh>
      {/* Up-light so the front face (which points at the floor) is lit and shadows land on the ceiling. */}
      <directionalLight
        position={[0.3, -1, 0.45]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-0.4}
        shadow-camera-right={0.4}
        shadow-camera-top={0.4}
        shadow-camera-bottom={-0.4}
      />
    </>
  )
}

export function InstallPage() {
  const [stepIndex, setStepIndex] = useState(0)
  return (
    <div className="page scrim">
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 36, near: 0.01, far: 20, position: [0.3, -0.3, 0.6] }}>
        <ambientLight intensity={0.15} />
        <directionalLight position={[0.5, 1, 0.4]} intensity={0.6} />
        <Suspense fallback={null}>
          {/* A real (CC0) bathroom photo lights the scene and gives the tiles and steel real reflections. */}
          <Environment files="/textures/modern_bathroom_1k.hdr" environmentIntensity={1.25} />
          <InstallScene onStep={setStepIndex} />
        </Suspense>
      </Canvas>
      <div className={`status-chip online-chip ${stepIndex === 4 ? 'show' : ''}`}>
        <span className="dot" />
        Online · connected to school network
      </div>
      <Caption
        eyebrow="Install"
        title="Up in minutes."
        text="Fix the mount over the existing mains and network feed, connect both, and click the sensor home. It joins the school Wi-Fi or Ethernet on its own."
      >
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s} className={i === stepIndex ? 'active' : i < stepIndex ? 'done' : ''}>
              {s}
            </li>
          ))}
        </ol>
      </Caption>
    </div>
  )
}
