"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TechGrid } from "@/components/tech-grid"
import { TechCard } from "@/components/tech-card"
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react"

// Move cardData outside component to prevent recreation on each render
const cardData = [
  {
    id: 1,
    title: "Quantum Neural Networks",
    subtitle: "Advanced AI Architecture",
    tabs: [
      {
        id: "overview",
        title: "Overview",
        content:
          "Our quantum neural networks leverage superposition principles to process complex data patterns with unprecedented efficiency, enabling AI systems that can analyze multidimensional datasets simultaneously.",
        stats: [
          { label: "Processing Power", value: "12.8 QFLOPS" },
          { label: "Accuracy", value: "99.7%" },
          { label: "Latency", value: "<5ms" },
        ],
      },
      {
        id: "applications",
        title: "Applications",
        content:
          "These networks power our predictive analytics systems, autonomous decision engines, and real-time pattern recognition modules across industrial automation, medical diagnostics, and security infrastructure.",
        stats: [
          { label: "Deployment", value: "Edge + Cloud" },
          { label: "Scalability", value: "Dynamic" },
          { label: "Integration", value: "Universal API" },
        ],
      },
      {
        id: "specifications",
        title: "Specifications",
        content:
          "Built on our proprietary quantum substrate, these networks feature self-optimizing topologies, adaptive learning rates, and distributed processing capabilities that scale linearly with input complexity.",
        stats: [
          { label: "Architecture", value: "Distributed" },
          { label: "Nodes", value: "10⁶+" },
          { label: "Connections", value: "10⁹+" },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Biomimetic Locomotion",
    subtitle: "Advanced Movement Systems",
    tabs: [
      {
        id: "overview",
        title: "Overview",
        content:
          "Our biomimetic locomotion systems replicate natural movement patterns with precision-engineered actuators and adaptive gait algorithms, creating fluid and efficient motion across diverse terrains.",
        stats: [
          { label: "Energy Efficiency", value: "+78%" },
          { label: "Terrain Types", value: "12+" },
          { label: "Adaptation Time", value: "850ms" },
        ],
      },
      {
        id: "applications",
        title: "Applications",
        content:
          "These systems enable our robots to navigate complex environments, from disaster zones to industrial facilities, with unprecedented agility and stability while maintaining optimal energy consumption.",
        stats: [
          { label: "Load Capacity", value: "250kg" },
          { label: "Speed", value: "12m/s" },
          { label: "Stability", value: "99.2%" },
        ],
      },
      {
        id: "specifications",
        title: "Specifications",
        content:
          "Featuring carbon-fiber composite structures, micro-hydraulic actuation, and distributed sensor arrays, our locomotion systems achieve the perfect balance of strength, precision, and adaptability.",
        stats: [
          { label: "Actuators", value: "48+" },
          { label: "Sensors", value: "128+" },
          { label: "Control Rate", value: "1000Hz" },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Adaptive Interfaces",
    subtitle: "Human-Machine Symbiosis",
    tabs: [
      {
        id: "overview",
        title: "Overview",
        content:
          "Our adaptive interfaces create seamless connections between human cognition and machine intelligence, using predictive algorithms to anticipate user needs and optimize interaction patterns in real-time.",
        stats: [
          { label: "Response Time", value: "<10ms" },
          { label: "Prediction Accuracy", value: "94.3%" },
          { label: "Learning Rate", value: "Exponential" },
        ],
      },
      {
        id: "applications",
        title: "Applications",
        content:
          "These interfaces power our augmented reality systems, industrial control platforms, and assistive technologies, creating intuitive experiences that enhance human capabilities across professional and personal domains.",
        stats: [
          { label: "Input Methods", value: "15+" },
          { label: "Accessibility", value: "Universal" },
          { label: "Customization", value: "Unlimited" },
        ],
      },
      {
        id: "specifications",
        title: "Specifications",
        content:
          "Combining neural signal processing, contextual awareness algorithms, and multimodal feedback systems, our interfaces adapt to individual users while continuously improving through collective intelligence.",
        stats: [
          { label: "Modalities", value: "Visual, Haptic, Audio" },
          { label: "Profiles", value: "Dynamic" },
          { label: "Updates", value: "Continuous" },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Swarm Intelligence",
    subtitle: "Distributed Cognition",
    tabs: [
      {
        id: "overview",
        title: "Overview",
        content:
          "Our swarm intelligence platforms enable coordinated operation of multiple autonomous units, creating emergent problem-solving capabilities that exceed the sum of individual components.",
        stats: [
          { label: "Coordination", value: "99.8%" },
          { label: "Scalability", value: "10³ units" },
          { label: "Resilience", value: "Self-healing" },
        ],
      },
      {
        id: "applications",
        title: "Applications",
        content:
          "These systems power our environmental monitoring networks, manufacturing automation cells, and search and rescue operations, enabling complex tasks to be completed with unprecedented efficiency and adaptability.",
        stats: [
          { label: "Coverage", value: "Exponential" },
          { label: "Task Complexity", value: "Unlimited" },
          { label: "Deployment", value: "Rapid" },
        ],
      },
      {
        id: "specifications",
        title: "Specifications",
        content:
          "Built on decentralized decision algorithms, mesh communication networks, and collective learning systems, our swarm platforms optimize resource allocation while maintaining operational integrity under changing conditions.",
        stats: [
          { label: "Communication", value: "Encrypted Mesh" },
          { label: "Algorithms", value: "Self-evolving" },
          { label: "Redundancy", value: "N+2" },
        ],
      },
    ],
  },
]

export function ScrollableSection() {
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const mouseMoveThrottleRef = useRef<number | null>(null)

  // Setup intersection observer with useEffect
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [])

  // Throttled mouse move handler for better performance
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (mouseMoveThrottleRef.current !== null) return

    mouseMoveThrottleRef.current = window.setTimeout(() => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      })
      mouseMoveThrottleRef.current = null
    }, 16) // ~60fps
  }, [])

  // Memoized navigation handlers
  const nextCard = useCallback(() => {
    setActiveCardIndex((prev) => (prev + 1) % cardData.length)
  }, [])

  const prevCard = useCallback(() => {
    setActiveCardIndex((prev) => (prev - 1 + cardData.length) % cardData.length)
  }, [])

  // Memoize animations for better performance
  const titleAnimations = useMemo(
    () => ({
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.8, delay: 0.2 },
    }),
    [],
  )

  const glowAnimations = useMemo(
    () => ({
      animate: {
        opacity: [0.5, 0.8, 0.5],
        scale: [1, 1.02, 1],
      },
      transition: { duration: 3, repeat: Number.POSITIVE_INFINITY },
    }),
    [],
  )

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mouseMoveThrottleRef.current !== null) {
        clearTimeout(mouseMoveThrottleRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full relative overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
    >
      {/* 3D Grid Background */}
      <TechGrid mousePosition={mousePosition} />

      {/* Section Title */}
      <motion.div
        className="pt-24 pb-12 text-center relative z-10"
        initial={titleAnimations.initial}
        animate={isVisible ? titleAnimations.animate : titleAnimations.initial}
        transition={titleAnimations.transition}
      >
        <div className="inline-block relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white relative z-10">
            Advanced <span className="text-purple-400">Technologies</span>
          </h2>
          <motion.div
            className="absolute -inset-1 rounded-lg bg-purple-500/10 blur-sm z-0"
            animate={glowAnimations.animate}
            transition={glowAnimations.transition}
          />
        </div>
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-500/50"></div>
          <p className="text-gray-400 max-w-2xl mx-auto px-4 text-sm tracking-wider uppercase">
            Next-generation AI and robotics systems
          </p>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-purple-500/50"></div>
        </div>
      </motion.div>

      {/* Card Navigation */}
      <div className="flex justify-center items-center gap-8 mb-8 relative z-10">
        <motion.button
          onClick={prevCard}
          className="p-3 rounded-full bg-black/50 border border-purple-500/30 text-white hover:bg-purple-900/30 transition-colors"
          whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(139, 92, 246, 0.3)" }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="h-5 w-5" />
        </motion.button>

        <div className="flex gap-3">
          {cardData.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveCardIndex(index)}
              className="relative"
              whileHover={{ scale: 1.2 }}
            >
              <div className={`w-2 h-2 rounded-full ${index === activeCardIndex ? "bg-purple-500" : "bg-gray-600"}`} />

              {index === activeCardIndex && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-purple-500/50 blur-sm"
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.8, 0.4, 0.8],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              )}
            </motion.button>
          ))}
        </div>

        <motion.button
          onClick={nextCard}
          className="p-3 rounded-full bg-black/50 border border-purple-500/30 text-white hover:bg-purple-900/30 transition-colors"
          whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(139, 92, 246, 0.3)" }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowRight className="h-5 w-5" />
        </motion.button>
      </div>

      {/* Cards Container */}
      <div className="relative h-[550px] w-full max-w-4xl mx-auto px-4 mb-20 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCardIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <TechCard card={cardData[activeCardIndex]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
        <motion.div
          className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer group"
          whileHover={{ scale: 1.05 }}
        >
          <span>View All Technologies</span>
          <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
            <ChevronRight className="h-4 w-4 group-hover:text-purple-400 transition-colors" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
