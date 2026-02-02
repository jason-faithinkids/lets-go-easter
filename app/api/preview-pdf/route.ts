import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { existsSync } from "fs"
import { readFile } from "fs/promises"

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

  const relativePath = decoded.replace(/^\//, "")
  const filePath = path.join(process.cwd(), "public", relativePath)
  if (!decoded.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "Not a PDF" }, { status: 400 })
  }
  if (!existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }

  const cacheKey = decoded
  const cached = cache.get(cacheKey)
  if (cached) {
    return new NextResponse(cached, {
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
    })
  }

  try {
    const pdfBuffer = await readFile(filePath)
    const { default: pdf } = await import("pdf-to-img")
    const doc = await pdf(pdfBuffer, { scale: 2 })
    const firstPage = await doc.getPage(1)
    if (!firstPage || !Buffer.isBuffer(firstPage)) {
      return NextResponse.json({ error: "Failed to render PDF" }, { status: 500 })
    }
    cache.set(cacheKey, firstPage)
    return new NextResponse(firstPage, {
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    console.error("GET /api/preview-pdf", message, e)
    return NextResponse.json(
      {
        error: "Failed to generate preview",
        ...(process.env.NODE_ENV === "development" && { details: message }),
      },
      { status: 500 }
    )
  }
}
