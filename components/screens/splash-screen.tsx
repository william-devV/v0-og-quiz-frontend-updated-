"use client"

import { useEffect } from "react"
import { AnimatedBackground } from "@/components/animated-background"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatedBackground variant="dark">
      <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6">
        <div className="animate-pulse-border border-3 border-arb-blue p-6 px-10 animate-pulse-glow">
          <h1 className="font-sans text-5xl font-bold tracking-tight text-white">
            OG QUIZ
          </h1>
        </div>
        <p className="mt-6 font-sans text-base italic text-white/50">
          {"\"Prove you're an OG.\""}
        </p>
      </div>
    </AnimatedBackground>
  )
}
