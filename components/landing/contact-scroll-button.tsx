"use client"

import type React from "react"

import { Button } from "@/components/ui/button"

type ContactScrollButtonProps = Omit<React.ComponentProps<typeof Button>, "onClick">

export function ContactScrollButton(props: ContactScrollButtonProps) {
  return (
    <Button
      {...props}
      onClick={() => {
        document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })
      }}
    />
  )
}
