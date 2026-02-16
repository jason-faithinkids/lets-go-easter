import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { existsSync } from "fs"
import { readFile } from "fs/promises"

// 1. Corrected Import Syntax
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs"
// Use * as for the worker as well
import * as PDFJSWorker from "pdfjs-dist/legacy/build/pdf.worker.mjs"

const cache = new Map<string, Buffer>()

export async function GET(request: NextRequest) {
  // 2. The "Direct Injection" Fix
  // Instead of workerSrc (a string path), we provide the worker logic directly
  if (!(pdfjs.GlobalWorkerOptions as any).workerPort) {
    try {
      (pdfjs.GlobalWorkerOptions as any).workerPort = new (PDFJSWorker as any)();
    } catch (e) {
      console.warn("WorkerPort initialization failed, falling back to src:", e);
      (pdfjs.GlobalWorkerOptions as any).workerSrc = ""; 
    }
  }

  const url = request.nextUrl.searchParams.get("url")
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 })

  const decoded = decodeURIComponent(url)
  const relativePath = decoded.replace(/^\//, "")
  const filePath = path.join(process.cwd(), "public", relativePath)

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }

  const cacheKey = decoded
  if (cache.has(cacheKey)) {
    return new NextResponse(cache.get(cacheKey), {
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
    })
  }

  try {
  const pdfBuffer = await readFile(filePath);
  
  // 1. Import the converter and the better canvas engine
  const { pdf } = await import("pdf-to-img");
  const { createCanvas } = await import("@napi-rs/canvas");

  // 2. Pass the custom canvas factory to pdf-to-img
  // This avoids the 'Cairo' requirement on your server
  const document = await pdf(pdfBuffer, { 
    scale: 2,
    factory: (width: number, height: number) => {
      const canvas = createCanvas(width, height);
      const context = canvas.getContext("2d");
      return { canvas, context };
    }
  });
  
  let firstPage: Buffer | null = null;
  for await (const page of document) {
    firstPage = page as Buffer;
    break; 
  }

  if (!firstPage) throw new Error("No pages rendered");

  cache.set(cacheKey, firstPage);
  return new NextResponse(firstPage, {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
  });
} catch (e) {
    console.error("PDF Preview Error:", e)
    return NextResponse.json({ 
      error: "Generation failed", 
      details: e instanceof Error ? e.message : String(e) 
    }, { status: 500 })
  }
}