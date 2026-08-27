"use client"

/**
 * BaseUIDashboard — the editing surface for Base UI components.
 *
 * Simpler than UnifiedDashboard because the data model is a flat classMap
 * (part name → Tailwind classes) instead of a ComponentTreeV2 with cva
 * exports and variant strategies.
 *
 * Reuses: VisualEditor, CodePanel, StatusBar, DragHandle, ContextPicker
 * (via VisualEditor). The ContextPicker gets Base UI-specific data
 * attributes instead of the hardcoded Radix ones.
 */

import * as React from "react"

import { ChevronDown, ChevronRight, Component, Diamond, Download } from "lucide-react"

import { cn } from "@/lib/utils"
import type { BaseUIComponent } from "@/lib/base-ui-registry"
import { renderBaseUIPreview } from "@/lib/base-ui-previews"
import { generateBaseUICode } from "@/lib/base-ui-code-gen"
import { buildBaseUIContextGroups } from "@/lib/style-context"
import type { ElementInfo } from "@/components/playground/element-selector"
import { ComponentCanvas } from "@/components/playground/component-canvas"
import { CodePanel } from "@/components/playground/code-panel"
import { StatusBar } from "@/components/playground/status-bar"
import { VisualEditor } from "@/components/playground/visual-editor"
import { DragHandle } from "@/components/playground/drag-handle"
import { ExportDialog } from "@/components/playground/export-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Breakpoint } from "@/components/playground/toolbar"

/* ── Types ──────────────────────────────────────────────────────── */

type ClassMap = Record<string, string>

export interface BaseUIDashboardProps {
  component: BaseUIComponent
  initialClassMap: ClassMap
  onClassMapChange?: (classMap: ClassMap) => void
}

/* ── Component ──────────────────────────────────────────────────── */

export function BaseUIDashboard({
  component,
  initialClassMap,
  onClassMapChange,
}: BaseUIDashboardProps) {
  /* ── State ──────────────────────────────────────────────────── */

  const [classMap, setClassMapRaw] = React.useState<ClassMap>(initialClassMap)
  // boolean states: { "checked": true, "disabled": true }
  // enum states: { "orientation": "vertical" }
  const [forcedStates, setForcedStates] = React.useState<Record<string, boolean | string>>({})

  // Wrap setClassMap to notify parent of changes
  const setClassMap = React.useCallback(
    (update: ClassMap | ((prev: ClassMap) => ClassMap)) => {
      setClassMapRaw((prev) => {
        const next = typeof update === "function" ? update(prev) : update
        onClassMapChange?.(next)
        return next
      })
    },
    [onClassMapChange],
  )
  const [selectedPart, setSelectedPart] = React.useState<string | null>(null)
  const [theme, setTheme] = React.useState<"light" | "dark">("light")
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint>("2xl")
  const [codePanelWidth, setCodePanelWidth] = React.useState(350)
  const [outlineHeight, setOutlineHeight] = React.useState(180)
  const codePanelInitialised = React.useRef(false)
  const [editPanelWidth, setEditPanelWidth] = React.useState(384)
  const contentRef = React.useRef<HTMLDivElement>(null)
  // Use state for the canvas container so React re-renders when it's set.
  // A ref would be null during the first useMemo and Toast.Portal (which
  // mounts immediately) would fall back to document.body.
  const [canvasEl, setCanvasEl] = React.useState<HTMLElement | null>(null)
  const canvasRef = React.useRef<HTMLElement | null>(null)
  const canvasCallbackRef = React.useCallback((el: HTMLDivElement | null) => {
    canvasRef.current = el
    setCanvasEl(el)
  }, [])

  // Initialise code panel width to 35% of container on mount
  React.useEffect(() => {
    if (!codePanelInitialised.current && contentRef.current) {
      codePanelInitialised.current = true
      setCodePanelWidth(Math.round(contentRef.current.offsetWidth * 0.35))
    }
  }, [])

  /* ── Derived ────────────────────────────────────────────────── */

  const source = React.useMemo(
    () => generateBaseUICode(component, classMap),
    [component, classMap],
  )

  const preview = React.useMemo(
    () => canvasEl ? renderBaseUIPreview(component.slug, classMap, canvasRef) : null,
    [component.slug, classMap, canvasEl],
  )

  // Build the VisualEditor's element info from the selected part
  const selectedPartMeta = React.useMemo(() => {
    if (!selectedPart) return null
    return component.parts.find((p) => p.name === selectedPart) ?? null
  }, [component.parts, selectedPart])

  // Extract toggleable attributes for the SELECTED part (or all parts if none selected)
  const availableAttributes = React.useMemo(() => {
    const skipAttrs = new Set([
      "data-starting-style", "data-ending-style", // animation
      "data-multiple", "data-side", "data-align", // structural
      "data-has-overflow-x", "data-has-overflow-y", // scroll
      "data-overflow-x-start", "data-overflow-x-end",
      "data-overflow-y-start", "data-overflow-y-end",
      "data-index", "data-activation-direction", // numeric/directional
      "data-behind", "data-anchor-hidden", "data-uncentered", // positional
      "data-swiping", "data-nested-dialog-open", "data-nested-drawer-open", // contextual
      "data-nested-drawer-swiping", "data-trigger-disabled", "data-modal",
      "data-has-submenu-open", "data-scrubbing", "data-type", "data-swipe-direction",
      "data-empty", "data-instant", "data-direction", "data-focusable",
      // Field-level attrs — only relevant when wrapped in Field.Root
      "data-valid", "data-invalid", "data-dirty", "data-touched",
      "data-filled", "data-focused", "data-readonly", "data-required",
    ])
    // Pairs: only show the "positive" state
    const negatives = new Set(["unchecked", "closed"])

    // Use selected part's attrs, or union of all parts if none selected
    const parts = selectedPartMeta ? [selectedPartMeta] : component.parts
    const attrs = new Set<string>()
    for (const part of parts) {
      for (const attr of part.dataAttributes) {
        if (!skipAttrs.has(attr)) {
          const name = attr.replace(/^data-/, "")
          if (!negatives.has(name)) attrs.add(name)
        }
      }
    }
    return Array.from(attrs).sort()
  }, [component.parts, selectedPartMeta])

  // Apply forced data attributes to canvas descendants
  React.useEffect(() => {
    if (!canvasEl) return
    const entries = Object.entries(forcedStates)
    if (entries.length === 0) return

    const pairs: Record<string, string> = {
      checked: "unchecked",
      unchecked: "checked",
      open: "closed",
      closed: "open",
      pressed: "unpressed",
    }

    const allElements = canvasEl.querySelectorAll("*")
    const appliedAttrs: string[] = []

    for (const el of allElements) {
      for (const [state, value] of entries) {
        if (typeof value === "string") {
          // Enum state: data-orientation="vertical"
          el.setAttribute(`data-${state}`, value)
          appliedAttrs.push(`data-${state}`)
        } else if (value === true) {
          // Boolean state: data-checked (present = on)
          el.setAttribute(`data-${state}`, "")
          appliedAttrs.push(`data-${state}`)
          const opposite = pairs[state]
          if (opposite) el.removeAttribute(`data-${opposite}`)
        }
      }
    }

    return () => {
      const allEls = canvasEl.querySelectorAll("*")
      for (const el of allEls) {
        for (const attr of appliedAttrs) {
          el.removeAttribute(attr)
        }
      }
    }
  }, [forcedStates, canvasEl, preview]) // re-run when preview re-renders

  const selectedElement: ElementInfo | null = React.useMemo(() => {
    if (!selectedPart) return null
    const classes = classMap[selectedPart] ?? ""
    return {
      tagName: "div",
      textContent: selectedPart,
      currentClasses: classes.split(/\s+/).filter(Boolean),
      elementPath: "",
      rect: new DOMRect(),
      domElement: document.createElement("div"),
    }
  }, [selectedPart, classMap])

  // Context picker gets this part's data attributes from the registry
  const baseUIContextGroups = React.useMemo(() => {
    if (!selectedPartMeta) return []
    return buildBaseUIContextGroups(selectedPartMeta.dataAttributes)
  }, [selectedPartMeta])

  // Extract a flat "variants" array that the ContextPicker understands —
  // but for Base UI we don't use the variant: prefix routing, just the
  // data attribute groups. We pass an empty array here and let the
  // ContextPicker use the groups from buildBaseUIContextGroups instead.

  /* ── Handlers ───────────────────────────────────────────────── */

  const handleClassChange = React.useCallback(
    (classes: string[]) => {
      if (!selectedPart) return
      setClassMap((prev) => ({
        ...prev,
        [selectedPart]: classes.join(" "),
      }))
    },
    [selectedPart],
  )

  const handleDeselect = React.useCallback(() => {
    setSelectedPart(null)
  }, [])

  // Compute baseDisplay for the selected part
  const baseDisplay = React.useMemo(() => {
    if (!selectedPart) return ""
    const classes = (classMap[selectedPart] ?? "").split(/\s+/).filter(Boolean)
    const displayClasses = [
      "flex",
      "inline-flex",
      "grid",
      "inline-grid",
      "block",
      "inline",
      "inline-block",
      "hidden",
      "contents",
    ]
    return classes.find((c) => displayClasses.includes(c)) || ""
  }, [selectedPart, classMap])

  /* ── Render ─────────────────────────────────────────────────── */

  return (
    <>
    {/* Export button — renders into the tab bar area via portal-like fixed positioning */}
    <ExportDialog
      slug={component.slug}
      source={source}
      defaultName={`My${component.name}`}
    >
      <button
        type="button"
        className="fixed top-1.5 right-3 z-20 flex items-center gap-1.5 rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Download className="size-3" />
        Export
      </button>
    </ExportDialog>
    <div ref={contentRef} className="flex flex-1 overflow-hidden">
      {/* ── Code panel + outline (left) ─────────────────────── */}
      <div
        className="relative flex shrink-0 flex-col border-r"
        style={{ width: `${codePanelWidth}px` }}
      >
        <div className="min-h-0 flex-1">
          <CodePanel code={source} />
        </div>

        {/* ── Component outline ──────────────────────────── */}
        <DragHandle
          width={outlineHeight}
          minWidth={80}
          maxWidth={400}
          onWidthChange={setOutlineHeight}
          orientation="vertical"
        />
        <div className="flex flex-col" style={{ height: `${outlineHeight}px` }}>
          <div className="flex items-center px-3 py-1.5">
            <span className="text-xs font-medium text-muted-foreground">OUTLINE</span>
          </div>
          <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col pb-1.5">
            {component.parts.map((part, i) => {
              const isSelected = selectedPart === part.name
              const hasCustomClasses = !!(classMap[part.name] ?? "").trim()
              const depth = part.depth ?? 0
              const isRoot = depth === 0
              // Has children if the next part has a greater depth
              const hasChildren = i < component.parts.length - 1 && (component.parts[i + 1].depth ?? 0) > depth
              const ChevronIcon = hasChildren ? ChevronDown : ChevronRight
              return (
                <button
                  key={part.name}
                  type="button"
                  onClick={() => setSelectedPart(isSelected ? null : part.name)}
                  className={cn(
                    "flex items-center gap-1 py-0.5 pr-3 text-left text-xs transition-colors",
                    isSelected
                      ? "bg-blue-500/10 text-blue-500"
                      : hasCustomClasses
                        ? "text-foreground hover:bg-muted/50"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                  style={{ paddingLeft: `${8 + depth * 16}px` }}
                >
                  {isRoot ? (
                    <Component className="size-3.5 shrink-0" />
                  ) : (
                    <>
                      {hasChildren ? (
                        <ChevronIcon className="size-3 shrink-0 text-muted-foreground" />
                      ) : (
                        <span className="size-3 shrink-0" />
                      )}
                      <Diamond className="size-3 shrink-0" />
                    </>
                  )}
                  <span className="font-mono">{part.name}</span>
                </button>
              )
            })}
          </div>
          </ScrollArea>
        </div>
      </div>

      <DragHandle
        width={codePanelWidth}
        minWidth={250}
        maxWidth={(contentRef.current?.offsetWidth ?? 1200) - 200 - 320}
        onWidthChange={setCodePanelWidth}
        side="left"
      />

      {/* ── Canvas + status bar (centre) ─────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* contain:paint creates a new containing block for fixed descendants,
            so portalled overlays (backdrop, drawer viewport) fill this area
            instead of the full browser viewport. StatusBar is outside so
            overlays don't cover it. */}
        <div ref={canvasCallbackRef} className={cn("relative flex min-w-0 flex-1 flex-col bg-background text-foreground [contain:paint]", theme === "dark" && "dark")}>
          <ComponentCanvas
            slug={component.slug}
            componentName={component.name}
            theme={theme}
            breakpoint={breakpoint}
            customPreview={preview}
            mode="inspect"
          />
        </div>

        {/* State force-toggles */}
        {availableAttributes.length > 0 && (
          <div className="flex items-center gap-1 border-t px-3 py-1">
            <span className="mr-1 text-xs text-muted-foreground">Attributes</span>
            {availableAttributes.map((state) => {
              // Orientation is an enum toggle: off → horizontal → vertical → off
              if (state === "orientation") {
                const isVertical = forcedStates[state] === "vertical"
                return (
                  <button
                    key={state}
                    type="button"
                    onClick={() =>
                      setForcedStates((prev) => {
                        const next = { ...prev }
                        if (isVertical) delete next[state]
                        else next[state] = "vertical"
                        return next
                      })
                    }
                    className={cn(
                      "rounded px-1.5 py-0.5 text-xs font-mono transition-colors",
                      isVertical
                        ? "bg-blue-500/15 text-blue-500"
                        : "text-muted-foreground hover:bg-muted/50",
                    )}
                  >
                    vertical
                  </button>
                )
              }

              const isForced = forcedStates[state] === true
              return (
                <button
                  key={state}
                  type="button"
                  onClick={() =>
                    setForcedStates((prev) => {
                      const next = { ...prev }
                      if (next[state]) {
                        delete next[state]
                      } else {
                        next[state] = true
                      }
                      return next
                    })
                  }
                  className={cn(
                    "rounded px-1.5 py-0.5 text-xs font-mono transition-colors",
                    isForced
                      ? "bg-blue-500/15 text-blue-500"
                      : "text-muted-foreground hover:bg-muted/50",
                  )}
                >
                  {state}
                </button>
              )
            })}
            {Object.keys(forcedStates).length > 0 && (
              <button
                type="button"
                onClick={() => setForcedStates({})}
                className="ml-auto text-xs text-muted-foreground hover:text-foreground"
              >
                Reset
              </button>
            )}
          </div>
        )}

        <StatusBar
          source={source}
          theme={theme}
          onThemeChange={setTheme}
          breakpoint={breakpoint}
          onBreakpointChange={setBreakpoint}
        />
      </div>

      {/* ── Right panel resize handle ──────────────────────── */}
      <DragHandle
        width={editPanelWidth}
        minWidth={384}
        maxWidth={600}
        onWidthChange={setEditPanelWidth}
        side="right"
      />

      {/* ── Right panel: part selector + visual editor ─────── */}
      <div
        className="flex min-h-0 shrink-0 flex-col border-l bg-background"
        style={{ width: `${editPanelWidth}px` }}
      >
        {/* Panel header */}
        <div className="flex items-center gap-1.5 border-b px-3 py-2">
          <span className="text-xs font-medium text-muted-foreground">
            Style
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs font-medium">{component.name}</span>
        </div>

        {/* Part pills */}
        <div className="flex flex-wrap items-center gap-1 border-b px-2 py-1.5">
          {component.parts.map((part) => {
            const isSelected = selectedPart === part.name
            const hasClasses = !!(classMap[part.name] ?? "").trim()
            return (
              <button
                key={part.name}
                type="button"
                onClick={() =>
                  setSelectedPart(isSelected ? null : part.name)
                }
                className={cn(
                  "rounded-md px-2 py-0.5 text-xs font-medium transition-colors",
                  isSelected
                    ? "bg-blue-500/10 text-blue-500"
                    : hasClasses
                      ? "text-foreground hover:bg-muted/50"
                      : "text-muted-foreground hover:bg-muted/50",
                )}
              >
                {part.name}
              </button>
            )
          })}
        </div>

        {/* Visual editor for selected part */}
        <ScrollArea className="min-h-0 flex-1">
          {selectedElement ? (
            <VisualEditor
              key={selectedPart}
              selectedElement={selectedElement}
              onClassChange={handleClassChange}
              onDeselect={handleDeselect}
              baseDisplay={baseDisplay}
              variants={[]}
              props={[]}
              subComponentNames={[]}
              contextGroupsOverride={baseUIContextGroups}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center p-8">
              <p className="text-center text-xs text-muted-foreground">
                Select a part above to edit its styles.
              </p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
    </>
  )
}
