"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { SiteConfig, FindableItem } from "@/lib/config"
import { Home, Save, Upload, Music, Palette, Search } from "lucide-react"

type BackgroundOption = { id: string; url: string; day: number | null }
type ImageOption = { id: string; url: string; label: string }

const DEFAULT_ITEMS_DAY1: FindableItem[] = [
  { id: 1, name: "Palm Branch", image: "/images/item-201.png", position: { x: 30, y: 20 } },
  { id: 2, name: "Donkey", image: "/images/item-202.png", position: { x: 50, y: 60 } },
  { id: 3, name: "Crown", image: "/images/item-203.png", position: { x: 70, y: 30 } },
  { id: 4, name: "Crowd", image: "/images/item-201.png", position: { x: 25, y: 70 } },
  { id: 5, name: "Cloaks", image: "/images/item-202.png", position: { x: 60, y: 50 } },
]
const DEFAULT_ITEMS_DAY2: FindableItem[] = [
  { id: 1, name: "Cross", image: "/images/item-201.png", position: { x: 25, y: 25 } },
  { id: 2, name: "Nails", image: "/images/item-202.png", position: { x: 55, y: 45 } },
  { id: 3, name: "Crown of Thorns", image: "/images/item-203.png", position: { x: 75, y: 20 } },
  { id: 4, name: "Soldier", image: "/images/item-201.png", position: { x: 40, y: 65 } },
  { id: 5, name: "Sign", image: "/images/item-202.png", position: { x: 60, y: 40 } },
]
const DEFAULT_ITEMS_DAY3: FindableItem[] = [
  { id: 1, name: "Cross", image: "/images/item-201.png", position: { x: 20, y: 15 } },
  { id: 2, name: "Green Brick", image: "/images/item-202.png", position: { x: 70, y: 75 } },
  { id: 3, name: "Burial Cloths", image: "/images/item-203.png", position: { x: 45, y: 50 } },
  { id: 4, name: "Golden Cross", image: "/images/item-201.png", position: { x: 85, y: 30 } },
]

export default function AdminPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [backgrounds, setBackgrounds] = useState<BackgroundOption[]>([])
  const [itemImages, setItemImages] = useState<ImageOption[]>([])
  const [listenUrlDay1, setListenUrlDay1] = useState("")
  const [listenUrlDay2, setListenUrlDay2] = useState("")
  const [listenUrlDay3, setListenUrlDay3] = useState("")
  const [backgroundDay1, setBackgroundDay1] = useState("")
  const [backgroundDay2, setBackgroundDay2] = useState("")
  const [backgroundDay3, setBackgroundDay3] = useState("")
  const [itemsDay1, setItemsDay1] = useState<FindableItem[]>(DEFAULT_ITEMS_DAY1)
  const [itemsDay2, setItemsDay2] = useState<FindableItem[]>(DEFAULT_ITEMS_DAY2)
  const [itemsDay3, setItemsDay3] = useState<FindableItem[]>(DEFAULT_ITEMS_DAY3)
  const [uploadDay, setUploadDay] = useState<"1" | "2" | "3">("1")
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null)

  const loadConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/config")
      const c: SiteConfig = await res.json()
      setConfig(c)
      setListenUrlDay1(c.listenUrlDay1 ?? "")
      setListenUrlDay2(c.listenUrlDay2 ?? "")
      setListenUrlDay3(c.listenUrlDay3 ?? "")
      setBackgroundDay1(c.backgroundDay1 ?? "")
      setBackgroundDay2(c.backgroundDay2 ?? "")
      setBackgroundDay3(c.backgroundDay3 ?? "")
      if (c.itemsDay1?.length) setItemsDay1(c.itemsDay1)
      if (c.itemsDay2?.length) setItemsDay2(c.itemsDay2)
      if (c.itemsDay3?.length) setItemsDay3(c.itemsDay3)
    } catch {
      setConfig(null)
    }
  }, [])

  useEffect(() => {
    loadConfig()
  }, [loadConfig])

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
    setTimeout(() => setMessage(null), 4000)
  }

  const handleSaveConfig = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listenUrlDay1: listenUrlDay1 || null,
          listenUrlDay2: listenUrlDay2 || null,
          listenUrlDay3: listenUrlDay3 || null,
          backgroundDay1: backgroundDay1 || null,
          backgroundDay2: backgroundDay2 || null,
          backgroundDay3: backgroundDay3 || null,
          itemsDay1,
          itemsDay2,
          itemsDay3,
        }),
      })
      if (!res.ok) throw new Error("Save failed")
      const c = await res.json()
      setConfig(c)
      showMessage("ok", "All settings saved successfully.")
    } catch {
      showMessage("err", "Failed to save. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleUploadBackground = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append("file", file)
      form.append("day", uploadDay)
      const res = await fetch("/api/upload/background", { method: "POST", body: form })
      if (!res.ok) throw new Error("Upload failed")
      const { filename } = await res.json()
      if (uploadDay === "1") setBackgroundDay1(filename)
      if (uploadDay === "2") setBackgroundDay2(filename)
      if (uploadDay === "3") setBackgroundDay3(filename)
      setBackgrounds((prev) => [...prev, { id: filename, url: `/uploads/${filename}`, day: parseInt(uploadDay, 10) }])
      showMessage("ok", "Background uploaded. Click Save to apply.")
    } catch {
      showMessage("err", "Upload failed.")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleUploadItemImage = async (
    day: 1 | 2 | 3,
    itemIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append("file", file)
      form.append("day", String(day))
      form.append("index", String(itemIndex))
      const res = await fetch("/api/upload/item", { method: "POST", body: form })
      if (!res.ok) throw new Error("Upload failed")
      const { url } = await res.json()
      setItemImages((prev) => [...prev, { id: url, url, label: file.name }])
      const setItems = day === 1 ? setItemsDay1 : day === 2 ? setItemsDay2 : setItemsDay3
      const items = day === 1 ? itemsDay1 : day === 2 ? itemsDay2 : itemsDay3
      const next = items.map((it, i) => (i === itemIndex ? { ...it, image: url } : it))
      setItems(next)
      showMessage("ok", "Item image updated. Click Save to apply.")
    } catch {
      showMessage("err", "Upload failed.")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const updateItem = (
    day: 1 | 2 | 3,
    index: number,
    updates: Partial<FindableItem>
  ) => {
    const setItems = day === 1 ? setItemsDay1 : day === 2 ? setItemsDay2 : setItemsDay3
    const items = day === 1 ? itemsDay1 : day === 2 ? itemsDay2 : itemsDay3
    setItems(
      items.map((it, i) => (i === index ? { ...it, ...updates } : it))
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <h1 className="text-xl font-bold text-[#5D4037] sm:text-2xl">
            Easter Adventure – Admin
          </h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSaveConfig}
              disabled={saving}
              className="gap-2 bg-[#4CAF50] hover:bg-[#45a049]"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : "Save all"}
            </Button>
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Message toast */}
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
        {/* Listen URLs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Music className="h-5 w-5 text-[#4CAF50]" />
              Listen (podcast) URLs
            </CardTitle>
            <CardDescription>
              Link to the podcast episode for each day. Leave blank to use the default.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="listen1">Day 1</Label>
                <Input
                  id="listen1"
                  type="url"
                  placeholder="https://..."
                  value={listenUrlDay1}
                  onChange={(e) => setListenUrlDay1(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="listen2">Day 2</Label>
                <Input
                  id="listen2"
                  type="url"
                  placeholder="https://..."
                  value={listenUrlDay2}
                  onChange={(e) => setListenUrlDay2(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="listen3">Day 3</Label>
                <Input
                  id="listen3"
                  type="url"
                  placeholder="https://..."
                  value={listenUrlDay3}
                  onChange={(e) => setListenUrlDay3(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Background images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="h-5 w-5 text-[#4CAF50]" />
              Scene backgrounds
            </CardTitle>
            <CardDescription>
              Upload or choose a background image for each day. No selection shows a plain colour.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-slate-600">Upload new image for:</span>
              {(["1", "2", "3"] as const).map((d) => (
                <label
                  key={d}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm transition-colors hover:bg-slate-50 has-[:checked]:border-[#4CAF50] has-[:checked]:bg-green-50"
                >
                  <input
                    type="radio"
                    name="uploadDay"
                    checked={uploadDay === d}
                    onChange={() => setUploadDay(d)}
                    className="sr-only"
                  />
                  Day {d}
                </label>
              ))}
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadBackground}
                disabled={uploading}
                className="max-w-[200px] text-sm file:mr-2 file:rounded-md file:border-0 file:bg-[#4CAF50] file:px-3 file:py-1.5 file:text-sm file:text-white file:hover:bg-[#45a049]"
              />
              {uploading && <span className="text-sm text-slate-500">Uploading…</span>}
            </div>
            <Separator />
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { day: 1, value: backgroundDay1, set: setBackgroundDay1 },
                { day: 2, value: backgroundDay2, set: setBackgroundDay2 },
                { day: 3, value: backgroundDay3, set: setBackgroundDay3 },
              ].map(({ day, value, set }) => (
                <div key={day} className="space-y-2">
                  <Label>Day {day} background</Label>
                  <select
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#4CAF50] focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                  >
                    <option value="">Plain colour</option>
                    {backgrounds.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.id}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Items to find – Day 1 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="h-5 w-5 text-[#4CAF50]" />
              Items to find – Day 1 (Jesus arrives)
            </CardTitle>
            <CardDescription>
              Choose the image and label for each hidden object. Players tap these in the scene.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {itemsDay1.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4 sm:flex-row sm:items-center"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <Label className="text-xs text-slate-500">Label</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem(1, index, { name: e.target.value })}
                    placeholder="Item name"
                    className="bg-white"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <select
                    value={item.image}
                    onChange={(e) => updateItem(1, index, { image: e.target.value })}
                    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#4CAF50] focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                  >
                    {itemImages.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <label className="flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm transition-colors hover:bg-slate-50">
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUploadItemImage(1, index, e)}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Items to find – Day 2 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="h-5 w-5 text-[#4CAF50]" />
              Items to find – Day 2 (The cross)
            </CardTitle>
            <CardDescription>
              Choose the image and label for each hidden object.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {itemsDay2.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4 sm:flex-row sm:items-center"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <Label className="text-xs text-slate-500">Label</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem(2, index, { name: e.target.value })}
                    placeholder="Item name"
                    className="bg-white"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <select
                    value={item.image}
                    onChange={(e) => updateItem(2, index, { image: e.target.value })}
                    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#4CAF50] focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                  >
                    {itemImages.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <label className="flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm transition-colors hover:bg-slate-50">
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUploadItemImage(2, index, e)}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Items to find – Day 3 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="h-5 w-5 text-[#4CAF50]" />
              Items to find – Day 3 (Empty tomb)
            </CardTitle>
            <CardDescription>
              Choose the image and label for each hidden object.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {itemsDay3.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4 sm:flex-row sm:items-center"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <Label className="text-xs text-slate-500">Label</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem(3, index, { name: e.target.value })}
                    placeholder="Item name"
                    className="bg-white"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <select
                    value={item.image}
                    onChange={(e) => updateItem(3, index, { image: e.target.value })}
                    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#4CAF50] focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                  >
                    {itemImages.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <label className="flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm transition-colors hover:bg-slate-50">
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUploadItemImage(3, index, e)}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Bottom save */}
        <div className="flex justify-center pb-8">
          <Button
            onClick={handleSaveConfig}
            disabled={saving}
            size="lg"
            className="gap-2 bg-[#4CAF50] hover:bg-[#45a049]"
          >
            <Save className="h-5 w-5" />
            {saving ? "Saving…" : "Save all settings"}
          </Button>
        </div>
      </main>
    </div>
  )
}
