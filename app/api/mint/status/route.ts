import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const walletAddress = searchParams.get("wallet")

  if (!walletAddress) {
    return NextResponse.json({ hasMinted: false })
  }

  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from("mints")
    .select("wallet_address")
    .ilike("wallet_address", walletAddress)
    .maybeSingle()

  return NextResponse.json({ hasMinted: !!data })
}
