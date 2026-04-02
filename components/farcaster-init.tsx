"use client"

import { useEffect } from "react"
import { sdk } from "@farcaster/miniapp-sdk"

export function FarcasterInit() {
  useEffect(() => {
    sdk.actions.ready()
    const timer = setTimeout(() => {
      sdk.actions.addFrame().catch(() => {})
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return null
}
