"use client"

import { useEffect } from "react"
import Image from "next/image"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2400)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className="relative flex min-h-[100dvh] flex-col items-center justify-center"
      style={{ backgroundColor: "#1B2559" }}
    >
      {/* Subtle accent glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-[30%] left-1/2 -translate-x-1/2 h-64 w-64 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(40, 160, 240, 0.12)" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Bobbing Arbitrum logo — true centered */}
        <div className="animate-bob">
          <div className="relative h-24 w-24 overflow-hidden rounded-3xl border-2 border-white/15 shadow-lg shadow-arb-blue/20 animate-pulse-glow">
            <Image
              src="/arbitrum-logo.png"
              alt="Arbitrum logo"
              width={96}
              height={96}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>

        {/* Title below logo with comfortable gap */}
        <h1 className="mt-6 font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Arbitrum OG Quiz
        </h1>

        {/* Subtle loading bar */}
        <div className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full"
            style={{
              backgroundColor: "#28A0F0",
              animation: "splash-progress 2.2s ease-in-out forwards",
            }}
          />
        </div>
      </div>

      {/* Bottom text */}
      <p className="absolute bottom-10 font-sans text-xs text-white/30">
        Arbitrum OG Quiz
      </p>
    </div>
  )
}
