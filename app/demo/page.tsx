"use client"

import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/layout/site-header"
import { MessageCircle } from "lucide-react"
import Link from "next/link"
import { DEMO_HEADER_ACTIONS } from "@/lib/navigation/header-actions"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <SiteHeader actions={DEMO_HEADER_ACTIONS} />

      {/* Main Content */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-background to-background"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#25D366]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto max-w-4xl px-6 relative z-10">
          <div className="text-center space-y-10">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#25D366]/20 to-[#25D366]/5 mb-6 shadow-premium-lg animate-float">
              <MessageCircle className="w-12 h-12 text-[#25D366]" />
            </div>
            
            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-7xl drop-shadow-sm">
              Demo de <span className="text-[#25D366]">Kolaz</span>
            </h1>
            
            <p className="text-pretty text-xl leading-relaxed text-muted-foreground md:text-2xl lg:text-3xl max-w-3xl mx-auto">
              Estamos poniendo en funcionamiento el demo de Kolaz a través de <span className="font-semibold text-[#25D366]">WhatsApp</span>
            </p>

            <div className="pt-8 space-y-8">
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Pronto podrás probar nuestra plataforma directamente desde WhatsApp y experimentar cómo funciona el sistema de predicción y pedidos automáticos para tu mascota.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
                <Link href="#" onClick={(e) => e.preventDefault()}>
                  <Button
                    size="lg"
                    className="rounded-full bg-[#25D366] text-lg text-white hover:bg-[#20BA5A] shadow-premium-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold px-8"
                  >
                    <MessageCircle className="mr-2 h-6 w-6" />
                    Prueba el Demo
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    size="lg"
                    className="rounded-full bg-primary text-lg text-primary-foreground hover:bg-primary/90 shadow-premium-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold"
                  >
                    Volver al Inicio
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full text-lg border-2 hover:bg-foreground/5 transform hover:scale-105 transition-all duration-300 font-semibold"
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
