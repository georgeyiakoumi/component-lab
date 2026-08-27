"use client"

import * as React from "react"
import { X } from "lucide-react"
import { ScrollArea } from "@base-ui/react/scroll-area"

import { cn } from "@/lib/utils"
import { ComponentPicker } from "@/components/playground/component-picker"

/* ── Types ──────────────────────────────────────────────────────── */

export interface Tab {
  slug: string
  name: string
}

interface TabBarProps {
  tabs: Tab[]
  activeSlug: string | null
  onSelect: (slug: string) => void
  onClose: (slug: string) => void
  onAdd: (slug: string) => void
}

/* ── Scrollbar classes ──────────────────────────────────────────── */

const SCROLLBAR_H =
  "m-px flex h-2 items-center bg-transparent opacity-0 transition-opacity data-[hovering]:opacity-100 data-[scrolling]:opacity-100 data-[scrolling]:duration-0"
const THUMB = "w-full rounded-full bg-muted-foreground/30"

/* ── Component ──────────────────────────────────────────────────── */

export function TabBar({ tabs, activeSlug, onSelect, onClose, onAdd }: TabBarProps) {
  return (
    <div className="flex h-9 shrink-0 items-stretch border-b bg-muted/30">
      <ScrollArea.Root className="flex min-w-0 flex-1">
        <ScrollArea.Viewport className="h-full">
          <ScrollArea.Content className="flex h-full items-stretch">
            {tabs.map((tab) => {
              const isActive = tab.slug === activeSlug
              return (
                <button
                  key={tab.slug}
                  type="button"
                  onClick={() => onSelect(tab.slug)}
                  className={cn(
                    "group relative flex shrink-0 items-center gap-1.5 border-r px-3 text-xs transition-colors",
                    isActive
                      ? "bg-background text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  <span className="truncate">{tab.name}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation()
                      onClose(tab.slug)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.stopPropagation()
                        onClose(tab.slug)
                      }
                    }}
                    className={cn(
                      "flex size-4 items-center justify-center rounded-sm transition-colors hover:bg-muted-foreground/20",
                      isActive
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100",
                    )}
                    aria-label={`Close ${tab.name}`}
                  >
                    <X className="size-3" />
                  </span>
                  {isActive && (
                    <span className="absolute inset-x-0 bottom-0 h-px bg-primary" />
                  )}
                </button>
              )
            })}
            <ComponentPicker
              openSlugs={new Set(tabs.map((t) => t.slug))}
              onSelect={onAdd}
            />
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="horizontal" className={SCROLLBAR_H}>
          <ScrollArea.Thumb className={THUMB} />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  )
}
