import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function POST(request: Request) {
  let body: { walletAddress: string; transactionHash: string; tokenId: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const { walletAddress, transactionHash, tokenId } = body

  if (!walletAddress || !transactionHash) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("mints").insert({
    wallet_address: walletAddress.toLowerCase(),
    transaction_hash: transactionHash,
    token_id: tokenId ? Number(tokenId) : 1,
  })

  if (error) {
    return NextResponse.json({ error: "Failed to record mint" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
