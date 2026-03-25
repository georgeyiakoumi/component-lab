"use client"

import * as React from "react"
import { Code2, Monitor, Moon, Sun, Smartphone } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/* ── Types ──────────────────────────────────────────────────────── */

interface ToolbarProps {
  componentName?: string
  theme?: "light" | "dark"
  onThemeChange?: (theme: "light" | "dark") => void
  breakpoint?: "desktop" | "mobile"
  onBreakpointChange?: (breakpoint: "desktop" | "mobile") => void
  className?: string
}

/* ── Component ──────────────────────────────────────────────────── */

export function PlaygroundToolbar({
  componentName,
  theme = "light",
  onThemeChange,
  breakpoint = "desktop",
  onBreakpointChange,
  className,
}: ToolbarProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          "flex h-12 shrink-0 items-center gap-1 border-b bg-background px-4",
          className,
        )}
      >
        {/* ── Component name ─────────────────────────────────── */}
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-blue-500" />
          <span
            className={cn(
              "text-sm font-medium",
              !componentName && "text-muted-foreground",
            )}
          >
            {componentName ?? "No component selected"}
          </span>
        </div>

        {/* ── Spacer ─────────────────────────────────────────── */}
        <div className="flex-1" />

        {/* ── View controls ──────────────────────────────────── */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={<Monitor className="size-4" />}
            label="Desktop view"
            active={breakpoint === "desktop"}
            onClick={() => onBreakpointChange?.("desktop")}
          />
          <ToolbarButton
            icon={<Smartphone className="size-4" />}
            label="Mobile view"
            active={breakpoint === "mobile"}
            onClick={() => onBreakpointChange?.("mobile")}
          />

          <Separator orientation="vertical" className="mx-1.5 h-6" />

          <ToolbarButton
            icon={<Sun className="size-4" />}
            label="Light theme"
            active={theme === "light"}
            onClick={() => onThemeChange?.("light")}
          />
          <ToolbarButton
            icon={<Moon className="size-4" />}
            label="Dark theme"
            active={theme === "dark"}
            onClick={() => onThemeChange?.("dark")}
          />
        </div>
      </div>
    </TooltipProvider>
  )
}

/* ── ToolbarButton ──────────────────────────────────────────────── */

interface ToolbarButtonProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  disabled?: boolean
  onClick?: () => void
}

function ToolbarButton({
  icon,
  label,
  active,
  disabled,
  onClick,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 text-muted-foreground",
            active && "bg-blue-500/10 text-blue-500",
          )}
          disabled={disabled}
          onClick={onClick}
        >
          {icon}
          <span className="sr-only">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  )
}
