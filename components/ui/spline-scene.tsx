"use client"

import { useState, useEffect, memo } from "react"
import dynamic from "next/dynamic"

// Dynamically import Spline with no SSR to avoid server-side errors
const Spline = dynamic(() => import("@splinetool/react-spline").then((mod) => mod.default), {
  ssr: false,
})

interface SplineSceneProps {
  scene: string
  className?: string
  onLoad?: (spline: any) => void
}

/**
 * SplineScene component for rendering 3D interactive content
 *
 * This component:
 * - Lazy loads the Spline library
 * - Handles loading states
 * - Provides a clean interface for Spline scenes
 * - Optimizes rendering with memo
 *
 * @param props SplineSceneProps
 * @returns Memoized SplineScene component
 */
function SplineSceneComponent({ scene, className = "", onLoad }: SplineSceneProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Handle successful load
  const handleLoad = (spline: any) => {
    setIsLoading(false)
    if (onLoad) {
      onLoad(spline)
    }
  }

  // Reset loading state when scene changes
  useEffect(() => {
    setIsLoading(true)
  }, [scene])

  return (
    <>
      {isLoading && (
        <div className="w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-sm text-gray-400">Loading interactive robot...</p>
          </div>
        </div>
      )}

      <div
        className={`${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-500 ${className}`}
        style={{ width: "100%", height: "100%" }}
      >
        <Spline scene={scene} onLoad={handleLoad} />
      </div>
    </>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const SplineScene = memo(SplineSceneComponent)
