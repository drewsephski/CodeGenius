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
    // Store the latest mouse position regardless of throttling
    lastMousePositionRef.current = {
      x: event.clientX,
      y: event.clientY,
    }

    // If we're currently throttling, don't update state yet
    if (throttleRef.current !== null) return

    // Set up throttling (16ms ≈ 60fps)
    throttleRef.current = window.setTimeout(() => {
      // Update state with the latest mouse position
      setMousePosition(lastMousePositionRef.current)

      // If we have access to the Spline object, send events to it
      if (splineRef.current) {
        // Normalize coordinates for Spline (0-1 range)
        const normalizedX = lastMousePositionRef.current.x / window.innerWidth
        const normalizedY = lastMousePositionRef.current.y / window.innerHeight

        // Send event to Spline
        splineRef.current.emitEvent("mousePosition", {
          x: normalizedX,
          y: normalizedY,
        })
      }

      // Clear the throttle
      throttleRef.current = null
    }, 16)
  }, [])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (throttleRef.current !== null) {
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
