import type React from "react"
import type { Metadata } from "next"
import { Instrument_Serif, Outfit } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  title: "Kolaz - AI Autoship para Alimento de Mascotas en Chile",
  description:
    "Marketplace inteligente que predice reabastecimiento y entrega el alimento perfecto para tu mascota a través de veterinarios y tiendas locales.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${outfit.className} ${instrumentSerif.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
