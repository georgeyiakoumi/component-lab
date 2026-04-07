/**
 * Playground-specific Slider wrapper that adds an `active` prop used by
 * the visual editor's style controls. Composes the canonical shadcn
 * Slider (components/ui/slider.tsx) unchanged so that file stays
 * canonical for the M4 round-trip fidelity bar.
 *
 * The `active` prop drives a visual distinction between "user has
 * explicitly set this value" (blue track + blue thumb border) and
 * "slider is at its default / inactive" (transparent track, muted
 * thumb border). Auto-detects based on `value > min` if not passed
 * explicitly.
 *
 * Why a wrapper instead of modifying components/ui/slider.tsx directly:
 * the M4 parser needs to round-trip every file in components/ui/ byte-
 * for-byte against the upstream shadcn registry. Any local modification
 * to slider.tsx would break round-trip. Playground-specific UI features
 * belong here, not there.
 */

"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"

export interface ActiveSliderProps
  extends React.ComponentProps<typeof Slider> {
  /** Visual "is this slider actively set by the user?" hint. When true,
   *  the range turns blue and the thumb gets a blue border. When false,
   *  the range is transparent and the thumb has a muted border. If
   *  omitted, auto-detects from `value[0] > min`. */
  active?: boolean
}

export function ActiveSlider({
  active,
  className,
  ...props
}: ActiveSliderProps) {
  // Auto-detect: if value is at min (or no value), inactive
  const firstValue = Array.isArray(props.value) ? props.value[0] : undefined
  const min = props.min ?? 0
  const isActive = active ?? (firstValue !== undefined && firstValue > min)

  return (
    <Slider
      className={cn(
        // Reach into the canonical Slider's internal slots via the
        // [&_[data-slot=X]]: arbitrary-variant syntax. This is the
        // Tailwind v4 way of styling nested primitive children without
        // forking the component.
        isActive
          ? "[&_[data-slot=slider-range]]:bg-blue-500 [&_[data-slot=slider-thumb]]:border-blue-500"
          : "[&_[data-slot=slider-range]]:bg-transparent [&_[data-slot=slider-thumb]]:border-muted-foreground/30",
        className,
      )}
      {...props}
    />
  )
}
