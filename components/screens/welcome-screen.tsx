"use client"

import { AnimatedBackground } from "@/components/animated-background"

interface WelcomeScreenProps {
  onStart: () => void
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <AnimatedBackground variant="light">
      <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-12">
        <div className="mx-auto flex w-full max-w-md flex-col items-center">
          {/* Logo badge */}
          <div className="mb-10 flex h-16 w-16 items-center justify-center border-3 border-black bg-arb-blue shadow-[3px_3px_0px_0px_#000000]">
            <span className="font-sans text-xl font-bold text-white">OG</span>
          </div>

          {/* Poster headline */}
          <h1 className="font-sans text-5xl font-bold leading-[1.05] tracking-tight text-navy text-balance text-center">
            They said you were an OG.
          </h1>
          <h2 className="mt-2 font-sans text-5xl font-bold leading-[1.05] tracking-tight text-arb-blue text-balance text-center">
            Prove it.
          </h2>

          {/* Info pills — thick-bordered badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
            {[
              { label: "20 questions", accent: false },
              { label: "15s each", accent: true },
              { label: "70% to pass", accent: false },
              { label: "Earn an NFT", accent: true },
            ].map((item) => (
              <span
                key={item.label}
                className={`border-3 border-black px-4 py-1.5 font-sans text-xs font-bold shadow-[2px_2px_0px_0px_#000000] ${
                  item.accent
                    ? "bg-arb-blue text-white"
                    : "bg-navy text-white"
                }`}
              >
                {item.label}
              </span>
            ))}
          </div>

          {/* CTA — the most visually dominant element */}
          <button
            onClick={onStart}
            className="mt-12 w-full border-3 border-black bg-arb-blue px-8 py-5 font-sans text-lg font-bold text-white shadow-[6px_6px_0px_0px_#000000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#000000] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
          >
            Take the Quiz
          </button>

          <button className="mt-5 font-sans text-sm text-navy/40 underline underline-offset-4 transition-colors hover:text-navy">
            What is an OG NFT?
          </button>
        </div>
      </div>
    </AnimatedBackground>
  )
}
