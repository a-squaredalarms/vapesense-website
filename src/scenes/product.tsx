// Shared product model + helpers used by every page.
import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from 'three-mesh-bvh'

// BVH-accelerated ray casts: hole/vent finding fires thousands of rays at the CAD meshes.
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree as unknown as typeof THREE.BufferGeometry.prototype.computeBoundsTree // library typings disagree with themselves
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree
THREE.Mesh.prototype.raycast = acceleratedRaycast

// Builds the ray-cast acceleration structure for every mesh under `object` (once per geometry).
export function makeRaycastable(object: THREE.Object3D) {
  object.traverse((o) => {
    const g = (o as THREE.Mesh).geometry
    if ((o as THREE.Mesh).isMesh && !g.boundsTree) g.computeBoundsTree()
  })
  object.updateMatrixWorld(true)
}

// Open cells (x, z) on a horizontal grid where a vertical ray passes through `object` within `depth`
// of `fromY` - i.e. holes, slots and cut-outs. dir = +1 casts upwards from below, -1 downwards from above.
export function findOpenings(object: THREE.Object3D, box: THREE.Box3, fromY: number, dir: 1 | -1, step: number, depth: number, inset = 0.002) {
  makeRaycastable(object)
  const ray = new THREE.Raycaster()
  ray.firstHitOnly = true
  const start = 0.01
  const cols = Math.floor((box.max.x - box.min.x - 2 * inset) / step)
  const rows = Math.floor((box.max.z - box.min.z - 2 * inset) / step)
  const open: boolean[] = new Array(cols * rows).fill(false)
  const at = (c: number, r: number) => new THREE.Vector3(box.min.x + inset + c * step, fromY, box.min.z + inset + r * step)
  const direction = new THREE.Vector3(0, dir, 0)
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const p = at(c, r)
      ray.set(p.clone().setY(fromY - dir * start), direction)
      const hit = ray.intersectObject(object, true)[0]
      open[c * rows + r] = !hit || hit.distance > start + depth
    }
  }
  return { open, cols, rows, at }
}

// Groups open grid cells into connected clusters (holes), largest first.
export function clusterOpenings({ open, cols, rows, at }: ReturnType<typeof findOpenings>) {
  const seen = new Uint8Array(open.length)
  const clusters: { centre: THREE.Vector3; cells: number }[] = []
  for (let i = 0; i < open.length; i++) {
    if (!open[i] || seen[i]) continue
    const stack = [i]
    seen[i] = 1
    const sum = new THREE.Vector3()
    let n = 0
    while (stack.length) {
      const k = stack.pop()!
      const c = Math.floor(k / rows)
      const r = k % rows
      sum.add(at(c, r))
      n++
      for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nc = c + dc
        const nr = r + dr
        const j = nc * rows + nr
        if (nc >= 0 && nc < cols && nr >= 0 && nr < rows && open[j] && !seen[j]) {
          seen[j] = 1
          stack.push(j)
        }
      }
    }
    clusters.push({ centre: sum.divideScalar(n), cells: n })
  }
  return clusters.sort((a, b) => b.cells - a.cells)
}

export const MODEL_URL = '/models/vape-sense.glb'

// Per-part colour fixes on top of the CAD colours. color replaces it; brightness multiplies it
// (1 = unchanged, lower = darker).
const PART_LOOK: Record<string, { color?: string; brightness?: number }> = {
  Ceiling: { brightness: 0.45 }, // back plate, a touch darker than the enclosure
}

// The device mounts on a ceiling: the model's underside (-Y: vents + embossed V) is the front and the
// "Ceiling" plate (+Y) is the back. FRONT_POSE turns the front to the camera with the V upright
// (its point, model -X, facing down). posed() then turns it by yaw and tilts it towards the camera.
export const FRONT_POSE = new THREE.Quaternion().setFromRotationMatrix(
  new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, -1), new THREE.Vector3(-1, 0, 0)),
)
export const posed = (yaw: number, tilt: number) =>
  new THREE.Quaternion()
    .setFromEuler(new THREE.Euler(tilt, 0, 0))
    .multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0)))
    .multiply(FRONT_POSE)

// Screws aren't in the STEP export either. The enclosure has screw holes in its two side walls (model ±Z);
// each guess is (fraction along the wall from -X, fraction of the case height from the front face).
// The real hole centre is found by ray-casting the wall around each guess.
const SCREW = {
  walls: [1, -1] as const, // +Z and -Z
  guesses: [
    [0.217, 0.53],
    [0.78, 0.53],
  ],
  length: 0.008, // metres (M3 x 8)
}

// Finds the hole near `guess` on the wall facing `side` (±Z): rays that don't hit the outer face went through it.
function findHole(enclosure: THREE.Object3D, caseBox: THREE.Box3, side: 1 | -1, guess: THREE.Vector3) {
  makeRaycastable(enclosure)
  const ray = new THREE.Raycaster()
  ray.firstHitOnly = true
  const faceZ = side > 0 ? caseBox.max.z : caseBox.min.z
  const start = 0.01
  const step = 0.00025
  const sum = new THREE.Vector3()
  let n = 0
  for (let dx = -0.004; dx <= 0.004; dx += step) {
    for (let dy = -0.004; dy <= 0.004; dy += step) {
      ray.set(new THREE.Vector3(guess.x + dx, guess.y + dy, faceZ + side * start), new THREE.Vector3(0, 0, -side))
      const hit = ray.intersectObject(enclosure, true)[0]
      if (!hit || hit.distance > start + 0.0015) {
        sum.add(new THREE.Vector3(guess.x + dx, guess.y + dy, faceZ))
        n++
      }
    }
  }
  if (n < 5) return { centre: guess.clone().setZ(faceZ) }
  return { centre: sum.divideScalar(n) }
}

// M3 countersunk hex-socket screw (ISO 10642), stainless, along +Y: the head's top face sits at y = 0
// (flush with the wall) and everything else goes in along -Y. Dimensions in metres.
const M3 = { headDia: 0.006, headHeight: 0.00186, shaftDia: 0.003, pitch: 0.0005, socketAF: 0.002, socketDepth: 0.0011 }

export function makeScrew(length: number) {
  // Double-sided: the lathe profiles run top-down, which faces their triangles inwards.
  // Satin stainless, close to the case colour. Full metalness would mirror the black background and look like a hole.
  const steel = new THREE.MeshStandardMaterial({ color: '#d4d7db', metalness: 0.45, roughness: 0.38, side: THREE.DoubleSide })
  const socketMat = new THREE.MeshStandardMaterial({ color: '#8a8e95', metalness: 0.4, roughness: 0.55 })
  const R = M3.headDia / 2
  const r = M3.shaftDia / 2
  const H = M3.headHeight
  const screw = new THREE.Group()

  // 90-degree countersunk head: flat top of radius R tapering to the shaft over H, with a hex socket.
  const head = new THREE.Mesh(
    new THREE.LatheGeometry(
      [new THREE.Vector2(0, 0), new THREE.Vector2(R, 0), new THREE.Vector2(R, -0.0002), new THREE.Vector2(r, -H)],
      48,
    ),
    steel,
  )
  screw.add(head)
  const socket = new THREE.Mesh(
    new THREE.CylinderGeometry(M3.socketAF / Math.sqrt(3), M3.socketAF / Math.sqrt(3), M3.socketDepth, 6),
    socketMat,
  )
  socket.position.y = -M3.socketDepth / 2 + 0.00002 // just proud of the face so it reads as a dark recess
  screw.add(socket)

  // Threaded shaft below the head: a zig-zag profile spun round the axis.
  const profile = [new THREE.Vector2(0, -H), new THREE.Vector2(r, -H)]
  for (let y = -H, i = 0; y > -length; y -= M3.pitch / 2, i++) profile.push(new THREE.Vector2(i % 2 ? r : r * 0.82, y))
  profile.push(new THREE.Vector2(r * 0.7, -length - 0.0002), new THREE.Vector2(0, -length - 0.0002))
  screw.add(new THREE.Mesh(new THREE.LatheGeometry(profile, 32), steel))
  screw.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) o.castShadow = true
  })
  return screw
}

function addScrews(container: THREE.Object3D) {
  const enclosure = container.children.find((c) => c.name === 'Whole_Case')
  if (!enclosure || container.getObjectByName('Screw_1')) return
  container.updateMatrixWorld(true)
  const caseBox = new THREE.Box3().setFromObject(enclosure)
  const size = caseBox.getSize(new THREE.Vector3())
  let i = 0
  for (const side of SCREW.walls) {
    for (const [along, height] of SCREW.guesses) {
      // Hole positions mirror on the far wall when seen from outside, but the fractions are from -X both ways.
      const guess = new THREE.Vector3(caseBox.min.x + along * size.x, caseBox.min.y + height * size.y, 0)
      const hole = findHole(enclosure, caseBox, side, guess)
      const screw = makeScrew(SCREW.length)
      screw.name = `Screw_${++i}`
      const outward = new THREE.Vector3(0, 0, side)
      screw.userData.outward = outward.toArray() // model space (array: userData is JSON-copied on clone)
      // Orient (+Y -> outward) and place in the container's space.
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), outward)
      const parentQ = container.getWorldQuaternion(new THREE.Quaternion())
      screw.quaternion.copy(parentQ.clone().invert().multiply(q))
      const parentScale = container.getWorldScale(new THREE.Vector3())
      screw.scale.set(1 / parentScale.x, 1 / parentScale.y, 1 / parentScale.z)
      // The CAD holes have no countersink, so seat the head just proud of the wall to keep it visible.
      screw.position.copy(container.worldToLocal(hole.centre.clone().addScaledVector(outward, 0.00015)))
      container.add(screw)
    }
  }
}

const findContainer = (root: THREE.Object3D) => {
  // The STEP root node wraps the real parts: find the first node with several children.
  let container = root
  while (container.children.length === 1) container = container.children[0]
  return container
}

// Clones the materials under `object` (the GLB shares them between parts) and lets `edit` change the copies.
export function cloneMaterials(object: THREE.Object3D, edit: (m: THREE.MeshStandardMaterial) => void) {
  object.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh) return
    const copy = (m: THREE.Material) => {
      const c = m.clone() as THREE.MeshStandardMaterial
      edit(c)
      return c
    }
    mesh.material = Array.isArray(mesh.material) ? mesh.material.map(copy) : copy(mesh.material)
  })
}

// One-time fixes on the cached GLB scene, before any page clones it.
function prepareSource(scene: THREE.Object3D) {
  if (scene.userData.prepared) return
  scene.userData.prepared = true
  scene.updateMatrixWorld(true)
  const container = findContainer(scene)
  addScrews(container)
  for (const part of container.children) {
    const look = PART_LOOK[part.name]
    if (!look) continue
    cloneMaterials(part, (m) => {
      if (look.color) m.color?.set(look.color)
      if (look.brightness !== undefined) m.color?.multiplyScalar(look.brightness)
    })
  }
  scene.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      o.castShadow = true
      o.receiveShadow = true
    }
  })
}

export type Product = {
  root: THREE.Object3D // centred on the origin; put it inside a posed <group>
  container: THREE.Object3D // parent of the parts
  parts: Map<string, THREE.Object3D>
  boxes: Map<string, THREE.Box3> // per part, in model space (the space of root's parent)
  box: THREE.Box3
  size: THREE.Vector3
  anchors: Map<string, THREE.Vector3> // named points (userData.anchor), in model space
}

// A fresh, centred copy of the product for one page (pages move parts around, so they don't share one).
export function useProduct(): Product {
  const { scene } = useGLTF(MODEL_URL)
  return useMemo(() => {
    prepareSource(scene)
    const root = scene.clone(true)
    root.position.set(0, 0, 0)
    root.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(root)
    root.position.sub(box.getCenter(new THREE.Vector3()))
    root.updateMatrixWorld(true)
    box.setFromObject(root)
    const container = findContainer(root)
    const parts = new Map(container.children.map((o) => [o.name, o]))
    const boxes = new Map(container.children.map((o) => [o.name, new THREE.Box3().setFromObject(o)]))
    const anchors = new Map<string, THREE.Vector3>()
    root.traverse((o) => void (o.userData.anchor && anchors.set(o.name, o.getWorldPosition(new THREE.Vector3()))))
    return { root, container, parts, boxes, box, size: box.getSize(new THREE.Vector3()), anchors }
  }, [scene])
}

// Converts a model-space move into the part's own parent space (what object.position uses).
export function localDelta(root: THREE.Object3D, object: THREE.Object3D, move: THREE.Vector3) {
  root.updateMatrixWorld(true)
  const modelFromParent = new THREE.Matrix4()
  if (root.parent) modelFromParent.copy(root.parent.matrixWorld).invert()
  modelFromParent.multiply(object.parent!.matrixWorld)
  const parentFromModel = modelFromParent.invert()
  const origin = new THREE.Vector3().applyMatrix4(parentFromModel)
  return move.clone().applyMatrix4(parentFromModel).sub(origin)
}

// A side screw's outward direction in model space.
export const screwOutward = (screw: THREE.Object3D) => new THREE.Vector3().fromArray(screw.userData.outward as number[])

// Glow blending for transparent canvases: adds light to the colour but leaves transparency untouched,
// so particles and rings glow over whatever page background sits behind the scene.
export const GLOW = {
  blending: THREE.CustomBlending,
  blendEquation: THREE.AddEquation,
  blendSrc: THREE.SrcAlphaFactor,
  blendDst: THREE.OneFactor,
  blendSrcAlpha: THREE.ZeroFactor,
  blendDstAlpha: THREE.OneFactor,
} as const

export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
export const clamp01 = (t: number) => THREE.MathUtils.clamp(t, 0, 1)

// Camera distance (along +Z) that fits a box on screen, counting from the box's nearest face.
export function fitDistance(camera: THREE.PerspectiveCamera, box: THREE.Box3, margin: number) {
  const size = box.getSize(new THREE.Vector3())
  const vFov = THREE.MathUtils.degToRad(camera.fov)
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect)
  return Math.max(size.x / 2 / Math.tan(hFov / 2), size.y / 2 / Math.tan(vFov / 2)) * margin + box.max.z
}

// Bounding box of some model-space boxes once the model is turned to a pose.
export function posedBounds(boxes: THREE.Box3[], pose: THREE.Quaternion) {
  const out = new THREE.Box3()
  const p = new THREE.Vector3()
  for (const b of boxes) {
    for (let i = 0; i < 8; i++) {
      p.set(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z)
      out.expandByPoint(p.applyQuaternion(pose))
    }
  }
  return out
}

// Keeps a camera on +Z framing `bounds` (world space), easing towards it.
export function useFramedCamera(bounds: THREE.Box3, margin: number) {
  const centre = useMemo(() => bounds.getCenter(new THREE.Vector3()), [bounds])
  useFrame((state, delta) => {
    const camera = state.camera as THREE.PerspectiveCamera
    const target = new THREE.Vector3(centre.x, centre.y, fitDistance(camera, bounds, margin))
    camera.position.lerp(target, 1 - Math.exp(-6 * delta))
    camera.lookAt(centre.x, centre.y, 0)
  })
}

// Soft round sprite for particles (air, smoke).
let dotTexture: THREE.Texture | null = null
export function softDot() {
  if (dotTexture) return dotTexture
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')!
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.35, 'rgba(255,255,255,0.45)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 64, 64)
  dotTexture = new THREE.CanvasTexture(c)
  return dotTexture
}

// The same lighting on every page.
export function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[0.5, 1, 0.4]} intensity={2} castShadow shadow-mapSize={[2048, 2048]} />
      {/* Low raking light from the left so the embossed V and vents read on the front face */}
      <directionalLight position={[-1, 0.4, 0.5]} intensity={1.6} />
      <Environment files="/textures/studio_small_03_1k.hdr" />
    </>
  )
}

useGLTF.preload(MODEL_URL)
