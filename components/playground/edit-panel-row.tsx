"use client"

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

interface EditPanelRowProps {
  /** Row label */
  label: string
  /** Optional inline value displayed next to the label */
  value?: string
  /** Optional clear callback — shows an X button next to the label/value when provided */
  onClear?: () => void
  /** Visual level — "default" has background card, "nested" is plain (for nesting inside a default row) */
  variant?: "default" | "nested"
  /** Additional class names */
  className?: string
  /** Control content — omit for a sub-heading with no controls */
  children?: React.ReactNode
}

function EditPanelRow({ label, value, onClear, variant = "default", className, children }: EditPanelRowProps) {
  return (
    <div className={cn(
      children && "space-y-2",
      variant === "default" && children && "rounded-md bg-muted/50 p-2",
      className,
    )}>
      <div className="flex items-center gap-1">
        <p className={cn(
          "flex-1 text-xs text-foreground",
          variant === "default"
            ? "font-semibold uppercase tracking-widest"
            : "font-medium",
        )}>
          {label}
          {value && (
            <span className="ml-1 font-normal normal-case tracking-normal text-muted-foreground">{value}</span>
          )}
        </p>
        {onClear && (
          <button
            type="button"
            className="shrink-0 text-muted-foreground hover:text-destructive"
            onClick={onClear}
          >
            <X className="size-3" />
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

export { EditPanelRow }
export type { EditPanelRowProps }
