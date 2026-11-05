// A school washroom for the install scene, using photographed CC0 materials from ambientCG
// (see public/textures/CREDITS.txt). Units are metres; `ceilingY` is the underside of the ceiling.
import { useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

const ROOM = { minX: -1.5, maxX: 1.7, minZ: -1.6, maxZ: 1.8, height: 2.6 }
const DADO = 1.2 // blue mosaic band up to this height

// Each material set and how many metres one copy of its texture covers (from its tile count/size).
const SETS = {
  ceiling: { name: 'OfficeCeiling001', span: 3.6 }, // 6 x 600 mm suspended-ceiling tiles
  wall: { name: 'Tiles036', span: 1.5 }, // 10 x 150 mm wall tiles
  dado: { name: 'Tiles132A', span: 0.6 }, // 12 x 50 mm mosaic
  floor: { name: 'Tiles040', span: 2.4 }, // 8 x 300 mm terrazzo
} as const
type SetName = keyof typeof SETS
const MAPS = ['color', 'normal', 'roughness'] as const
const URLS = Object.fromEntries(
  (Object.keys(SETS) as SetName[]).flatMap((k) => MAPS.map((m) => [`${k}_${m}`, `/textures/${SETS[k].name}/${m}.jpg`])),
)

// A tiled PBR material sized for a w x h metre surface.
function surface(tex: Record<string, THREE.Texture>, set: SetName, w: number, h: number, extra: THREE.MeshStandardMaterialParameters = {}) {
  const tile = (t: THREE.Texture, srgb: boolean) => {
    const c = t.clone()
    c.wrapS = c.wrapT = THREE.RepeatWrapping
    c.repeat.set(w / SETS[set].span, h / SETS[set].span)
    c.anisotropy = 8
    c.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace
    c.needsUpdate = true
    return c
  }
  return new THREE.MeshStandardMaterial({
    map: tile(tex[`${set}_color`], true),
    normalMap: tile(tex[`${set}_normal`], false),
    roughnessMap: tile(tex[`${set}_roughness`], false),
    ...extra,
  })
}

export function Bathroom({ ceilingY }: { ceilingY: number }) {
  const floorY = ceilingY - ROOM.height
  const w = ROOM.maxX - ROOM.minX
  const d = ROOM.maxZ - ROOM.minZ
  const cx = (ROOM.minX + ROOM.maxX) / 2
  const cz = (ROOM.minZ + ROOM.maxZ) / 2

  const loaded = useTexture(URLS) as Record<string, THREE.Texture>
  const mat = useMemo(
    () => ({
      ceiling: surface(loaded, 'ceiling', w, d, { side: THREE.DoubleSide }),
      wallBack: surface(loaded, 'wall', w, ROOM.height - DADO),
      wallSide: surface(loaded, 'wall', d, ROOM.height - DADO),
      dadoBack: surface(loaded, 'dado', w, DADO),
      dadoSide: surface(loaded, 'dado', d, DADO),
      floor: surface(loaded, 'floor', w, d),
    }),
    [loaded, w, d],
  )

  // Wall helper: a vertical plane of width `span`, white tiles above the blue mosaic band.
  const wall = (key: string, pos: [number, number], rotY: number, span: number, upper: THREE.Material, dado: THREE.Material) => (
    <group key={key} position={[pos[0], floorY, pos[1]]} rotation={[0, rotY, 0]}>
      <mesh position={[0, DADO + (ROOM.height - DADO) / 2, 0]} material={upper} receiveShadow>
        <planeGeometry args={[span, ROOM.height - DADO]} />
      </mesh>
      <mesh position={[0, DADO / 2, 0]} material={dado} receiveShadow>
        <planeGeometry args={[span, DADO]} />
      </mesh>
    </group>
  )

  // Toilet cubicles along the back wall: partitions, doors and a headrail.
  const cubicleDepth = 1.25
  const frontZ = ROOM.minZ + cubicleDepth
  const bays = 3
  const bay = 0.9
  const startX = ROOM.minX + 0.6
  const laminate = <meshStandardMaterial color="#2f6db3" roughness={0.45} />
  const panelH = 1.85
  const panelY = floorY + 0.15 + panelH / 2
  const cubicles = []
  for (let k = 0; k <= bays; k++) {
    const x = startX + k * bay
    cubicles.push(
      <mesh key={`p${k}`} position={[x, panelY, ROOM.minZ + cubicleDepth / 2]} castShadow receiveShadow>
        <boxGeometry args={[0.025, panelH, cubicleDepth]} />
        {laminate}
      </mesh>,
    )
    if (k < bays) {
      const ajar = k === 1 ? -0.55 : 0 // one door left open
      cubicles.push(
        <group key={`d${k}`} position={[x + 0.04, panelY, frontZ]} rotation={[0, ajar, 0]}>
          <mesh position={[(bay - 0.08) / 2, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[bay - 0.08, panelH, 0.025]} />
            {laminate}
          </mesh>
        </group>,
      )
    }
  }
  cubicles.push(
    <mesh key="rail" position={[startX + (bays * bay) / 2, floorY + 0.15 + panelH + 0.02, frontZ]}>
      <boxGeometry args={[bays * bay, 0.04, 0.04]} />
      <meshStandardMaterial color="#c8ccd2" metalness={0.8} roughness={0.3} />
    </mesh>,
  )

  // Basins on a counter along the left wall, with a mirror above.
  const counter = { from: 0.1, to: 1.5, top: floorY + 0.85, depth: 0.5 }
  const basins = [0.35, 0.8, 1.25]

  return (
    <group>
      {/* Ceiling */}
      <mesh position={[cx, ceilingY + 0.0002, cz]} rotation={[Math.PI / 2, 0, 0]} material={mat.ceiling} receiveShadow>
        <planeGeometry args={[w, d]} />
      </mesh>
      {/* LED panel lights set into the grid */}
      {[
        [-1.0, 0.3],
        [1.2, -1.2],
        [-0.3, 1.2],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, ceilingY - 0.002, z]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.58, 0.58]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <pointLight position={[-1.0, ceilingY - 0.1, 0.3]} intensity={0.9} distance={5} decay={1.2} color="#f4f8ff" />
      <pointLight position={[1.2, ceilingY - 0.1, -1.2]} intensity={0.9} distance={5} decay={1.2} color="#f4f8ff" />
      <hemisphereLight args={['#ffffff', '#9a9ea4', 0.25]} />

      {/* Walls and floor */}
      {wall('back', [cx, ROOM.minZ], 0, w, mat.wallBack, mat.dadoBack)}
      {wall('left', [ROOM.minX, cz], Math.PI / 2, d, mat.wallSide, mat.dadoSide)}
      {wall('right', [ROOM.maxX, cz], -Math.PI / 2, d, mat.wallSide, mat.dadoSide)}
      {wall('front', [cx, ROOM.maxZ], Math.PI, w, mat.wallBack, mat.dadoBack)}
      <mesh position={[cx, floorY, cz]} rotation={[-Math.PI / 2, 0, 0]} material={mat.floor} receiveShadow>
        <planeGeometry args={[w, d]} />
      </mesh>

      {cubicles}

      <mesh position={[ROOM.minX + counter.depth / 2, counter.top - 0.03, (counter.from + counter.to) / 2]} castShadow receiveShadow>
        <boxGeometry args={[counter.depth, 0.06, counter.to - counter.from]} />
        <meshStandardMaterial color="#d8d8d4" roughness={0.4} />
      </mesh>
      {basins.map((z) => (
        <group key={z} position={[ROOM.minX + counter.depth / 2, counter.top, z]} rotation={[0, Math.PI / 2, 0]}>
          <mesh scale={[1, 0.25, 0.75]}>
            <sphereGeometry args={[0.16, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
            <meshStandardMaterial color="#fbfbfa" roughness={0.15} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.07, -0.17]}>
            <cylinderGeometry args={[0.012, 0.014, 0.14, 16]} />
            <meshStandardMaterial color="#d5d9de" metalness={1} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0.13, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.09, 16]} />
            <meshStandardMaterial color="#d5d9de" metalness={1} roughness={0.15} />
          </mesh>
        </group>
      ))}
      <mesh position={[ROOM.minX + 0.005, floorY + 1.5, (counter.from + counter.to) / 2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[counter.to - counter.from, 0.8]} />
        <meshStandardMaterial color="#e8edf2" metalness={1} roughness={0.04} />
      </mesh>
    </group>
  )
}
