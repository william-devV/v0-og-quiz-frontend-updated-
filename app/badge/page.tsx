"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import { sdk } from "@farcaster/miniapp-sdk"
import { AnimatedBackground } from "@/components/animated-background"

const OPENSEA_URL = "https://opensea.io"

export default function BadgePage() {
  const router = useRouter()
  const { address: walletAddress } = useAccount()
  const [hasMinted, setHasMinted] = useState<boolean | null>(null)

  useEffect(() => {
    if (!walletAddress) {
      setHasMinted(false)
      return
    }
    setHasMinted(null) // loading
    fetch(`/api/mint/status?wallet=${walletAddress}`)
      .then((r) => r.json())
      .then(({ hasMinted }) => setHasMinted(hasMinted))
      .catch(() => setHasMinted(false))
  }, [walletAddress])

  const handleOpenSea = () => {
    sdk.actions.openUrl(OPENSEA_URL).catch(() => {
      window.open(OPENSEA_URL, "_blank", "noopener,noreferrer")
    })
  }

  return (
    <AnimatedBackground variant="light">
      <div className="flex min-h-[100dvh] flex-col px-6 py-10">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-8 self-start font-sans text-sm text-navy/50 underline underline-offset-4 transition-colors hover:text-navy"
        >
          ← Back
        </button>

        <div className="mx-auto flex w-full max-w-md flex-col items-center pt-4">
          {/* Badge name */}
          <h1 className="animate-fade-in-up mb-8 font-sans text-2xl font-bold tracking-tight text-navy text-center">
            Arbitrum OG Badge
          </h1>

          {/* Badge image / placeholder */}
          <div className="animate-fade-in-up relative h-64 w-64 overflow-hidden rounded-3xl" style={{ animationDelay: "0.1s" }}>
            {hasMinted === null ? (
              /* Loading state */
              <div className="flex h-full w-full items-center justify-center rounded-3xl bg-navy/5">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-arb-blue border-t-transparent" />
              </div>
            ) : hasMinted ? (
              /* Badge image */
              <Image
                src="/badge_image.png"
                alt="Arbitrum OG Badge"
                fill
                className="object-contain"
                priority
              />
            ) : (
              /* Placeholder */
              <div className="flex h-full w-full flex-col items-center justify-center rounded-3xl border border-arb-blue/20 bg-gradient-to-br from-arb-blue/10 via-navy/5 to-arb-blue/15">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-arb-blue/20 bg-white/60 shadow-sm">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-arb-blue/50">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="font-sans text-sm font-semibold text-navy/60">Badge not minted yet</p>
                <p className="mt-1 font-sans text-xs text-navy/35">Pass the quiz to earn it</p>
              </div>
            )}
          </div>

          {/* OpenSea button */}
          <div className="animate-fade-in-up mt-8 w-full" style={{ animationDelay: "0.2s" }}>
            <button
              type="button"
              onClick={handleOpenSea}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-navy/10 bg-white/80 px-8 py-4 font-sans text-base font-semibold text-navy shadow-sm backdrop-blur-sm transition-all hover:border-navy/20 hover:bg-white hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-60">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              View on OpenSea
            </button>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  )
}
