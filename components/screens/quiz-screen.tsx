"use client"

import { useState, useEffect, useCallback } from "react"
import { AnimatedBackground } from "@/components/animated-background"

export interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
}

interface QuizScreenProps {
  questions: QuizQuestion[]
  onComplete: (score: number) => void
}

const TIMER_SECONDS = 15

const labels = ["A", "B", "C", "D"]

function getTimerColor(seconds: number): string {
  if (seconds > 10) return "border-navy/30 bg-white text-navy"
  if (seconds > 5) return "border-arb-blue bg-arb-blue-light text-arb-blue"
  if (seconds > 3) return "border-timer-amber bg-amber-50 text-timer-amber"
  return "border-timer-red bg-red-50 text-timer-red"
}

function getTimerBarColor(seconds: number): string {
  if (seconds > 10) return "bg-arb-blue"
  if (seconds > 5) return "bg-arb-blue"
  if (seconds > 3) return "bg-timer-amber"
  return "bg-timer-red"
}

export function QuizScreen({ questions, onComplete }: QuizScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)

  const totalQuestions = questions.length
  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex) / totalQuestions) * 100
  const timerPercent = (timeLeft / TIMER_SECONDS) * 100

  const handleNext = useCallback(() => {
    const newScore =
      selectedAnswer === currentQuestion.correctIndex ? score + 1 : score

    if (selectedAnswer === currentQuestion.correctIndex) {
      setScore(newScore)
    }

    if (currentIndex + 1 >= totalQuestions) {
      onComplete(newScore)
    } else {
      setCurrentIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setTimeLeft(TIMER_SECONDS)
    }
  }, [selectedAnswer, currentQuestion.correctIndex, score, currentIndex, totalQuestions, onComplete])

  useEffect(() => {
    if (timeLeft <= 0) {
      handleNext()
      return
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft, handleNext])

  return (
    <AnimatedBackground variant="light">
      <div className="flex min-h-[100dvh] flex-col">
        {/* Top bar */}
        <div className="border-b-3 border-black bg-navy px-4 pt-4 pb-3">
          <div className="mx-auto flex w-full max-w-md items-center justify-between gap-3">
            <span className="shrink-0 font-sans text-xs font-bold text-white">
              {currentIndex + 1}/{totalQuestions}
            </span>
            <div className="h-2 flex-1 overflow-hidden border border-white/20 bg-navy-dark">
              <div
                className="h-full bg-arb-blue transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quiz content */}
        <div className="flex flex-1 flex-col items-center px-4 pt-6 pb-8">
          <div className="mx-auto w-full max-w-md">
            {/* Timer */}
            <div className="mb-6 flex flex-col items-center gap-2">
              <div
                className={`flex h-16 w-16 items-center justify-center border-3 font-sans text-2xl font-bold transition-colors duration-300 ${getTimerColor(timeLeft)}`}
              >
                {timeLeft}
              </div>
              <div className="h-1.5 w-32 overflow-hidden border border-navy/20 bg-muted">
                <div
                  className={`h-full transition-all duration-1000 ease-linear ${getTimerBarColor(timeLeft)}`}
                  style={{ width: `${timerPercent}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-6 border-3 border-black bg-white p-5 shadow-[4px_4px_0px_0px_#000000]">
              <p className="font-sans text-lg font-bold leading-relaxed text-navy text-balance">
                {currentQuestion.question}
              </p>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-2.5">
              {currentQuestion.options.map((option, i) => {
                const isSelected = selectedAnswer === i
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedAnswer(i)}
                    className={`flex w-full items-center gap-3 border-3 px-4 py-3 text-left font-sans text-sm font-medium transition-all ${
                      isSelected
                        ? "border-black bg-arb-blue text-white shadow-[2px_2px_0px_0px_#000000]"
                        : "border-black bg-white text-navy shadow-[3px_3px_0px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000000]"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center border-2 font-sans text-xs font-bold ${
                        isSelected
                          ? "border-white bg-white text-arb-blue"
                          : "border-navy bg-navy/5 text-navy"
                      }`}
                    >
                      {labels[i]}
                    </span>
                    {option}
                  </button>
                )
              })}
            </div>

            {/* Next button */}
            <div className="mt-6">
              <button
                onClick={handleNext}
                disabled={selectedAnswer === null}
                className="w-full border-3 border-black bg-navy px-8 py-3 font-sans text-base font-bold text-white shadow-[4px_4px_0px_0px_#000000] transition-all enabled:hover:translate-x-[2px] enabled:hover:translate-y-[2px] enabled:hover:shadow-[2px_2px_0px_0px_#000000] enabled:active:translate-x-[4px] enabled:active:translate-y-[4px] enabled:active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {currentIndex + 1 >= totalQuestions ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  )
}
