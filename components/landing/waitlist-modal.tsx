"use client"

import type React from "react"
import { useEffect, useState } from "react"

import { ArrowRight } from "lucide-react"

import { OPEN_WAITLIST_MODAL_EVENT } from "@/components/landing/waitlist-events"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function WaitlistModal() {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const openModal = () => {
      setIsEmailModalOpen(true)
    }

    window.addEventListener(OPEN_WAITLIST_MODAL_EVENT, openModal)
    return () => {
      window.removeEventListener(OPEN_WAITLIST_MODAL_EVENT, openModal)
    }
  }, [])

  const handleEmailSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)

    // TODO: Add actual email collection logic here (e.g., API call)
    console.log("[v0] Email submitted:", email)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setEmail("")
    setIsEmailModalOpen(false)

    // Show success message (you can add a toast notification here)
    alert("¡Gracias! Te notificaremos cuando lancemos Kolaz.")
  }

  return (
    <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
      <DialogContent className="sm:max-w-md border-2 shadow-premium-lg">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            ¡Únete a la lista de espera!
          </DialogTitle>
          <DialogDescription className="text-center text-base mt-3 text-muted-foreground">
            Sé de los primeros en saber cuando lancemos Kolaz. Te notificaremos por email.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEmailSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="h-14 text-base border-2 focus:border-primary transition-colors shadow-sm"
              disabled={isSubmitting}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full rounded-full bg-primary text-lg text-primary-foreground hover:bg-primary/90 btn-glow shadow-premium-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Notifícame"}
            {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
