"use client"

import { useEffect } from "react"
import Image from "next/image"
import { AnimatedBackground } from "@/components/animated-background"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2400)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatedBackground variant="dark">
      <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center">
          {/* Bobbing Arbitrum logo */}
          <div className="animate-bob mb-8">
            <div className="relative h-24 w-24 overflow-hidden rounded-3xl border-2 border-arb-blue/30 shadow-lg shadow-arb-blue/20 animate-pulse-glow">
              <Image
                src="/arbitrum-logo.svg"
                alt="Arbitrum logo"
                width={96}
                height={96}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="animate-fade-in-up font-sans text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Arbitrum OG Quiz
          </h1>

          {/* Subtle loading bar */}
          <div className="animate-fade-in-up mt-8 h-1 w-48 overflow-hidden rounded-full bg-white/10" style={{ animationDelay: "0.2s" }}>
            <div
              className="h-full rounded-full bg-arb-blue"
              style={{
                animation: "splash-progress 2.2s ease-in-out forwards",
              }}
            />
          </div>
        </div>

        {/* Bottom text */}
        <p
          className="animate-fade-in-up absolute bottom-10 font-sans text-xs text-white/30"
          style={{ animationDelay: "0.3s" }}
        >
          Arbitrum OG Quiz
        </p>
      </div>
    </AnimatedBackground>
  )
}
