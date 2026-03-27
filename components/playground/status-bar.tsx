"use client"

import * as React from "react"
import { Shield, FileCode, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { checkAccessibility } from "@/lib/a11y-checker"
import { checkSemanticHtml } from "@/lib/semantic-checker"
import { A11yPanel } from "@/components/playground/a11y-panel"
import { SemanticPanel } from "@/components/playground/semantic-panel"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface StatusBarProps {
  source: string
}

export function StatusBar({ source }: StatusBarProps) {
  const a11yIssues = React.useMemo(() => checkAccessibility(source), [source])
  const semanticIssues = React.useMemo(
    () => checkSemanticHtml(source),
    [source],
  )

  const a11yErrors = a11yIssues.filter((i) => i.severity === "error").length
  const a11yWarnings = a11yIssues.filter((i) => i.severity === "warning").length
  const semErrors = semanticIssues.filter((i) => i.severity === "error").length
  const semWarnings = semanticIssues.filter(
    (i) => i.severity === "warning",
  ).length

  return (
    <div className="flex h-10 shrink-0 items-center gap-4 border-t bg-background px-4">
      {/* ── A11y indicator ───────────────────────────────── */}
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Shield className="size-3.5" />
            <span className="font-medium">A11y</span>
            <StatusBadges errors={a11yErrors} warnings={a11yWarnings} />
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="start"
          className="w-[400px] max-h-[500px] overflow-auto p-0"
        >
          <A11yPanel source={source} />
        </PopoverContent>
      </Popover>

      {/* ── Semantic indicator ───────────────────────────── */}
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <FileCode className="size-3.5" />
            <span className="font-medium">HTML</span>
            <StatusBadges errors={semErrors} warnings={semWarnings} />
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="start"
          className="w-[400px] max-h-[500px] overflow-auto p-0"
        >
          <SemanticPanel source={source} />
        </PopoverContent>
      </Popover>
    </div>
  )
}

function StatusBadges({
  errors,
  warnings,
}: {
  errors: number
  warnings: number
}) {
  if (errors === 0 && warnings === 0) {
    return <CheckCircle2 className="size-3.5 text-green-500" />
  }

  return (
    <span className="flex items-center gap-1">
      {errors > 0 && (
        <Badge
          variant="outline"
          className={cn(
            "h-4 px-1 text-[10px] font-medium",
            "border-red-500/30 bg-red-500/10 text-red-500",
          )}
        >
          <AlertTriangle className="mr-0.5 size-2.5" />
          {errors}
        </Badge>
      )}
      {warnings > 0 && (
        <Badge
          variant="outline"
          className={cn(
            "h-4 px-1 text-[10px] font-medium",
            "border-yellow-500/30 bg-yellow-500/10 text-yellow-500",
          )}
        >
          <AlertCircle className="mr-0.5 size-2.5" />
          {warnings}
        </Badge>
      )}
    </span>
  )
}
