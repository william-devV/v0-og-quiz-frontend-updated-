import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { verifyToken } from "@/lib/quiz-utils"

const PASS_THRESHOLD = 14
const EXPECTED_ANSWER_COUNT = 20

interface RawAnswer {
  questionId: string
  selectedIndex: number | null
}

interface SubmitBody {
  answers: RawAnswer[]
  token: string
  walletAddress?: string
}

export async function POST(request: Request) {
  let body: SubmitBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const { answers, token, walletAddress } = body

  if (!Array.isArray(answers) || !token) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Require exactly 20 answers
  if (answers.length !== EXPECTED_ANSWER_COUNT) {
    return NextResponse.json(
      { error: `Expected ${EXPECTED_ANSWER_COUNT} answers, got ${answers.length}` },
      { status: 400 }
    )
  }

  // Reject duplicate question IDs
  const submittedIds = answers.map((a) => a.questionId)
  if (new Set(submittedIds).size !== submittedIds.length) {
    return NextResponse.json({ error: "Duplicate question IDs in submission" }, { status: 400 })
  }

  const payload = verifyToken(token)
  if (!payload) {
    return NextResponse.json({ error: "Invalid or expired quiz token" }, { status: 400 })
  }

  const maps = payload.maps as Record<string, string[]>
  const tokenQuestionIds = payload.questionIds as string[]

  // Verify submitted IDs exactly match the token's question set (order-independent)
  const tokenIdSet = new Set(tokenQuestionIds)
  const submittedIdSet = new Set(submittedIds)
  const idsMatch =
    tokenIdSet.size === submittedIdSet.size &&
    submittedIds.every((id) => tokenIdSet.has(id))

  if (!idsMatch) {
    return NextResponse.json(
      { error: "Submitted question IDs do not match the issued quiz" },
      { status: 400 }
    )
  }

  const supabase = createServerSupabaseClient()
  const { data: questions, error: fetchError } = await supabase
    .from("questions")
    .select("id, question_text, option_a, option_b, option_c, option_d, correct_option")
    .in("id", submittedIds)

  if (fetchError || !questions) {
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
  }

  const questionMap = Object.fromEntries(questions.map((q) => [q.id as string, q]))

  let score = 0

  const reviewAnswers = answers
    .map((answer) => {
      const q = questionMap[answer.questionId]
      if (!q) return null

      const shuffleMap = maps[answer.questionId]
      if (!shuffleMap) return null

      // Reverse-map the selected shuffled index back to the original option letter
      const selectedLetter =
        answer.selectedIndex !== null ? shuffleMap[answer.selectedIndex] : null
      const isCorrect = selectedLetter === q.correct_option
      if (isCorrect) score++

      // Find where the correct answer landed in the shuffled order
      const correctIndex = shuffleMap.indexOf(q.correct_option as string)

      // Reconstruct the shuffled options array (same order the user saw)
      const shuffledOptions = shuffleMap.map(
        (letter) => q[`option_${letter}` as keyof typeof q] as string
      )

      return {
        question: q.question_text as string,
        options: shuffledOptions,
        correctIndex,
        selectedIndex: answer.selectedIndex,
      }
    })
    .filter(Boolean)

  const passed = score >= PASS_THRESHOLD
  const percentage = Math.round((score / answers.length) * 100)

  const { error: insertError } = await supabase.from("attempts").insert({
    wallet_address: walletAddress ?? null,
    score,
    passed,
  })

  if (insertError) {
    return NextResponse.json({ error: "Failed to record attempt" }, { status: 500 })
  }

  return NextResponse.json({ score, passed, percentage, reviewAnswers })
}
