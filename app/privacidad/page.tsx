import type { Metadata } from "next"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShieldCheck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Kolaz - Términos y Privacidad",
  description:
    "Términos y condiciones relacionados con privacidad y tratamiento de datos en Kolaz.",
}

const sections = [
  {
    title: "1. Alcance",
    body: "Estos términos describen cómo tratamos los datos personales al usar nuestro sitio, la lista de espera y futuras comunicaciones del servicio Kolaz.",
  },
  {
    title: "2. Información que recopilamos",
    body: "Solo solicitamos la información necesaria para operar y mejorar la experiencia.",
    items: [
      "Datos de contacto: nombre, correo y teléfono (si los entregas).",
      "Datos de tu mascota: especie, raza, edad, peso y preferencias (si los compartes).",
      "Datos técnicos: IP, navegador, dispositivo, cookies y métricas de uso.",
    ],
  },
  {
    title: "3. Cómo usamos la información",
    items: [
      "Gestionar la lista de espera y notificaciones de lanzamiento.",
      "Personalizar recomendaciones y comunicaciones del servicio.",
      "Mejorar seguridad, rendimiento y experiencia del sitio.",
      "Cumplir obligaciones legales aplicables.",
    ],
  },
  {
    title: "4. Base legal y consentimiento",
    body: "Tratamos tus datos con tu consentimiento o cuando sea necesario para prestarte el servicio solicitado. Puedes retirar tu consentimiento en cualquier momento.",
  },
  {
    title: "5. Compartir datos con terceros",
    body: "No vendemos tus datos personales. Podemos compartirlos con proveedores que nos ayudan a operar el servicio (por ejemplo, email y analítica) bajo acuerdos de confidencialidad, o con autoridades si la ley lo exige.",
  },
  {
    title: "6. Seguridad y conservación",
    body: "Aplicamos medidas razonables para proteger tu información. Conservamos los datos solo por el tiempo necesario para los fines descritos o por exigencia legal.",
  },
  {
    title: "7. Tus derechos",
    body: "Puedes solicitar acceso, rectificación, eliminación u oposición al tratamiento de tus datos.",
    items: [
      "Acceder y corregir tu información.",
      "Solicitar la eliminación cuando corresponda.",
      "Limitar u oponerte al tratamiento en ciertos casos.",
    ],
  },
  {
    title: "8. Cookies y analítica",
    body: "Usamos cookies para el funcionamiento básico y análisis de uso. Puedes gestionar cookies desde tu navegador.",
  },
  {
    title: "9. Cambios a esta política",
    body: "Podemos actualizar estos términos para reflejar cambios legales o del servicio. Publicaremos la fecha de actualización en esta página.",
  },
  {
    title: "10. Contacto",
    body: "Si tienes dudas sobre privacidad, escríbenos a kolazpet@gmail.com.",
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
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
          <Button size="lg" className="rounded-full bg-white text-[#FF0000] hover:bg-white/90" asChild>
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </header>

      <section className="relative overflow-hidden bg-background pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-[#FFD700] bg-[#FFD700]/20 px-6 py-3 text-base font-bold text-foreground">
              <ShieldCheck className="h-5 w-5 text-[#FFD700]" />
              PRIVACIDAD
            </div>
            <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-wider text-foreground md:text-4xl lg:text-5xl">
              Términos y Condiciones de Privacidad
            </h1>
            <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
              Este documento explica cómo recopilamos, usamos y protegemos tu información cuando interactúas con Kolaz.
              Queremos que tengas claridad y control sobre tus datos.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">Última actualización: 29 de enero de 2026</p>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {sections.map((section) => (
              <Card key={section.title} className="border-2 p-8 transition-all hover:shadow-lg">
                <h2 className="mb-3 text-xl font-bold text-foreground">{section.title}</h2>
                {section.body && <p className="leading-relaxed text-muted-foreground">{section.body}</p>}
                {section.items && (
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

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
    </div>
  )
}
