"use client"

import { Suspense, lazy, useState } from "react"
const Spline = lazy(() => import("@splinetool/react-spline").then((mod) => mod.default))

interface SplineSceneProps {
  scene: string
  className?: string
  onLoad?: (spline: any) => void
}

export function SplineScene({ scene, className, onLoad }: SplineSceneProps) {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoad = (spline: any) => {
    setIsLoading(false)
    if (onLoad) {
      onLoad(spline)
    }
  }

  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center bg-black">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-white text-sm">Loading interactive robot...</p>
          </div>
        </div>
      }
    >
      <div className={`${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-500 ${className}`}>
        <Spline scene={scene} onLoad={handleLoad} />
      </div>
    </Suspense>
  )
}
