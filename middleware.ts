import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const COOKIE_NAME = "admin_session"
const MAX_AGE_SEC = 7 * 24 * 60 * 60 // 7 days

async function bufferToHex(buffer: ArrayBuffer): Promise<string> {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

async function verifyTokenEdge(token: string, password: string): Promise<boolean> {
  if (!password || !token) return false
  const dot = token.indexOf(".")
  if (dot === -1) return false
  const t = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const ts = parseInt(t, 10)
  if (Number.isNaN(ts) || ts < Math.floor(Date.now() / 1000) - MAX_AGE_SEC) return false

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(t)
  )
  const expected = await bufferToHex(signature)
  return sig === expected
}

function getTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`))
  return match ? decodeURIComponent(match[1].trim()) : null
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminLogin = pathname === "/admin/login"
  const isAdminPage = pathname.startsWith("/admin")
  const isProtectedApi =
    pathname.startsWith("/api/config") ||
    pathname.startsWith("/api/upload")

  if (!isAdminPage && !isProtectedApi) {
    return NextResponse.next()
  }

  if (pathname === "/api/admin-auth") {
    return NextResponse.next()
  }

  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    return NextResponse.next()
  }

  const token = getTokenFromCookie(request.headers.get("cookie"))
  const valid = token ? await verifyTokenEdge(token, adminPassword) : false

  if (valid) {
    return NextResponse.next()
  }

  if (isAdminPage) {
    if (isAdminLogin) return NextResponse.next()
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  if (isProtectedApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin", "/admin/login", "/admin/media", "/api/upload", "/api/upload/:path*", "/api/admin-auth"],
}
