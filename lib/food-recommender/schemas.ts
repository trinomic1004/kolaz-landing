import { z } from "zod"

export const especieValues = ["perro", "gato"] as const
export const sexoValues = ["macho", "hembra"] as const
export const edadUnidadValues = ["años", "meses"] as const
export const estadoSexualValues = ["intacto", "esterilizado"] as const
export const nivelActividadValues = ["alto", "medio", "bajo"] as const
export const condicionCorporalValues = ["delgado", "ideal", "sobrepeso", "obeso"] as const
export const objetivoPesoValues = ["mantener", "bajar", "subir"] as const
export const comidaExtraValues = ["nada", "poco", "medio", "mucho"] as const

export const petProfileSchema = z.object({
  nombre: z.string().trim().min(1),
  especie: z.enum(especieValues),
  sexo: z.enum(sexoValues),
  edad: z.object({
    valor: z.number().finite().positive(),
    unidad: z.enum(edadUnidadValues),
  }),
  peso_kg: z.number().finite().positive(),
  raza: z.string().trim().min(1),
  condiciones_salud: z.string().trim().min(1),
  direccion: z.string().trim().min(1),
  estado_sexual: z.enum(estadoSexualValues),
  nivel_actividad: z.enum(nivelActividadValues),
  condicion_corporal: z.enum(condicionCorporalValues),
  objetivo_peso: z.enum(objetivoPesoValues),
  comida_extra: z.enum(comidaExtraValues),
})

export const recommendationRequestSchema = z.object({
  customerId: z.string().trim().min(1).optional(),
  petProfile: petProfileSchema,
})

export const llmRecommendationSchema = z.object({
  recommendations: z
    .array(
      z.object({
        rank: z.number().int().min(1).max(6),
        food_id: z.string().trim().min(1),
        why: z.string().trim().min(1),
        confidence: z.number().min(0).max(1),
      }),
    )
    .min(1)
    .max(6),
  notes: z.string(),
})

export type RecommendationRequest = z.infer<typeof recommendationRequestSchema>
export type PetProfileInput = z.infer<typeof petProfileSchema>
export type LlmRecommendationOutput = z.infer<typeof llmRecommendationSchema>
