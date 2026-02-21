"use client"

import { useEffect, useState } from "react"
import { AnimatedBackground } from "@/components/animated-background"

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
    <AnimatedBackground variant="dark">
      <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center">
          {/* Spinning rounded square */}
          <div
            className="mb-8 h-14 w-14 animate-spin rounded-2xl border-2 border-arb-blue bg-arb-blue/20"
            style={{ animationDuration: "1.2s" }}
          />

          <h2 className="mb-6 font-sans text-xl font-bold text-white text-center">
            Calculating your OG status...
          </h2>

          <div className="h-2 w-56 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-arb-blue transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-4 font-sans text-xs text-white/50">
            {progress}%
          </p>
        </div>
      </div>
    </AnimatedBackground>
  )
}
