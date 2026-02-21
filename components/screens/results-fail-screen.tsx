"use client"

import { useEffect, useState } from "react"
import { AnimatedBackground } from "@/components/animated-background"

interface ResultsFailScreenProps {
  score: number
  total: number
  onRetry: () => void
  onExit: () => void
}

export function ResultsFailScreen({
  score,
  total,
  onRetry,
  onExit,
}: ResultsFailScreenProps) {
  const percentage = Math.round((score / total) * 100)
  const [shouldShake, setShouldShake] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShouldShake(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatedBackground variant="light">
      <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6">
        <div
          className={`mx-auto flex w-full max-w-md flex-col items-center ${shouldShake ? "animate-shake-fail" : ""}`}
        >
          {/* X badge */}
          <div className="mb-4 flex h-14 w-14 items-center justify-center border-3 border-black bg-destructive shadow-[3px_3px_0px_0px_#000000]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="square">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>

          <h1 className="mb-2 text-center font-sans text-2xl font-bold text-navy text-balance">
            Unfortunately you don{"'"}t seem to be an Arbitrum OG.
          </h1>

          <div className="mt-6 mb-4 w-full border-3 border-black bg-white p-6 shadow-[6px_6px_0px_0px_#000000]">
            <p className="text-center font-sans text-3xl font-bold text-navy">
              {score} / {total} — {percentage}%
            </p>
          </div>

          <p className="mb-8 font-sans text-sm text-navy/40">
            You need 14/20 to qualify. Study up.
          </p>

          <div className="flex w-full flex-col gap-3">
            <button
              onClick={onRetry}
              className="w-full border-3 border-black bg-arb-blue px-8 py-4 font-sans text-base font-bold text-white shadow-[4px_4px_0px_0px_#000000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
            >
              Try Again
            </button>

            <button
              onClick={onExit}
              className="font-sans text-sm text-navy/40 underline underline-offset-4 transition-colors hover:text-navy"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  )
}
