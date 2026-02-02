import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

const ITEMS_DIR = "public/uploads/items"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const dayRaw = formData.get("day")
    const indexRaw = formData.get("index")

    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json({ error: "Missing file" }, { status: 400 })
    }

    const day = dayRaw != null ? String(dayRaw) : "1"
    const index = indexRaw != null ? String(indexRaw) : Date.now().toString()
    const ext = path.extname(file.name) || ".png"
    const safeExt = /^\.(jpg|jpeg|png|gif|webp)$/i.test(ext) ? ext : ".png"
    const filename = `day-${day}-item-${index}${safeExt}`
    const dir = path.join(process.cwd(), ITEMS_DIR)
    await mkdir(dir, { recursive: true })
    const filePath = path.join(dir, filename)
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    const url = `/uploads/items/${filename}`
    return NextResponse.json({ url, filename })
  } catch (e) {
    console.error("POST /api/upload/item", e)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
