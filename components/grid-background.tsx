"use client"

import { useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import { motion } from "framer-motion"

function Grid({ count = 32, spacing = 1.5, color = "#8b5cf6" }) {
  const points = []
  const lineGeometry = new THREE.BufferGeometry()

  // Create grid points
  for (let i = -count / 2; i <= count / 2; i++) {
    // X lines
    points.push(new THREE.Vector3((-count / 2) * spacing, 0, i * spacing))
    points.push(new THREE.Vector3((count / 2) * spacing, 0, i * spacing))

    // Z lines
    points.push(new THREE.Vector3(i * spacing, 0, (-count / 2) * spacing))
    points.push(new THREE.Vector3(i * spacing, 0, (count / 2) * spacing))
  }

  lineGeometry.setFromPoints(points)

  const lineMaterial = new THREE.LineBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.2,
  })

  return <lineSegments geometry={lineGeometry} material={lineMaterial} />
}

function AnimatedGrid() {
  const gridRef = useRef<THREE.Group>(null)
  const { mouse } = useThree()

  useFrame(({ clock }) => {
    if (gridRef.current) {
      // Gentle wave animation
      const time = clock.getElapsedTime()
      gridRef.current.rotation.x = THREE.MathUtils.lerp(
        gridRef.current.rotation.x,
        -0.2 + Math.sin(time * 0.2) * 0.05,
        0.05,
      )

      // Follow mouse with subtle movement
      gridRef.current.rotation.y = THREE.MathUtils.lerp(gridRef.current.rotation.y, mouse.x * 0.2, 0.05)
    }
  })

  return (
    <group ref={gridRef}>
      <Grid />

      {/* Add some floating points for depth */}
      {Array.from({ length: 50 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 40
        const z = (Math.random() - 0.5) * 40
        const y = Math.random() * 5

        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#8b5cf6" transparent opacity={0.6} />
          </mesh>
        )
      })}
    </group>
  )
}

export function GridBackground() {
  return (
    <motion.div
      className="absolute inset-0 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Canvas camera={{ position: [0, 10, 0], fov: 75, near: 0.1, far: 1000 }} dpr={[1, 2]}>
        <color attach="background" args={["#000"]} />
        <fog attach="fog" args={["#000", 20, 40]} />
        <AnimatedGrid />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </motion.div>
  )
}
