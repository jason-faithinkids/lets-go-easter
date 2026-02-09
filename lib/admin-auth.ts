import { createHmac } from "crypto"

const COOKIE_NAME = "admin_session"
const MAX_AGE_SEC = 7 * 24 * 60 * 60 // 7 days

export function createAdminToken(password: string): string {
  const t = Math.floor(Date.now() / 1000).toString()
  const sig = createHmac("sha256", password).update(t).digest("hex")
  return `${t}.${sig}`
}

export function getAdminTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`))
  return match ? decodeURIComponent(match[1]) : null
}

export async function verifyAdminToken(token: string, password: string): Promise<boolean> {
  if (!password || !token) return false
  const dot = token.indexOf(".")
  if (dot === -1) return false
  const t = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const expected = createHmac("sha256", password).update(t).digest("hex")
  if (sig !== expected) return false
  const ts = parseInt(t, 10)
  if (Number.isNaN(ts)) return false
  return ts > Math.floor(Date.now() / 1000) - MAX_AGE_SEC
}

export function adminAuthCookieHeader(token: string, secure = false): string {
  const secureAttr = secure ? "; Secure" : ""
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE_SEC}${secureAttr}`
}

export { COOKIE_NAME }
