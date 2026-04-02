"use client"

import { Box } from "lucide-react"

import type { ControlState } from "@/lib/style-state"
import { SPACING_SCALE_FULL, WIDTH_OPTIONS, HEIGHT_OPTIONS, MIN_WIDTH_OPTIONS, MAX_WIDTH_OPTIONS, MIN_HEIGHT_OPTIONS, MAX_HEIGHT_OPTIONS, SIZE_OPTIONS } from "@/lib/tailwind-options"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { TextToggle, SpacingValueInput, BoxModelControl } from "@/components/playground/style-controls"
import { EditPanelRow } from "@/components/playground/edit-panel-row"
import { EditPanelSection } from "@/components/playground/edit-panel-section"

import type { SectionProps, SectionCallbacks } from "./types"

interface SpacingSectionProps extends SectionProps, SectionCallbacks {
  effectiveDisplay: string
  isFlex: boolean
  isGrid: boolean
  showPaddingSides: boolean
  showMarginSides: boolean
  onTogglePaddingSides: () => void
  onToggleMarginSides: () => void
}

export function SpacingSection({
  state,
  update,
  sectionHasValues,
  clearSection,
  effectiveDisplay,
  isFlex,
  isGrid,
  showPaddingSides,
  showMarginSides,
  onTogglePaddingSides,
  onToggleMarginSides,
}: SpacingSectionProps) {
  const isInline = effectiveDisplay === "inline"
  const isBlockDisplay = effectiveDisplay === "block" || effectiveDisplay === "inline-block"
  const acceptsSize = !isInline && effectiveDisplay !== "hidden" && effectiveDisplay !== "contents"
  const isFlexRow = isFlex && (state.direction === "flex-row" || state.direction === "flex-row-reverse" || !state.direction)
  const isFlexCol = isFlex && (state.direction === "flex-col" || state.direction === "flex-col-reverse")

  return (
    <EditPanelSection icon={Box} title="Spacing" hasValues={sectionHasValues("spacing")} onClear={() => clearSection("spacing")}>
      {/* Padding */}
      <EditPanelRow label="Padding">
        <BoxModelControl
          label="Padding"
          allPrefix="p"
          allValue={state.padding}
          onAllChange={(v) => update("padding", v)}
          sides={[
            { prefix: "pt", label: "Top", value: state.paddingTop, onChange: (v) => update("paddingTop", v) },
            { prefix: "pr", label: "Right", value: state.paddingRight, onChange: (v) => update("paddingRight", v) },
            { prefix: "pb", label: "Bottom", value: state.paddingBottom, onChange: (v) => update("paddingBottom", v) },
            { prefix: "pl", label: "Left", value: state.paddingLeft, onChange: (v) => update("paddingLeft", v) },
          ]}
          expanded={showPaddingSides}
          onToggleExpand={onTogglePaddingSides}
        />
        {/* Padding axes */}
        <div className="mt-1 flex gap-2 pl-6">
          <SpacingValueInput prefix="px" value={state.paddingX} onChange={(v) => update("paddingX", v)} />
          <SpacingValueInput prefix="py" value={state.paddingY} onChange={(v) => update("paddingY", v)} />
        </div>
      </EditPanelRow>

      {/* Margin */}
      <EditPanelRow label="Margin">
        <BoxModelControl
          label="Margin"
          allPrefix="m"
          allValue={state.margin}
          onAllChange={(v) => update("margin", v)}
          sides={[
            { prefix: "mt", label: "Top", value: state.marginTop, onChange: (v) => update("marginTop", v) },
            { prefix: "mr", label: "Right", value: state.marginRight, onChange: (v) => update("marginRight", v) },
            { prefix: "mb", label: "Bottom", value: state.marginBottom, onChange: (v) => update("marginBottom", v) },
            { prefix: "ml", label: "Left", value: state.marginLeft, onChange: (v) => update("marginLeft", v) },
          ]}
          expanded={showMarginSides}
          onToggleExpand={onToggleMarginSides}
          allowNegative
          allowAuto
        />
        {/* Margin axes */}
        <div className="mt-1 flex gap-2 pl-6">
          <SpacingValueInput prefix="mx" value={state.marginX} onChange={(v) => update("marginX", v)} allowNegative allowAuto />
          <SpacingValueInput prefix="my" value={state.marginY} onChange={(v) => update("marginY", v)} allowNegative allowAuto />
        </div>
      </EditPanelRow>

      {/* Space between — conditional on display/direction */}
      {isFlexRow && (
        <EditPanelRow label="Space-X">
          <div className="flex flex-wrap items-center gap-2">
            <Select value={state.spaceX ? state.spaceX.replace("space-x-", "") : "__none__"} onValueChange={(v) => update("spaceX", v === "__none__" ? "" : `space-x-${v}`)}>
              <SelectTrigger className="h-6 w-20 text-xs"><SelectValue placeholder="–" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">–</SelectItem>
                {SPACING_SCALE_FULL.map((v) => (<SelectItem key={v} value={String(v)} className="text-xs">{v}</SelectItem>))}
              </SelectContent>
            </Select>
            <TextToggle value="space-x-reverse" label="rev" tooltip="space-x-reverse" isActive={!!state.spaceXReverse} onClick={() => update("spaceXReverse", state.spaceXReverse ? "" : "space-x-reverse")} />
          </div>
        </EditPanelRow>
      )}
      {(isBlockDisplay || isFlexCol) && (
        <EditPanelRow label="Space-Y">
          <div className="flex flex-wrap items-center gap-2">
            <Select value={state.spaceY ? state.spaceY.replace("space-y-", "") : "__none__"} onValueChange={(v) => update("spaceY", v === "__none__" ? "" : `space-y-${v}`)}>
              <SelectTrigger className="h-6 w-20 text-xs"><SelectValue placeholder="–" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">–</SelectItem>
                {SPACING_SCALE_FULL.map((v) => (<SelectItem key={v} value={String(v)} className="text-xs">{v}</SelectItem>))}
              </SelectContent>
            </Select>
            <TextToggle value="space-y-reverse" label="rev" tooltip="space-y-reverse" isActive={!!state.spaceYReverse} onClick={() => update("spaceYReverse", state.spaceYReverse ? "" : "space-y-reverse")} />
          </div>
        </EditPanelRow>
      )}

      {/* Width / Height — not for inline */}
      {acceptsSize && (
        <>
          <EditPanelRow label="Width">
            <Select value={state.width || "__none__"} onValueChange={(v) => update("width", v === "__none__" ? "" : v)}>
              <SelectTrigger className="h-6 w-24 text-xs"><SelectValue placeholder="–" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">–</SelectItem>
                {WIDTH_OPTIONS.map((v) => (<SelectItem key={v} value={v} className="text-xs">{v.replace("w-", "")}</SelectItem>))}
              </SelectContent>
            </Select>
          </EditPanelRow>

          <EditPanelRow label="Height">
            <Select value={state.height || "__none__"} onValueChange={(v) => update("height", v === "__none__" ? "" : v)}>
              <SelectTrigger className="h-6 w-24 text-xs"><SelectValue placeholder="–" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">–</SelectItem>
                {HEIGHT_OPTIONS.map((v) => (<SelectItem key={v} value={v} className="text-xs">{v.replace("h-", "")}</SelectItem>))}
              </SelectContent>
            </Select>
          </EditPanelRow>

          <EditPanelRow label="Size">
            <Select value={state.size || "__none__"} onValueChange={(v) => update("size", v === "__none__" ? "" : v)}>
              <SelectTrigger className="h-6 w-24 text-xs"><SelectValue placeholder="–" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">–</SelectItem>
                {SIZE_OPTIONS.map((v) => (<SelectItem key={v} value={v} className="text-xs">{v.replace("size-", "")}</SelectItem>))}
              </SelectContent>
            </Select>
          </EditPanelRow>

          <EditPanelRow label="Min W">
            <Select value={state.minWidth || "__none__"} onValueChange={(v) => update("minWidth", v === "__none__" ? "" : v)}>
              <SelectTrigger className="h-6 w-24 text-xs"><SelectValue placeholder="–" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">–</SelectItem>
                {MIN_WIDTH_OPTIONS.map((v) => (<SelectItem key={v} value={v} className="text-xs">{v.replace("min-w-", "")}</SelectItem>))}
              </SelectContent>
            </Select>
          </EditPanelRow>

          <EditPanelRow label="Max W">
            <Select value={state.maxWidth || "__none__"} onValueChange={(v) => update("maxWidth", v === "__none__" ? "" : v)}>
              <SelectTrigger className="h-6 w-24 text-xs"><SelectValue placeholder="–" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">–</SelectItem>
                {MAX_WIDTH_OPTIONS.map((v) => (<SelectItem key={v} value={v} className="text-xs">{v.replace("max-w-", "")}</SelectItem>))}
              </SelectContent>
            </Select>
          </EditPanelRow>

          <EditPanelRow label="Min H">
            <Select value={state.minHeight || "__none__"} onValueChange={(v) => update("minHeight", v === "__none__" ? "" : v)}>
              <SelectTrigger className="h-6 w-24 text-xs"><SelectValue placeholder="–" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">–</SelectItem>
                {MIN_HEIGHT_OPTIONS.map((v) => (<SelectItem key={v} value={v} className="text-xs">{v.replace("min-h-", "")}</SelectItem>))}
              </SelectContent>
            </Select>
          </EditPanelRow>

          <EditPanelRow label="Max H">
            <Select value={state.maxHeight || "__none__"} onValueChange={(v) => update("maxHeight", v === "__none__" ? "" : v)}>
              <SelectTrigger className="h-6 w-24 text-xs"><SelectValue placeholder="–" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">–</SelectItem>
                {MAX_HEIGHT_OPTIONS.map((v) => (<SelectItem key={v} value={v} className="text-xs">{v.replace("max-h-", "")}</SelectItem>))}
              </SelectContent>
            </Select>
          </EditPanelRow>
        </>
      )}
    </EditPanelSection>
  )
}
