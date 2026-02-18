"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"

import { SiteHeader } from "@/components/layout/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FOOD_RECOMMENDER_HEADER_ACTIONS } from "@/lib/navigation/header-actions"
import { ArrowRight, Loader2, PawPrint, Sparkles } from "lucide-react"

type FormState = {
  nombre: string
  especie: "perro" | "gato"
  sexo: "macho" | "hembra"
  edad_valor: string
  edad_unidad: "años" | "meses"
  peso_kg: string
  raza: string
  condiciones_salud: string
  direccion: string
  estado_sexual: "intacto" | "esterilizado"
  nivel_actividad: "alto" | "medio" | "bajo"
  condicion_corporal: "delgado" | "ideal" | "sobrepeso" | "obeso"
  objetivo_peso: "mantener" | "bajar" | "subir"
  comida_extra: "nada" | "poco" | "medio" | "mucho"
}

type Recommendation = {
  rank: number
  food_id: string
  label: string
  why: string
  confidence: number
  image_url: string
}

type RecommendationResponse = {
  pet: Record<string, unknown>
  recommendations: Recommendation[]
  notes: string
}

type Option<T extends string> = {
  label: string
  value: T
}

const CUSTOMER_ID_STORAGE_KEY = "kolaz_customer_id"
const inputClassName =
  "h-11 rounded-xl border-2 border-border/80 bg-white/80 px-3 text-sm shadow-sm transition-all focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20"
const selectClassName =
  "h-11 w-full rounded-xl border-2 border-border/80 bg-white/80 px-3 text-sm shadow-sm transition-all focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20"
const textareaClassName =
  "min-h-24 w-full rounded-xl border-2 border-border/80 bg-white/80 px-3 py-2 text-sm shadow-sm transition-all focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20"

const initialState: FormState = {
  nombre: "",
  especie: "perro",
  sexo: "macho",
  edad_valor: "",
  edad_unidad: "años",
  peso_kg: "",
  raza: "",
  condiciones_salud: "ninguna",
  direccion: "",
  estado_sexual: "esterilizado",
  nivel_actividad: "medio",
  condicion_corporal: "ideal",
  objetivo_peso: "mantener",
  comida_extra: "poco",
}

const especieOptions: Option<FormState["especie"]>[] = [
  { label: "Perro", value: "perro" },
  { label: "Gato", value: "gato" },
]

const sexoOptions: Option<FormState["sexo"]>[] = [
  { label: "Macho", value: "macho" },
  { label: "Hembra", value: "hembra" },
]

const edadUnidadOptions: Option<FormState["edad_unidad"]>[] = [
  { label: "Años", value: "años" },
  { label: "Meses", value: "meses" },
]

const estadoSexualOptions: Option<FormState["estado_sexual"]>[] = [
  { label: "Intacto", value: "intacto" },
  { label: "Esterilizado", value: "esterilizado" },
]

const nivelActividadOptions: Option<FormState["nivel_actividad"]>[] = [
  { label: "Alto", value: "alto" },
  { label: "Medio", value: "medio" },
  { label: "Bajo", value: "bajo" },
]

const condicionCorporalOptions: Option<FormState["condicion_corporal"]>[] = [
  { label: "Delgado", value: "delgado" },
  { label: "Ideal", value: "ideal" },
  { label: "Sobrepeso", value: "sobrepeso" },
  { label: "Obeso", value: "obeso" },
]

const objetivoPesoOptions: Option<FormState["objetivo_peso"]>[] = [
  { label: "Mantener", value: "mantener" },
  { label: "Bajar", value: "bajar" },
  { label: "Subir", value: "subir" },
]

const comidaExtraOptions: Option<FormState["comida_extra"]>[] = [
  { label: "Nada", value: "nada" },
  { label: "Poco", value: "poco" },
  { label: "Medio", value: "medio" },
  { label: "Mucho", value: "mucho" },
]

function createCustomerId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `web_${crypto.randomUUID()}`
  }
  return `web_${Date.now()}`
}

function confidenceToPercentage(value: number): number {
  if (!Number.isFinite(value)) {
    return 0
  }

  return Math.max(0, Math.min(100, Math.round(value * 100)))
}

function FieldSelect<T extends string>({
  onChange,
  options,
  value,
}: {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  options: Option<T>[]
  value: T
}) {
  return (
    <select className={selectClassName} value={value} onChange={onChange}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export default function FoodRecommenderPage() {
  const [form, setForm] = useState<FormState>(initialState)
  const [customerId, setCustomerId] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>("")
  const [result, setResult] = useState<RecommendationResponse | null>(null)

  useEffect(() => {
    const fromStorage = window.localStorage.getItem(CUSTOMER_ID_STORAGE_KEY)
    if (fromStorage && fromStorage.trim()) {
      setCustomerId(fromStorage)
      return
    }

    const generated = createCustomerId()
    window.localStorage.setItem(CUSTOMER_ID_STORAGE_KEY, generated)
    setCustomerId(generated)
  }, [])

  const canSubmit = useMemo(() => {
    return !isSubmitting
  }, [isSubmitting])

  const handleInputChange =
    (key: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = event.target.value
      setForm((previous) => ({ ...previous, [key]: value }))
    }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setResult(null)

    const edadValor = Number(form.edad_valor)
    const pesoKg = Number(form.peso_kg)

    if (!Number.isFinite(edadValor) || edadValor <= 0) {
      setError("La edad debe ser un número mayor a 0.")
      return
    }
    if (!Number.isFinite(pesoKg) || pesoKg <= 0) {
      setError("El peso debe ser un número mayor a 0.")
      return
    }

    setIsSubmitting(true)

    const ensuredCustomerId = customerId || createCustomerId()
    if (!customerId) {
      window.localStorage.setItem(CUSTOMER_ID_STORAGE_KEY, ensuredCustomerId)
      setCustomerId(ensuredCustomerId)
    }

    try {
      const response = await fetch("/api/food-recommender/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: ensuredCustomerId,
          petProfile: {
            nombre: form.nombre,
            especie: form.especie,
            sexo: form.sexo,
            edad: {
              valor: edadValor,
              unidad: form.edad_unidad,
            },
            peso_kg: pesoKg,
            raza: form.raza,
            condiciones_salud: form.condiciones_salud,
            direccion: form.direccion,
            estado_sexual: form.estado_sexual,
            nivel_actividad: form.nivel_actividad,
            condicion_corporal: form.condicion_corporal,
            objetivo_peso: form.objetivo_peso,
            comida_extra: form.comida_extra,
          },
        }),
      })
      const raw = await response.text()
      let data: RecommendationResponse | { error?: string } = { error: "Respuesta inválida del servidor." }
      if (raw) {
        try {
          data = JSON.parse(raw) as RecommendationResponse | { error?: string }
        } catch {
          data = { error: "Respuesta inválida del servidor." }
        }
      }

      if (!response.ok) {
        setError(
          typeof (data as { error?: string }).error === "string"
            ? (data as { error: string }).error
            : "No fue posible obtener recomendaciones.",
        )
        return
      }

      setResult(data as RecommendationResponse)
    } catch {
      setError("No fue posible conectar con el backend.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader actions={FOOD_RECOMMENDER_HEADER_ACTIONS} />

      <main className="relative overflow-hidden py-14 md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background" />
        <div className="pointer-events-none absolute left-10 top-14 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-12 right-8 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

        <section className="container mx-auto max-w-7xl px-6 pb-10 md:pb-12">
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-[#FFD700] bg-[#FFD700]/20 px-6 py-3 text-sm font-bold tracking-wide">
              <Sparkles className="h-4 w-4 text-[#CC8A00]" />
              NUTRICIÓN PERSONALIZADA
            </div>
            <h1 className="mt-6 text-balance text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Recomendador de alimento para tu mascota
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Prueba nuestra tecnología de IA para recomendarte el alimento perfecto para tu mascota!
            </p>
          </div>
        </section>

        <section className="container relative z-10 mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="premium-card glass-card border-2 border-white/60 p-6 shadow-premium-lg md:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Perfil de Mascota</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Danos los datos de tu mascota y te recomendaremos alimentos que se ajusten a sus necesidades!
                </p>
              </div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <PawPrint className="h-6 w-6 text-primary" />
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold">Nombre</label>
                  <Input required value={form.nombre} onChange={handleInputChange("nombre")} className={inputClassName} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold">Especie</label>
                  <FieldSelect
                    value={form.especie}
                    onChange={handleInputChange("especie")}
                    options={especieOptions}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold">Sexo</label>
                  <FieldSelect value={form.sexo} onChange={handleInputChange("sexo")} options={sexoOptions} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold">Edad (valor)</label>
                  <Input
                    required
                    type="number"
                    step="0.1"
                    inputMode="decimal"
                    value={form.edad_valor}
                    onChange={handleInputChange("edad_valor")}
                    placeholder="Ej: 2"
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold">Edad (unidad)</label>
                  <FieldSelect
                    value={form.edad_unidad}
                    onChange={handleInputChange("edad_unidad")}
                    options={edadUnidadOptions}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold">Peso (kg)</label>
                  <Input
                    required
                    type="number"
                    step="0.1"
                    inputMode="decimal"
                    value={form.peso_kg}
                    onChange={handleInputChange("peso_kg")}
                    placeholder="Ej: 12.5"
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold">Raza</label>
                  <Input required value={form.raza} onChange={handleInputChange("raza")} className={inputClassName} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold">Estado sexual</label>
                  <FieldSelect
                    value={form.estado_sexual}
                    onChange={handleInputChange("estado_sexual")}
                    options={estadoSexualOptions}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold">Nivel de actividad</label>
                  <FieldSelect
                    value={form.nivel_actividad}
                    onChange={handleInputChange("nivel_actividad")}
                    options={nivelActividadOptions}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold">Condición corporal</label>
                  <FieldSelect
                    value={form.condicion_corporal}
                    onChange={handleInputChange("condicion_corporal")}
                    options={condicionCorporalOptions}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold">Objetivo de peso</label>
                  <FieldSelect
                    value={form.objetivo_peso}
                    onChange={handleInputChange("objetivo_peso")}
                    options={objetivoPesoOptions}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold">Comida extra</label>
                  <FieldSelect
                    value={form.comida_extra}
                    onChange={handleInputChange("comida_extra")}
                    options={comidaExtraOptions}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold">Condiciones de salud</label>
                <textarea
                  className={textareaClassName}
                  value={form.condiciones_salud}
                  onChange={handleInputChange("condiciones_salud")}
                  placeholder="Ej: ninguna, alergia a pollo, sensibilidad digestiva..."
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Dirección</label>
                <textarea
                  required
                  className={textareaClassName}
                  value={form.direccion}
                  onChange={handleInputChange("direccion")}
                  placeholder="Dirección de despacho"
                />
              </div>

              {error ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                  {error}
                </p>
              ) : null}

              <Button
                disabled={!canSubmit}
                className="w-full rounded-full bg-primary text-base text-primary-foreground shadow-premium-lg transition-all hover:bg-primary/90 hover:shadow-2xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generando recomendaciones...
                  </>
                ) : (
                  <>
                    Recomendar alimentos
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </Card>

          <Card className="premium-card border-2 border-border/70 bg-white/85 p-6 shadow-premium-lg md:p-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Resultados</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Se muestran hasta 6 opciones con imagen, explicación nutricional y nivel de confianza.
            </p>

            {!result ? (
              <div className="mt-6 rounded-2xl border-2 border-dashed border-border/80 bg-muted/20 p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Completa el formulario y presiona{" "}
                  <span className="font-semibold text-foreground">&quot;Recomendar alimentos&quot;</span> para cargar los
                  resultados.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-border/80 bg-muted/20 p-4 text-sm">
                  <p className="font-semibold text-foreground">Mascota guardada</p>
                  <p className="mt-1 text-muted-foreground">ID: {String(result.pet.id ?? "N/A")}</p>
                </div>

                {result.recommendations.map((recommendation) => {
                  const confidence = confidenceToPercentage(recommendation.confidence)

                  return (
                    <article
                      key={`${recommendation.rank}-${recommendation.food_id}`}
                      className="rounded-2xl border-2 border-border/80 bg-white/90 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row">
                        <img
                          src={recommendation.image_url}
                          alt={recommendation.label}
                          className="h-40 w-full rounded-xl border border-border/70 object-cover sm:w-36"
                          loading="lazy"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                              Ranking #{recommendation.rank}
                            </p>
                            <p className="text-xs text-muted-foreground">ID: {recommendation.food_id}</p>
                          </div>
                          <h3 className="mt-2 text-lg font-bold leading-tight text-foreground">{recommendation.label}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{recommendation.why}</p>

                          <div className="mt-4">
                            <div className="mb-1.5 flex items-center justify-between text-xs">
                              <span className="font-semibold text-foreground">Confianza</span>
                              <span className="text-muted-foreground">{confidence}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-muted/60">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-primary to-[#FF7A00]"
                                style={{ width: `${confidence}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })}

                <div className="rounded-xl border border-border/80 bg-muted/20 p-4 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Nota:</span> {result.notes}
                </div>
              </div>
            )}
          </Card>
        </section>
      </main>
    </div>
  )
}
