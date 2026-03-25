"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { componentPreviews } from "@/lib/component-previews"

/* ── Types ──────────────────────────────────────────────────────── */

interface ComponentCanvasProps {
  slug: string
  componentName: string
  theme?: "light" | "dark"
  breakpoint?: "desktop" | "mobile"
}

/* ── Component ──────────────────────────────────────────────────── */

export function ComponentCanvas({
  slug,
  componentName,
  theme = "light",
  breakpoint = "desktop",
}: ComponentCanvasProps) {
  const PreviewComponent = componentPreviews[slug]

  return (
    <div className="flex flex-1 items-center justify-center bg-muted/30 p-8">
      <div
        className={cn(
          "w-full rounded-lg border bg-background p-8 shadow-sm transition-all duration-300",
          breakpoint === "mobile" && "max-w-sm",
          theme === "dark" && "dark",
        )}
      >
        {PreviewComponent ? (
          <PreviewComponent />
        ) : (
          <div className="space-y-2 text-center">
            <h2 className="text-lg font-medium">{componentName}</h2>
            <p className="text-sm text-muted-foreground">
              Preview not yet available
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
