"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#FF0000] backdrop-blur">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="cursor-pointer">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imag2e-YCSsxyA9MGcWS017lPzUCiHeT9noYt.png"
                alt="Kolaz"
                width={60}
                height={60}
                className="h-12 w-12"
              />
            </Link>
          </div>
          <Link href="/">
            <Button
              size="lg"
              className="rounded-full bg-white text-[#FF0000] hover:bg-white/90"
            >
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-4">
              <MessageCircle className="w-10 h-10 text-green-500" />
            </div>
            
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Demo de Kolaz
            </h1>
            
            <p className="text-pretty text-xl leading-relaxed text-muted-foreground md:text-2xl max-w-2xl mx-auto">
              Estamos poniendo en funcionamiento el demo de Kolaz a través de WhatsApp
            </p>

            <div className="pt-8">
              <p className="text-lg text-muted-foreground mb-6">
                Pronto podrás probar nuestra plataforma directamente desde WhatsApp y experimentar cómo funciona el sistema de predicción y pedidos automáticos para tu mascota.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                <Link href="#" onClick={(e) => e.preventDefault()}>
                  <Button
                    size="lg"
                    className="rounded-full bg-[#25D366] text-lg text-white hover:bg-[#20BA5A] shadow-lg"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Prueba el Demo
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    size="lg"
                    className="rounded-full bg-primary text-lg text-primary-foreground hover:bg-primary/90"
                  >
                    Volver al Inicio
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full text-lg"
                  onClick={() => {
                    window.location.href = "/#contacto"
                  }}
                >
                  Contáctanos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
