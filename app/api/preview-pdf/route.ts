import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { existsSync } from "fs"
import { readFile } from "fs/promises"

// Import the engine
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs"

const cache = new Map<string, Buffer>()

export async function GET(request: NextRequest) {
  // 1. Force Fake Worker for Serverless compatibility
  // This is the most stable way to run on Vercel/Linux
  (pdfjs.GlobalWorkerOptions as any).workerSrc = "";

  const url = request.nextUrl.searchParams.get("url")
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 })

  const decoded = decodeURIComponent(url)
  const relativePath = decoded.replace(/^\//, "")
  const filePath = path.join(process.cwd(), "public", relativePath)

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }

  // Cache Logic
  if (cache.has(decoded)) {
    return new NextResponse(cache.get(decoded), {
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
    })
  }

  try {
    const pdfBuffer = await readFile(filePath)
    
    // 2. Use @napi-rs/canvas which works on Linux without 'brew'
    const { pdf } = await import("pdf-to-img")
    const { createCanvas } = await import("@napi-rs/canvas")

    // 3. Explicitly tell the library to use the NAPI canvas
    const document = await pdf(pdfBuffer, { 
      scale: 2,
      factory: (width: number, height: number) => {
        const canvas = createCanvas(width, height)
        const context = canvas.getContext("2d")
        return { canvas, context }
      }
    })
    
    let firstPage: Buffer | null = null;
    for await (const page of document) {
      firstPage = page as Buffer;
      break; 
    }

    if (!firstPage) throw new Error("No pages rendered");

    cache.set(decoded, firstPage)
    return new NextResponse(firstPage, {
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
    })
  } catch (e: any) {
    console.error("PDF SERVER ERROR:", e.message)
    return NextResponse.json({ error: "Generation failed", details: e.message }, { status: 500 })
  }
}