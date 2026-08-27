"use client"

import * as React from "react"
import { Check, Clipboard, WrapText } from "lucide-react"
import { ScrollArea } from "@base-ui/react/scroll-area"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"

/* ── Types ──────────────────────────────────────────────────────── */

interface CodePanelProps {
  code: string
  language?: string
  /** Line number to scroll to and highlight (1-based) */
  highlightLine?: number | null
  /** Range of lines to focus — dims everything outside this range */
  focusRange?: { start: number; end: number } | null
  className?: string
}

/* ── Scrollbar classes (Base UI data attrs use bare Tailwind v4 syntax) */

const SCROLLBAR =
  "relative m-px flex opacity-0 transition-opacity pointer-events-none data-[orientation=vertical]:w-2 data-[orientation=horizontal]:h-2 data-[hovering]:pointer-events-auto data-[hovering]:opacity-100 data-[scrolling]:pointer-events-auto data-[scrolling]:opacity-100 data-[scrolling]:duration-0"

const THUMB = "w-full rounded-full bg-white/30"

/* ── Component ──────────────────────────────────────────────────── */

export function CodePanel({ code, language = "tsx", highlightLine, focusRange, className }: CodePanelProps) {
  const deferredCode = React.useDeferredValue(code)
  const [highlightedHtml, setHighlightedHtml] = React.useState<string>("")
  const [isLoading, setIsLoading] = React.useState(true)
  const [copied, setCopied] = React.useState(false)
  const [wordWrap, setWordWrap] = React.useState(false)
  const codeBodyRef = React.useRef<HTMLDivElement>(null)

  // Scroll to and highlight the target line
  React.useEffect(() => {
    if (!highlightLine || !codeBodyRef.current) return

    const lines = codeBodyRef.current.querySelectorAll(".line")
    const targetLine = lines[highlightLine - 1] as HTMLElement | undefined
    if (!targetLine) return

    targetLine.scrollIntoView({ behavior: "smooth", block: "center" })

    targetLine.style.backgroundColor = "rgba(59, 130, 246, 0.2)"
    targetLine.style.transition = "background-color 0.3s"
    const timer = setTimeout(() => {
      targetLine.style.backgroundColor = ""
    }, 2000)

    return () => clearTimeout(timer)
  }, [highlightLine])

  const focusStyle = React.useMemo(() => {
    if (!focusRange) return ""
    const { start, end } = focusRange
    return `.code-panel-shiki .line { opacity: 0.2; transition: opacity 0.3s; }
.code-panel-shiki .line:nth-child(n+${start}):nth-child(-n+${end}) { opacity: 1; }`
  }, [focusRange])

  React.useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    async function highlight() {
      const { codeToHtml } = await import("shiki/bundle/web")
      const html = await codeToHtml(deferredCode, {
        lang: language,
        theme: "github-dark",
        transformers: [
          {
            // Store leading whitespace count as a CSS variable per line.
            // The hanging indent (padding-left + text-indent) is activated
            // by CSS only when word-wrap mode is on, so non-wrapped mode
            // is unaffected.
            line(node, line) {
              const sourceLine = deferredCode.split("\n")[line - 1]
              if (!sourceLine) return
              const spaces = sourceLine.match(/^(\s*)/)?.[1].length ?? 0
              if (spaces > 0) {
                const existing = typeof node.properties.style === "string" ? node.properties.style : ""
                node.properties.style = `${existing};--indent:${spaces}ch`
              }
            },
          },
        ],
      })

      if (!cancelled) {
        setHighlightedHtml(html)
        setIsLoading(false)
      }
    }

    highlight().catch(() => {
      if (!cancelled) setIsLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [deferredCode, language])

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API may fail in non-HTTPS or permission-denied contexts
    }
  }, [code])

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {focusStyle && <style dangerouslySetInnerHTML={{ __html: focusStyle }} />}
      {wordWrap && (
        <style dangerouslySetInnerHTML={{ __html: [
          `.code-panel-shiki .line { display: block; position: relative; margin: 0; padding-left: calc(3rem + var(--indent, 0ch)); text-indent: calc(var(--indent, 0ch) * -1); }`,
          `.code-panel-shiki .line::before { display: inline-block; position: absolute; left: 0; width: 2rem; text-align: right; }`,
          `.code-panel-shiki code { display: block; font-size: 0; }`,
          `.code-panel-shiki .line { font-size: 0.875rem; }`,
        ].join("\n") }} />
      )}

      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b px-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Code
        </span>
        <div className="flex items-center gap-0.5">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-7 w-7",
                    wordWrap ? "text-blue-500" : "text-muted-foreground",
                  )}
                  onClick={() => setWordWrap((w) => !w)}
                >
                  <WrapText className="size-3.5" />
                  <span className="sr-only">Toggle word wrap</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {wordWrap ? "Disable word wrap" : "Enable word wrap"}
              </TooltipContent>
            </Tooltip>
            <Tooltip open={copied ? true : undefined}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="size-3.5 text-green-500" />
                  ) : (
                    <Clipboard className="size-3.5" />
                  )}
                  <span className="sr-only">Copy code</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {copied ? "Copied!" : "Copy to clipboard"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* ── Code body ─────────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex-1 bg-[#0d1117] p-4 space-y-2">
          <Skeleton className="h-4 w-3/4 bg-white/5" />
          <Skeleton className="h-4 w-1/2 bg-white/5" />
          <Skeleton className="h-4 w-5/6 bg-white/5" />
          <Skeleton className="h-4 w-2/3 bg-white/5" />
          <Skeleton className="h-4 w-3/5 bg-white/5" />
          <Skeleton className="h-4 w-4/5 bg-white/5" />
          <Skeleton className="h-4 w-1/3 bg-white/5" />
        </div>
      ) : (
        <ScrollArea.Root className="min-h-0 flex-1 bg-[#0d1117]">
          <ScrollArea.Viewport className="h-full">
            <ScrollArea.Content>
              <div
                ref={codeBodyRef}
                className={cn(
                  "code-panel-shiki text-sm font-mono p-4 pb-6 pr-6",
                  "[&_pre]:!bg-transparent [&_code]:!bg-transparent",
                  "[&_code]:[counter-reset:line]",
                  "[&_.line]:[counter-increment:line]",
                  "[&_.line::before]:pr-4 [&_.line::before]:text-right [&_.line::before]:text-white/20 [&_.line::before]:select-none [&_.line::before]:[content:counter(line)] [&_.line::before]:min-w-[2rem]",
                  "[&_.line]:table-row [&_.line::before]:table-cell",
                  wordWrap
                    ? "[&_pre]:whitespace-pre-wrap"
                    : "w-max",
                )}
                dangerouslySetInnerHTML={{ __html: highlightedHtml }}
              />
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar className={SCROLLBAR}>
            <ScrollArea.Thumb className={THUMB} />
          </ScrollArea.Scrollbar>
          {!wordWrap && (
            <ScrollArea.Scrollbar className={SCROLLBAR} orientation="horizontal">
              <ScrollArea.Thumb className={THUMB} />
            </ScrollArea.Scrollbar>
          )}
          <ScrollArea.Corner />
        </ScrollArea.Root>
      )}
    </div>
  )
}
