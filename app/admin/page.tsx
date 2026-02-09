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
import { MediaLibraryModal } from "@/components/MediaLibraryModal"
import { Home, Save, Upload, Music, Palette, Search, ImageIcon } from "lucide-react"

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
  const [backgroundUrlDay1, setBackgroundUrlDay1] = useState("")
  const [backgroundUrlDay2, setBackgroundUrlDay2] = useState("")
  const [backgroundUrlDay3, setBackgroundUrlDay3] = useState("")
  const [itemsDay1, setItemsDay1] = useState<FindableItem[]>(DEFAULT_ITEMS_DAY1)
  const [itemsDay2, setItemsDay2] = useState<FindableItem[]>(DEFAULT_ITEMS_DAY2)
  const [itemsDay3, setItemsDay3] = useState<FindableItem[]>(DEFAULT_ITEMS_DAY3)
  const [imageCreditDay1, setImageCreditDay1] = useState("")
  const [imageCreditDay2, setImageCreditDay2] = useState("")
  const [imageCreditDay3, setImageCreditDay3] = useState("")
  const [uploadDay, setUploadDay] = useState<"1" | "2" | "3">("1")
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savingBackgroundDay, setSavingBackgroundDay] = useState<1 | 2 | 3 | null>(null)
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null)
  const [libraryContext, setLibraryContext] = useState<
    { type: "background"; day: 1 | 2 | 3 } | { type: "item"; day: 1 | 2 | 3; index: number } | null
  >(null)

  const loadConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/config")
      const c: SiteConfig = await res.json()
      setConfig(c)
      setListenUrlDay1(c.listenUrlDay1 ?? "")
      setListenUrlDay2(c.listenUrlDay2 ?? "")
      setListenUrlDay3(c.listenUrlDay3 ?? "")
      const bg1 = c.backgroundDay1 ?? ""
      const bg2 = c.backgroundDay2 ?? ""
      const bg3 = c.backgroundDay3 ?? ""
      setBackgroundDay1(bg1.startsWith("http") ? "" : bg1)
      setBackgroundDay2(bg2.startsWith("http") ? "" : bg2)
      setBackgroundDay3(bg3.startsWith("http") ? "" : bg3)
      setBackgroundUrlDay1(bg1.startsWith("http") ? bg1 : "")
      setBackgroundUrlDay2(bg2.startsWith("http") ? bg2 : "")
      setBackgroundUrlDay3(bg3.startsWith("http") ? bg3 : "")
      const norm = (it: FindableItem) => ({
        ...it,
        position: {
          x: Number(it.position?.x) || 50,
          y: Number(it.position?.y) || 50,
        },
      })
      if (c.itemsDay1?.length) setItemsDay1(c.itemsDay1.map(norm))
      if (c.itemsDay2?.length) setItemsDay2(c.itemsDay2.map(norm))
      if (c.itemsDay3?.length) setItemsDay3(c.itemsDay3.map(norm))
      setImageCreditDay1(c.imageCreditDay1 ?? "")
      setImageCreditDay2(c.imageCreditDay2 ?? "")
      setImageCreditDay3(c.imageCreditDay3 ?? "")
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
          backgroundDay1: (backgroundUrlDay1 || backgroundDay1) || null,
          backgroundDay2: (backgroundUrlDay2 || backgroundDay2) || null,
          backgroundDay3: (backgroundUrlDay3 || backgroundDay3) || null,
          itemsDay1,
          itemsDay2,
          itemsDay3,
          imageCreditDay1: imageCreditDay1 || null,
          imageCreditDay2: imageCreditDay2 || null,
          imageCreditDay3: imageCreditDay3 || null,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error((err as { error?: string }).error || "Save failed")
      }
      const c = await res.json()
      setConfig(c)
      showMessage("ok", "All settings saved successfully.")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save."
      showMessage("err", msg)
    } finally {
      setSaving(false)
    }
  }

  const saveBackgroundDay = async (day: 1 | 2 | 3) => {
    const key = `backgroundDay${day}` as const
    const urlVal = day === 1 ? backgroundUrlDay1 : day === 2 ? backgroundUrlDay2 : backgroundUrlDay3
    const fileVal = day === 1 ? backgroundDay1 : day === 2 ? backgroundDay2 : backgroundDay3
    const value = (urlVal || fileVal) || null
    setSavingBackgroundDay(day)
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error((err as { error?: string }).error || "Save failed")
      }
      const c = await res.json()
      setConfig(c)
      const bg = c[key] ?? ""
      if (day === 1) {
        setBackgroundDay1(bg.startsWith("http") ? "" : bg)
        setBackgroundUrlDay1(bg.startsWith("http") ? bg : "")
      }
      if (day === 2) {
        setBackgroundDay2(bg.startsWith("http") ? "" : bg)
        setBackgroundUrlDay2(bg.startsWith("http") ? bg : "")
      }
      if (day === 3) {
        setBackgroundDay3(bg.startsWith("http") ? "" : bg)
        setBackgroundUrlDay3(bg.startsWith("http") ? bg : "")
      }
      showMessage("ok", `Day ${day} background saved.`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save."
      showMessage("err", msg)
    } finally {
      setSavingBackgroundDay(null)
    }
  }

  const UPLOAD_TIMEOUT_MS = 25000

  const handleUploadBackground = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const inputEl = e.target
    try {
      const form = new FormData()
      form.append("file", file)
      form.append("day", uploadDay)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS)
      const res = await fetch("/api/upload/background", {
        method: "POST",
        body: form,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error((err as { error?: string }).error || "Upload failed")
      }
      const { filename } = await res.json()
      if (uploadDay === "1") {
        setBackgroundDay1(filename)
        setBackgroundUrlDay1("")
      }
      if (uploadDay === "2") {
        setBackgroundDay2(filename)
        setBackgroundUrlDay2("")
      }
      if (uploadDay === "3") {
        setBackgroundDay3(filename)
        setBackgroundUrlDay3("")
      }
      setBackgrounds((prev) => [...prev, { id: filename, url: `/uploads/${filename}`, day: parseInt(uploadDay, 10) }])
      showMessage("ok", "Background uploaded. Click Save next to Day " + uploadDay + " to apply.")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed."
      showMessage("err", msg === "The user aborted a request." ? "Upload timed out. Try a smaller image or use a URL instead." : msg)
    } finally {
      setUploading(false)
      if (inputEl) inputEl.value = ""
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

  const handleLibrarySelect = (value: string) => {
    if (!libraryContext) return
    if (libraryContext.type === "background") {
      const setFile = libraryContext.day === 1 ? setBackgroundDay1 : libraryContext.day === 2 ? setBackgroundDay2 : setBackgroundDay3
      const setUrl = libraryContext.day === 1 ? setBackgroundUrlDay1 : libraryContext.day === 2 ? setBackgroundUrlDay2 : setBackgroundUrlDay3
      setFile(value)
      setUrl("")
    } else {
      updateItem(libraryContext.day, libraryContext.index, { image: value })
    }
    setLibraryContext(null)
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
            <Link href="/admin/media">
              <Button variant="outline" size="sm" className="gap-1.5">
                <ImageIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Media Library</span>
              </Button>
            </Link>
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
              Paste a direct image URL (e.g. https://…/image.jpg) and click Save next to that day. Or choose from uploads below. Use a link that points to an image file, not a webpage.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {([
              {
                day: 1 as const,
                urlValue: backgroundUrlDay1,
                setUrl: (v: string) => {
                  setBackgroundUrlDay1(v)
                  if (v) setBackgroundDay1("")
                },
                fileValue: backgroundDay1,
                setFile: (v: string) => {
                  setBackgroundDay1(v)
                  if (v) setBackgroundUrlDay1("")
                },
              },
              {
                day: 2 as const,
                urlValue: backgroundUrlDay2,
                setUrl: (v: string) => {
                  setBackgroundUrlDay2(v)
                  if (v) setBackgroundDay2("")
                },
                fileValue: backgroundDay2,
                setFile: (v: string) => {
                  setBackgroundDay2(v)
                  if (v) setBackgroundUrlDay2("")
                },
              },
              {
                day: 3 as const,
                urlValue: backgroundUrlDay3,
                setUrl: (v: string) => {
                  setBackgroundUrlDay3(v)
                  if (v) setBackgroundDay3("")
                },
                fileValue: backgroundDay3,
                setFile: (v: string) => {
                  setBackgroundDay3(v)
                  if (v) setBackgroundUrlDay3("")
                },
              },
            ] as const).map(({ day, urlValue, setUrl, fileValue, setFile }) => (
              <div key={day} className="flex flex-col gap-2 rounded-lg border border-slate-100 bg-slate-50/50 p-3 sm:flex-row sm:items-center sm:gap-3">
                <Label className="shrink-0 text-sm font-medium sm:w-28">Day {day} background</Label>
                <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                  <Input
                    type="url"
                    placeholder="https://…/image.jpg"
                    value={urlValue}
                    onChange={(e) => setUrl(e.target.value)}
                    className="min-w-0 flex-1 bg-white text-sm"
                  />
                  <Button
                    type="button"
                    size="sm"
                    className="shrink-0 gap-1 bg-[#4CAF50] hover:bg-[#45a049]"
                    disabled={savingBackgroundDay === day}
                    onClick={() => saveBackgroundDay(day)}
                  >
                    <Save className="h-4 w-4" />
                    {savingBackgroundDay === day ? "Saving…" : "Save"}
                  </Button>
                </div>
                <div className="flex gap-2 sm:w-48">
                  <select
                    value={fileValue}
                    onChange={(e) => setFile(e.target.value)}
                    className="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm focus:border-[#4CAF50] focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                    title="From uploads"
                  >
                    <option value="">From uploads</option>
                    {backgrounds.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.id}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    onClick={() => setLibraryContext({ type: "background", day })}
                    title="Library"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3">
              <span className="text-sm text-slate-500">Upload new image for:</span>
              {(["1", "2", "3"] as const).map((d) => (
                <label
                  key={d}
                  className="flex cursor-pointer items-center gap-2 rounded border border-slate-200 bg-white px-2 py-1.5 text-sm has-[:checked]:border-[#4CAF50] has-[:checked]:bg-green-50"
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
                className="max-w-[180px] text-sm file:mr-2 file:rounded file:border-0 file:bg-[#4CAF50] file:px-2 file:py-1 file:text-xs file:text-white"
              />
              {uploading && <span className="text-sm text-slate-500">Uploading…</span>}
            </div>
          </CardContent>
        </Card>

        {/* Image copyright credit – per day */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Image copyright credit (per day)</CardTitle>
            <CardDescription>
              Shown at the bottom left on each day page. The credit links to this admin. Set one per day.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="imageCreditDay1" className="text-slate-600">
                Day 1 credit
              </Label>
              <Input
                id="imageCreditDay1"
                value={imageCreditDay1}
                onChange={(e) => setImageCreditDay1(e.target.value)}
                placeholder="e.g. © Faith in Kids"
                className="mt-1 max-w-md bg-white"
              />
            </div>
            <div>
              <Label htmlFor="imageCreditDay2" className="text-slate-600">
                Day 2 credit
              </Label>
              <Input
                id="imageCreditDay2"
                value={imageCreditDay2}
                onChange={(e) => setImageCreditDay2(e.target.value)}
                placeholder="e.g. © Faith in Kids"
                className="mt-1 max-w-md bg-white"
              />
            </div>
            <div>
              <Label htmlFor="imageCreditDay3" className="text-slate-600">
                Day 3 credit
              </Label>
              <Input
                id="imageCreditDay3"
                value={imageCreditDay3}
                onChange={(e) => setImageCreditDay3(e.target.value)}
                placeholder="e.g. © Faith in Kids"
                className="mt-1 max-w-md bg-white"
              />
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
              Choose the image and label for each hidden object. Drag the position sliders to move items on the scene (X% and Y%). Players tap these in the scene.
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
                  <div className="flex items-center gap-2 pt-1">
                    <Label className="text-xs text-slate-500 shrink-0">Position X %</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={Number(item.position?.x) ?? 50}
                      onChange={(e) =>
                        updateItem(1, index, {
                          position: { x: Number(e.target.value) || 0, y: Number(item.position?.y) ?? 50 },
                        })
                      }
                      className="h-8 w-16 bg-white text-sm"
                    />
                    <Label className="text-xs text-slate-500 shrink-0">Y %</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={Number(item.position?.y) ?? 50}
                      onChange={(e) =>
                        updateItem(1, index, {
                          position: { x: Number(item.position?.x) ?? 50, y: Number(e.target.value) || 0 },
                        })
                      }
                      className="h-8 w-16 bg-white text-sm"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap">
                  <div className="w-full sm:w-auto sm:min-w-[180px]">
                    <Input
                      type="url"
                      placeholder="Or paste image URL"
                      value={item.image.startsWith("http") ? item.image : ""}
                      onChange={(e) => updateItem(1, index, { image: e.target.value })}
                      className="h-9 rounded-md border border-slate-200 bg-white text-sm"
                    />
                  </div>
                  <select
                    value={item.image.startsWith("http") ? "" : item.image}
                    onChange={(e) => updateItem(1, index, { image: e.target.value })}
                    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#4CAF50] focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                  >
                    <option value="">Select image</option>
                    {itemImages.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => setLibraryContext({ type: "item", day: 1, index })}
                  >
                    <ImageIcon className="h-4 w-4" />
                    Library
                  </Button>
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
              Choose the image and label for each hidden object. Adjust X% and Y% to move items on the scene.
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
                  <div className="flex items-center gap-2 pt-1">
                    <Label className="text-xs text-slate-500 shrink-0">Position X %</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={Number(item.position?.x) ?? 50}
                      onChange={(e) =>
                        updateItem(2, index, {
                          position: { x: Number(e.target.value) || 0, y: Number(item.position?.y) ?? 50 },
                        })
                      }
                      className="h-8 w-16 bg-white text-sm"
                    />
                    <Label className="text-xs text-slate-500 shrink-0">Y %</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={Number(item.position?.y) ?? 50}
                      onChange={(e) =>
                        updateItem(2, index, {
                          position: { x: Number(item.position?.x) ?? 50, y: Number(e.target.value) || 0 },
                        })
                      }
                      className="h-8 w-16 bg-white text-sm"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap">
                  <div className="w-full sm:w-auto sm:min-w-[180px]">
                    <Input
                      type="url"
                      placeholder="Or paste image URL"
                      value={item.image.startsWith("http") ? item.image : ""}
                      onChange={(e) => updateItem(2, index, { image: e.target.value })}
                      className="h-9 rounded-md border border-slate-200 bg-white text-sm"
                    />
                  </div>
                  <select
                    value={item.image.startsWith("http") ? "" : item.image}
                    onChange={(e) => updateItem(2, index, { image: e.target.value })}
                    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#4CAF50] focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                  >
                    <option value="">Select image</option>
                    {itemImages.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => setLibraryContext({ type: "item", day: 2, index })}
                  >
                    <ImageIcon className="h-4 w-4" />
                    Library
                  </Button>
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
              Choose the image and label for each hidden object. Adjust X% and Y% to move items on the scene.
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
                  <div className="flex items-center gap-2 pt-1">
                    <Label className="text-xs text-slate-500 shrink-0">Position X %</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={Number(item.position?.x) ?? 50}
                      onChange={(e) =>
                        updateItem(3, index, {
                          position: { x: Number(e.target.value) || 0, y: Number(item.position?.y) ?? 50 },
                        })
                      }
                      className="h-8 w-16 bg-white text-sm"
                    />
                    <Label className="text-xs text-slate-500 shrink-0">Y %</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={Number(item.position?.y) ?? 50}
                      onChange={(e) =>
                        updateItem(3, index, {
                          position: { x: Number(item.position?.x) ?? 50, y: Number(e.target.value) || 0 },
                        })
                      }
                      className="h-8 w-16 bg-white text-sm"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap">
                  <div className="w-full sm:w-auto sm:min-w-[180px]">
                    <Input
                      type="url"
                      placeholder="Or paste image URL"
                      value={item.image.startsWith("http") ? item.image : ""}
                      onChange={(e) => updateItem(3, index, { image: e.target.value })}
                      className="h-9 rounded-md border border-slate-200 bg-white text-sm"
                    />
                  </div>
                  <select
                    value={item.image.startsWith("http") ? "" : item.image}
                    onChange={(e) => updateItem(3, index, { image: e.target.value })}
                    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#4CAF50] focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                  >
                    <option value="">Select image</option>
                    {itemImages.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => setLibraryContext({ type: "item", day: 3, index })}
                  >
                    <ImageIcon className="h-4 w-4" />
                    Library
                  </Button>
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

        {/* Media library modal */}
        <MediaLibraryModal
          open={libraryContext !== null}
          onClose={() => setLibraryContext(null)}
          type={libraryContext?.type ?? "background"}
          onSelect={handleLibrarySelect}
          title={
            libraryContext?.type === "background"
              ? `Choose Day ${libraryContext.day} background`
              : libraryContext
                ? `Choose Day ${libraryContext.day} item ${libraryContext.index + 1} image`
                : undefined
          }
        />

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
