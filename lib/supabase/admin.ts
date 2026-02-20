import "server-only"

type JsonRecord = Record<string, unknown>

export class SupabaseAdminError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.name = "SupabaseAdminError"
  }
}

function normalizeEnvValue(value: string | undefined): string | null {
  if (!value) {
    return null
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  const hasDoubleQuotes = trimmed.startsWith('"') && trimmed.endsWith('"')
  const hasSingleQuotes = trimmed.startsWith("'") && trimmed.endsWith("'")
  const unquoted = hasDoubleQuotes || hasSingleQuotes ? trimmed.slice(1, -1).trim() : trimmed

  return unquoted || null
}

function getSupabaseUrl(): string {
  const value =
    normalizeEnvValue(process.env.SUPABASE_URL) ??
    normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL)
  if (!value) {
    throw new SupabaseAdminError(500, "SUPABASE_URL no está configurado.")
  }
  return value
}

function getServiceRoleKey(): string {
  const value = normalizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY)
  if (!value) {
    throw new SupabaseAdminError(500, "SUPABASE_SERVICE_ROLE_KEY no está configurado.")
  }
  return value
}

function buildHeaders(extraHeaders?: HeadersInit): Headers {
  const serviceRoleKey = getServiceRoleKey()
  const headers = new Headers(extraHeaders)
  headers.set("apikey", serviceRoleKey)
  headers.set("Authorization", `Bearer ${serviceRoleKey}`)
  return headers
}

async function parseErrorMessage(response: Response): Promise<string> {
  const fallback = `Supabase request failed with status ${response.status}`
  try {
    const data = (await response.json()) as JsonRecord
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message
    }
    if (typeof data.error_description === "string" && data.error_description.trim()) {
      return data.error_description
    }
    if (typeof data.error === "string" && data.error.trim()) {
      return data.error
    }
    return fallback
  } catch {
    return fallback
  }
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getSupabaseUrl()}${path}`, {
    ...init,
    headers: buildHeaders(init?.headers),
    cache: "no-store",
  })

  if (!response.ok) {
    const message = await parseErrorMessage(response)
    throw new SupabaseAdminError(response.status, message)
  }

  return (await response.json()) as T
}

export async function insertPetRow(row: JsonRecord): Promise<JsonRecord> {
  const result = await requestJson<JsonRecord[] | JsonRecord>("/rest/v1/pets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(row),
  })

  if (Array.isArray(result)) {
    if (!result[0]) {
      throw new SupabaseAdminError(500, "Supabase no devolvió la mascota creada.")
    }
    return result[0]
  }

  return result
}

export async function insertStoreRow(row: JsonRecord): Promise<JsonRecord> {
  const result = await requestJson<JsonRecord[] | JsonRecord>("/rest/v1/stores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(row),
  })

  if (Array.isArray(result)) {
    if (!result[0]) {
      throw new SupabaseAdminError(500, "Supabase no devolvió la tienda creada.")
    }
    return result[0]
  }

  return result
}

export async function getFoodsRows(): Promise<JsonRecord[]> {
  const result = await requestJson<JsonRecord[]>("/rest/v1/foods?select=*")
  return Array.isArray(result) ? result : []
}

export async function getFoodsBrandRows(): Promise<JsonRecord[]> {
  const result = await requestJson<JsonRecord[]>("/rest/v1/foods?select=ID,MARCA,image_path&order=MARCA.asc")
  return Array.isArray(result) ? result : []
}

export function getPublicStorageUrl(bucket: string, path: string): string {
  const encodedBucket = encodeURIComponent(bucket)
  const encodedPath = path
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/")
  return `${getSupabaseUrl()}/storage/v1/object/public/${encodedBucket}/${encodedPath}`
}
