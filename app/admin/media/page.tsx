"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ImageIcon, Palette } from "lucide-react"

type BackgroundOption = { id: string; url: string; day: number | null }
type ImageOption = { id: string; url: string; label: string }

export default function AdminMediaPage() {
  const [backgrounds, setBackgrounds] = useState<BackgroundOption[]>([])
  const [itemImages, setItemImages] = useState<ImageOption[]>([])
  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null)

  useEffect(() => {
    fetch("/api/uploads/backgrounds")
      .then((r) => r.json())
      .then(setBackgrounds)
      .catch(() => setBackgrounds([]))
  }, [])

  useEffect(() => {
    fetch("/api/uploads/items")
      .then((r) => r.json())
      .then(setItemImages)
      .catch(() => setItemImages([]))
  }, [])

  const showMessage = (type: "ok" | "err", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const useAsBackground = async (filename: string, day: 1 | 2 | 3) => {
    const key = `backgroundDay${day}` as const
    setSaving(`${key}-${filename}`)
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [key]: filename,
        }),
      })
      if (!res.ok) throw new Error("Save failed")
      showMessage("ok", `Day ${day} background set. Save other settings on the main admin page.`)
    } catch {
      showMessage("err", "Failed to set background.")
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <h1 className="text-xl font-bold text-[#5D4037] sm:text-2xl">Media Library</h1>
          <Link href="/admin">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Back to Admin
            </Button>
          </Link>
        </div>
      </header>

      {message && (
        <div
          className={`mx-4 mt-4 rounded-lg border px-4 py-3 text-sm font-medium sm:mx-6 ${
            message.type === "ok"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <main className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="h-5 w-5 text-[#4CAF50]" />
              Background images
            </CardTitle>
            <CardDescription>
              Upload backgrounds from the main admin page, then use them here for each day. Click &quot;Use for Day N&quot; to set that image as the scene background.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {backgrounds.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">
                No background images yet. Upload some on the{" "}
                <Link href="/admin" className="text-[#4CAF50] underline">
                  admin page
                </Link>
                .
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {backgrounds.map((b) => (
                  <div
                    key={b.id}
                    className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                      <Image
                        src={b.url}
                        alt={b.id}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    </div>
                    <div className="flex flex-wrap gap-1 p-2">
                      {([1, 2, 3] as const).map((day) => (
                        <Button
                          key={day}
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          disabled={saving !== null}
                          onClick={() => useAsBackground(b.id, day)}
                        >
                          Day {day}
                        </Button>
                      ))}
                    </div>
                    <p className="truncate px-2 pb-2 text-xs text-slate-500">{b.id}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ImageIcon className="h-5 w-5 text-[#4CAF50]" />
              Item images
            </CardTitle>
            <CardDescription>
              Use these for findable items (Day 1–3). On the admin page, click &quot;Library&quot; next to an item and choose an image from this list.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {itemImages.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">
                No item images loaded. Default images and uploads appear here.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                {itemImages.map((opt) => (
                  <div
                    key={opt.id}
                    className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-slate-50/50"
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-white">
                      <Image
                        src={opt.url}
                        alt={opt.label}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 33vw, 20vw"
                      />
                    </div>
                    <p className="truncate p-1.5 text-center text-xs text-slate-600" title={opt.id}>
                      {opt.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
