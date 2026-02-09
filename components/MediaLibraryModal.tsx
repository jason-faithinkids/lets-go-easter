"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type BackgroundOption = { id: string; url: string; day: number | null }
type ImageOption = { id: string; url: string; label: string }

type MediaLibraryModalProps = {
  open: boolean
  onClose: () => void
  type: "background" | "item"
  onSelect: (value: string) => void
  title?: string
}

export function MediaLibraryModal({
  open,
  onClose,
  type,
  onSelect,
  title,
}: MediaLibraryModalProps) {
  const [items, setItems] = useState<BackgroundOption[] | ImageOption[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    const url = type === "background" ? "/api/uploads/backgrounds" : "/api/uploads/items"
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setItems(data)
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [open, type])

  const handleSelect = (value: string) => {
    onSelect(value)
    onClose()
  }

  const displayTitle = title ?? (type === "background" ? "Choose background image" : "Choose item image")

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{displayTitle}</DialogTitle>
          <DialogDescription>
            Click an image to use it. Upload new images from the main admin page.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="py-8 text-center text-sm text-slate-500">Loading…</div>
        ) : items.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-500">
            No images in library yet. Upload images in the admin section above.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {items.map((item) => {
              const id = "id" in item ? item.id : (item as ImageOption).id
              const url = "url" in item ? item.url : (item as ImageOption).url
              const label = "label" in item ? (item as ImageOption).label : (item as BackgroundOption).id
              const value = type === "background" ? (item as BackgroundOption).id : url
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleSelect(value)}
                  className="flex flex-col items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/50 p-2 transition-colors hover:border-[#4CAF50] hover:bg-green-50/50 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                >
                  <div className="relative h-20 w-full overflow-hidden rounded-md border bg-white">
                    <Image
                      src={url}
                      alt={label}
                      fill
                      className="object-contain"
                      sizes="120px"
                    />
                  </div>
                  <span className="w-full truncate text-center text-xs text-slate-600">
                    {label}
                  </span>
                </button>
              )
            })}
          </div>
        )}
        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
