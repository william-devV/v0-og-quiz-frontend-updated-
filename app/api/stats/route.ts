import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function GET() {
  const supabase = createServerSupabaseClient()

  const [totalResult, passedResult] = await Promise.all([
    supabase.from("attempts").select("id", { count: "exact", head: true }),
    supabase.from("attempts").select("id", { count: "exact", head: true }).eq("passed", true),
  ])

  const total = totalResult.count ?? 0
  const passed = passedResult.count ?? 0
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0

  return NextResponse.json({ total, passed, passRate })
}
