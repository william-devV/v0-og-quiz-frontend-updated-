"use client"

import { useEffect, useRef } from "react"
import { sdk } from "@farcaster/miniapp-sdk"

export function FarcasterInit() {
  const hasPrompted = useRef(false)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    sdk.actions.ready().then(() => {
      if (hasPrompted.current) return
      timer = setTimeout(() => {
        if (hasPrompted.current) return
        hasPrompted.current = true
        sdk.actions.addMiniApp().catch((err) => {
          console.error("[FarcasterInit] addMiniApp failed:", err)
        })
      }, 1500)
    }).catch((err) => {
      console.error("[FarcasterInit] ready() failed:", err)
    })

    return () => clearTimeout(timer)
  }, [])

  return null
}
