import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

const UPLOADS_DIR = "public/uploads"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const dayRaw = formData.get("day")

    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json({ error: "Missing file" }, { status: 400 })
    }

    const day = dayRaw != null ? String(dayRaw) : null
    const ext = path.extname(file.name) || ".jpg"
    const safeExt = /^\.(jpg|jpeg|png|gif|webp)$/i.test(ext) ? ext : ".jpg"
    const filename = day ? `background-day-${day}${safeExt}` : `background-${Date.now()}${safeExt}`
    const dir = path.join(process.cwd(), UPLOADS_DIR)
    await mkdir(dir, { recursive: true })
    const filePath = path.join(dir, filename)
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    const url = `/uploads/${filename}`
    return NextResponse.json({ url, filename })
  } catch (e) {
    console.error("POST /api/upload/background", e)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
