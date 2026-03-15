import crypto from "crypto"

export function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function getSecret(): string {
  const secret = process.env.QUIZ_TOKEN_SECRET
  if (!secret) throw new Error("QUIZ_TOKEN_SECRET is not set")
  return secret
}

// Token format: base64(payload).hex(hmac-sha256)
// Base64 never contains "." so the split is unambiguous.

export function signToken(payload: object): string {
  const data = JSON.stringify({ ...payload, exp: Date.now() + 30 * 60 * 1000 })
  const encoded = Buffer.from(data).toString("base64")
  const sig = crypto.createHmac("sha256", getSecret()).update(encoded).digest("hex")
  return `${encoded}.${sig}`
}

export function verifyToken(token: string): Record<string, unknown> | null {
  const dotIndex = token.indexOf(".")
  if (dotIndex === -1) return null

  const encoded = token.slice(0, dotIndex)
  const sig = token.slice(dotIndex + 1)

  const expectedSig = crypto.createHmac("sha256", getSecret()).update(encoded).digest("hex")

  const expectedBuf = Buffer.from(expectedSig)
  const actualBuf = Buffer.from(sig)
  if (expectedBuf.length !== actualBuf.length) return null
  if (!crypto.timingSafeEqual(expectedBuf, actualBuf)) return null

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64").toString()
    ) as Record<string, unknown>
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}
