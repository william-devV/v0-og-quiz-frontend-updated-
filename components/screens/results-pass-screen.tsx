"use client"

import { useEffect, useState } from "react"
import { sdk } from "@farcaster/miniapp-sdk"
import { AnimatedBackground } from "@/components/animated-background"

interface ResultsPassScreenProps {
  score: number
  total: number
  hasMinted?: boolean
  isMinting?: boolean
  mintError?: string | null
  onMintAndShare: () => void
}

export function ResultsPassScreen({
  score,
  total,
  hasMinted = false,
  isMinting = false,
  mintError = null,
  onMintAndShare,
}: ResultsPassScreenProps) {
  const percentage = Math.round((score / total) * 100)
  const [shouldShake, setShouldShake] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShouldShake(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleButtonClick = () => {
    if (hasMinted) {
      sdk.actions.composeCast({
        text: `Just took the Arbitrum OG Quiz and scored ${percentage}%!\n\nThere you have it, proof that I am an Arbitrum OG. 😌\n\nAre you one also? (take the quiz and let's find out)`,
        embeds: ["https://arbitrum-og-quiz.vercel.app"],
      })
    } else {
      onMintAndShare()
    }
  }

  const buttonLabel = hasMinted
    ? "Share Your Score"
    : isMinting
      ? "Minting..."
      : "Mint OG Badge & Share"

  return (
    <AnimatedBackground variant="light">
      <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6">
        <div
          className={`mx-auto flex w-full max-w-md flex-col items-center ${shouldShake ? "animate-shake-pass" : ""}`}
        >
          {/* Verified badge */}
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-arb-blue shadow-lg shadow-arb-blue/25">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="mb-4 font-sans text-4xl font-bold text-navy">
            You Passed!
          </h1>
          <p className="mb-6 font-sans text-base text-navy/80 text-center">
            They were right about you, you really are an OG.{" "}
            <span className="text-navy/80 text-sm font-semibold">(if you recognize this reference, you are an OG OG! respect! &#x1F9CF;)</span>
          </p>

          <div className="mb-6 w-full rounded-2xl bg-arb-blue p-6 shadow-lg shadow-arb-blue/20">
            <p className="text-center font-sans text-3xl font-bold text-white">
              {score} / {total} -- {percentage}%
            </p>
          </div>

          <button
            type="button"
            onClick={handleButtonClick}
            disabled={isMinting}
            className="w-full rounded-2xl bg-arb-blue px-8 py-4 font-sans text-base font-bold text-white shadow-lg shadow-arb-blue/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-arb-blue/30 active:translate-y-0 active:shadow-md disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {buttonLabel}
          </button>

          {mintError && (
            <p className="mt-3 text-center font-sans text-sm font-medium text-red-500">
              {mintError}
            </p>
          )}

          {!hasMinted && (
            <p className="mt-5 text-center font-sans text-xs font-semibold text-navy/35 leading-relaxed">
              Note: You might get a &apos;malicious token&apos; warning from Farcaster when you try to mint, but I assure you the token is completely safe.{" "}
              This is my first Mini App and I suspect there&apos;s something I missed that would tell Farcaster the contract is safe.
            </p>
          )}
        </div>
      </div>
    </AnimatedBackground>
  )
}
