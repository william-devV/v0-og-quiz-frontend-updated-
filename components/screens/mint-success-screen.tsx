"use client"

import { useState, useEffect } from "react"

interface MintSuccessScreenProps {
  onExit: () => void
}

const MOCK_TX_HASH = "0x7a8f3e2b1c0d9e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f"

export function MintSuccessScreen({ onExit }: MintSuccessScreenProps) {
  const [copied, setCopied] = useState(false)
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    const animTimer = setTimeout(() => setShouldAnimate(true), 50)
    // Auto-dismiss after 3 seconds
    const dismissTimer = setTimeout(onExit, 3000)
    return () => {
      clearTimeout(animTimer)
      clearTimeout(dismissTimer)
    }
  }, [onExit])

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
    <div
      className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6"
      style={{ backgroundColor: "#1B2559" }}
    >
      {/* Subtle accent glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-[35%] left-1/2 -translate-x-1/2 h-56 w-56 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(40, 160, 240, 0.14)" }}
        />
      </div>

      <div
        className={`relative z-10 mx-auto flex w-full max-w-md flex-col items-center ${shouldAnimate ? "animate-stamp" : "opacity-0"}`}
      >
        <div className="mb-8 rounded-2xl border-2 border-white/15 p-6 animate-pulse-glow">
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
              className="shrink-0 border-l border-white/10 px-3 py-3 font-sans text-xs font-bold transition-colors hover:bg-white/5"
              style={{ color: "#28A0F0" }}
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
            className="flex w-full items-center justify-center rounded-xl px-8 py-3.5 font-sans text-base font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-sm"
            style={{ backgroundColor: "#28A0F0" }}
          >
            View on Basescan
          </a>

          <p className="mt-2 text-center font-sans text-xs text-white/30">
            Returning to results in 3s...
          </p>
        </div>
      </div>
    </div>
  )
}
