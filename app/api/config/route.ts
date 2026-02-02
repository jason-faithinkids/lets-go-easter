import { NextResponse } from "next/server"
import { getConfig, setConfig } from "@/lib/config"
import type { SiteConfig } from "@/lib/config"

export async function GET() {
  try {
    const config = await getConfig()
    return NextResponse.json(config)
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
