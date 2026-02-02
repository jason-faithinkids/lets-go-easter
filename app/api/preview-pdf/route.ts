import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { existsSync } from "fs"

const cache = new Map<string, Buffer>()

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Missing url" }, { status: 400 })
  }

  const decoded = decodeURIComponent(url)
  if (!decoded.startsWith("/")) {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 })
  }

  const filePath = path.join(process.cwd(), "public", decoded.replace(/^\//, ""))
  if (!decoded.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "Not a PDF" }, { status: 400 })
  }
  if (!existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }

  const cached = cache.get(decoded)
  if (cached) {
    return new NextResponse(cached, {
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
    })
  }

  try {
    const { default: pdf } = await import("pdf-to-img")
    const doc = await pdf(filePath, { scale: 2 })
    const firstPage = await doc.getPage(1)
    if (!firstPage || !Buffer.isBuffer(firstPage)) {
      return NextResponse.json({ error: "Failed to render PDF" }, { status: 500 })
    }
    cache.set(decoded, firstPage)
    return new NextResponse(firstPage, {
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
    })
  } catch (e) {
    console.error("GET /api/preview-pdf", e)
    return NextResponse.json({ error: "Failed to generate preview" }, { status: 500 })
  }
}
