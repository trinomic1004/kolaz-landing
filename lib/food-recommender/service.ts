import "server-only"

import { randomUUID } from "node:crypto"

import { FOOD_RECOMMENDER_SYSTEM_MESSAGE } from "@/lib/food-recommender/system-message"
import {
  llmRecommendationSchema,
  recommendationRequestSchema,
  type RecommendationRequest,
} from "@/lib/food-recommender/schemas"
import {
  SupabaseAdminError,
  getFoodsRows,
  getPublicStorageUrl,
  insertPetRow,
} from "@/lib/supabase/admin"

type JsonRecord = Record<string, unknown>

type FoodLite = {
  id: string
  marca: string | null
  modelo: string | null
  peso_kg: number | null
  caracteristicas: string | null
  analisis_garantizado: string | null
  energia_metabolizable: string | null
  ingredientes_principales: string | null
  claim_y_notas_formula: string | null
  etapa: string | null
  tipo: string | null
  tamano: string | null
  image_path: string | null
}

type FinalRecommendation = {
  rank: number
  food_id: string
  label: string
  why: string
  confidence: number
  image_url: string
}

type RecommendationResponse = {
  pet: JsonRecord
  recommendations: FinalRecommendation[]
  notes: string
}

const OPENAI_CHAT_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions"
const FOOD_IMAGES_BUCKET = "food-images"

export class RecommenderHttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.name = "RecommenderHttpError"
  }
}

function toNumberOrNull(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null
  }
  if (typeof value !== "string") {
    return null
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  const numericValue = Number(trimmed.replace(",", ".").replace(/[^0-9.+\-eE]/g, ""))
  return Number.isFinite(numericValue) ? numericValue : null
}

function trimToNull(value: unknown): string | null {
  if (typeof value !== "string") {
    return null
  }
  const trimmed = value.trim()
  return trimmed.length ? trimmed : null
}

function pickFirst(obj: JsonRecord, keys: string[]): unknown {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) {
      return obj[key]
    }
  }
  return null
}

function normalizeFoods(rows: JsonRecord[]): FoodLite[] {
  return rows
    .map((row) => {
      const idRaw = pickFirst(row, ["ID", "id"])
      if (idRaw === null) {
        return null
      }

      return {
        id: String(idRaw),
        marca: trimToNull(pickFirst(row, ["MARCA", "marca"])),
        modelo: trimToNull(pickFirst(row, ["MODELO", "modelo"])),
        peso_kg: toNumberOrNull(pickFirst(row, ["PESO KG", "PESO_KG", "peso_kg"])),
        caracteristicas: trimToNull(pickFirst(row, ["caracteristicas", "CARACTERISTICAS"])),
        analisis_garantizado: trimToNull(
          pickFirst(row, ["analisis_garantizado", "ANALISIS_GARANTIZADO"]),
        ),
        energia_metabolizable: trimToNull(
          pickFirst(row, ["energia_metabolizable", "ENERGIA_METABOLIZABLE"]),
        ),
        ingredientes_principales: trimToNull(
          pickFirst(row, ["ingredientes_principales", "INGREDIENTES_PRINCIPALES"]),
        ),
        claim_y_notas_formula: trimToNull(
          pickFirst(row, ["claim_y_notas_formula", "CLAIM_Y_NOTAS_FORMULA"]),
        ),
        etapa: trimToNull(pickFirst(row, ["etapa", "ETAPA"])),
        tipo: trimToNull(pickFirst(row, ["tipo", "TIPO"])),
        tamano: trimToNull(pickFirst(row, ["tamano", "TAMANO", "tamaño", "TAMAÑO"])),
        image_path: trimToNull(pickFirst(row, ["image_path"])),
      }
    })
    .filter((food): food is FoodLite => food !== null)
}

function normalizeAgeToMonths(ageValue: number, ageUnit: string): number {
  return ageUnit === "años" ? ageValue * 12 : ageValue
}

function buildAiInput(pet: JsonRecord, foods: FoodLite[]): string {
  return `PERFIL_PERRO_JSON: ${JSON.stringify(pet)}\nFOODS_JSON: ${JSON.stringify(foods)}`
}

function stripMarkdownFences(rawText: string): string {
  const trimmed = rawText.trim()
  if (!trimmed.startsWith("```")) {
    return trimmed
  }

  return trimmed
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim()
}

function extractOpenAIMessageContent(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    throw new RecommenderHttpError(502, "OpenAI devolvió un payload inválido.")
  }

  const choices = (payload as { choices?: unknown }).choices
  if (!Array.isArray(choices) || !choices[0]) {
    throw new RecommenderHttpError(502, "OpenAI no devolvió contenido de recomendación.")
  }

  const message = (choices[0] as { message?: unknown }).message
  if (!message || typeof message !== "object") {
    throw new RecommenderHttpError(502, "OpenAI no devolvió mensaje válido.")
  }

  const content = (message as { content?: unknown }).content
  if (typeof content === "string") {
    return content
  }

  if (Array.isArray(content)) {
    const text = content
      .map((part) => {
        if (!part || typeof part !== "object") {
          return ""
        }
        const maybeText = (part as { text?: unknown }).text
        return typeof maybeText === "string" ? maybeText : ""
      })
      .join("\n")
      .trim()

    if (text) {
      return text
    }
  }

  throw new RecommenderHttpError(502, "OpenAI devolvió respuesta sin texto utilizable.")
}

async function requestOpenAICompletion(body: JsonRecord): Promise<unknown> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new RecommenderHttpError(500, "OPENAI_API_KEY no está configurado.")
  }

  const response = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  })

  const raw = await response.text()
  let data: unknown = null
  try {
    data = JSON.parse(raw)
  } catch {
    data = null
  }

  if (!response.ok) {
    const errorMessage =
      typeof (data as { error?: { message?: string } } | null)?.error?.message === "string"
        ? (data as { error: { message: string } }).error.message
        : `OpenAI request failed with status ${response.status}`
    throw new RecommenderHttpError(502, errorMessage)
  }

  if (!data) {
    throw new RecommenderHttpError(502, "OpenAI devolvió una respuesta no parseable.")
  }

  return data
}

async function callFoodRecommenderLlm(aiInput: string): Promise<unknown> {
  const model = process.env.OPENAI_RECOMMENDER_MODEL?.trim() || "gpt-5.2"
  const baseBody = {
    model,
    messages: [
      { role: "system", content: FOOD_RECOMMENDER_SYSTEM_MESSAGE },
      { role: "user", content: aiInput },
    ],
    temperature: 0.2,
  }

  const bodies: JsonRecord[] = [
    {
      ...baseBody,
      response_format: { type: "json_object" },
    },
    baseBody,
  ]

  let lastError: unknown = null

  for (const body of bodies) {
    try {
      const payload = await requestOpenAICompletion(body)
      const content = extractOpenAIMessageContent(payload)
      return JSON.parse(stripMarkdownFences(content))
    } catch (error) {
      lastError = error
    }
  }

  if (lastError instanceof RecommenderHttpError) {
    throw lastError
  }
  throw new RecommenderHttpError(502, "No fue posible obtener recomendaciones del modelo.")
}

function getLabel(food: FoodLite): string {
  const brand = food.marca ?? ""
  const model = food.modelo ?? ""
  const base = `${brand} ${model}`.trim()
  if (food.peso_kg !== null) {
    return `${base || `Alimento ${food.id}`} (${food.peso_kg} kg)`
  }
  return base || `Alimento ${food.id}`
}

function getFoodImageUrl(food: FoodLite): string {
  const path = food.image_path ?? `foods/${food.id}.jpg`
  return getPublicStorageUrl(FOOD_IMAGES_BUCKET, path)
}

function normalizePetForAi(pet: JsonRecord): JsonRecord {
  const edadValor = toNumberOrNull(pet.edad_valor)
  const edadUnidad = trimToNull(pet.edad_unidad)
  const edadMeses =
    edadValor !== null && edadUnidad !== null ? normalizeAgeToMonths(edadValor, edadUnidad) : null

  return {
    ...pet,
    edad_valor: edadValor,
    peso_kg: toNumberOrNull(pet.peso_kg),
    edad_meses: edadMeses,
  }
}

function buildPetInsertPayload(input: RecommendationRequest, customerId: string): JsonRecord {
  const profile = input.petProfile
  return {
    customer_id: customerId,
    nombre: profile.nombre,
    especie: profile.especie,
    sexo: profile.sexo,
    edad_valor: profile.edad.valor,
    edad_unidad: profile.edad.unidad,
    peso_kg: profile.peso_kg,
    raza: profile.raza,
    condiciones_salud: profile.condiciones_salud,
    direccion: profile.direccion,
    estado_sexual: profile.estado_sexual,
    nivel_actividad: profile.nivel_actividad,
    condicion_corporal: profile.condicion_corporal,
    objetivo_peso: profile.objetivo_peso,
    comida_extra: profile.comida_extra,
  }
}

function clampConfidence(value: number): number {
  if (!Number.isFinite(value)) {
    return 0
  }
  if (value < 0) {
    return 0
  }
  if (value > 1) {
    return 1
  }
  return value
}

function mapRecommendations(
  foods: FoodLite[],
  llmOutput: unknown,
): { recommendations: FinalRecommendation[]; notes: string } {
  const parsed = llmRecommendationSchema.safeParse(llmOutput)
  if (!parsed.success) {
    throw new RecommenderHttpError(502, "La salida del modelo no cumplió el formato esperado.")
  }

  const foodsById = new Map(foods.map((food) => [food.id, food]))
  const used = new Set<string>()
  const selected: Array<{ food: FoodLite; why: string; confidence: number }> = []

  const ordered = [...parsed.data.recommendations].sort((a, b) => a.rank - b.rank)

  for (const recommendation of ordered) {
    const food = foodsById.get(recommendation.food_id)
    if (!food) {
      continue
    }
    if (used.has(food.id)) {
      continue
    }

    used.add(food.id)
    selected.push({
      food,
      why: recommendation.why,
      confidence: clampConfidence(recommendation.confidence),
    })
    if (selected.length >= 6) {
      break
    }
  }

  if (selected.length < 6) {
    for (const food of foods) {
      if (used.has(food.id)) {
        continue
      }
      used.add(food.id)
      selected.push({
        food,
        why: "Opción general disponible; validar adecuación específica según etapa y condiciones.",
        confidence: 0.35,
      })
      if (selected.length >= 6) {
        break
      }
    }
  }

  const recommendations: FinalRecommendation[] = selected.map((item, index) => ({
    rank: index + 1,
    food_id: item.food.id,
    label: getLabel(item.food),
    why: item.why,
    confidence: item.confidence,
    image_url: getFoodImageUrl(item.food),
  }))

  return {
    recommendations,
    notes:
      parsed.data.notes.trim() ||
      "Recomendación general. En caso de patologías o síntomas, validar con un médico veterinario.",
  }
}

export async function recommendFoods(payload: unknown): Promise<RecommendationResponse> {
  const parsedInput = recommendationRequestSchema.safeParse(payload)
  if (!parsedInput.success) {
    throw new RecommenderHttpError(400, "Payload inválido.")
  }

  const input = parsedInput.data
  if (input.petProfile.especie !== "perro") {
    throw new RecommenderHttpError(422, "Por ahora Food Recommender solo soporta perros.")
  }

  const customerId = input.customerId?.trim() || `web_${randomUUID()}`

  let pet: JsonRecord
  try {
    pet = await insertPetRow(buildPetInsertPayload(input, customerId))
  } catch (error) {
    if (error instanceof SupabaseAdminError) {
      throw new RecommenderHttpError(500, "No fue posible guardar la mascota en Supabase.")
    }
    throw error
  }

  let foodsRows: JsonRecord[]
  try {
    foodsRows = await getFoodsRows()
  } catch (error) {
    if (error instanceof SupabaseAdminError) {
      throw new RecommenderHttpError(500, "No fue posible leer foods desde Supabase.")
    }
    throw error
  }

  const foods = normalizeFoods(foodsRows)
  if (!foods.length) {
    throw new RecommenderHttpError(500, "No hay alimentos disponibles para recomendar.")
  }

  const petForAi = normalizePetForAi(pet)
  const aiInput = buildAiInput(petForAi, foods)
  const llmRaw = await callFoodRecommenderLlm(aiInput)
  const { recommendations, notes } = mapRecommendations(foods, llmRaw)

  return {
    pet,
    recommendations,
    notes,
  }
}
