import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"

interface WebhookHeader {
  fid: number
  type: string
  key: string
}

interface NotificationDetails {
  token: string
  url: string
}

interface WebhookPayload {
  event: "miniapp_added" | "miniapp_removed" | "notifications_enabled" | "notifications_disabled"
  notificationDetails?: NotificationDetails
}

function base64urlDecode(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(str.length + ((4 - (str.length % 4)) % 4), "=")
  return Buffer.from(padded, "base64").toString("utf-8")
}

function base64urlToBytes(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(str.length + ((4 - (str.length % 4)) % 4), "=")
  return new Uint8Array(Buffer.from(padded, "base64"))
}

async function verifyEd25519Signature(
  publicKeyHex: string,
  message: Uint8Array,
  signature: Uint8Array
): Promise<boolean> {
  // Strip leading 0x if present
  const hex = publicKeyHex.startsWith("0x") ? publicKeyHex.slice(2) : publicKeyHex
  const keyBytes = new Uint8Array(Buffer.from(hex, "hex"))

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "Ed25519" },
    false,
    ["verify"]
  )

  return crypto.subtle.verify("Ed25519", cryptoKey, signature, message)
}

export async function POST(request: Request) {
  let body: { header: string; payload: string; signature: string }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  if (!body.header || !body.payload || !body.signature) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  let header: WebhookHeader
  let payload: WebhookPayload

  try {
    header = JSON.parse(base64urlDecode(body.header))
    payload = JSON.parse(base64urlDecode(body.payload))
  } catch {
    return NextResponse.json({ error: "Invalid payload encoding" }, { status: 400 })
  }

  // Verify Ed25519 signature: message = "<header>.<payload>" as UTF-8 bytes
  try {
    const message = new TextEncoder().encode(`${body.header}.${body.payload}`)
    const signature = base64urlToBytes(body.signature)
    const valid = await verifyEd25519Signature(header.key, message, signature)
    if (!valid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }
  } catch {
    return NextResponse.json({ error: "Signature verification failed" }, { status: 401 })
  }

  const fid = header.fid
  if (!fid) {
    return NextResponse.json({ error: "Missing fid" }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()

  switch (payload.event) {
    case "miniapp_added":
    case "notifications_enabled": {
      if (payload.notificationDetails) {
        const { token, url } = payload.notificationDetails
        await supabase
          .from("notification_tokens")
          .upsert({ fid, token, url }, { onConflict: "fid" })
      }
      break
    }

    case "miniapp_removed":
    case "notifications_disabled": {
      await supabase.from("notification_tokens").delete().eq("fid", fid)
      break
    }
  }

  return NextResponse.json({ success: true })
}