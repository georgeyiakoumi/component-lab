"use client"

import { Palette } from "lucide-react"

import { SHADCN_TEXT_TOKENS, SHADCN_BG_TOKENS, SHADCN_BORDER_TOKENS, SHADCN_RING_TOKENS } from "@/lib/tailwind-options"
import { Slider } from "@/components/ui/slider"

import { TextToggle, ColorPicker } from "@/components/playground/style-controls"
import { EditPanelRow } from "@/components/playground/edit-panel-row"
import { EditPanelSection } from "@/components/playground/edit-panel-section"

import type { SectionProps, SectionCallbacks } from "./types"

export function ColoursSection({
  state,
  update,
  sectionHasValues,
  clearSection,
}: SectionProps & SectionCallbacks) {
  return (
    <EditPanelSection icon={Palette} title="Colours" hasValues={sectionHasValues("colours")} onClear={() => clearSection("colours")}>
      <ColorPicker
        label="Text"
        prefix="text"
        shadcnTokens={SHADCN_TEXT_TOKENS}
        value={state.textColor}
        onChange={(v) => update("textColor", v)}
      />
      <ColorPicker
        label="Background"
        prefix="bg"
        shadcnTokens={SHADCN_BG_TOKENS}
        value={state.bgColor}
        onChange={(v) => update("bgColor", v)}
      />
      <ColorPicker
        label="Border"
        prefix="border"
        shadcnTokens={SHADCN_BORDER_TOKENS}
        value={state.borderColor}
        onChange={(v) => update("borderColor", v)}
      />
      <ColorPicker
        label="Ring"
        prefix="ring"
        shadcnTokens={SHADCN_RING_TOKENS}
        value={state.ringColor}
        onChange={(v) => update("ringColor", v)}
      />
      <ColorPicker
        label="Ring offset"
        prefix="ring-offset"
        value={state.ringOffsetColor}
        onChange={(v) => update("ringOffsetColor", v)}
      />
      <ColorPicker
        label="Outline"
        prefix="outline"
        value={state.outlineColor}
        onChange={(v) => update("outlineColor", v)}
      />

      {/* Opacity */}
      <EditPanelRow label="Opacity" value={state.opacity ? state.opacity.replace("opacity-", "") + "%" : "100%"}>
        <Slider
          value={[state.opacity ? parseInt(state.opacity.replace("opacity-", ""), 10) : 100]}
          min={0}
          max={100}
          step={5}
          onValueChange={([v]) =>
            update("opacity", v === 100 ? "" : `opacity-${v}`)
          }
        />
      </EditPanelRow>

      {/* Gradient */}
      <EditPanelRow label="Gradient dir.">
        <div className="flex flex-wrap gap-0.5">
          {[
            { value: "bg-gradient-to-t", label: "\u2191" },
            { value: "bg-gradient-to-tr", label: "\u2197" },
            { value: "bg-gradient-to-r", label: "\u2192" },
            { value: "bg-gradient-to-br", label: "\u2198" },
            { value: "bg-gradient-to-b", label: "\u2193" },
            { value: "bg-gradient-to-bl", label: "\u2199" },
            { value: "bg-gradient-to-l", label: "\u2190" },
            { value: "bg-gradient-to-tl", label: "\u2196" },
          ].map((opt) => (
            <TextToggle
              key={opt.value}
              value={opt.value}
              label={opt.label}
              tooltip={opt.value}
              isActive={state.gradientDirection === opt.value}
              onClick={(v) => update("gradientDirection", v)}
            />
          ))}
        </div>
      </EditPanelRow>
      <ColorPicker
        label="From"
        prefix="from"
        value={state.gradientFrom}
        onChange={(v) => update("gradientFrom", v)}
      />
      <ColorPicker
        label="Via"
        prefix="via"
        value={state.gradientVia}
        onChange={(v) => update("gradientVia", v)}
      />
      <ColorPicker
        label="To"
        prefix="to"
        value={state.gradientTo}
        onChange={(v) => update("gradientTo", v)}
      />
    </EditPanelSection>
  )
}
