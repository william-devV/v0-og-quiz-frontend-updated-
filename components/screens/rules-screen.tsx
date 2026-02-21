"use client"

import { useState } from "react"
import { AnimatedBackground } from "@/components/animated-background"

interface RulesScreenProps {
  onStart: () => void
  onBack: () => void
}

const rules = [
  "20 questions",
  "15 seconds per question",
  "Single correct answer per question",
  "No going back once answered",
  "70% (14/20) to pass",
  "Quiz auto-submits when time expires",
]

export function RulesScreen({ onStart, onBack }: RulesScreenProps) {
  const [accepted, setAccepted] = useState(false)

  return (
    <AnimatedBackground variant="light">
      <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-8">
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-2xl border border-navy/10 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
            <h2 className="mb-6 font-sans text-2xl font-bold text-navy">
              Rules
            </h2>

            <ul className="flex flex-col gap-3">
              {rules.map((rule, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 font-sans text-sm text-navy"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-arb-blue font-sans text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  {rule}
                </li>
              ))}
            </ul>

            <label className="mt-8 flex cursor-pointer items-center gap-3 border-t border-navy/8 pt-6">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-md border-2 border-navy/20 bg-white checked:border-arb-blue checked:bg-arb-blue transition-colors"
              />
              <span className="font-sans text-sm font-medium text-navy">
                I understand the rules
              </span>
            </label>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={onStart}
                disabled={!accepted}
                className="w-full rounded-xl bg-arb-blue px-8 py-3.5 font-sans text-base font-bold text-white shadow-md shadow-arb-blue/20 transition-all enabled:hover:-translate-y-0.5 enabled:hover:shadow-lg enabled:hover:shadow-arb-blue/25 enabled:active:translate-y-0 enabled:active:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {"Let's Go"}
              </button>

              <button
                onClick={onBack}
                className="font-sans text-sm text-navy/40 underline underline-offset-4 transition-colors hover:text-navy"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  )
}
