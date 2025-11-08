import { NextResponse } from "next/server"

const WEBHOOK_URL =
  process.env.GS_WEBHOOK_URL ??
  "https://script.google.com/macros/s/AKfycbwGgelx4KutQm33jBtdFZ3lZS-KVgnTLwsUPfX7ndzVW619SWuJ3CiVvXPEEA6Nfou9/exec"

export async function POST(request: Request) {
  if (!WEBHOOK_URL) {
    return NextResponse.json(
      { error: "GS_WEBHOOK_URL no está configurado en el entorno." },
      { status: 500 },
    )
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 })
  }

  if (
    !payload ||
    typeof payload !== "object" ||
    !("email" in payload) ||
    typeof payload.email !== "string"
  ) {
    return NextResponse.json({ error: "Email requerido." }, { status: 400 })
  }

  const email = payload.email.trim()

  if (!email) {
    return NextResponse.json({ error: "Email requerido." }, { status: 400 })
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        email,
        source: "kolaz-landing",
      }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      const message = typeof data.error === "string" ? data.error : "No pudimos registrarte."

      return NextResponse.json({ error: message }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Error conectando con Google Sheets." }, { status: 502 })
  }
}
