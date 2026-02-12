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
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)

    // Scroll progress indicator
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
    }

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up')
          }
        })
      },
      { threshold: 0.1 }
    )

    // Observe all elements with scroll-animate class
    document.querySelectorAll('.scroll-animate').forEach((el) => {
      observer.observe(el)
    })

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
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
      {/* Scroll Progress */}
      <div 
        className="scroll-progress" 
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      />
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#FF0000]/95 backdrop-blur-xl shadow-premium">
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
                className="rounded-full bg-white text-[#FF0000] hover:bg-white/95 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold"
              >
                Demo
              </Button>
            </Link>
            <Button
              size="lg"
              className="rounded-full bg-white text-[#FF0000] hover:bg-white/95 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold"
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
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20 pt-24 pb-20 md:pt-32 md:pb-32 z-0">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-12 w-full max-w-4xl animate-hero-logo-appear animate-hero-logo-move-up relative z-10 logo-shine logo-reflection logo-crop">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imagekolaz-sKxvO78UHBSBzYvglSoV0dm0FchcQO.png"
                alt="Kolaz"
                width={800}
                height={267}
                className="w-full h-auto"
                priority
              />
            </div>
            <div className="space-y-8 w-full max-w-[95%] lg:max-w-[90%] xl:max-w-[85%] animate-hero-text-slide-up px-4">
              <Link href="/demo">
                <div className="inline-flex items-center gap-3 rounded-full border-2 border-[#25D366] bg-[#25D366]/20 px-8 py-4 text-base md:text-lg font-bold text-foreground cursor-pointer hover:bg-[#25D366]/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 animate-float-slow">
                  <Sparkles className="h-6 w-6 text-[#25D366] animate-pulse" />
                  Demo ya disponible
                </div>
              </Link>
              <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-wide text-foreground md:text-5xl lg:text-6xl xl:text-7xl drop-shadow-sm">
                El alimento perfecto para tu mascota, <span className="text-primary">siempre a tiempo</span>
              </h1>
              <p className="text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl lg:text-2xl max-w-4xl mx-auto">
                Kolaz predice cuándo tu mascota necesita alimento y lo entrega automáticamente a través de veterinarios
                y tiendas locales de confianza.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row justify-center">
                <Button
                  size="lg"
                  className="rounded-full bg-primary text-lg text-primary-foreground hover:bg-primary/90 btn-glow shadow-premium-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  onClick={() => setIsEmailModalOpen(true)}
                >
                  Únete a la Lista de Espera
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full text-lg bg-transparent border-2 hover:bg-foreground/5 transform hover:scale-105 transition-all duration-300"
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
      <section id="como-funciona" className="relative bg-gradient-to-b from-muted/30 via-background to-background py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center scroll-animate">
            <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl mb-4">
              Cómo funcionará Kolaz
            </h2>
            <p className="mt-4 text-pretty text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
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
              <Card key={i} className={`scroll-animate stagger-${i + 1} premium-card relative overflow-hidden border-2 p-8 glass-card shadow-premium-lg group`}>
                <div className="absolute right-4 top-4 text-7xl font-bold text-primary/5 group-hover:text-primary/10 transition-colors">{step.number}</div>
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-4 text-xl md:text-2xl font-bold text-foreground">{step.title}</h3>
                <p className="leading-relaxed text-muted-foreground text-base">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="relative py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:gap-16 lg:grid-cols-2">
            <div className="relative scroll-animate group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20pantalla%202025-11-03%20155028-0gT4WP0auHOaDSoYYFW0qYvmptTQ2C.png"
                alt="Mascota comiendo con su familia"
                width={500}
                height={500}
                className="relative rounded-3xl shadow-premium-lg hover:shadow-2xl transition-shadow duration-500"
              />
            </div>
            <div className="space-y-6 scroll-animate">
              <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Nutrición inteligente para cada mascota
              </h2>
              <p className="text-pretty text-lg md:text-xl leading-relaxed text-muted-foreground">
                Nuestro motor de IA analiza el perfil completo de tu mascota para recomendar la dieta óptima y predecir
                exactamente cuándo necesitará más alimento.
              </p>
              <ul className="space-y-5 pt-4">
                {[
                  "Predicción precisa de consumo basada en perfil único",
                  "Recomendaciones personalizadas de dieta",
                  "Alertas tempranas para reabastecimiento",
                  "Ajustes automáticos según cambios de peso o actividad",
                ].map((benefit, i) => (
                  <li key={i} className={`flex items-start gap-4 scroll-animate stagger-${i + 1}`}>
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                      <svg
                        className="h-3.5 w-3.5 text-primary-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-foreground text-base md:text-lg font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Local Network */}
      <section className="relative bg-gradient-to-b from-background via-muted/30 to-background py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:gap-16 lg:grid-cols-2">
            <div className="space-y-8 lg:order-2 scroll-animate">
              <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Red local de confianza
              </h2>
              <p className="text-pretty text-lg md:text-xl leading-relaxed text-muted-foreground">
                Trabajamos con veterinarios y tiendas de mascotas en toda Chile. Tu pedido se enruta al socio más
                cercano con el mejor precio y disponibilidad.
              </p>
              <div className="grid gap-5 sm:grid-cols-2 pt-4">
                {[
                  { icon: MapPin, text: "Entrega desde socios cercanos" },
                  { icon: Calendar, text: "Suscripciones flexibles" },
                  { icon: Package, text: "Sin inventario centralizado" },
                  { icon: Sparkles, text: "Precios competitivos" },
                ].map((item, i) => (
                  <div key={i} className={`scroll-animate stagger-${i + 1} flex items-center gap-4 p-4 rounded-2xl bg-accent/5 hover:bg-accent/10 transition-colors group`}>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent/30 to-accent/10 shadow-md group-hover:scale-110 transition-transform">
                      <item.icon className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <span className="font-semibold text-foreground text-base">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative lg:order-1 scroll-animate group">
              <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 to-primary/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <Image
                src="/kolazcity.png"
                alt="Mapa de red de socios locales en Chile"
                width={800}
                height={450}
                className="relative rounded-3xl shadow-premium-lg hover:shadow-2xl transition-shadow duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* For Partners */}
      <div className="py-20 md:py-32 scroll-animate">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="relative rounded-3xl bg-gradient-to-br from-[#FF0000] via-[#FF0000] to-[#CC0000] p-12 text-center text-white md:p-20 shadow-premium-lg overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-6">
                ¿Eres veterinario o tienda de mascotas?
              </h2>
              <p className="mx-auto mt-6 max-w-3xl text-pretty text-lg md:text-xl leading-relaxed text-white/95">
                Únete a nuestra red de socios y aumenta tus ventas con pedidos automáticos de clientes locales. Sin costos
                de inventario, solo entregas.
              </p>
              <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" className="rounded-full text-lg shadow-premium-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold">
                  Registra tu Interés
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm text-lg text-white hover:bg-white/20 hover:border-white/50 transform hover:scale-105 transition-all duration-300 font-semibold"
                >
                  Más Información
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section id="socios"></section>

      {/* Footer */}
      <footer id="contacto" className="relative border-t border-border/50 bg-gradient-to-b from-muted/30 to-muted/50 py-16 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-2 lg:gap-16">
            <div className="space-y-6">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-removebg-preview-WP6xtRE2l7XPa0wKnQiedcQvblgW9U.png"
                alt="Kolaz"
                width={180}
                height={60}
                className="h-14 w-auto hover:scale-105 transition-transform duration-300"
              />
              <p className="text-base text-muted-foreground max-w-md leading-relaxed">
                Marketplace inteligente de nutrición para mascotas en Chile.
              </p>
            </div>
            <div>
              <h3 className="mb-6 text-xl font-bold text-foreground">Contáctanos</h3>
              <ul className="space-y-4 text-base text-muted-foreground">
                <li className="flex items-center gap-3 group">
                  <span className="font-semibold text-foreground min-w-[80px]">Teléfono:</span>
                  <a href="tel:+56990182719" className="hover:text-primary transition-colors group-hover:translate-x-1 transform duration-200">
                    +569 90182719
                  </a>
                </li>
                <li className="flex items-center gap-3 group">
                  <span className="font-semibold text-foreground min-w-[80px]">Email:</span>
                  <a href="mailto:kolazpet@gmail.com" className="hover:text-primary transition-colors group-hover:translate-x-1 transform duration-200">
                    kolazpet@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-16 border-t border-border/50 pt-8 text-center">
            <p className="text-sm text-muted-foreground">&copy; 2025 Kolaz. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Email Collection Modal */}
      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent className="sm:max-w-md border-2 shadow-premium-lg">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              ¡Únete a la lista de espera!
            </DialogTitle>
            <DialogDescription className="text-center text-base mt-3 text-muted-foreground">
              Sé de los primeros en saber cuando lancemos Kolaz. Te notificaremos por email.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEmailSubmit} className="space-y-6 mt-6">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 text-base border-2 focus:border-primary transition-colors shadow-sm"
                disabled={isSubmitting}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full bg-primary text-lg text-primary-foreground hover:bg-primary/90 btn-glow shadow-premium-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold"
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
