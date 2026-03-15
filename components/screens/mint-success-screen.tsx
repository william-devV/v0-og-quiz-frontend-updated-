"use client"

import { useState, useEffect } from "react"

interface MintSuccessScreenProps {
  txHash: string
  onExit: () => void
}

export function MintSuccessScreen({ txHash, onExit }: MintSuccessScreenProps) {
  const [copied, setCopied] = useState(false)
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(5)

  useEffect(() => {
    const animTimer = setTimeout(() => setShouldAnimate(true), 50)
    return () => clearTimeout(animTimer)
  }, [])

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExit()
      return
    }
    const dismissTimer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(dismissTimer)
  }, [secondsLeft, onExit])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(txHash)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback — clipboard may not be available in all mini app contexts
    }
  }

  const truncatedHash = txHash
    ? `${txHash.slice(0, 10)}...${txHash.slice(-8)}`
    : ""

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
        <div className="mb-5 animate-pulse-glow">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://copper-patient-pelican-734.mypinata.cloud/ipfs/bafybeice7jscjgcc4bh5ncnbfzcxjcnorcliu77mwy2xjncdojaxeniiu4"
            alt="Arbitrum OG Badge NFT"
            className="h-44 w-44 rounded-2xl border-2 border-white/20 object-cover shadow-xl shadow-arb-blue/30"
          />
        </div>

        <h1 className="mb-2 font-sans text-2xl font-bold text-white">
          NFT Minted.
        </h1>

        <p className="mb-6 font-sans text-sm text-white/60 text-center">
          Your OG status is now on-chain. Welcome to the club.
        </p>

        {/* Transaction hash */}
        <div className="mb-8 w-full">
          <p className="mb-2 font-sans text-xs text-white/50">
            Transaction Hash
          </p>
          <div className="flex items-center overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <code className="flex-1 overflow-hidden px-3 py-3 font-mono text-xs text-white">
              {truncatedHash}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 border-l border-white/10 px-3 py-3 font-sans text-xs font-bold text-arb-blue transition-colors hover:bg-white/5"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex w-full flex-col gap-3">
          <a
            href={`https://arbiscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center rounded-xl border border-white/15 px-8 py-3.5 font-sans text-sm font-medium text-white/70 transition-all hover:bg-white/5"
          >
            View on Arbiscan
          </a>

          <p className="mt-2 text-center font-sans text-xs text-white/30">
            Returning to results in {secondsLeft}s...
          </p>
        </div>
      </div>
    </div>
  )
}
