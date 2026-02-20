"use client"

import type React from "react"

import { OPEN_STORE_INTEREST_MODAL_EVENT } from "@/components/landing/waitlist-events"
import { Button } from "@/components/ui/button"

type StoreInterestOpenButtonProps = React.ComponentProps<typeof Button>

export function StoreInterestOpenButton({ onClick, ...props }: StoreInterestOpenButtonProps) {
  return (
    <Button
      {...props}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) {
          return
        }
        window.dispatchEvent(new Event(OPEN_STORE_INTEREST_MODAL_EVENT))
      }}
    />
  )
}
