"use client"

import { Ruler } from "lucide-react"

import { SizeControl, SizeAxisControl } from "@/components/playground/style-controls"
import { EditPanelRow } from "@/components/playground/edit-panel-row"
import { EditSection } from "@/components/playground/edit-panel-section"

import type { SectionProps, SectionCallbacks } from "./types"

interface SizeSectionProps extends SectionProps, SectionCallbacks {
  effectiveDisplay: string
}

export function SizeSection({
  state,
  update,
  sectionHasValues,
  clearSection,
  effectiveDisplay,
}: SizeSectionProps) {
  const isInline = effectiveDisplay === "inline"
  const acceptsSize = !isInline && effectiveDisplay !== "hidden" && effectiveDisplay !== "contents"

  if (!acceptsSize) return null

  return (
    <EditSection icon={Ruler} title="Size" hasValues={sectionHasValues("size")} onClear={() => clearSection("size")}>

      <SizeControl
        width={state.width}
        height={state.height}
        size={state.size}
        onWidthChange={(v) => update("width", v)}
        onHeightChange={(v) => update("height", v)}
        onSizeChange={(v) => update("size", v)}
      />

      <EditPanelRow
        label="Min width"
        variant="nested"
        value={state.minWidth ? state.minWidth.replace("min-w-", "") : undefined}
        onClear={state.minWidth ? () => update("minWidth", "") : undefined}
      >
        <SizeAxisControl axis="min-w" value={state.minWidth} onChange={(v) => update("minWidth", v)} hideLabel />
      </EditPanelRow>

      <EditPanelRow
        label="Max width"
        variant="nested"
        value={state.maxWidth ? state.maxWidth.replace("max-w-", "") : undefined}
        onClear={state.maxWidth ? () => update("maxWidth", "") : undefined}
      >
        <SizeAxisControl axis="max-w" value={state.maxWidth} onChange={(v) => update("maxWidth", v)} hideLabel />
      </EditPanelRow>

      <EditPanelRow
        label="Min height"
        variant="nested"
        value={state.minHeight ? state.minHeight.replace("min-h-", "") : undefined}
        onClear={state.minHeight ? () => update("minHeight", "") : undefined}
      >
        <SizeAxisControl axis="min-h" value={state.minHeight} onChange={(v) => update("minHeight", v)} hideLabel />
      </EditPanelRow>

      <EditPanelRow
        label="Max height"
        variant="nested"
        value={state.maxHeight ? state.maxHeight.replace("max-h-", "") : undefined}
        onClear={state.maxHeight ? () => update("maxHeight", "") : undefined}
      >
        <SizeAxisControl axis="max-h" value={state.maxHeight} onChange={(v) => update("maxHeight", v)} hideLabel />
      </EditPanelRow>

    </EditSection>
  )
}
