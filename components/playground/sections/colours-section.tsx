"use client"

import { Palette, ArrowUp, ArrowUpRight, ArrowRight, ArrowDownRight, ArrowDown, ArrowDownLeft, ArrowLeft, ArrowUpLeft } from "lucide-react"

import { SHADCN_TEXT_TOKENS, SHADCN_BG_TOKENS, SHADCN_BORDER_TOKENS, SHADCN_RING_TOKENS } from "@/lib/tailwind-options"

import { IconToggle, ColorPicker } from "@/components/playground/style-controls"
import { EditPanelRow } from "@/components/playground/edit-panel-row"
import {
  EditSection,
  EditSubSectionWrapper,
  EditSubSection,
  EditSubSectionTitle,
  EditSubSectionContent,
} from "@/components/playground/edit-panel-section"

import type { SectionProps, SectionCallbacks } from "./types"

const GRADIENT_DIRECTIONS = [
  { value: "bg-gradient-to-t", icon: ArrowUp, tooltip: "to top" },
  { value: "bg-gradient-to-tr", icon: ArrowUpRight, tooltip: "to top right" },
  { value: "bg-gradient-to-r", icon: ArrowRight, tooltip: "to right" },
  { value: "bg-gradient-to-br", icon: ArrowDownRight, tooltip: "to bottom right" },
  { value: "bg-gradient-to-b", icon: ArrowDown, tooltip: "to bottom" },
  { value: "bg-gradient-to-bl", icon: ArrowDownLeft, tooltip: "to bottom left" },
  { value: "bg-gradient-to-l", icon: ArrowLeft, tooltip: "to left" },
  { value: "bg-gradient-to-tl", icon: ArrowUpLeft, tooltip: "to top left" },
]

export function ColoursSection({
  state,
  update,
  sectionHasValues,
  clearSection,
}: SectionProps & SectionCallbacks) {
  return (
    <EditSection icon={Palette} title="Colours" hasValues={sectionHasValues("colours")} onClear={() => clearSection("colours")}>

      {/* ── Core ── */}
      <EditSubSectionWrapper>
        <EditSubSection>
          <EditSubSectionTitle>Core</EditSubSectionTitle>
          <EditSubSectionContent>
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
              label="Outline"
              prefix="outline"
              value={state.outlineColor}
              onChange={(v) => update("outlineColor", v)}
            />
          </EditSubSectionContent>
        </EditSubSection>
      </EditSubSectionWrapper>

      {/* ── Ring ── */}
      <EditSubSectionWrapper>
        <EditSubSection>
          <EditSubSectionTitle>Ring</EditSubSectionTitle>
          <EditSubSectionContent>
            <ColorPicker
              label="Colour"
              prefix="ring"
              shadcnTokens={SHADCN_RING_TOKENS}
              value={state.ringColor}
              onChange={(v) => update("ringColor", v)}
            />
            <ColorPicker
              label="Offset"
              prefix="ring-offset"
              value={state.ringOffsetColor}
              onChange={(v) => update("ringOffsetColor", v)}
            />
          </EditSubSectionContent>
        </EditSubSection>
      </EditSubSectionWrapper>

      {/* ── Gradient ── */}
      <EditSubSectionWrapper>
        <EditSubSection>
          <EditSubSectionTitle>Gradient</EditSubSectionTitle>
          <EditSubSectionContent>
            <EditPanelRow label="Direction" variant="nested">
              <div className="flex flex-wrap gap-0.5">
                {GRADIENT_DIRECTIONS.map((opt) => (
                  <IconToggle
                    key={opt.value}
                    value={opt.value}
                    icon={opt.icon}
                    tooltip={opt.tooltip}
                    isActive={state.gradientDirection === opt.value}
                    onClick={(v) => update("gradientDirection", state.gradientDirection === v ? "" : v)}
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
          </EditSubSectionContent>
        </EditSubSection>
      </EditSubSectionWrapper>

    </EditSection>
  )
}
