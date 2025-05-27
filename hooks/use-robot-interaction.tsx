"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"

/**
 * Custom hook for handling robot interaction with mouse movements
 *
 * This hook provides:
 * - Throttled mouse position tracking
 * - Spline reference for the 3D robot
 * - Normalized mouse coordinates for the robot to follow
 *
 * @returns Object containing mouse position, handler, and spline reference
 */
export function useRobotInteraction() {
  // Track mouse position
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Reference to the Spline object
  const splineRef = useRef<any>(null)

  // Throttling for mouse movement
  const throttleRef = useRef<number | null>(null)
  const lastMousePositionRef = useRef({ x: 0, y: 0 })

  // Throttled mouse move handler for better performance
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLElement>) => {
    // Check if window is defined (client-side only)
    if (typeof window === "undefined") return

    // Rest of the function remains the same
    lastMousePositionRef.current = {
      x: event.clientX,
      y: event.clientY,
    }

    if (throttleRef.current !== null) return

    throttleRef.current = window.setTimeout(() => {
      setMousePosition(lastMousePositionRef.current)

      if (splineRef.current) {
        const normalizedX = lastMousePositionRef.current.x / window.innerWidth
        const normalizedY = lastMousePositionRef.current.y / window.innerHeight

        splineRef.current.emitEvent("mousePosition", {
          x: normalizedX,
          y: normalizedY,
        })
      }

      throttleRef.current = null
    }, 16)
  }, [])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && throttleRef.current !== null) {
        clearTimeout(throttleRef.current)
      }
    }
  }, [])

  return {
    mousePosition,
    handleMouseMove,
    splineRef,
  }
}
