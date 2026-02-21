"use client"

import { useState, useEffect } from "react"
import { AnimatedBackground } from "@/components/animated-background"

interface MintSuccessScreenProps {
  onExit: () => void
}

const MOCK_TX_HASH = "0x7a8f3e2b1c0d9e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f"

export function MintSuccessScreen({ onExit }: MintSuccessScreenProps) {
  const [copied, setCopied] = useState(false)
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShouldAnimate(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(MOCK_TX_HASH)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  return (
    <AnimatedBackground variant="dark">
      <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6">
        <div
          className={`mx-auto flex w-full max-w-md flex-col items-center ${shouldAnimate ? "animate-stamp" : "opacity-0"}`}
        >
          <div className="mb-8 rounded-2xl border-2 border-arb-blue/40 p-6 animate-pulse-glow">
            <h1 className="font-sans text-3xl font-bold text-white">
              NFT Minted.
            </h1>
          </div>

          <p className="mb-6 font-sans text-sm text-white/60 text-center">
            Your OG status is now on-chain. Welcome to the club.
          </p>

          {/* Transaction hash */}
          <div className="mb-8 w-full">
            <p className="mb-2 font-sans text-xs text-white/50">
              Transaction Hash
            </p>
            <div className="flex items-center overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <code className="flex-1 overflow-hidden px-3 py-3 font-mono text-xs text-white text-ellipsis">
                {MOCK_TX_HASH}
              </code>
              <button
                onClick={handleCopy}
                className="shrink-0 border-l border-white/10 px-3 py-3 font-sans text-xs font-bold text-arb-blue transition-colors hover:bg-arb-blue/10"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex w-full flex-col gap-3">
            <a
              href={`https://basescan.org/tx/${MOCK_TX_HASH}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center rounded-xl bg-arb-blue px-8 py-3.5 font-sans text-base font-bold text-white shadow-md shadow-arb-blue/25 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-arb-blue/30 active:translate-y-0 active:shadow-sm"
            >
              View on Basescan
            </a>

            <button
              onClick={onExit}
              className="font-sans text-sm text-white/50 underline underline-offset-4 transition-colors hover:text-white"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  )
}
