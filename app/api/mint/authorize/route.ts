import { NextResponse } from "next/server"
import { encodePacked, keccak256 } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { CONTRACT_ADDRESS, BADGE_ID } from "@/lib/contract"

export async function POST(request: Request) {
  let body: { walletAddress: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const { walletAddress } = body

  if (!walletAddress || !/^0x[0-9a-fA-F]{40}$/.test(walletAddress)) {
    return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 })
  }

  const signerKey = process.env.MINT_SIGNER_PRIVATE_KEY
  if (!signerKey) {
    return NextResponse.json({ error: "Signer not configured" }, { status: 500 })
  }

  const supabase = createServerSupabaseClient()
  const normalized = walletAddress.toLowerCase()

  // Verify the wallet has a passing attempt
  const { data: attempt } = await supabase
    .from("attempts")
    .select("id")
    .ilike("wallet_address", normalized)
    .eq("passed", true)
    .limit(1)
    .maybeSingle()

  if (!attempt) {
    return NextResponse.json(
      { error: "No passing attempt found for this wallet" },
      { status: 403 }
    )
  }

  // Reject if already minted
  const { data: existingMint } = await supabase
    .from("mints")
    .select("id")
    .ilike("wallet_address", normalized)
    .limit(1)
    .maybeSingle()

  if (existingMint) {
    return NextResponse.json({ error: "Already minted" }, { status: 409 })
  }

  // Generate a random 32-byte nonce and a 5-minute expiry
  const nonceBytes = crypto.getRandomValues(new Uint8Array(32))
  const nonce = ("0x" +
    Array.from(nonceBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")) as `0x${string}`
  const expiry = BigInt(Math.floor(Date.now() / 1000) + 300)

  // Hash matches the contract: keccak256(abi.encodePacked(minter, tokenId, nonce, expiry, contract))
  const messageHash = keccak256(
    encodePacked(
      ["address", "uint256", "bytes32", "uint256", "address"],
      [walletAddress as `0x${string}`, BADGE_ID, nonce, expiry, CONTRACT_ADDRESS]
    )
  )

  // personal_sign adds the \x19Ethereum Signed Message:\n32 prefix — matches ECDSA.toEthSignedMessageHash in contract
  const account = privateKeyToAccount(signerKey as `0x${string}`)
  const signature = await account.signMessage({ message: { raw: messageHash } })

  return NextResponse.json({
    tokenId: BADGE_ID.toString(),
    nonce,
    expiry: expiry.toString(),
    signature,
  })
}
