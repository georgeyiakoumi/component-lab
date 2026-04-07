/**
 * Pillar 5c — slot picker for cva-style components.
 *
 * When the user is editing a stock component whose root className is a
 * cva-call (Button, Badge, Toggle, Item, ToggleGroup, Tabs), this picker
 * lets them choose which cva slot their next class edit will land in.
 *
 * Slots:
 * - "Base classes" — the cva's first argument (always-applied classes)
 * - "<group>: <value>" — every variant value, e.g. "variant: destructive",
 *   "size: lg"
 *
 * Single-select. Default = "Base classes". Independent of the toolbar's
 * preview state — the canvas keeps showing whatever variant the toolbar
 * dropdowns describe; this picker only controls where edits are written.
 *
 * Linear: GEO-303
 */

"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import type {
  CvaEditSlot,
  CvaSlotInfo,
} from "@/lib/parser/apply-class-edit"

export interface CvaSlotPickerProps {
  info: CvaSlotInfo
  selected: CvaEditSlot
  onChange: (slot: CvaEditSlot) => void
}

/** Stable string key for a `CvaEditSlot` so React can use it as a key. */
function slotKey(slot: CvaEditSlot): string {
  return slot.kind === "base" ? "base" : `${slot.group}:${slot.value}`
}

/** Compare two slots for equality. */
function slotsEqual(a: CvaEditSlot, b: CvaEditSlot): boolean {
  return slotKey(a) === slotKey(b)
}

export function CvaSlotPicker({
  info,
  selected,
  onChange,
}: CvaSlotPickerProps) {
  // Build the flat list of (label, slot) entries we render.
  const entries: Array<{ label: string; slot: CvaEditSlot }> = []

  if (info.baseAvailable) {
    entries.push({ label: "Base classes", slot: { kind: "base" } })
  }

  for (const group of info.groups) {
    for (const value of group.values) {
      entries.push({
        label: `${group.name}: ${value}`,
        slot: { kind: "variant", group: group.name, value },
      })
    }
  }

  return (
    <div
      className="border-b px-3 py-2"
      data-testid="cva-slot-picker"
      data-cva-name={info.cvaName}
    >
      <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        Editing target
      </div>
      <div
        role="radiogroup"
        aria-label="cva slot picker"
        className="flex flex-wrap gap-1"
      >
        {entries.map((entry) => {
          const isSelected = slotsEqual(entry.slot, selected)
          return (
            <button
              key={slotKey(entry.slot)}
              type="button"
              role="radio"
              aria-checked={isSelected}
              data-testid="cva-slot-option"
              data-slot-key={slotKey(entry.slot)}
              data-selected={isSelected ? "true" : "false"}
              onClick={() => onChange(entry.slot)}
              className={cn(
                "rounded border px-2 py-0.5 text-[10px] leading-tight transition-colors",
                isSelected
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground",
              )}
            >
              {entry.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
