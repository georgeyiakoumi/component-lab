"use client"

import { SlidersHorizontal } from "lucide-react"

import { BLUR_OPTIONS, DROP_SHADOW_OPTIONS, BACKDROP_BLUR_OPTIONS } from "@/lib/tailwind-options"
import { Switch } from "@/components/ui/switch"

import { TextToggle, SteppedSlider } from "@/components/playground/style-controls"
import { EditPanelRow } from "@/components/playground/edit-panel-row"
import {
  EditSection,
  EditSubSectionWrapper,
  EditSubSection,
  EditSubSectionTitle,
  EditSubSectionContent,
} from "@/components/playground/edit-panel-section"

import type { SectionProps, SectionCallbacks } from "./types"

export function FiltersSection({
  state,
  update,
  sectionHasValues,
  clearSection,
}: SectionProps & SectionCallbacks) {
  return (
    <EditSection icon={SlidersHorizontal} title="Filters" hasValues={sectionHasValues("filters")} onClear={() => clearSection("filters")}>

      {/* ── Element filters ── */}
      <EditSubSectionWrapper>
        <EditSubSection>
          <EditSubSectionTitle>Filters</EditSubSectionTitle>
          <EditSubSectionContent>
            <EditPanelRow label="Blur" variant="nested">
              <div className="flex flex-wrap gap-0.5">
                {BLUR_OPTIONS.map((opt) => (
                  <TextToggle key={opt} value={opt} label={opt === "blur" ? "base" : opt.replace("blur-", "")} tooltip={opt} isActive={state.blur === opt} onClick={(v) => update("blur", state.blur === v ? "" : v)} />
                ))}
              </div>
            </EditPanelRow>
            <SteppedSlider label="Brightness" values={["0", "50", "75", "90", "95", "100", "105", "110", "125", "150", "200"]} prefix="brightness" value={state.brightness} onChange={(v) => update("brightness", v)} suffix="%" />
            <SteppedSlider label="Contrast" values={["0", "50", "75", "100", "125", "150", "200"]} prefix="contrast" value={state.contrast} onChange={(v) => update("contrast", v)} suffix="%" />
            <SteppedSlider label="Saturate" values={["0", "50", "100", "150", "200"]} prefix="saturate" value={state.saturate} onChange={(v) => update("saturate", v)} suffix="%" />
            <SteppedSlider label="Hue rotate" values={["0", "15", "30", "60", "90", "180"]} prefix="hue-rotate" value={state.hueRotate} onChange={(v) => update("hueRotate", v)} suffix="°" />
            <EditPanelRow label="Grayscale" variant="nested">
              <div className="flex flex-wrap items-center gap-2">
                <Switch checked={state.grayscale === "grayscale"} onCheckedChange={(checked) => update("grayscale", checked ? "grayscale" : "")} />
                <span className="text-xs text-muted-foreground">{state.grayscale === "grayscale" ? "on" : "off"}</span>
              </div>
            </EditPanelRow>
            <EditPanelRow label="Invert" variant="nested">
              <div className="flex flex-wrap items-center gap-2">
                <Switch checked={state.invert === "invert"} onCheckedChange={(checked) => update("invert", checked ? "invert" : "")} />
                <span className="text-xs text-muted-foreground">{state.invert === "invert" ? "on" : "off"}</span>
              </div>
            </EditPanelRow>
            <EditPanelRow label="Sepia" variant="nested">
              <div className="flex flex-wrap items-center gap-2">
                <Switch checked={state.sepia === "sepia"} onCheckedChange={(checked) => update("sepia", checked ? "sepia" : "")} />
                <span className="text-xs text-muted-foreground">{state.sepia === "sepia" ? "on" : "off"}</span>
              </div>
            </EditPanelRow>
            <EditPanelRow label="Drop shadow" variant="nested">
              <div className="flex flex-wrap gap-0.5">
                {DROP_SHADOW_OPTIONS.map((opt) => (
                  <TextToggle key={opt} value={opt} label={opt === "drop-shadow" ? "base" : opt.replace("drop-shadow-", "")} tooltip={opt} isActive={state.dropShadow === opt} onClick={(v) => update("dropShadow", state.dropShadow === v ? "" : v)} />
                ))}
              </div>
            </EditPanelRow>
          </EditSubSectionContent>
        </EditSubSection>
      </EditSubSectionWrapper>

      {/* ── Backdrop filters ── */}
      <EditSubSectionWrapper>
        <EditSubSection>
          <EditSubSectionTitle>Backdrop</EditSubSectionTitle>
          <EditSubSectionContent>
            <EditPanelRow label="Blur" variant="nested">
              <div className="flex flex-wrap gap-0.5">
                {BACKDROP_BLUR_OPTIONS.map((opt) => (
                  <TextToggle key={opt} value={opt} label={opt === "backdrop-blur" ? "base" : opt.replace("backdrop-blur-", "")} tooltip={opt} isActive={state.backdropBlur === opt} onClick={(v) => update("backdropBlur", state.backdropBlur === v ? "" : v)} />
                ))}
              </div>
            </EditPanelRow>
            <SteppedSlider label="Brightness" values={["0", "50", "75", "90", "95", "100", "105", "110", "125", "150", "200"]} prefix="backdrop-brightness" value={state.backdropBrightness} onChange={(v) => update("backdropBrightness", v)} suffix="%" />
            <SteppedSlider label="Contrast" values={["0", "50", "75", "100", "125", "150", "200"]} prefix="backdrop-contrast" value={state.backdropContrast} onChange={(v) => update("backdropContrast", v)} suffix="%" />
            <SteppedSlider label="Saturate" values={["0", "50", "100", "150", "200"]} prefix="backdrop-saturate" value={state.backdropSaturate} onChange={(v) => update("backdropSaturate", v)} suffix="%" />
            <SteppedSlider label="Opacity" values={["0", "5", "10", "20", "25", "30", "40", "50", "60", "70", "75", "80", "90", "95", "100"]} prefix="backdrop-opacity" value={state.backdropOpacity} onChange={(v) => update("backdropOpacity", v)} suffix="%" />
            <SteppedSlider label="Hue rotate" values={["0", "15", "30", "60", "90", "180"]} prefix="backdrop-hue-rotate" value={state.backdropHueRotate} onChange={(v) => update("backdropHueRotate", v)} suffix="°" />
            <EditPanelRow label="Grayscale" variant="nested">
              <div className="flex flex-wrap items-center gap-2">
                <Switch checked={state.backdropGrayscale === "backdrop-grayscale"} onCheckedChange={(checked) => update("backdropGrayscale", checked ? "backdrop-grayscale" : "")} />
                <span className="text-xs text-muted-foreground">{state.backdropGrayscale === "backdrop-grayscale" ? "on" : "off"}</span>
              </div>
            </EditPanelRow>
            <EditPanelRow label="Invert" variant="nested">
              <div className="flex flex-wrap items-center gap-2">
                <Switch checked={state.backdropInvert === "backdrop-invert"} onCheckedChange={(checked) => update("backdropInvert", checked ? "backdrop-invert" : "")} />
                <span className="text-xs text-muted-foreground">{state.backdropInvert === "backdrop-invert" ? "on" : "off"}</span>
              </div>
            </EditPanelRow>
            <EditPanelRow label="Sepia" variant="nested">
              <div className="flex flex-wrap items-center gap-2">
                <Switch checked={state.backdropSepia === "backdrop-sepia"} onCheckedChange={(checked) => update("backdropSepia", checked ? "backdrop-sepia" : "")} />
                <span className="text-xs text-muted-foreground">{state.backdropSepia === "backdrop-sepia" ? "on" : "off"}</span>
              </div>
            </EditPanelRow>
          </EditSubSectionContent>
        </EditSubSection>
      </EditSubSectionWrapper>

    </EditSection>
  )
}
