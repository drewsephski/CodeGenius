import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"

// Optimize font loading
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "CodeGenius - AI-Powered Code Generation",
  description:
    "Generate production-ready code with AI. Build faster, smarter, and with fewer bugs using our advanced AI code generation platform.",
  keywords: "AI, code generation, developer tools, programming, artificial intelligence, coding assistant",
  openGraph: {
    title: "CodeGenius - AI-Powered Code Generation",
    description: "Generate production-ready code with AI. Build faster, smarter, and with fewer bugs.",
    url: "https://codegenius.ai",
    siteName: "CodeGenius",
    images: [
      {
        url: "https://codegenius.ai/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CodeGenius AI Code Generation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeGenius - AI-Powered Code Generation",
    description: "Generate production-ready code with AI. Build faster, smarter, and with fewer bugs.",
    images: ["https://codegenius.ai/twitter-image.jpg"],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://prod.spline.design" crossOrigin="anonymous" />
        {/* Add preload for the Spline scene */}
        <link
          rel="preload"
          href="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          as="fetch"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
