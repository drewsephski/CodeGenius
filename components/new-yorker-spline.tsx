"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { SplineScene } from "@/components/ui/splite"
import { motion } from "framer-motion"
import { ChevronDown, PinIcon as Chip, CircuitBoardIcon as Circuit, Cpu } from "lucide-react"
import { ScrollableSection } from "@/components/scrollable-section"

export function NewYorkerSpline() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [spline, setSpline] = useState<any>(null)
  const [scrolled, setScrolled] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Handle mouse movement
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    setMousePosition({ x, y })

    // If we have access to the Spline object, we can send events to it
    if (spline) {
      // Normalize coordinates for Spline (0-1 range)
      const normalizedX = x / rect.width
      const normalizedY = y / rect.height

      // Send event to Spline
      spline.emitEvent("mousePosition", { x: normalizedX, y: normalizedY })
    }
  }

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Handle Spline load
  const handleSplineLoad = (splineApp: any) => {
    setSpline(splineApp)
  }

  // Handle scroll to section
  const handleScrollToSection = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" })
      setScrolled(true)
    }
  }

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen w-full bg-black text-white relative overflow-x-hidden font-serif">
      {/* Hero Section */}
      <div ref={containerRef} className="h-screen w-full relative overflow-hidden" onMouseMove={handleMouseMove}>
        {/* Background text with glow effect */}
        <div className="absolute inset-0 flex flex-wrap content-center justify-center opacity-10 pointer-events-none select-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="text-[10vw] font-bold opacity-20 px-4"
              style={{
                transform: `translateX(${(mousePosition.x - dimensions.width / 2) * -0.02}px) translateY(${(mousePosition.y - dimensions.height / 2) * -0.02}px)`,
              }}
            >
              NORTHERN AI
            </div>
          ))}
        </div>

        {/* Glow effect that follows mouse */}
        <motion.div
          className="absolute pointer-events-none bg-purple-900 rounded-full opacity-20 blur-[100px] transition-transform duration-300 ease-out"
          style={{
            width: "400px",
            height: "400px",
            left: `${mousePosition.x - 200}px`,
            top: `${mousePosition.y - 200}px`,
          }}
          animate={{
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        {/* Header */}
        <header className="z-30 p-6 flex justify-between items-center bg-transparent text-white absolute top-0 left-0 right-0">
          <div className="text-sm uppercase tracking-widest">Est. 2025</div>
          <div className="text-xl font-bold italic tracking-tight">NorthernAI - Robotics</div>
          <div className="text-sm uppercase tracking-widest">FRG, CHI, IL, 60021</div>
        </header>

        {/* Main content - Full screen 3D Scene */}
        <div className="absolute inset-0 z-10">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
            onLoad={handleSplineLoad}
          />
        </div>

        {/* Interaction hint */}
        <div
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 text-center cursor-pointer"
          onClick={handleScrollToSection}
        >
          <div className="animate-bounce flex flex-col items-center opacity-70 hover:opacity-100 transition-opacity">
            <span className="text-sm uppercase tracking-widest mb-2">Scroll</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>

        {/* Footer */}
        <footer className="z-20 p-6 flex justify-between items-center text-xs uppercase tracking-widest absolute bottom-0 left-0 right-0">
          <div>©Robotics</div>
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.2 }}
              animate={{
                y: [0, -3, 0],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 0,
              }}
            >
              <Cpu className="h-5 w-5 text-purple-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.2 }}
              animate={{
                y: [0, -3, 0],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 0.7,
              }}
            >
              <Circuit className="h-5 w-5 text-purple-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.2 }}
              animate={{
                y: [0, -3, 0],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 1.4,
              }}
            >
              <Chip className="h-5 w-5 text-purple-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
            </motion.div>
          </div>
        </footer>
      </div>

      {/* Scrollable Section with 3D Grid and Cards */}
      <div ref={sectionRef}>
        <ScrollableSection />
      </div>
    </div>
  )
}
