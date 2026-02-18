"use client"

import { useState } from "react"

import { Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export type HeaderAction = {
  label: string
  href: string
  className?: string
}

export type SiteHeaderProps = {
  actions: HeaderAction[]
  logoHref?: string
  logoClassName?: string
  headerClassName?: string
}

const DEFAULT_HEADER_CLASS_NAME =
  "sticky top-0 z-50 w-full border-b border-white/10 bg-[#FF0000]/95 backdrop-blur-xl shadow-premium"
const DEFAULT_LOGO_HREF = "/"
const DEFAULT_LOGO_CLASS_NAME = "cursor-pointer hover:scale-105 transition-transform duration-300"
const LOGO_SRC =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imag2e-YCSsxyA9MGcWS017lPzUCiHeT9noYt.png"
const MOBILE_TRIGGER_CLASS_NAME =
  "h-10 w-10 rounded-full bg-white text-[#FF0000] hover:bg-white/95 shadow-lg hover:shadow-xl"

function renderActionLabel(action: HeaderAction, isMobile: boolean) {
  return (
    <Button
      size="lg"
      className={cn(
        action.className,
        isMobile ? "w-full justify-center" : "",
      )}
    >
      {action.label}
    </Button>
  )
}

export function SiteHeader({
  actions,
  logoHref = DEFAULT_LOGO_HREF,
  logoClassName = DEFAULT_LOGO_CLASS_NAME,
  headerClassName = DEFAULT_HEADER_CLASS_NAME,
}: SiteHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const desktopActionsGapClassName = actions.length >= 3 ? "gap-4" : "gap-3"

  const handleHashClick = (hashHref: string) => {
    const targetId = hashHref.replace(/^#/, "")
    if (!targetId) {
      return
    }

    const target = document.getElementById(targetId)
    if (!target) {
      return
    }

    target.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <header className={headerClassName}>
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href={logoHref} className={logoClassName}>
          <Image src={LOGO_SRC} alt="Kolaz" width={60} height={60} className="h-12 w-12" />
        </Link>

        <div className={cn("hidden items-center sm:flex", desktopActionsGapClassName)}>
          {actions.map((action) => {
            if (action.href.startsWith("#")) {
              return (
                <Link
                  key={`${action.href}:${action.label}`}
                  href={action.href}
                  onClick={(event) => {
                    event.preventDefault()
                    handleHashClick(action.href)
                  }}
                >
                  {renderActionLabel(action, false)}
                </Link>
              )
            }

            return (
              <Link key={`${action.href}:${action.label}`} href={action.href}>
                {renderActionLabel(action, false)}
              </Link>
            )
          })}
        </div>

        <Button
          type="button"
          size="icon"
          className={cn(MOBILE_TRIGGER_CLASS_NAME, "sm:hidden")}
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Abrir menú de navegación"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <Dialog open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <DialogContent className="max-w-sm border-2 shadow-premium-lg sm:hidden">
          <DialogHeader>
            <DialogTitle>Navegación</DialogTitle>
          </DialogHeader>
          <nav className="mt-2 flex flex-col gap-3">
            {actions.map((action) => {
              if (action.href.startsWith("#")) {
                return (
                  <Link
                    key={`${action.href}:${action.label}:mobile`}
                    href={action.href}
                    onClick={(event) => {
                      event.preventDefault()
                      setIsMobileMenuOpen(false)
                      handleHashClick(action.href)
                    }}
                  >
                    {renderActionLabel(action, true)}
                  </Link>
                )
              }

              return (
                <Link
                  key={`${action.href}:${action.label}:mobile`}
                  href={action.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {renderActionLabel(action, true)}
                </Link>
              )
            })}
          </nav>
        </DialogContent>
      </Dialog>
    </header>
  )
}
