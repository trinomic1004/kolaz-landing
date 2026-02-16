import { NextResponse } from "next/server"

import { RecommenderHttpError, recommendFoods } from "@/lib/food-recommender/service"

export async function POST(request: Request) {
  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 })
  }

  try {
    const result = await recommendFoods(payload)
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    if (error instanceof RecommenderHttpError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    return NextResponse.json({ error: "Error interno inesperado." }, { status: 500 })
  }
}
