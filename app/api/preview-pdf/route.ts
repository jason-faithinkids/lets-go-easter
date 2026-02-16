import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { existsSync } from "fs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  const decoded = decodeURIComponent(url);
  const relativePath = decoded.replace(/^\//, "");
  const filePath = path.join(process.cwd(), "public", relativePath);

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  try {
    // DYNAMIC IMPORT: This bypasses all Turbopack/Next.js bundling errors
    const pdf = await import("pdf-img-convert");
    
    // Some versions use .default, others use the name directly
    const converter = (pdf as any).default || pdf;

    const outputImages = await converter.convert(filePath, {
      width: 800,
      page_numbers: [1]
    });

    if (!outputImages || outputImages.length === 0) {
      throw new Error("No pages rendered");
    }

    const imageBuffer = Buffer.from(outputImages[0]);

    return new NextResponse(imageBuffer, {
      headers: { 
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400" 
      },
    });
  } catch (e: any) {
    console.error("PDF_FINAL_ERROR:", e.message);
    return NextResponse.json({ 
      error: "Generation failed", 
      details: e.message 
    }, { status: 500 });
  }
}