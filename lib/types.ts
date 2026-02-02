import type { LucideIcon } from "lucide-react"

export type GoodyBagItem = {
  id: string
  label: string
  content: string
  icon: LucideIcon
  embedVideo?: string
  download?: string
  downloadUrl?: string
  link?: string
  image?: string
}
