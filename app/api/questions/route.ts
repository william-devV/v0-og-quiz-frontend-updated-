import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { shuffleArray, signToken } from "@/lib/quiz-utils"

const QUESTION_COUNT = 20

export async function GET() {
  const supabase = createServerSupabaseClient()

  const { data: allQuestions, error } = await supabase
    .from("questions")
    .select("id, question_text, option_a, option_b, option_c, option_d, correct_option")

  if (error || !allQuestions) {
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
  }

  // Randomly select QUESTION_COUNT questions
  const selected = shuffleArray(allQuestions).slice(0, QUESTION_COUNT)

  // shuffleMaps[questionId] = array where index i holds the original letter at shuffled position i
  // e.g. ['c', 'a', 'd', 'b'] means shuffled[0] was originally option_c
  const shuffleMaps: Record<string, string[]> = {}

  const questions = selected.map((q) => {
    const options = [
      { letter: "a", text: q.option_a as string },
      { letter: "b", text: q.option_b as string },
      { letter: "c", text: q.option_c as string },
      { letter: "d", text: q.option_d as string },
    ]
    const shuffled = shuffleArray(options)
    shuffleMaps[q.id as string] = shuffled.map((o) => o.letter)

    return {
      id: q.id,
      question: q.question_text,
      options: shuffled.map((o) => o.text),
      // correct_option is intentionally omitted
    }
  })

  const questionIds = questions.map((q) => q.id as string)
  const token = signToken({ maps: shuffleMaps, questionIds })

  return NextResponse.json({ questions, token })
}
