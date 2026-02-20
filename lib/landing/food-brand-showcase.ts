import "server-only"

import { unstable_cache } from "next/cache"

import {
  SupabaseAdminError,
  getFoodsBrandRows,
  getPublicStorageUrl,
} from "@/lib/supabase/admin"

type JsonRecord = Record<string, unknown>

type BrandAccumulator = {
  brand: string
  formulasCount: number
  sampleId: string | null
  sampleImagePath: string | null
}

export type FoodBrandShowcaseTile = {
  brand: string
  formulasCount: number
  imageUrl: string
}

const FOOD_IMAGES_BUCKET = "food-images"
const BRAND_IMAGE_PATH_OVERRIDES: Record<string, string> = {
  "BRIT CARE": "foods/209.jpg",
}

function hasSupabaseAdminEnv(): boolean {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  return Boolean(supabaseUrl?.trim() && serviceRoleKey?.trim())
}

function trimToNull(value: unknown): string | null {
  if (typeof value !== "string") {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length ? trimmed : null
}

function getBrand(row: JsonRecord): string | null {
  return trimToNull(row.MARCA) ?? trimToNull(row.marca)
}

function getImagePath(row: JsonRecord): string | null {
  return trimToNull(row.image_path)
}

function getFoodId(row: JsonRecord): string | null {
  const raw = row.ID ?? row.id
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return String(raw)
  }
  return trimToNull(raw)
}

function normalizeBrandTiles(rows: JsonRecord[]): FoodBrandShowcaseTile[] {
  const grouped = new Map<string, BrandAccumulator>()

  for (const row of rows) {
    const brand = getBrand(row)
    if (!brand) {
      continue
    }

    const imagePath = getImagePath(row)
    const foodId = getFoodId(row)

    const existing = grouped.get(brand)
    if (!existing) {
      grouped.set(brand, {
        brand,
        formulasCount: 1,
        sampleId: foodId,
        sampleImagePath: imagePath,
      })
      continue
    }

    existing.formulasCount += 1
    if (!existing.sampleImagePath && imagePath) {
      existing.sampleImagePath = imagePath
    }
    if (!existing.sampleId && foodId) {
      existing.sampleId = foodId
    }
  }

  return Array.from(grouped.values())
    .sort((a, b) => a.brand.localeCompare(b.brand, "es"))
    .map((brand) => {
      const fallbackPath = brand.sampleId ? `foods/${brand.sampleId}.jpg` : null
      const imagePath =
        BRAND_IMAGE_PATH_OVERRIDES[brand.brand] ?? brand.sampleImagePath ?? fallbackPath
      if (!imagePath) {
        return null
      }

      return {
        brand: brand.brand,
        formulasCount: brand.formulasCount,
        imageUrl: getPublicStorageUrl(FOOD_IMAGES_BUCKET, imagePath),
      }
    })
    .filter((tile): tile is FoodBrandShowcaseTile => tile !== null)
}

const getCachedFoodBrandShowcaseTiles = unstable_cache(
  async (): Promise<FoodBrandShowcaseTile[]> => {
    const rows = await getFoodsBrandRows()
    return normalizeBrandTiles(rows)
  },
  ["landing-food-brand-showcase-tiles-v2"],
  { revalidate: 60 * 60 * 6 },
)

export async function getFoodBrandShowcaseTiles(): Promise<FoodBrandShowcaseTile[]> {
  if (!hasSupabaseAdminEnv()) {
    return []
  }

  try {
    return await getCachedFoodBrandShowcaseTiles()
  } catch (error) {
    if (error instanceof SupabaseAdminError) {
      const logger = process.env.NODE_ENV === "production" ? console.error : console.warn
      logger(
        `[landing] no fue posible cargar marcas de foods (status=${error.status}, message=${error.message})`,
      )
      return []
    }

    const logger = process.env.NODE_ENV === "production" ? console.error : console.warn
    logger("[landing] error inesperado cargando marcas de foods")
    return []
  }
}
