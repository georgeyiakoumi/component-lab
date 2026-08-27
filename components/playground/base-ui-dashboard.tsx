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
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Breakpoint } from "@/components/playground/toolbar"

/* ── Types ──────────────────────────────────────────────────────── */

type ClassMap = Record<string, string>

export interface BaseUIDashboardProps {
  component: BaseUIComponent
  initialClassMap: ClassMap
}

/* ── Component ──────────────────────────────────────────────────── */

export function BaseUIDashboard({
  component,
  initialClassMap,
}: BaseUIDashboardProps) {
  /* ── State ──────────────────────────────────────────────────── */

  const [classMap, setClassMap] = React.useState<ClassMap>(initialClassMap)
  const [selectedPart, setSelectedPart] = React.useState<string | null>(null)
  const [theme, setTheme] = React.useState<"light" | "dark">("light")
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint>("2xl")
  const [codePanelWidth, setCodePanelWidth] = React.useState(350)
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
    <div ref={contentRef} className="flex flex-1 overflow-hidden">
      {/* ── Code panel (left) ──────────────────────────────── */}
      <div
        className="relative flex shrink-0 flex-col border-r"
        style={{ width: `${codePanelWidth}px` }}
      >
        <CodePanel code={source} />
      </div>

      <DragHandle
        width={codePanelWidth}
        minWidth={250}
        maxWidth={(contentRef.current?.offsetWidth ?? 1200) - 200 - 320}
        onWidthChange={setCodePanelWidth}
        side="left"
      />

      {/* ── Canvas (centre) ────────────────────────────────── */}
      {/* contain:paint creates a new containing block for fixed descendants,
          so portalled overlays (backdrop, drawer viewport) fill this area
          instead of the full browser viewport. */}
      <div ref={canvasCallbackRef} className="relative flex min-w-0 flex-1 flex-col [contain:paint]">
        <ComponentCanvas
          slug={component.slug}
          componentName={component.name}
          theme={theme}
          breakpoint={breakpoint}
          customPreview={preview}
          mode="inspect"
        />

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
  )
}
