"use client"

import * as React from "react"
import { Move } from "lucide-react"

import type { ControlState } from "@/lib/style-state"
import { TRANSITION_PROPERTY_OPTIONS, TRANSITION_BEHAVIOR_OPTIONS, TRANSITION_TIMING_OPTIONS, ANIMATION_OPTIONS } from "@/lib/tailwind-options"

import { TextToggle, SteppedSlider, ScaleControl, TranslateControl, SkewControl, RotateControl, TransformOriginGrid } from "@/components/playground/style-controls"
import { EditPanelRow } from "@/components/playground/edit-panel-row"
import {
  EditSection,
  EditSubSectionWrapper,
  EditSubSection,
  EditSubSectionTitle,
  EditSubSectionContent,
} from "@/components/playground/edit-panel-section"

import type { SectionProps, SectionCallbacks } from "./types"

interface MotionSectionProps extends SectionProps, SectionCallbacks {
  isUserChange: React.MutableRefObject<boolean>
  setState: React.Dispatch<React.SetStateAction<ControlState>>
}

export function MotionSection({
  state,
  update,
  sectionHasValues,
  clearSection,
  isUserChange,
  setState,
}: MotionSectionProps) {
  return (
    <EditSection icon={Move} title="Motion" hasValues={sectionHasValues("motion")} onClear={() => clearSection("motion")}>

      {/* ── Transitions ── */}
      <EditSubSectionWrapper>
        <EditSubSection>
          <EditSubSectionTitle>Transitions</EditSubSectionTitle>
          <EditSubSectionContent>
            <EditPanelRow label="Property" variant="nested">
              <div className="flex flex-wrap gap-0.5">
                {TRANSITION_PROPERTY_OPTIONS.map((opt) => (
                  <TextToggle key={opt} value={opt} label={opt === "transition" ? "default" : opt.replace("transition-", "")} tooltip={opt} isActive={state.transitionProperty === opt} onClick={(v) => update("transitionProperty", state.transitionProperty === v ? "" : v)} />
                ))}
              </div>
            </EditPanelRow>
            <EditPanelRow label="Behavior" variant="nested">
              <div className="flex flex-wrap gap-0.5">
                {TRANSITION_BEHAVIOR_OPTIONS.map((opt) => (
                  <TextToggle key={opt} value={opt} label={opt.replace("transition-", "")} tooltip={opt} isActive={state.transitionBehavior === opt} onClick={(v) => update("transitionBehavior", state.transitionBehavior === v ? "" : v)} />
                ))}
              </div>
            </EditPanelRow>
            <SteppedSlider label="Duration" values={["0", "75", "100", "150", "200", "300", "500", "700", "1000"]} prefix="duration" value={state.transitionDuration} onChange={(v) => update("transitionDuration", v)} suffix="ms" />
            <EditPanelRow label="Easing" variant="nested">
              <div className="flex flex-wrap gap-0.5">
                {TRANSITION_TIMING_OPTIONS.map((opt) => (
                  <TextToggle key={opt} value={opt} label={opt.replace("ease-", "")} tooltip={opt} isActive={state.transitionTiming === opt} onClick={(v) => update("transitionTiming", state.transitionTiming === v ? "" : v)} />
                ))}
              </div>
            </EditPanelRow>
            <SteppedSlider label="Delay" values={["0", "75", "100", "150", "200", "300", "500", "700", "1000"]} prefix="delay" value={state.transitionDelay} onChange={(v) => update("transitionDelay", v)} suffix="ms" />
          </EditSubSectionContent>
        </EditSubSection>
      </EditSubSectionWrapper>

      {/* ── Animation ── */}
      <EditSubSectionWrapper>
        <EditSubSection>
          <EditSubSectionTitle>Animation</EditSubSectionTitle>
          <EditSubSectionContent>
            {(state.scale || state.scaleX || state.scaleY || state.rotate || state.rotateX || state.rotateY || state.translateX || state.translateY || state.skewX || state.skewY) ? (
              <p className="text-xs text-muted-foreground">
                Disabled —{" "}
                <button
                  type="button"
                  className="text-xs font-medium text-destructive hover:underline"
                  onClick={() => {
                    isUserChange.current = true
                    setState((prev) => ({ ...prev, scale: "", scaleX: "", scaleY: "", rotate: "", rotateX: "", rotateY: "", translateX: "", translateY: "", skewX: "", skewY: "", transformOrigin: "" }))
                  }}
                >
                  clear transforms
                </button>
              </p>
            ) : (
              <div className="flex flex-wrap gap-0.5">
                {ANIMATION_OPTIONS.map((opt) => (
                  <TextToggle key={opt} value={opt} label={opt.replace("animate-", "")} tooltip={opt} isActive={state.animation === opt} onClick={(v) => update("animation", state.animation === v ? "" : v)} />
                ))}
              </div>
            )}
          </EditSubSectionContent>
        </EditSubSection>
      </EditSubSectionWrapper>

      {/* ── Transforms ── */}
      <EditSubSectionWrapper>
        <EditSubSection>
          <EditSubSectionTitle>Transforms</EditSubSectionTitle>
          <EditSubSectionContent>
            {(state.animation && state.animation !== "animate-none") ? (
              <p className="text-xs text-muted-foreground">
                Disabled —{" "}
                <button
                  type="button"
                  className="text-xs font-medium text-destructive hover:underline"
                  onClick={() => {
                    isUserChange.current = true
                    setState((prev) => ({ ...prev, animation: "" }))
                  }}
                >
                  clear animation
                </button>
              </p>
            ) : (
              <>
                <EditPanelRow label="Origin" variant="nested">
                  <TransformOriginGrid
                    value={state.transformOrigin}
                    onChange={(v) => update("transformOrigin", v)}
                  />
                </EditPanelRow>
                <ScaleControl
                  scale={state.scale}
                  scaleX={state.scaleX}
                  scaleY={state.scaleY}
                  onScaleChange={(v) => update("scale", v)}
                  onScaleXChange={(v) => update("scaleX", v)}
                  onScaleYChange={(v) => update("scaleY", v)}
                />
                <TranslateControl
                  translateX={state.translateX}
                  translateY={state.translateY}
                  onTranslateXChange={(v) => update("translateX", v)}
                  onTranslateYChange={(v) => update("translateY", v)}
                />
                <SkewControl
                  skewX={state.skewX}
                  skewY={state.skewY}
                  onSkewXChange={(v) => update("skewX", v)}
                  onSkewYChange={(v) => update("skewY", v)}
                />
                <RotateControl
                  rotate={state.rotate}
                  rotateX={state.rotateX}
                  rotateY={state.rotateY}
                  onRotateChange={(v) => update("rotate", v)}
                  onRotateXChange={(v) => update("rotateX", v)}
                  onRotateYChange={(v) => update("rotateY", v)}
                />
              </>
            )}
          </EditSubSectionContent>
        </EditSubSection>
      </EditSubSectionWrapper>

    </EditSection>
  )
}
