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
import { ReviewAnswersScreen } from "@/components/screens/review-answers-screen"
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
  | "review-answers"

const PASS_THRESHOLD = 14
const TOTAL_QUESTIONS = 20

interface QuestionAnswer {
  question: string
  options: string[]
  correctIndex: number
  selectedIndex: number | null
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("splash")
  const [score, setScore] = useState(0)
  const [hasMinted, setHasMinted] = useState(false)
  const [userAnswers, setUserAnswers] = useState<QuestionAnswer[]>([])
  const [reviewFrom, setReviewFrom] = useState<"fail" | "pass">("fail")

  const handleQuizComplete = useCallback(
    (finalScore: number, answers: QuestionAnswer[]) => {
      setScore(finalScore)
      setUserAnswers(answers)
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
    setHasMinted(false)
    setCurrentScreen("rules")
  }, [])

  const handleExit = useCallback(() => {
    setScore(0)
    setHasMinted(false)
    setCurrentScreen("welcome")
  }, [])

  const handleMintAndShare = useCallback(() => {
    // In a real app this would trigger wallet connect + mint tx
    setCurrentScreen("mint-success")
  }, [])

  const handleMintDismiss = useCallback(() => {
    setHasMinted(true)
    setCurrentScreen("results-pass")
  }, [])

  const handleReviewFromFail = useCallback(() => {
    setReviewFrom("fail")
    setCurrentScreen("review-answers")
  }, [])

  const handleReviewFromPass = useCallback(() => {
    setReviewFrom("pass")
    setCurrentScreen("review-answers")
  }, [])

  const handleBackFromReview = useCallback(() => {
    if (reviewFrom === "fail") {
      setCurrentScreen("results-fail")
    } else {
      setCurrentScreen("results-pass")
    }
  }, [reviewFrom])

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
          hasMinted={hasMinted}
          onMintAndShare={handleMintAndShare}
          onReview={handleReviewFromPass}
        />
      )}

      {currentScreen === "results-fail" && (
        <ResultsFailScreen
          score={score}
          total={TOTAL_QUESTIONS}
          onRetry={handleRetry}
          onExit={handleExit}
          onReview={handleReviewFromFail}
        />
      )}

      {currentScreen === "mint-success" && (
        <MintSuccessScreen onExit={handleMintDismiss} />
      )}

      {currentScreen === "review-answers" && (
        <ReviewAnswersScreen
          questions={userAnswers}
          onBack={handleBackFromReview}
        />
      )}
    </main>
  )
}
