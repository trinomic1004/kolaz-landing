"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ArrowRight, Brain, Calendar, MapPin, Package, Sparkles, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function KolazLanding() {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: Add actual email collection logic here (e.g., API call)
    console.log("[v0] Email submitted:", email)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setEmail("")
    setIsEmailModalOpen(false)

    // Show success message (you can add a toast notification here)
    alert("¡Gracias! Te notificaremos cuando lancemos Kolaz.")
  }

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
          <div className="flex items-center gap-4">
            <Link href="/demo">
              <Button
                size="lg"
                className="rounded-full bg-white text-[#FF0000] hover:bg-white/90"
              >
                Demo
              </Button>
            </Link>
            <Button
              size="lg"
              className="rounded-full bg-white text-[#FF0000] hover:bg-white/90"
              onClick={() => {
                document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Contáctanos
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-24 pb-20 md:pt-32 md:pb-32 z-0">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-12 w-full max-w-4xl animate-hero-logo-appear animate-hero-logo-move-up relative z-10">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imagekolaz-sKxvO78UHBSBzYvglSoV0dm0FchcQO.png"
                alt="Kolaz"
                width={800}
                height={267}
                className="w-full h-auto logo-reflection"
                priority
              />
            </div>
            <div className="space-y-8 w-full max-w-[95%] lg:max-w-[90%] xl:max-w-[85%] animate-hero-text-slide-up px-4">
              <Link href="/demo">
                <div className="inline-flex items-center gap-2 rounded-full border-2 border-[#25D366] bg-[#25D366]/20 px-6 py-3 text-base font-bold text-foreground cursor-pointer hover:bg-[#25D366]/30 transition-colors">
                  <Sparkles className="h-5 w-5 text-[#25D366]" />
                  Demo ya disponible
                </div>
              </Link>
              <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-wider text-foreground md:text-4xl lg:text-5xl xl:text-6xl">
                El alimento perfecto para tu mascota, siempre a tiempo
              </h1>
              <p className="text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
                Kolaz predice cuándo tu mascota necesita alimento y lo entrega automáticamente a través de veterinarios
                y tiendas locales de confianza.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row justify-center">
                <Button
                  size="lg"
                  className="rounded-full bg-primary text-lg text-primary-foreground hover:bg-primary/90"
                  onClick={() => setIsEmailModalOpen(true)}
                >
                  Únete a la Lista de Espera
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full text-lg bg-transparent"
                  onClick={() => setIsEmailModalOpen(true)}
                >
                  Notifícame al Lanzamiento
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="bg-muted/30 py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Cómo funcionará Kolaz
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              Tres pasos simples para nunca quedarte sin alimento
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                number: "01",
                icon: Users,
                title: "Crea el perfil de tu mascota",
                description:
                  "Ingresa especie, raza, edad, peso, esterilización, actividad y sensibilidades. Nuestro sistema aprende las necesidades únicas de tu compañero.",
              },
              {
                number: "02",
                icon: Brain,
                title: "IA predice y recomienda",
                description:
                  "Estimamos el consumo diario, predecimos fechas de reorden y recomendamos la dieta perfecta: mantenimiento, control de peso o alternativas prescritas.",
              },
              {
                number: "03",
                icon: Package,
                title: "Entrega automática local",
                description:
                  "Enviamos pedidos a veterinarios y tiendas cercanas según precio, stock, distancia y SLA. Tú solo disfrutas tiempo con tu mascota.",
              },
            ].map((step, i) => (
              <Card key={i} className="relative overflow-hidden border-2 p-8 transition-all hover:shadow-lg">
                <div className="absolute right-4 top-4 text-6xl font-bold text-primary/10">{step.number}</div>
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground">{step.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20pantalla%202025-11-03%20155028-0gT4WP0auHOaDSoYYFW0qYvmptTQ2C.png"
                alt="Mascota comiendo con su familia"
                width={500}
                height={500}
                className="rounded-3xl"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Nutrición inteligente para cada mascota
              </h2>
              <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
                Nuestro motor de IA analiza el perfil completo de tu mascota para recomendar la dieta óptima y predecir
                exactamente cuándo necesitará más alimento.
              </p>
              <ul className="space-y-4">
                {[
                  "Predicción precisa de consumo basada en perfil único",
                  "Recomendaciones personalizadas de dieta",
                  "Alertas tempranas para reabastecimiento",
                  "Ajustes automáticos según cambios de peso o actividad",
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
                      <svg
                        className="h-3 w-3 text-primary-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Local Network */}
      <section className="bg-muted/30 py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6 lg:order-2">
              <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Red local de confianza
              </h2>
              <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
                Trabajamos con veterinarios y tiendas de mascotas en toda Chile. Tu pedido se enruta al socio más
                cercano con el mejor precio y disponibilidad.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: MapPin, text: "Entrega desde socios cercanos" },
                  { icon: Calendar, text: "Suscripciones flexibles" },
                  { icon: Package, text: "Sin inventario centralizado" },
                  { icon: Sparkles, text: "Precios competitivos" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/20">
                      <item.icon className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <span className="font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative lg:order-1">
              <Image
                src="/kolazcity.png"
                alt="Mapa de red de socios locales en Chile"
                width={800}
                height={450}
                className="rounded-3xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* For Partners */}
      <div className="py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="rounded-3xl bg-[#FF0000] p-12 text-center text-white md:p-20">
            <h2 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
              ¿Eres veterinario o tienda de mascotas?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/90">
              Únete a nuestra red de socios y aumenta tus ventas con pedidos automáticos de clientes locales. Sin costos
              de inventario, solo entregas.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" className="rounded-full text-lg">
                Registra tu Interés
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-2 border-white/20 bg-transparent text-lg text-white hover:bg-white/10"
              >
                Más Información
              </Button>
            </div>
          </div>
        </div>
      </div>

      <section id="socios"></section>

      {/* Footer */}
      <footer id="contacto" className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-removebg-preview-WP6xtRE2l7XPa0wKnQiedcQvblgW9U.png"
                alt="Kolaz"
                width={180}
                height={60}
                className="h-12 w-auto"
              />
              <p className="text-sm text-muted-foreground">
                Marketplace inteligente de nutrición para mascotas en Chile.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-foreground">Contáctanos</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="font-medium text-foreground">Teléfono:</span>
                  <a href="tel:+56990182719" className="hover:text-foreground hover:underline">
                    +569 90182719
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-medium text-foreground">Email:</span>
                  <a href="mailto:kolazpet@gmail.com" className="hover:text-foreground hover:underline">
                    kolazpet@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Kolaz. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Email Collection Modal */}
      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">¡Únete a la lista de espera!</DialogTitle>
            <DialogDescription className="text-center">
              Sé de los primeros en saber cuando lancemos Kolaz. Te notificaremos por email.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEmailSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base"
                disabled={isSubmitting}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full bg-primary text-lg text-primary-foreground hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Notifícame"}
              {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
