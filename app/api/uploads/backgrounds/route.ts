import { NextResponse } from "next/server"
import { readdir } from "fs/promises"
import path from "path"

const UPLOADS_DIR = "public/uploads"

export async function GET() {
  try {
    const dir = path.join(process.cwd(), UPLOADS_DIR)
    let entries: string[]
    try {
      entries = await readdir(dir)
    } catch {
      return NextResponse.json([])
    }
    const images = entries.filter(
      (f) =>
        f.startsWith("background-") &&
        /\.(jpg|jpeg|png|gif|webp)$/i.test(path.extname(f))
    )
    const list = images.map((filename) => {
      const dayMatch = filename.match(/background-day-(\d)/)
      return {
        id: filename,
        url: `/uploads/${filename}`,
        day: dayMatch ? parseInt(dayMatch[1], 10) : null,
      }
    })
    return NextResponse.json(list)
  } catch (e) {
    console.error("GET /api/uploads/backgrounds", e)
    return NextResponse.json({ error: "Failed to list backgrounds" }, { status: 500 })
  }
}
