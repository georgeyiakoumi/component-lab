"use client"

import * as React from "react"
import { Plus, ChevronRight } from "lucide-react"
import { Popover } from "@base-ui/react/popover"

import { cn } from "@/lib/utils"
import {
  getBaseUIComponentsByCategory,
  type ComponentCategory,
} from "@/lib/base-ui-registry"

/* ── Types ──────────────────────────────────────────────────────── */

interface ComponentPickerProps {
  openSlugs: Set<string>
  onSelect: (slug: string) => void
}

/* ── Categories ─────────────────────────────────────────────────── */

const CATEGORIES: ComponentCategory[] = [
  "Inputs",
  "Forms",
  "Overlays",
  "Navigation",
  "Layout",
  "Feedback",
  "Data Display",
]

/* ── Component ──────────────────────────────────────────────────── */

export function ComponentPicker({ openSlugs, onSelect }: ComponentPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [hoveredCategory, setHoveredCategory] = React.useState<ComponentCategory | null>(null)

  function handleSelect(slug: string) {
    onSelect(slug)
    setOpen(false)
    setHoveredCategory(null)
  }

  return (
    <Popover.Root
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) setHoveredCategory(null)
      }}
    >
      <Popover.Trigger
        className="flex shrink-0 items-center justify-center px-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
        aria-label="Open component"
      >
        <Plus className="size-3.5" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner className="outline-hidden" sideOffset={4} align="start">
          <Popover.Popup className="flex rounded-lg border bg-popover shadow-lg origin-[var(--transform-origin)] transition-[scale,opacity] duration-100 ease-out data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0 data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0">
            {/* Categories column */}
            <div className="flex w-44 flex-col p-1">
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Base UI
              </div>
              {CATEGORIES.map((cat) => {
                const isHovered = hoveredCategory === cat
                return (
                  <div
                    key={cat}
                    onMouseEnter={() => setHoveredCategory(cat)}
                    className={cn(
                      "flex cursor-default items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors",
                      isHovered
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground",
                    )}
                  >
                    <span>{cat}</span>
                    <ChevronRight className="size-3.5 text-muted-foreground" />
                  </div>
                )
              })}
            </div>

            {/* Components column — visible when hovering a category */}
            {hoveredCategory && (
              <div className="flex w-44 flex-col border-l p-1">
                {getBaseUIComponentsByCategory(hoveredCategory).map((comp) => {
                  const isOpen = openSlugs.has(comp.slug)
                  return (
                    <button
                      key={comp.slug}
                      type="button"
                      onClick={() => handleSelect(comp.slug)}
                      className={cn(
                        "flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                        isOpen && "text-muted-foreground",
                      )}
                    >
                      <span>{comp.name}</span>
                      {isOpen && (
                        <span className="text-xs text-muted-foreground">open</span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}
