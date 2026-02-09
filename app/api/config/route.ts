import { NextResponse } from "next/server"
import { getConfig, setConfig } from "@/lib/config"
import type { SiteConfig, FindableItem } from "@/lib/config"

function normalizeItems(items: FindableItem[] | null | undefined): FindableItem[] | null {
  if (!items?.length) return null
  return items.map((it) => ({
    ...it,
    position: {
      x: Number(it.position?.x) || 50,
      y: Number(it.position?.y) || 50,
    },
  }))
}

export async function GET() {
  try {
    const config = await getConfig()
    const out: SiteConfig = {
      ...config,
      itemsDay1: normalizeItems(config.itemsDay1) ?? config.itemsDay1,
      itemsDay2: normalizeItems(config.itemsDay2) ?? config.itemsDay2,
      itemsDay3: normalizeItems(config.itemsDay3) ?? config.itemsDay3,
    }
    return NextResponse.json(out)
  } catch (e) {
    console.error("GET /api/config", e)
    return NextResponse.json({ error: "Failed to load config" }, { status: 500 })
  }
}

const CONFIG_KEYS: (keyof SiteConfig)[] = [
  "listenUrlDay1",
  "listenUrlDay2",
  "listenUrlDay3",
  "backgroundDay1",
  "backgroundDay2",
  "backgroundDay3",
  "itemsDay1",
  "itemsDay2",
  "itemsDay3",
  "imageCreditDay1",
  "imageCreditDay2",
  "imageCreditDay3",
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const updates: Partial<SiteConfig> = {}
    for (const key of CONFIG_KEYS) {
      if (key in body) {
        const v = body[key]
        if (key.startsWith("itemsDay")) {
          updates[key as keyof SiteConfig] = Array.isArray(v) ? v : null
        } else {
          updates[key as keyof SiteConfig] = v === "" ? null : v
        }
      }
    }
    const config = await setConfig(updates)
    return NextResponse.json(config)
  } catch (e) {
    console.error("POST /api/config", e)
    return NextResponse.json({ error: "Failed to save config" }, { status: 500 })
  }
}
