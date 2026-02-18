"use client"

import { useEffect, useRef } from "react"

export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) {
      return
    }

    let frame = 0

    const updateProgress = () => {
      frame = 0
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const ratio = totalHeight > 0 ? window.scrollY / totalHeight : 1
      const clampedRatio = Math.max(0, Math.min(1, ratio))
      bar.style.transform = `scaleX(${clampedRatio})`
    }

    const requestProgressUpdate = () => {
      if (frame !== 0) {
        return
      }
      frame = window.requestAnimationFrame(updateProgress)
    }

    requestProgressUpdate()
    window.addEventListener("scroll", requestProgressUpdate, { passive: true })
    window.addEventListener("resize", requestProgressUpdate)

    return () => {
      window.removeEventListener("scroll", requestProgressUpdate)
      window.removeEventListener("resize", requestProgressUpdate)
      if (frame !== 0) {
        window.cancelAnimationFrame(frame)
      }
    }
  }, [])

  return <div ref={barRef} className="scroll-progress" style={{ transform: "scaleX(0)" }} />
}
