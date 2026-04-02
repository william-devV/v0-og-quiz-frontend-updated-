"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useAccount, useConnect, useWriteContract } from "wagmi"
import { SplashScreen } from "@/components/screens/splash-screen"
import { WelcomeScreen } from "@/components/screens/welcome-screen"
import { RulesScreen } from "@/components/screens/rules-screen"
import { QuizScreen } from "@/components/screens/quiz-screen"
import { CalculatingScreen } from "@/components/screens/calculating-screen"
import { ResultsPassScreen } from "@/components/screens/results-pass-screen"
import { ResultsFailScreen } from "@/components/screens/results-fail-screen"
import { MintSuccessScreen } from "@/components/screens/mint-success-screen"
import { ReviewAnswersScreen } from "@/components/screens/review-answers-screen"
import { BADGE_NFT_ABI, CONTRACT_ADDRESS, MINT_PRICE } from "@/lib/contract"
import type { QuizQuestion, RawAnswer } from "@/components/screens/quiz-screen"

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

const TOTAL_QUESTIONS = 20

interface ReviewAnswer {
  question: string
  options: string[]
  correctIndex: number
  selectedIndex: number | null
}

interface SubmitResult {
  score: number
  passed: boolean
  percentage: number
  reviewAnswers: ReviewAnswer[]
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("splash")
  const [score, setScore] = useState(0)
  const [hasMinted, setHasMinted] = useState(false)
  const [userAnswers, setUserAnswers] = useState<ReviewAnswer[]>([])
  const [reviewFrom, setReviewFrom] = useState<"fail" | "pass">("fail")
  const [mintTxHash, setMintTxHash] = useState<string | null>(null)
  const [isMinting, setIsMinting] = useState(false)
  const [mintError, setMintError] = useState<string | null>(null)

  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [quizToken, setQuizToken] = useState("")
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false)
  const [quizLoadError, setQuizLoadError] = useState(false)

  // Coordinate the calculating animation and the submit API response
  const submitResultRef = useRef<SubmitResult | null>(null)
  const [submitReady, setSubmitReady] = useState(false)
  const [calculatingDone, setCalculatingDone] = useState(false)

  const { address: walletAddress } = useAccount()
  const { connectAsync, connectors } = useConnect()
  const { writeContractAsync } = useWriteContract()

  // Navigate to results once both the animation and the API call are done
  useEffect(() => {
    if (!calculatingDone || !submitReady) return
    const result = submitResultRef.current!
    setScore(result.score)
    setUserAnswers(result.reviewAnswers)
    setCurrentScreen(result.passed ? "results-pass" : "results-fail")
  }, [calculatingDone, submitReady])

  // Silently connect wallet when the pass screen appears
  useEffect(() => {
    if (currentScreen !== "results-pass" || walletAddress) return
    connectAsync({ connector: connectors[0] }).catch(() => {})
  }, [currentScreen, walletAddress, connectAsync, connectors])

  const handleStartQuiz = useCallback(async () => {
    setIsLoadingQuiz(true)
    setQuizLoadError(false)
    try {
      const res = await fetch("/api/questions")
      const data = await res.json()
      setQuizQuestions(data.questions)
      setQuizToken(data.token)
      setCurrentScreen("quiz")
    } catch {
      setQuizLoadError(true)
    } finally {
      setIsLoadingQuiz(false)
    }
  }, [])

  const handleQuizComplete = useCallback(
    async (answers: RawAnswer[]) => {
      setCurrentScreen("calculating")
      setSubmitReady(false)
      setCalculatingDone(false)
      submitResultRef.current = null

      try {
        const res = await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers,
            token: quizToken,
            walletAddress: walletAddress ?? undefined,
          }),
        })
        const result: SubmitResult = await res.json()
        submitResultRef.current = result
        setSubmitReady(true)
      } catch {
        submitResultRef.current = {
          score: 0,
          passed: false,
          percentage: 0,
          reviewAnswers: [],
        }
        setSubmitReady(true)
      }
    },
    [quizToken, walletAddress]
  )

  const handleCalculationComplete = useCallback(() => {
    setCalculatingDone(true)
  }, [])

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

  const parseMintError = (err: unknown): string => {
    const msg = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase()
    if (msg.includes("rejected") || msg.includes("denied") || msg.includes("cancelled") || msg.includes("user refused")) {
      return "Transaction cancelled."
    }
    if (msg.includes("insufficient") || msg.includes("funds") || msg.includes("balance") || msg.includes("exceeds")) {
      return "Insufficient funds. You need 0.0005 ETH + gas on Arbitrum."
    }
    if (msg.includes("already minted") || msg.includes("hasminted")) {
      return "This wallet has already minted."
    }
    if (msg.includes("expired") || msg.includes("expiry")) {
      return "Authorization expired. Please try again."
    }
    if (msg.includes("network") || msg.includes("timeout") || msg.includes("fetch")) {
      return "Network error. Check your connection and try again."
    }
    return "Mint failed. Please try again."
  }

  const handleMintAndShare = useCallback(async () => {
    setIsMinting(true)
    setMintError(null)
    try {
      // Connect wallet on demand if not already connected
      let address = walletAddress
      if (!address) {
        const result = await connectAsync({ connector: connectors[0] })
        address = result.accounts[0]
      }
      if (!address) {
        setMintError("Could not connect wallet. Please try again.")
        setTimeout(() => setMintError(null), 4000)
        setIsMinting(false)
        return
      }
      // Get authorization signature from server
      const authRes = await fetch("/api/mint/authorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: address }),
      })

      if (!authRes.ok) {
        const err = await authRes.json()
        const message = err.error === "Already minted"
          ? "This wallet has already minted."
          : err.error ?? "Authorization failed. Please try again."
        setMintError(message)
        setTimeout(() => setMintError(null), 4000)
        setIsMinting(false)
        return
      }

      const { tokenId, nonce, expiry, signature } = await authRes.json()

      // Call the contract
      const txHash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: BADGE_NFT_ABI,
        functionName: "mint",
        args: [BigInt(tokenId), nonce as `0x${string}`, BigInt(expiry), signature as `0x${string}`],
        value: MINT_PRICE,
      })

      // Record the mint in Supabase (best-effort — don't block on failure)
      fetch("/api/mint/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: address, transactionHash: txHash, tokenId }),
      }).catch(() => {})

      setMintTxHash(txHash)
      setCurrentScreen("mint-success")
    } catch (err) {
      console.error("Mint failed:", err)
      const message = parseMintError(err)
      setMintError(message)
      setTimeout(() => setMintError(null), 4000)
    } finally {
      setIsMinting(false)
    }
  }, [walletAddress, connectAsync, connectors, writeContractAsync])

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
    setCurrentScreen(reviewFrom === "fail" ? "results-fail" : "results-pass")
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
          onStart={handleStartQuiz}
          onBack={() => setCurrentScreen("welcome")}
          isLoading={isLoadingQuiz}
          loadError={quizLoadError}
        />
      )}

      {currentScreen === "quiz" && (
        <QuizScreen
          questions={quizQuestions}
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
          isMinting={isMinting}
          mintError={mintError}
          onMintAndShare={handleMintAndShare}
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
        <MintSuccessScreen
          txHash={mintTxHash ?? ""}
          onExit={handleMintDismiss}
        />
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
