import { NextResponse } from "next/server"
import { readdir } from "fs/promises"
import path from "path"

const ITEMS_DIR = "public/uploads/items"

const DEFAULT_ITEM_IMAGES = [
  { id: "/images/item-201.png", url: "/images/item-201.png", label: "Default 1" },
  { id: "/images/item-202.png", url: "/images/item-202.png", label: "Default 2" },
  { id: "/images/item-203.png", url: "/images/item-203.png", label: "Default 3" },
]

export async function GET() {
  try {
    const dir = path.join(process.cwd(), ITEMS_DIR)
    let entries: string[] = []
    try {
      entries = await readdir(dir)
    } catch {
      return NextResponse.json([...DEFAULT_ITEM_IMAGES])
    }
    const images = entries.filter((f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(path.extname(f)))
    const list = [
      ...DEFAULT_ITEM_IMAGES,
      ...images.map((filename) => ({
        id: `/uploads/items/${filename}`,
        url: `/uploads/items/${filename}`,
        label: filename,
      })),
    ]
    return NextResponse.json(list)
  } catch (e) {
    console.error("GET /api/uploads/items", e)
    return NextResponse.json({ error: "Failed to list items" }, { status: 500 })
  }
}
