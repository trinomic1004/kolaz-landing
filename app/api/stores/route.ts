import { NextResponse } from "next/server"

import { insertStoreRow, SupabaseAdminError } from "@/lib/supabase/admin"

type StoresPayload = {
  name?: unknown
  brandStore?: unknown
  email?: unknown
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getTrimmedString(value: unknown): string {
  if (typeof value !== "string") {
    return ""
  }
  return value.trim()
}

export async function POST(request: Request) {
  let payload: StoresPayload
  try {
    payload = (await request.json()) as StoresPayload
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 })
  }

  const name = getTrimmedString(payload?.name)
  const brandStore = getTrimmedString(payload?.brandStore)
  const email = getTrimmedString(payload?.email).toLowerCase()

  if (!name) {
    return NextResponse.json({ error: "Name es obligatorio." }, { status: 400 })
  }

  if (!brandStore) {
    return NextResponse.json({ error: "Brand Store es obligatorio." }, { status: 400 })
  }

  if (!email) {
    return NextResponse.json({ error: "Email es obligatorio." }, { status: 400 })
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Email inválido." }, { status: 400 })
  }

  try {
    await insertStoreRow({
      name,
      brand_store: brandStore,
      email,
      source: "kolaz-landing",
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof SupabaseAdminError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    return NextResponse.json({ error: "No fue posible guardar la tienda." }, { status: 500 })
  }
}
