"use client"

import type React from "react"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion"
import {
  Code2,
  Zap,
  Sparkles,
  Cpu,
  GitBranch,
  Check,
  ChevronRight,
  X,
  Menu,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import { useRobotInteraction } from "@/hooks/use-robot-interaction"

// Dynamically import the SplineScene component to reduce initial bundle size
const SplineScene = dynamic(() => import("@/components/ui/spline-scene").then((mod) => mod.SplineScene), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-gray-400">Loading interactive robot...</p>
      </div>
    </div>
  ),
})

/**
 * Main landing page component for AI Code Generation SaaS
 *
 * This component orchestrates all sections of the landing page including:
 * - Hero section with headline and CTA
 * - Features section highlighting AI capabilities
 * - Pricing section
 * - Contact form
 *
 * @returns {JSX.Element} The complete landing page
 */
export function TechCard(): JSX.Element {
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Refs for scroll animations
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle scroll to section
  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setMobileMenuOpen(false)
    }
  }, [])

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [mobileMenuOpen])

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent flex items-center">
                <Code2 className="mr-2 h-6 w-6 text-purple-500" />
                CodeGenius
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink onClick={() => scrollToSection("features")}>Features</NavLink>
              <NavLink onClick={() => scrollToSection("pricing")}>Pricing</NavLink>
              <NavLink onClick={() => scrollToSection("contact")}>Contact</NavLink>
              <button className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 transition-colors">
                Try for Free
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-white"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden bg-black/95 border-b border-purple-500/20"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-4 space-y-4">
                <MobileNavLink onClick={() => scrollToSection("features")}>Features</MobileNavLink>
                <MobileNavLink onClick={() => scrollToSection("pricing")}>Pricing</MobileNavLink>
                <MobileNavLink onClick={() => scrollToSection("contact")}>Contact</MobileNavLink>
                <button className="w-full mt-4 px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 transition-colors">
                  Try for Free
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main>
        <RobotHeroSection />
        <FeaturesSection />
        <PricingSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-purple-500/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent flex items-center">
                <Code2 className="mr-2 h-6 w-6 text-purple-500" />
                CodeGenius
              </h3>
              <p className="mt-4 text-gray-400 text-sm">
                AI-powered code generation for developers. Build faster, smarter, and with fewer bugs.
              </p>
              <div className="mt-6 flex space-x-4">
                <SocialLink icon={<Github className="h-5 w-5" />} href="#" />
                <SocialLink icon={<Twitter className="h-5 w-5" />} href="#" />
                <SocialLink icon={<Linkedin className="h-5 w-5" />} href="#" />
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <FooterLink href="#">Features</FooterLink>
              <FooterLink href="#">Pricing</FooterLink>
              <FooterLink href="#">API</FooterLink>
              <FooterLink href="#">Documentation</FooterLink>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <FooterLink href="#">About</FooterLink>
              <FooterLink href="#">Blog</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Press</FooterLink>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <FooterLink href="#">Privacy</FooterLink>
              <FooterLink href="#">Terms</FooterLink>
              <FooterLink href="#">Security</FooterLink>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-purple-500/20 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} CodeGenius. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

/**
 * Hero section component with interactive robot and headline
 *
 * @returns {JSX.Element} The hero section
 */
function RobotHeroSection(): JSX.Element {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  // Custom hook for robot interaction
  // Initialize mousePosition with a check for window
  const { mousePosition, handleMouseMove, splineRef } = useRobotInteraction()

  // Parallax effect for background grid
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  // Add a useEffect to handle window resize
  useEffect(() => {
    // Ensure we're in the browser
    if (typeof window === "undefined") return

    // Handle window resize to update any calculations that depend on window dimensions
    const handleResize = () => {
      // Force a re-render when window is resized
      // This ensures proper calculations for responsive layout
      window.dispatchEvent(new Event("resize"))
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      id="hero"
      onMouseMove={handleMouseMove}
    >
      {/* Animated background grid */}
      <motion.div className="absolute inset-0 z-0 opacity-20" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-grid-pattern" />
      </motion.div>

      {/* Glow effects */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-600/30 rounded-full filter blur-[100px] z-0" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-blue-600/20 rounded-full filter blur-[100px] z-0" />

      {/* Background text with glow effect */}
      <div className="absolute inset-0 flex flex-wrap content-center justify-center opacity-5 pointer-events-none select-none overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="text-[10vw] font-bold opacity-20 px-4 whitespace-nowrap"
            style={{
              transform: `translateX(${(mousePosition.x - window.innerWidth / 2) * -0.02}px) translateY(${(mousePosition.y - window.innerHeight / 2) * -0.02}px)`,
            }}
          >
            CODE GENIUS
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column: Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="z-10"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                AI-Powered Code
              </span>
              <br />
              Generation for Developers
            </h1>

            <p className="mt-6 text-xl text-gray-300 max-w-lg">
              Build applications faster with intelligent code generation. Let AI handle the boilerplate while you focus
              on what matters.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <motion.button
                className="px-8 py-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started Free
                <ChevronRight className="ml-2 h-5 w-5" />
              </motion.button>

              <motion.button
                className="px-8 py-4 rounded-lg border border-purple-500/30 hover:bg-purple-500/10 text-white font-medium transition-colors flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                View Demo
              </motion.button>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-black bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-xs font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-400">
                <span className="text-white font-medium">500+</span> developers are already using CodeGenius
              </div>
            </div>
          </motion.div>

          {/* Right column: Interactive Robot */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative h-[500px] lg:h-[600px] w-full"
          >
            <div className="absolute inset-0 z-10">
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                onLoad={(spline) => (splineRef.current = spline)}
              />
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-600/20 rounded-full filter blur-[30px] z-0" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-600/20 rounded-full filter blur-[30px] z-0" />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer"
        onClick={() => scrollToSection("features")}
        animate={{
          y: [0, 10, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        }}
      >
        <div className="flex flex-col items-center">
          <span className="text-sm uppercase tracking-widest mb-2 text-gray-400">Scroll</span>
          <ChevronRight className="h-5 w-5 text-gray-400 transform rotate-90" />
        </div>
      </motion.div>
    </section>
  )
}

/**
 * Features section highlighting AI code generation capabilities
 *
 * @returns {JSX.Element} The features section
 */
function FeaturesSection(): JSX.Element {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  // Features data
  const features = useMemo(
    () => [
      {
        icon: <Zap className="h-6 w-6 text-yellow-400" />,
        title: "Lightning Fast Generation",
        description:
          "Generate production-ready code in seconds, not minutes. Our AI models are optimized for speed and efficiency.",
      },
      {
        icon: <Sparkles className="h-6 w-6 text-blue-400" />,
        title: "Multiple Languages & Frameworks",
        description:
          "Support for JavaScript, TypeScript, Python, Java, and more. Works with React, Vue, Angular, Next.js, and other popular frameworks.",
      },
      {
        icon: <Cpu className="h-6 w-6 text-green-400" />,
        title: "Context-Aware Intelligence",
        description:
          "Our AI understands your codebase and generates code that fits your existing patterns and conventions.",
      },
      {
        icon: <GitBranch className="h-6 w-6 text-purple-400" />,
        title: "Version Control Integration",
        description:
          "Seamlessly integrates with Git, GitHub, and other version control systems to enhance your workflow.",
      },
    ],
    [],
  )

  // Advanced features
  const advancedFeatures = useMemo(
    () => [
      {
        title: "Natural Language to Code",
        description:
          "Describe what you want in plain English, and watch as CodeGenius transforms your words into functional code.",
        image: "/placeholder.svg?height=300&width=400",
        alt: "Natural language to code conversion",
      },
      {
        title: "Code Refactoring & Optimization",
        description:
          "Improve existing code with AI-powered refactoring suggestions that enhance performance and readability.",
        image: "/placeholder.svg?height=300&width=400",
        alt: "Code refactoring and optimization",
      },
      {
        title: "Intelligent Autocomplete",
        description: "Context-aware code suggestions that understand your project structure and coding patterns.",
        image: "/placeholder.svg?height=300&width=400",
        alt: "Intelligent code autocomplete",
      },
    ],
    [],
  )

  return (
    <section ref={ref} className="py-20 relative overflow-hidden" id="features">
      {/* Background elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-xl text-gray-300">
            Our AI-powered platform offers a suite of tools designed to accelerate your development workflow and
            eliminate repetitive coding tasks.
          </p>
        </motion.div>

        {/* Core features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Advanced features */}
        <div className="mt-32">
          {advancedFeatures.map((feature, index) => (
            <AdvancedFeatureRow
              key={index}
              title={feature.title}
              description={feature.description}
              image={feature.image}
              alt={feature.alt}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Pricing section with different plan options
 *
 * @returns {JSX.Element} The pricing section
 */
function PricingSection(): JSX.Element {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  // Pricing plans
  const plans = useMemo(
    () => [
      {
        name: "Free",
        price: "$0",
        description: "Perfect for trying out CodeGenius",
        features: ["100 code generations per month", "Basic language support", "Community support", "Single user"],
        cta: "Get Started",
        popular: false,
      },
      {
        name: "Pro",
        price: "$29",
        period: "per month",
        description: "For professional developers",
        features: [
          "Unlimited code generations",
          "All languages and frameworks",
          "Priority support",
          "Up to 5 team members",
          "API access",
          "Custom code styles",
        ],
        cta: "Start Free Trial",
        popular: true,
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For teams and organizations",
        features: [
          "Unlimited everything",
          "Dedicated support",
          "Unlimited team members",
          "Advanced security features",
          "Custom integrations",
          "On-premise deployment option",
        ],
        cta: "Contact Sales",
        popular: false,
      },
    ],
    [],
  )

  return (
    <section ref={ref} className="py-20 relative overflow-hidden" id="pricing">
      {/* Background elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </span>
          </h2>
          <p className="text-xl text-gray-300">
            Choose the plan that's right for you and start building with AI-powered code generation.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard key={index} plan={plan} index={index} isInView={isInView} />
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <motion.h3
            className="text-2xl font-bold mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Frequently Asked Questions
          </motion.h3>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <FaqItem
              question="How accurate is the generated code?"
              answer="Our AI models are trained on millions of code repositories and achieve over 95% accuracy for most common programming tasks. The code is production-ready and follows best practices."
            />
            <FaqItem
              question="Can I customize the code style?"
              answer="Yes, Pro and Enterprise plans allow you to define custom code styles, formatting preferences, and even provide examples of your preferred coding patterns."
            />
            <FaqItem
              question="Is my code and data secure?"
              answer="Absolutely. We don't store your code permanently, and all data is encrypted in transit and at rest. Enterprise plans offer additional security features including private deployments."
            />
            <FaqItem
              question="Can I upgrade or downgrade my plan?"
              answer="Yes, you can change your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the new rate will apply at the start of your next billing cycle."
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/**
 * Contact section with form and information
 *
 * @returns {JSX.Element} The contact section
 */
function ContactSection(): JSX.Element {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  // Form state
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Handle form input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }, [])

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormState({ name: "", email: "", message: "" })

      // Reset submission status after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    }, 1500)
  }, [])

  return (
    <section ref={ref} className="py-20 relative overflow-hidden" id="contact">
      {/* Background elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Get in Touch
            </span>
          </h2>
          <p className="text-xl text-gray-300">
            Have questions about CodeGenius? We're here to help. Reach out to our team and we'll get back to you as soon
            as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact form */}
          <motion.div
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                  <Check className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-gray-400">Thank you for reaching out. We'll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "w-full py-3 px-6 rounded-lg font-medium transition-all",
                    "bg-purple-600 hover:bg-purple-700 text-white",
                    isSubmitting && "opacity-70 cursor-not-allowed",
                  )}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact information */}
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="space-y-8">
              <ContactInfoItem
                title="Email"
                value="hello@codegenius.ai"
                icon={
                  <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                }
              />

              <ContactInfoItem
                title="Phone"
                value="+1 (555) 123-4567"
                icon={
                  <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                }
              />

              <ContactInfoItem
                title="Location"
                value="123 Innovation Drive, San Francisco, CA 94107"
                icon={
                  <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                }
              />

              <ContactInfoItem
                title="Office Hours"
                value="Monday - Friday, 9AM - 6PM PST"
                icon={
                  <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
              />
            </div>

            <div className="mt-12 p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20">
              <h4 className="font-medium mb-2">Enterprise Support</h4>
              <p className="text-gray-400 text-sm mb-4">
                For enterprise inquiries, dedicated support, and custom solutions, please contact our enterprise team
                directly.
              </p>
              <a href="#" className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors">
                Learn more about enterprise solutions
                <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/**
 * Navigation link component for desktop menu
 */
function NavLink({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-gray-300 hover:text-white transition-colors">
      {children}
    </button>
  )
}

/**
 * Navigation link component for mobile menu
 */
function MobileNavLink({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-purple-500/10 rounded-md transition-colors"
    >
      {children}
    </button>
  )
}

/**
 * Social media link component
 */
function SocialLink({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a href={href} className="p-2 bg-gray-800 rounded-full hover:bg-purple-500/20 transition-colors">
      {icon}
    </a>
  )
}

/**
 * Footer link component
 */
function FooterLink({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a href={href} className="block mt-2 text-gray-400 hover:text-white transition-colors">
      {children}
    </a>
  )
}

/**
 * Feature card component for the features grid
 */
function FeatureCard({
  icon,
  title,
  description,
  index,
  isInView,
}: {
  icon: React.ReactNode
  title: string
  description: string
  index: number
  isInView: boolean
}) {
  return (
    <motion.div
      className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 hover:bg-purple-500/5 transition-colors"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
    >
      <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  )
}

/**
 * Advanced feature row component with image and text
 */
function AdvancedFeatureRow({
  title,
  description,
  image,
  alt,
  index,
  isInView,
}: {
  title: string
  description: string
  image: string
  alt: string
  index: number
  isInView: boolean
}) {
  const isEven = index % 2 === 0

  return (
    <div className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12 mb-20`}>
      <motion.div
        className="flex-1"
        initial={{ opacity: 0, x: isEven ? -20 : 20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -20 : 20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-gray-300 text-lg">{description}</p>
        <motion.button
          className="mt-6 inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
          whileHover={{ x: 5 }}
        >
          Learn more
          <ChevronRight className="ml-1 h-4 w-4" />
        </motion.button>
      </motion.div>

      <motion.div
        className="flex-1 relative"
        initial={{ opacity: 0, x: isEven ? 20 : -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? 20 : -20 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="relative rounded-lg overflow-hidden border border-purple-500/20">
          <Image src={image || "/placeholder.svg"} alt={alt} width={500} height={300} className="w-full h-auto" />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent opacity-60" />
        </div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-600/20 rounded-full filter blur-[30px] z-0" />
      </motion.div>
    </div>
  )
}

/**
 * Pricing card component
 */
function PricingCard({
  plan,
  index,
  isInView,
}: {
  plan: {
    name: string
    price: string
    period?: string
    description: string
    features: string[]
    cta: string
    popular: boolean
  }
  index: number
  isInView: boolean
}) {
  return (
    <motion.div
      className={cn(
        "rounded-xl overflow-hidden relative",
        plan.popular ? "border-2 border-purple-500" : "border border-purple-500/20",
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
    >
      {plan.popular && (
        <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          MOST POPULAR
        </div>
      )}

      <div className={cn("p-6", plan.popular ? "bg-purple-900/30" : "bg-gray-900/50")}>
        <h3 className="text-xl font-bold">{plan.name}</h3>
        <div className="mt-4 flex items-baseline">
          <span className="text-4xl font-extrabold">{plan.price}</span>
          {plan.period && <span className="ml-2 text-gray-400">{plan.period}</span>}
        </div>
        <p className="mt-2 text-gray-400">{plan.description}</p>
      </div>

      <div className="p-6 bg-black/30 backdrop-blur-sm">
        <ul className="space-y-4">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <button
          className={cn(
            "mt-8 w-full py-3 px-6 rounded-lg font-medium transition-colors",
            plan.popular ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-gray-800 hover:bg-gray-700 text-white",
          )}
        >
          {plan.cta}
        </button>
      </div>
    </motion.div>
  )
}

/**
 * FAQ item component with toggle functionality
 */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-800 pb-4">
      <button className="flex justify-between items-center w-full text-left py-2" onClick={() => setIsOpen(!isOpen)}>
        <h4 className="text-lg font-medium">{question}</h4>
        <ChevronRight className={cn("h-5 w-5 text-gray-400 transition-transform", isOpen && "transform rotate-90")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="py-3 text-gray-400">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Contact information item component
 */
function ContactInfoItem({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-start">
      <div className="mr-4 mt-1">{icon}</div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-gray-400">{value}</p>
      </div>
    </div>
  )
}
