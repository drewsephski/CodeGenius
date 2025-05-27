"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import * as THREE from "three"
import { motion } from "framer-motion"
import { useEffect } from "react"

type TechGridProps = {
  mousePosition: { x: number; y: number }
}

// Optimized Grid component with memoization and better memory management
function Grid(props: { mousePosition: { x: number; y: number } }) {
  const { mousePosition } = props
  const gridRef = useRef<THREE.Group>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const { size } = useThree()

  // Define constants
  const count = 24 // Reduced from 32 for better performance
  const spacing = 1.8
  const color = "#8b5cf6"
  const particleCount = 150 // Reduced from 200

  // Memoize geometry creation to prevent recreation on each render
  const { lineGeometry, particleGeometry, particleSizes } = useMemo(() => {
    // Create grid lines
    const linePoints = []
    for (let i = -count / 2; i <= count / 2; i += 2) {
      // Increased step size for fewer lines
      // X lines
      linePoints.push(new THREE.Vector3((-count / 2) * spacing, 0, i * spacing))
      linePoints.push(new THREE.Vector3((count / 2) * spacing, 0, i * spacing))

      // Z lines
      linePoints.push(new THREE.Vector3(i * spacing, 0, (-count / 2) * spacing))
      linePoints.push(new THREE.Vector3(i * spacing, 0, (count / 2) * spacing))
    }

    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints)

    // Create floating points
    const particlePositions = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      particlePositions[i3] = (Math.random() - 0.5) * count * spacing
      particlePositions[i3 + 1] = Math.random() * 5
      particlePositions[i3 + 2] = (Math.random() - 0.5) * count * spacing

      sizes[i] = Math.random() * 0.5 + 0.1
    }

    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3))
    particleGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1))

    return { lineGeometry: lineGeo, particleGeometry: particleGeo, particleSizes: sizes }
  }, [count, spacing, particleCount])

  // Memoize materials to prevent recreation
  const { lineMaterial, particleMaterial, glowMaterial } = useMemo(() => {
    const lineMat = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.15,
    })

    const particleMat = new THREE.PointsMaterial({
      color: color,
      size: 0.1,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    })

    const glowMat = new THREE.MeshBasicMaterial({
      color: "#a855f7",
      transparent: true,
      opacity: 0.8,
    })

    return { lineMaterial: lineMat, particleMaterial: particleMat, glowMaterial: glowMat }
  }, [color])

  // Memoize glowing elements
  const glowingElements = useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => {
      const x = (Math.random() - 0.5) * count * spacing * 0.8
      const z = (Math.random() - 0.5) * count * spacing * 0.8
      const y = Math.random() * 3
      const scale = Math.random() * 0.5 + 0.5

      return { position: [x, y, z], scale, key: i }
    })
  }, [count, spacing])

  // Optimize animation frame calculations
  const animationData = useRef({
    time: 0,
    lastUpdate: 0,
    updateInterval: 1000 / 30, // Limit updates to 30fps
  })

  // Optimized animation with throttling
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    const currentTime = performance.now()

    // Only update animations at the specified interval
    if (currentTime - animationData.current.lastUpdate > animationData.current.updateInterval) {
      animationData.current.lastUpdate = currentTime

      if (gridRef.current) {
        // Gentle wave animation
        gridRef.current.rotation.x = THREE.MathUtils.lerp(
          gridRef.current.rotation.x,
          -0.2 + Math.sin(time * 0.2) * 0.05,
          0.05,
        )

        // Follow mouse with subtle movement
        const normalizedMouseX = (mousePosition.x / size.width) * 2 - 1
        const normalizedMouseY = -(mousePosition.y / size.height) * 2 + 1

        gridRef.current.rotation.y = THREE.MathUtils.lerp(gridRef.current.rotation.y, normalizedMouseX * 0.2, 0.05)

        gridRef.current.rotation.z = THREE.MathUtils.lerp(gridRef.current.rotation.z, normalizedMouseY * 0.05, 0.05)
      }

      if (pointsRef.current) {
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
        const sizes = pointsRef.current.geometry.attributes.size.array as Float32Array

        // Update only a subset of particles each frame for better performance
        const updateCount = Math.min(30, particleCount)
        const startIdx = Math.floor(Math.random() * (particleCount - updateCount))

        for (let i = startIdx; i < startIdx + updateCount; i++) {
          const i3 = i * 3
          // Gentle floating movement
          positions[i3 + 1] = Math.sin(time * 0.2 + i * 0.1) * 0.5 + positions[i3 + 1]

          // Pulsating size
          sizes[i] = (Math.sin(time * 0.5 + i) * 0.1 + 0.5) * particleSizes[i]
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true
        pointsRef.current.geometry.attributes.size.needsUpdate = true
      }
    }
  })

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      lineGeometry.dispose()
      particleGeometry.dispose()
      lineMaterial.dispose()
      particleMaterial.dispose()
      glowMaterial.dispose()
    }
  }, [lineGeometry, particleGeometry, lineMaterial, particleMaterial, glowMaterial])

  return (
    <group ref={gridRef}>
      <lineSegments geometry={lineGeometry} material={lineMaterial} />
      <points ref={pointsRef} geometry={particleGeometry} material={particleMaterial} />

      {/* Add some glowing elements */}
      {glowingElements.map(({ position, scale, key }) => (
        <mesh key={key} position={position as [number, number, number]} scale={scale}>
          <sphereGeometry args={[0.2, 8, 8]} /> {/* Reduced segments for better performance */}
          <primitive object={glowMaterial} />
        </mesh>
      ))}
    </group>
  )
}

// Memoized TechGrid component to prevent unnecessary re-renders
export function TechGrid({ mousePosition }: TechGridProps) {
  // Ensure mousePosition is always defined
  const safeMousePosition = mousePosition || { x: 0, y: 0 }

  // Memoize the Canvas setup
  const canvasSetup = useMemo(
    () => ({
      camera: { position: [0, 10, 0], fov: 75, near: 0.1, far: 1000 },
      dpr: [1, 1.5], // Reduced from [1, 2] for better performance
    }),
    [],
  )

  return (
    <motion.div
      className="absolute inset-0 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Canvas
        camera={canvasSetup.camera}
        dpr={canvasSetup.dpr}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        performance={{ min: 0.5 }}
      >
        <color attach="background" args={["#000"]} />
        <fog attach="fog" args={["#000", 20, 40]} />
        <Grid mousePosition={safeMousePosition} />
        <EffectComposer enabled={true}>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={256} />{" "}
          {/* Reduced height for better performance */}
        </EffectComposer>
      </Canvas>
    </motion.div>
  )
}
