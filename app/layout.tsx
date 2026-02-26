import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Let's Go! A Family Easter Adventure",
  description: "An interactive Easter story game for families",
  generator: "v0.app",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Link
          href="https://faithinkids.org"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 md:bottom-4 right-4 z-50 block opacity-90 hover:opacity-100 transition-opacity"
          aria-label="Faith in Kids"
        >
          <Image
            src="/images/fik-logo.webp"
            alt="Faith in Kids"
            width={40}
            height={40}
            className="h-6 w-auto sm:h-7"
          />
        </Link>
        <Analytics />
      </body>
    </html>
  )
}
