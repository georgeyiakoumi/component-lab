"use client"

import * as React from "react"
import {
  Monitor,
  Tablet,
  Smartphone,
  Moon,
  Sun,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { breakpoints, type Breakpoint, type PropSelector } from "@/components/playground/toolbar"

/* ── Props ──────────────────────────────────────────────────────── */

interface CanvasToolbarProps {
  theme?: "light" | "dark"
  onThemeChange?: (theme: "light" | "dark") => void
  breakpoint?: Breakpoint
  onBreakpointChange?: (breakpoint: Breakpoint) => void
  propSelectors?: PropSelector[]
  className?: string
}

/* ── Component ──────────────────────────────────────────────────── */

export function CanvasToolbar({
  theme = "light",
  onThemeChange,
  breakpoint = "2xl",
  onBreakpointChange,
  propSelectors,
  className,
}: CanvasToolbarProps) {
  const hasSelectors = propSelectors && propSelectors.length > 0

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          "flex h-10 shrink-0 items-center gap-1 border-b bg-muted/30 px-3",
          className,
        )}
      >
        {/* ── Breakpoint controls ─────────────────────────────── */}
        <div className="flex items-center gap-0.5">
          {breakpoints.map((bp) => {
            const Icon = bp.icon
            return (
              <Tooltip key={bp.key}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-7 w-7",
                      breakpoint === bp.key
                        ? "bg-blue-500/10 text-blue-500"
                        : "text-muted-foreground",
                    )}
                    onClick={() => onBreakpointChange?.(bp.key)}
                  >
                    <Icon className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  {bp.label}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>

        <Separator orientation="vertical" className="mx-1 h-5" />

        {/* ── Theme controls ──────────────────────────────────── */}
        <div className="flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7",
                  theme === "light"
                    ? "bg-blue-500/10 text-blue-500"
                    : "text-muted-foreground",
                )}
                onClick={() => onThemeChange?.("light")}
              >
                <Sun className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              Light theme
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7",
                  theme === "dark"
                    ? "bg-blue-500/10 text-blue-500"
                    : "text-muted-foreground",
                )}
                onClick={() => onThemeChange?.("dark")}
              >
                <Moon className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              Dark theme
            </TooltipContent>
          </Tooltip>
        </div>

        {/* ── Prop selectors ──────────────────────────────────── */}
        {hasSelectors && (
          <>
            <Separator orientation="vertical" className="mx-1 h-5" />
            {propSelectors.map((selector) => (
              <Select
                key={selector.label}
                value={selector.value}
                onValueChange={selector.onChange}
              >
                <SelectTrigger className="h-7 w-[120px] text-xs">
                  <SelectValue placeholder={selector.label} />
                </SelectTrigger>
                <SelectContent>
                  {selector.options.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </>
        )}
      </div>
    </TooltipProvider>
  )
}
