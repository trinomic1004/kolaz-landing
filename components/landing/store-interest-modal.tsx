"use client"

import type React from "react"
import { useEffect, useState } from "react"

import { ArrowRight, CheckCircle2 } from "lucide-react"

import { OPEN_STORE_INTEREST_MODAL_EVENT } from "@/components/landing/waitlist-events"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type StoreInterestForm = {
  name: string
  brandStore: string
  email: string
}

const INITIAL_FORM: StoreInterestForm = {
  name: "",
  brandStore: "",
  email: "",
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function StoreInterestModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState<StoreInterestForm>(INITIAL_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const openModal = () => {
      setIsOpen(true)
    }

    window.addEventListener(OPEN_STORE_INTEREST_MODAL_EVENT, openModal)
    return () => {
      window.removeEventListener(OPEN_STORE_INTEREST_MODAL_EVENT, openModal)
    }
  }, [])

  const handleFieldChange =
    (field: keyof StoreInterestForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }))
      if (errorMessage) {
        setErrorMessage(null)
      }
      if (successMessage) {
        setSuccessMessage(null)
      }
    }

  const validateForm = (): string | null => {
    const name = form.name.trim()
    const brandStore = form.brandStore.trim()
    const email = form.email.trim()

    if (!name) {
      return "El nombre es obligatorio."
    }
    if (!brandStore) {
      return "La marca o tienda es obligatoria."
    }
    if (!email) {
      return "El email es obligatorio."
    }
    if (!EMAIL_REGEX.test(email)) {
      return "Ingresa un email válido."
    }
    return null
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await fetch("/api/stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          brandStore: form.brandStore.trim(),
          email: form.email.trim(),
        }),
      })

      const data = (await response.json().catch(() => null)) as { error?: string } | null

      if (!response.ok) {
        throw new Error(data?.error || "No pudimos registrar tu tienda. Intenta nuevamente.")
      }

      setSuccessMessage("¡Gracias! Guardamos tus datos y te contactaremos pronto.")
      setForm(INITIAL_FORM)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Ocurrió un error inesperado.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setIsOpen(nextOpen)
    if (!nextOpen) {
      setForm(INITIAL_FORM)
      setErrorMessage(null)
      setSuccessMessage(null)
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md border-2 shadow-premium-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent sm:text-3xl">
            Registra tu interés
          </DialogTitle>
          <DialogDescription className="text-center text-base mt-3 text-muted-foreground">
            Completa tus datos y te contactaremos para sumar tu tienda a la red Kolaz.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="store-interest-name" className="text-sm font-medium text-foreground">
              Name
            </label>
            <Input
              id="store-interest-name"
              type="text"
              placeholder="Tu nombre"
              value={form.name}
              onChange={handleFieldChange("name")}
              required
              disabled={isSubmitting}
              className="h-12 border-2 focus:border-primary transition-colors shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="store-interest-brand-store" className="text-sm font-medium text-foreground">
              Brand Store
            </label>
            <Input
              id="store-interest-brand-store"
              type="text"
              placeholder="Nombre de tu tienda o marca"
              value={form.brandStore}
              onChange={handleFieldChange("brandStore")}
              required
              disabled={isSubmitting}
              className="h-12 border-2 focus:border-primary transition-colors shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="store-interest-email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              id="store-interest-email"
              type="email"
              placeholder="tu@email.com"
              value={form.email}
              onChange={handleFieldChange("email")}
              required
              disabled={isSubmitting}
              className="h-12 border-2 focus:border-primary transition-colors shadow-sm"
            />
          </div>

          {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
          {successMessage && (
            <p className="inline-flex items-center gap-2 text-sm text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              {successMessage}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full rounded-full bg-primary text-lg text-primary-foreground hover:bg-primary/90 btn-glow shadow-premium-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar datos"}
            {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
