"use client"

import { Sparkles } from "lucide-react"

import { SHADOW_OPTIONS, TEXT_SHADOW_OPTIONS, MIX_BLEND_OPTIONS, BG_BLEND_OPTIONS, OPACITY_OPTIONS, MASK_CLIP_OPTIONS, MASK_COMPOSITE_OPTIONS, MASK_IMAGE_OPTIONS, MASK_MODE_OPTIONS, MASK_ORIGIN_OPTIONS, MASK_POSITION_GRID, MASK_REPEAT_OPTIONS, MASK_SIZE_OPTIONS, MASK_TYPE_OPTIONS } from "@/lib/tailwind-options"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { TextToggle, ColorPicker, SpatialGrid, SteppedSlider } from "@/components/playground/style-controls"
import { EditPanelRow } from "@/components/playground/edit-panel-row"
import {
  EditSection,
  EditSubSectionWrapper,
  EditSubSection,
  EditSubSectionTitle,
  EditSubSectionContent,
} from "@/components/playground/edit-panel-section"

import type { SectionProps, SectionCallbacks } from "./types"

export function EffectsSection({
  state,
  update,
  sectionHasValues,
  clearSection,
}: SectionProps & SectionCallbacks) {
  return (
    <EditSection icon={Sparkles} title="Effects" hasValues={sectionHasValues("effects")} onClear={() => clearSection("effects")}>

      {/* ── Shadows ── */}
      <EditSubSectionWrapper>
        <EditSubSection>
          <EditSubSectionTitle>Box shadow</EditSubSectionTitle>
          <EditSubSectionContent className="space-y-0">
            <div className="flex flex-wrap gap-0.5">
              {SHADOW_OPTIONS.map((opt) => (
                <TextToggle key={opt} value={opt} label={opt === "shadow" ? "base" : opt.replace("shadow-", "")} tooltip={opt} isActive={state.shadow === opt} onClick={(v) => update("shadow", state.shadow === v ? "" : v)} />
              ))}
            </div>
            <ColorPicker className="p-0"label="" prefix="shadow" value={state.shadowColor} onChange={(v) => update("shadowColor", v)} />
          </EditSubSectionContent>
        </EditSubSection>

        <EditSubSection>
          <EditSubSectionTitle>Text shadow</EditSubSectionTitle>
          <EditSubSectionContent>
            <div className="flex flex-wrap gap-0.5">
              {TEXT_SHADOW_OPTIONS.map((opt) => (
                <TextToggle key={opt} value={opt} label={opt === "text-shadow" ? "base" : opt.replace("text-shadow-", "")} tooltip={opt} isActive={state.textShadow === opt} onClick={(v) => update("textShadow", state.textShadow === v ? "" : v)} />
              ))}
            </div>
          </EditSubSectionContent>
        </EditSubSection>
      </EditSubSectionWrapper>

      {/* ── Opacity ── */}
      <EditSubSectionWrapper>
        <EditSubSection>
          <EditSubSectionTitle>Opacity</EditSubSectionTitle>
          <EditSubSectionContent>
            <SteppedSlider
              label=""
              hideLabel
              values={OPACITY_OPTIONS.map((o) => o.replace("opacity-", ""))}
              prefix="opacity"
              value={state.opacity}
              onChange={(v) => update("opacity", v)}
              suffix="%"
            />
          </EditSubSectionContent>
        </EditSubSection>
      </EditSubSectionWrapper>

      {/* ── Blend modes ── */}
      <EditSubSectionWrapper>
        <EditSubSection>
          <EditSubSectionTitle>Blend modes</EditSubSectionTitle>
          <EditSubSectionContent>
            <EditPanelRow label="Mix blend" variant="nested">
              <Select value={state.mixBlend || "__none__"} onValueChange={(v) => update("mixBlend", v === "__none__" ? "" : v)}>
                <SelectTrigger className="h-6 text-xs"><SelectValue placeholder="–" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">–</SelectItem>
                  {MIX_BLEND_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt} className="text-xs">{opt.replace("mix-blend-", "")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </EditPanelRow>
            <EditPanelRow label="Background blend" variant="nested">
              <Select value={state.bgBlend || "__none__"} onValueChange={(v) => update("bgBlend", v === "__none__" ? "" : v)}>
                <SelectTrigger className="h-6 text-xs"><SelectValue placeholder="–" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">–</SelectItem>
                  {BG_BLEND_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt} className="text-xs">{opt.replace("bg-blend-", "")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </EditPanelRow>
          </EditSubSectionContent>
        </EditSubSection>
      </EditSubSectionWrapper>

      {/* ── Mask ── */}
      <EditSubSectionWrapper>
        <EditSubSection>
          <EditSubSectionTitle>Mask</EditSubSectionTitle>
          <EditSubSectionContent>
            {/* Source */}
            <EditPanelRow label="Image" variant="nested">
              <div className="flex flex-wrap gap-0.5">
                {MASK_IMAGE_OPTIONS.map((opt) => {
                  const arrowMap: Record<string, string> = { "mask-linear-gradient-to-t": "\u2191", "mask-linear-gradient-to-tr": "\u2197", "mask-linear-gradient-to-r": "\u2192", "mask-linear-gradient-to-br": "\u2198", "mask-linear-gradient-to-b": "\u2193", "mask-linear-gradient-to-bl": "\u2199", "mask-linear-gradient-to-l": "\u2190", "mask-linear-gradient-to-tl": "\u2196" }
                  return (
                    <TextToggle key={opt} value={opt} label={arrowMap[opt] ?? opt.replace("mask-", "")} tooltip={opt} isActive={state.maskImage === opt} onClick={(v) => update("maskImage", state.maskImage === v ? "" : v)} />
                  )
                })}
              </div>
            </EditPanelRow>
            {/* Placement */}
            <EditPanelRow label="Position" variant="nested">
              <SpatialGrid options={MASK_POSITION_GRID} value={state.maskPosition} onChange={(v) => update("maskPosition", v)} labelPrefix="mask-" />
            </EditPanelRow>
            <EditPanelRow label="Size" variant="nested">
              <div className="flex flex-wrap gap-0.5">
                {MASK_SIZE_OPTIONS.map((opt) => (
                  <TextToggle key={opt} value={opt} label={opt.replace("mask-", "")} tooltip={opt} isActive={state.maskSize === opt} onClick={(v) => update("maskSize", state.maskSize === v ? "" : v)} />
                ))}
              </div>
            </EditPanelRow>
            <EditPanelRow label="Repeat" variant="nested">
              <div className="flex flex-wrap gap-0.5">
                {MASK_REPEAT_OPTIONS.map((opt) => (
                  <TextToggle key={opt} value={opt} label={opt.replace("mask-", "")} tooltip={opt} isActive={state.maskRepeat === opt} onClick={(v) => update("maskRepeat", state.maskRepeat === v ? "" : v)} />
                ))}
              </div>
            </EditPanelRow>
            {/* Advanced */}
            <EditPanelRow label="Clip" variant="nested">
              <div className="flex flex-wrap gap-0.5">
                {MASK_CLIP_OPTIONS.map((opt) => (
                  <TextToggle key={opt} value={opt} label={opt.replace("mask-clip-", "")} tooltip={opt} isActive={state.maskClip === opt} onClick={(v) => update("maskClip", state.maskClip === v ? "" : v)} />
                ))}
              </div>
            </EditPanelRow>
            <EditPanelRow label="Origin" variant="nested">
              <div className="flex flex-wrap gap-0.5">
                {MASK_ORIGIN_OPTIONS.map((opt) => (
                  <TextToggle key={opt} value={opt} label={opt.replace("mask-origin-", "")} tooltip={opt} isActive={state.maskOrigin === opt} onClick={(v) => update("maskOrigin", state.maskOrigin === v ? "" : v)} />
                ))}
              </div>
            </EditPanelRow>
            <EditPanelRow label="Composite" variant="nested">
              <div className="flex flex-wrap gap-0.5">
                {MASK_COMPOSITE_OPTIONS.map((opt) => (
                  <TextToggle key={opt} value={opt} label={opt.replace("mask-composite-", "")} tooltip={opt} isActive={state.maskComposite === opt} onClick={(v) => update("maskComposite", state.maskComposite === v ? "" : v)} />
                ))}
              </div>
            </EditPanelRow>
            <EditPanelRow label="Mode" variant="nested">
              <div className="flex flex-wrap gap-0.5">
                {MASK_MODE_OPTIONS.map((opt) => (
                  <TextToggle key={opt} value={opt} label={opt.replace("mask-", "")} tooltip={opt} isActive={state.maskMode === opt} onClick={(v) => update("maskMode", state.maskMode === v ? "" : v)} />
                ))}
              </div>
            </EditPanelRow>
            <EditPanelRow label="Type" variant="nested">
              <div className="flex flex-wrap gap-0.5">
                {MASK_TYPE_OPTIONS.map((opt) => (
                  <TextToggle key={opt} value={opt} label={opt.replace("mask-type-", "")} tooltip={opt} isActive={state.maskType === opt} onClick={(v) => update("maskType", state.maskType === v ? "" : v)} />
                ))}
              </div>
            </EditPanelRow>
          </EditSubSectionContent>
        </EditSubSection>
      </EditSubSectionWrapper>

    </EditSection>
  )
}
