"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    fetch("/api/admin-auth")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) router.replace("/admin")
        else if (data.configured === false) router.replace("/admin")
        else setChecking(false)
      })
      .catch(() => setChecking(false))
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || "Invalid password")
        setLoading(false)
        return
      }
      router.replace("/admin")
      router.refresh()
    } catch {
      setError("Something went wrong")
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-500">Checking…</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Easter Adventure – Admin</CardTitle>
          <CardDescription>Enter the admin password to continue.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoFocus
                className="bg-white"
                disabled={loading}
              />
            </div>
            {error && (
              <p className="text-sm font-medium text-red-600">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full bg-[#4CAF50] hover:bg-[#45a049]"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <div className="pt-2">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-1.5 w-full">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
