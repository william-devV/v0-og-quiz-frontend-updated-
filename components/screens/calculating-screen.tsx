"use client"

import { useEffect, useState } from "react"

interface CalculatingScreenProps {
  onComplete: () => void
}

export function CalculatingScreen({ onComplete }: CalculatingScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 80)

    const timer = setTimeout(onComplete, 1800)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [onComplete])

  return (
    <div
      className="relative flex min-h-[100dvh] flex-col items-center justify-center"
      style={{ backgroundColor: "#1B2559" }}
    >
      {/* Subtle accent glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-[40%] left-1/2 -translate-x-1/2 h-48 w-48 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(40, 160, 240, 0.15)" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Spinning rounded square */}
        <div
          className="mb-8 h-14 w-14 animate-spin rounded-2xl border-2"
          style={{
            borderColor: "#28A0F0",
            backgroundColor: "rgba(40, 160, 240, 0.2)",
            animationDuration: "1.2s",
          }}
        />

        <h2 className="mb-6 font-sans text-xl font-bold text-white text-center">
          Calculating your OG status...
        </h2>

        <div className="h-2 w-56 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{ width: `${progress}%`, backgroundColor: "#28A0F0" }}
          />
        </div>

        <p className="mt-4 font-sans text-xs text-white/50">
          {progress}%
        </p>
      </div>
    </div>
  )
}
