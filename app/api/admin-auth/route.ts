import { NextResponse } from "next/server"
import { createAdminToken, adminAuthCookieHeader, getAdminTokenFromCookie, verifyAdminToken } from "@/lib/admin-auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const password = typeof body.password === "string" ? body.password : ""
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword) {
      return NextResponse.json({ error: "Admin login not configured. Set ADMIN_PASSWORD to enable." }, { status: 503 })
    }

    if (password !== adminPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    const token = createAdminToken(adminPassword)
    const headers = new Headers()
    headers.append("Set-Cookie", adminAuthCookieHeader(token, process.env.NODE_ENV === "production"))

    return new NextResponse(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...Object.fromEntries(headers) },
    })
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 })
  }
}

export async function GET(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    return NextResponse.json({ ok: false, configured: false })
  }
  const cookieHeader = request.headers.get("cookie")
  const token = getAdminTokenFromCookie(cookieHeader)
  const valid = token ? await verifyAdminToken(token, adminPassword) : false
  return NextResponse.json({ ok: valid, configured: true })
}
