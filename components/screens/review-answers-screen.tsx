"use client"

import { useState } from "react"
import { AnimatedBackground } from "@/components/animated-background"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ReviewQuestion {
  question: string
  options: string[]
  correctIndex: number
  selectedIndex: number | null
}

interface ReviewAnswersScreenProps {
  questions: ReviewQuestion[]
  onBack: () => void
}

export function ReviewAnswersScreen({
  questions,
  onBack,
}: ReviewAnswersScreenProps) {
  const correctCount = questions.filter(
    (q) => q.selectedIndex === q.correctIndex
  ).length

  const percentage = Math.round((correctCount / questions.length) * 100)

  return (
    <AnimatedBackground variant="light">
      <div className="flex min-h-[100dvh] flex-col">
        {/* Header */}
        <div className="border-b border-navy/10 bg-white/80 px-4 py-4 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-md items-center justify-between gap-3">
            <button
              onClick={onBack}
              className="font-sans text-sm font-bold text-arb-blue hover:text-arb-blue/80 transition-colors"
            >
              ← Back
            </button>
            <h2 className="font-sans text-lg font-bold text-navy">
              Review Answers
            </h2>
            <div className="w-12" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col items-center px-4 py-6 pb-8">
          <div className="mx-auto w-full max-w-md">
            {/* Summary */}
            <div className="mb-6 flex items-center justify-center gap-3 rounded-xl bg-arb-blue/10 border border-arb-blue/20 px-5 py-3">
              <span className="font-sans text-xs font-medium text-navy/50 uppercase tracking-widest">Score</span>
              <span className="font-sans text-base font-bold text-arb-blue">
                {correctCount} / {questions.length} — {percentage}%
              </span>
            </div>

            {/* Questions list */}
            <ScrollArea className="h-[calc(100dvh-300px)]">
              <div className="space-y-3 pr-4">
                {questions.map((question, idx) => {
                  const isCorrect = question.selectedIndex === question.correctIndex
                  const unanswered = question.selectedIndex === null

                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl border-2 p-4 transition-colors ${
                        unanswered
                          ? "border-navy/10 bg-white/90"
                          : isCorrect
                            ? "border-green-200 bg-green-50/60"
                            : "border-red-200 bg-red-50/60"
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <span className="shrink-0 font-sans text-xs font-bold text-navy/40">
                          Q{idx + 1}
                        </span>
                        {!unanswered && (
                          <div
                            className={`shrink-0 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white ${
                              isCorrect ? "bg-green-500" : "bg-red-500"
                            }`}
                          >
                            {isCorrect ? "✓" : "✗"}
                          </div>
                        )}
                      </div>

                      <p className="mb-3 font-sans text-sm font-bold text-navy">
                        {question.question}
                      </p>

                      <div className="space-y-2">
                        {question.options.map((option, optIdx) => {
                          return (
                            <div
                              key={optIdx}
                              className="flex items-start gap-2 rounded-lg px-3 py-2 font-sans text-xs bg-navy/5 text-navy/70"
                            >
                              <span className="shrink-0 font-bold">
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              <span className="flex-1">{option}</span>
                            </div>
                          )
                        })}
                      </div>

                      {unanswered && (
                        <p className="mt-3 font-sans text-xs font-medium text-navy/50 italic">
                          No answer selected
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  )
}
