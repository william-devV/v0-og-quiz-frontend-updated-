"use client"

import { useEffect, useState } from "react"
import { AnimatedBackground } from "@/components/animated-background"

interface ResultsPassScreenProps {
  score: number
  total: number
  onMintAndShare: () => void
}

export function ResultsPassScreen({
  score,
  total,
  onMintAndShare,
}: ResultsPassScreenProps) {
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
          className={`mx-auto flex w-full max-w-md flex-col items-center ${shouldShake ? "animate-shake-pass" : ""}`}
        >
          {/* Verified badge */}
          <div className="mb-4 flex h-14 w-14 items-center justify-center border-3 border-black bg-arb-blue shadow-[3px_3px_0px_0px_#000000]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="square">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="mb-2 font-sans text-4xl font-bold text-navy">
            You Passed!
          </h1>
          <p className="mb-8 font-sans text-base text-navy/50 text-center">
            They were right about you, you really are an OG.
          </p>

          <div className="mb-10 w-full border-3 border-black bg-arb-blue p-6 shadow-[6px_6px_0px_0px_#000000]">
            <p className="text-center font-sans text-3xl font-bold text-white">
              {score} / {total} — {percentage}%
            </p>
          </div>

          <button
            onClick={onMintAndShare}
            className="w-full border-3 border-black bg-arb-blue px-8 py-4 font-sans text-base font-bold text-white shadow-[6px_6px_0px_0px_#000000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#000000] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
          >
            {"Mint OG NFT & Share"}
          </button>
        </div>
      </div>
    </AnimatedBackground>
  )
}
