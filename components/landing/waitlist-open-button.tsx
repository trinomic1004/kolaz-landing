"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { OPEN_WAITLIST_MODAL_EVENT } from "@/components/landing/waitlist-events"

type WaitlistOpenButtonProps = React.ComponentProps<typeof Button>

export function WaitlistOpenButton({ onClick, ...props }: WaitlistOpenButtonProps) {
  return (
    <Button
      {...props}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) {
          return
        }
        window.dispatchEvent(new Event(OPEN_WAITLIST_MODAL_EVENT))
      }}
    />
  )
}
