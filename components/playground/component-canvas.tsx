"use client"

import { cn } from "@/lib/utils"
import { renderComponent } from "@/lib/component-renderer"
import { breakpoints, type Breakpoint } from "@/components/playground/toolbar"

/* ── Types ──────────────────────────────────────────────────────── */

interface ComponentCanvasProps {
  slug: string
  componentName: string
  theme?: "light" | "dark"
  breakpoint?: Breakpoint
  previewProps?: Record<string, string>
}

/* ── Component ──────────────────────────────────────────────────── */

export function ComponentCanvas({
  slug,
  componentName: _componentName,
  theme = "light",
  breakpoint = "2xl",
  previewProps,
}: ComponentCanvasProps) {
  const bp = breakpoints.find((b) => b.key === breakpoint)
  const maxWidth = bp?.width

  return (
    <div className="flex flex-1 justify-center overflow-auto bg-background">
      <div
        className={cn(
          "flex w-full items-center justify-center p-8 text-foreground transition-all duration-300",
          theme === "dark" && "dark",
        )}
        style={{
          maxWidth: maxWidth ? `${maxWidth}px` : undefined,
          colorScheme: theme === "dark" ? "dark" : "light",
        }}
      >
        {renderComponent(slug, previewProps ?? {})}
      </div>
    </div>
  )
}
