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
  event: "frame_added" | "frame_removed" | "notifications_enabled" | "notifications_disabled"
  notificationDetails?: NotificationDetails
}

function base64urlDecode(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(str.length + ((4 - (str.length % 4)) % 4), "=")
  return Buffer.from(padded, "base64").toString("utf-8")
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

  const fid = header.fid
  if (!fid) {
    return NextResponse.json({ error: "Missing fid" }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()

  switch (payload.event) {
    case "frame_added":
    case "notifications_enabled": {
      // Store or update the notification token for this user
      if (payload.notificationDetails) {
        const { token, url } = payload.notificationDetails
        await supabase
          .from("notification_tokens")
          .upsert({ fid, token, url }, { onConflict: "fid" })
      }
      break
    }

    case "frame_removed":
    case "notifications_disabled": {
      // Remove the notification token — user no longer reachable
      await supabase.from("notification_tokens").delete().eq("fid", fid)
      break
    }
  }

  return NextResponse.json({ success: true })
}
