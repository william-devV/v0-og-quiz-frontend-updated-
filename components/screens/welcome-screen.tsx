"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { AnimatedBackground } from "@/components/animated-background"

interface WelcomeScreenProps {
  onStart: () => void
}

interface Stats {
  total: number
  passed: number
  passRate: number
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data: Stats) => setStats(data))
      .catch(() => {})
  }, [])

  const statLabels = stats
    ? [
        `${stats.total.toLocaleString()} attempted`,
        `${stats.passed.toLocaleString()} passed`,
        `Only ${stats.passRate}% make it`,
      ]
    : ["0 attempted", "0 passed", "Only 0% make it"]

  return (
    <AnimatedBackground variant="light">
      <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-10">
        <div className="mx-auto flex w-full max-w-md flex-col items-center">
          {/* Arbitrum Logo */}
          <div className="animate-fade-in-up mb-6">
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl border-2 border-navy/10 shadow-lg">
              <Image
                src="/arbitrum-logo.png"
                alt="Arbitrum logo"
                width={80}
                height={80}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>

          {/* Poster headline — reduced 2 sizes */}
          <div className="animate-fade-in-up text-center" style={{ animationDelay: "0.1s" }}>
            <h1 className="font-sans text-3xl font-bold leading-[1.1] tracking-tight text-navy text-balance sm:text-4xl">
              Are you really an
            </h1>
            <h1 className="mt-1 font-sans text-3xl font-bold leading-[1.1] tracking-tight text-navy text-balance sm:text-4xl">
              Arbitrum OG?
            </h1>
          </div>

          {/* Subtext: "Prove it." */}
          <p
            className="animate-fade-in-up mt-4 font-sans text-xl font-medium italic text-arb-blue sm:text-2xl"
            style={{ animationDelay: "0.2s" }}
          >
            Prove it.
          </p>

          {/* Stats strip */}
          <div
            className="animate-fade-in-up mt-8 flex flex-wrap items-center justify-center gap-2"
            style={{ animationDelay: "0.3s" }}
          >
            {statLabels.map((stat) => (
              <span
                key={stat}
                className="rounded-full border border-navy/12 bg-white/80 px-4 py-1.5 font-sans text-xs font-semibold text-navy/70 shadow-sm backdrop-blur-sm"
              >
                {stat}
              </span>
            ))}
          </div>

          {/* OG Level badge + CTA button */}
          <div
            className="animate-fade-in-up mt-10 flex w-full flex-col items-center gap-3"
            style={{ animationDelay: "0.4s" }}
          >
            <span className="rounded-full border border-arb-blue/20 bg-arb-blue/8 px-4 py-1 font-sans text-[11px] font-bold tracking-widest text-arb-blue uppercase">
              OG Level: MED-EASY
            </span>
            <button
              onClick={onStart}
              className="group relative w-full overflow-hidden rounded-2xl bg-arb-blue px-8 py-5 font-sans text-lg font-bold text-white shadow-lg shadow-arb-blue/25 transition-all hover:shadow-xl hover:shadow-arb-blue/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md"
            >
              <span className="relative z-10">Take the Quiz</span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  )
}
