"use client"

import { useState, useCallback } from "react"
import { SplashScreen } from "@/components/screens/splash-screen"
import { WelcomeScreen } from "@/components/screens/welcome-screen"
import { RulesScreen } from "@/components/screens/rules-screen"
import { QuizScreen } from "@/components/screens/quiz-screen"
import { CalculatingScreen } from "@/components/screens/calculating-screen"
import { ResultsPassScreen } from "@/components/screens/results-pass-screen"
import { ResultsFailScreen } from "@/components/screens/results-fail-screen"
import { MintSuccessScreen } from "@/components/screens/mint-success-screen"
import { quizQuestions } from "@/lib/quiz-data"

type ScreenName =
  | "splash"
  | "welcome"
  | "rules"
  | "quiz"
  | "calculating"
  | "results-pass"
  | "results-fail"
  | "mint-success"

const PASS_THRESHOLD = 14
const TOTAL_QUESTIONS = 20

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("splash")
  const [score, setScore] = useState(0)

  const handleQuizComplete = useCallback(
    (finalScore: number) => {
      setScore(finalScore)
      setCurrentScreen("calculating")
    },
    []
  )

  const handleCalculationComplete = useCallback(() => {
    if (score >= PASS_THRESHOLD) {
      setCurrentScreen("results-pass")
    } else {
      setCurrentScreen("results-fail")
    }
  }, [score])

  const handleRetry = useCallback(() => {
    setScore(0)
    setCurrentScreen("rules")
  }, [])

  const handleExit = useCallback(() => {
    setScore(0)
    setCurrentScreen("welcome")
  }, [])

  const handleMintAndShare = useCallback(() => {
    // In a real app this would trigger wallet connect + mint tx
    setCurrentScreen("mint-success")
  }, [])

  return (
    <main>
      {currentScreen === "splash" && (
        <SplashScreen onComplete={() => setCurrentScreen("welcome")} />
      )}

      {currentScreen === "welcome" && (
        <WelcomeScreen onStart={() => setCurrentScreen("rules")} />
      )}

      {currentScreen === "rules" && (
        <RulesScreen
          onStart={() => setCurrentScreen("quiz")}
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "quiz" && (
        <QuizScreen
          questions={quizQuestions.slice(0, TOTAL_QUESTIONS)}
          onComplete={handleQuizComplete}
        />
      )}

      {currentScreen === "calculating" && (
        <CalculatingScreen onComplete={handleCalculationComplete} />
      )}

      {currentScreen === "results-pass" && (
        <ResultsPassScreen
          score={score}
          total={TOTAL_QUESTIONS}
          onMintAndShare={handleMintAndShare}
        />
      )}

      {currentScreen === "results-fail" && (
        <ResultsFailScreen
          score={score}
          total={TOTAL_QUESTIONS}
          onRetry={handleRetry}
          onExit={handleExit}
        />
      )}

      {currentScreen === "mint-success" && (
        <MintSuccessScreen onExit={handleExit} />
      )}
    </main>
  )
}
