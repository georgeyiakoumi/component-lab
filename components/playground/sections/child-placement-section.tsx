"use client"

import {
  AlignCenterVertical,
  Maximize2,
} from "lucide-react"

import type { ControlState } from "@/lib/style-state"
import { ALIGN_SELF_OPTIONS, JUSTIFY_SELF_OPTIONS, ORDER_OPTIONS, FLEX_BASIS_OPTIONS } from "@/lib/tailwind-options"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { IconToggle, TextToggle, GridNumberPicker } from "@/components/playground/style-controls"
import { EditPanelRow } from "@/components/playground/edit-panel-row"
import { EditPanelSection } from "@/components/playground/edit-panel-section"

import type { SectionProps, SectionCallbacks } from "./types"

interface ChildPlacementSectionProps extends SectionProps, SectionCallbacks {
  parentIsFlex: boolean
  parentIsGrid: boolean
  parentEffectiveDisplay: string | undefined
}

export function ChildPlacementSection({
  state,
  update,
  sectionHasValues,
  clearSection,
  parentIsFlex,
  parentIsGrid,
  parentEffectiveDisplay,
}: ChildPlacementSectionProps) {
  if (!parentIsFlex && !parentIsGrid) return null

  return (
    <EditPanelSection
      icon={AlignCenterVertical}
      title={`Child — ${parentEffectiveDisplay}`}
      defaultOpen
      hasValues={sectionHasValues("childPlacement")}
      onClear={() => clearSection("childPlacement")}
    >
      <EditPanelRow label="Align self">
        <div className="flex flex-wrap gap-0.5">
          {ALIGN_SELF_OPTIONS.map((opt) => (
            <TextToggle key={opt} value={opt} label={opt.replace("self-", "")} tooltip={opt} isActive={state.alignSelf === opt} onClick={(v) => update("alignSelf", state.alignSelf === v ? "" : v)} />
          ))}
        </div>
      </EditPanelRow>

      <EditPanelRow label="Justify self">
        <div className="flex flex-wrap gap-0.5">
          {JUSTIFY_SELF_OPTIONS.map((opt) => (
            <TextToggle key={opt} value={opt} label={opt.replace("justify-self-", "")} tooltip={opt} isActive={state.justifySelf === opt} onClick={(v) => update("justifySelf", state.justifySelf === v ? "" : v)} />
          ))}
        </div>
      </EditPanelRow>

      <EditPanelRow label="Order">
        <Select value={state.order || "__none__"} onValueChange={(v) => update("order", v === "__none__" ? "" : v)}>
          <SelectTrigger className="h-6 w-24 text-xs"><SelectValue placeholder="–" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">–</SelectItem>
            {ORDER_OPTIONS.map((v) => (
              <SelectItem key={v} value={v} className="text-xs">{v.replace("order-", "")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </EditPanelRow>

      {parentIsFlex && (
        <>
          <EditPanelRow label="Flex">
            <div className="flex flex-wrap gap-0.5">
              <TextToggle value="" label="–" tooltip="default" isActive={!state.flexShorthand} onClick={() => update("flexShorthand", "")} />
              <TextToggle value="flex-1" label="1" tooltip="flex-1" isActive={state.flexShorthand === "flex-1"} onClick={(v) => update("flexShorthand", v)} />
              <TextToggle value="flex-auto" label="auto" tooltip="flex-auto" isActive={state.flexShorthand === "flex-auto"} onClick={(v) => update("flexShorthand", v)} />
              <TextToggle value="flex-initial" label="initial" tooltip="flex-initial" isActive={state.flexShorthand === "flex-initial"} onClick={(v) => update("flexShorthand", v)} />
              <TextToggle value="flex-none" label="none" tooltip="flex-none" isActive={state.flexShorthand === "flex-none"} onClick={(v) => update("flexShorthand", v)} />
            </div>
          </EditPanelRow>

          <EditPanelRow label="Grow">
            <div className="flex flex-wrap gap-0.5">
              <TextToggle value="" label="–" tooltip="default" isActive={!state.flexGrow} onClick={() => update("flexGrow", "")} />
              <IconToggle value="grow" icon={Maximize2} tooltip="grow" isActive={state.flexGrow === "grow"} onClick={(v) => update("flexGrow", v)} />
              <TextToggle value="grow-0" label="0" tooltip="grow-0" isActive={state.flexGrow === "grow-0"} onClick={(v) => update("flexGrow", v)} />
            </div>
          </EditPanelRow>

          <EditPanelRow label="Shrink">
            <div className="flex flex-wrap gap-0.5">
              <TextToggle value="" label="–" tooltip="default" isActive={!state.flexShrink} onClick={() => update("flexShrink", "")} />
              <TextToggle value="shrink" label="shrink" tooltip="shrink" isActive={state.flexShrink === "shrink"} onClick={(v) => update("flexShrink", v)} />
              <TextToggle value="shrink-0" label="0" tooltip="shrink-0" isActive={state.flexShrink === "shrink-0"} onClick={(v) => update("flexShrink", v)} />
            </div>
          </EditPanelRow>

          <EditPanelRow label="Basis">
            <Select value={state.flexBasis || "__none__"} onValueChange={(v) => update("flexBasis", v === "__none__" ? "" : v)}>
              <SelectTrigger className="h-6 w-24 text-xs"><SelectValue placeholder="–" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">–</SelectItem>
                {FLEX_BASIS_OPTIONS.map((v) => (
                  <SelectItem key={v} value={v} className="text-xs">{v.replace("basis-", "")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EditPanelRow>
        </>
      )}

      {parentIsGrid && (
        <>
          <EditPanelRow label="Col span">
            <GridNumberPicker value={state.colSpan} prefix="col-span" max={12} extras={[{ value: "col-span-full", label: "full" }]} onChange={(v) => update("colSpan", v)} />
          </EditPanelRow>
          <EditPanelRow label="Row span">
            <GridNumberPicker value={state.rowSpan} prefix="row-span" max={12} extras={[{ value: "row-span-full", label: "full" }]} onChange={(v) => update("rowSpan", v)} />
          </EditPanelRow>
          <EditPanelRow label="Col start">
            <GridNumberPicker value={state.colStart} prefix="col-start" max={13} extras={[{ value: "col-start-auto", label: "auto" }]} onChange={(v) => update("colStart", v)} />
          </EditPanelRow>
          <EditPanelRow label="Col end">
            <GridNumberPicker value={state.colEnd} prefix="col-end" max={13} extras={[{ value: "col-end-auto", label: "auto" }]} onChange={(v) => update("colEnd", v)} />
          </EditPanelRow>
          <EditPanelRow label="Row start">
            <GridNumberPicker value={state.rowStart} prefix="row-start" max={7} extras={[{ value: "row-start-auto", label: "auto" }]} onChange={(v) => update("rowStart", v)} />
          </EditPanelRow>
          <EditPanelRow label="Row end">
            <GridNumberPicker value={state.rowEnd} prefix="row-end" max={7} extras={[{ value: "row-end-auto", label: "auto" }]} onChange={(v) => update("rowEnd", v)} />
          </EditPanelRow>
        </>
      )}
    </EditPanelSection>
  )
}
