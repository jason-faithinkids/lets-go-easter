export type FindableItem = {
  id: number
  name: string
  image: string
  position: { x: number; y: number }
}

export type SiteConfig = {
  listenUrlDay1?: string | null
  listenUrlDay2?: string | null
  listenUrlDay3?: string | null
  backgroundDay1?: string | null
  backgroundDay2?: string | null
  backgroundDay3?: string | null
  itemsDay1?: FindableItem[] | null
  itemsDay2?: FindableItem[] | null
  itemsDay3?: FindableItem[] | null
}

export const DEFAULT_CONFIG: SiteConfig = {
  listenUrlDay1: null,
  listenUrlDay2: null,
  listenUrlDay3: null,
  backgroundDay1: null,
  backgroundDay2: null,
  backgroundDay3: null,
  itemsDay1: null,
  itemsDay2: null,
  itemsDay3: null,
}

const CONFIG_PATH = "data/site-config.json"

export async function getConfig(): Promise<SiteConfig> {
  const fs = await import("fs/promises")
  const path = await import("path")
  const filePath = path.join(process.cwd(), CONFIG_PATH)
  try {
    const data = await fs.readFile(filePath, "utf-8")
    const parsed = JSON.parse(data) as Partial<SiteConfig>
    return { ...DEFAULT_CONFIG, ...parsed }
  } catch {
    return { ...DEFAULT_CONFIG }
  }
}

export async function setConfig(updates: Partial<SiteConfig>): Promise<SiteConfig> {
  const fs = await import("fs/promises")
  const path = await import("path")
  const current = await getConfig()
  const next = { ...current, ...updates }
  const filePath = path.join(process.cwd(), CONFIG_PATH)
  const dir = path.dirname(filePath)
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(next, null, 2), "utf-8")
  return next
}
