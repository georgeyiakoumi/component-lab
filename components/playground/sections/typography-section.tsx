"use client"

import {
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react"

import { FONT_SIZE_OPTIONS, FONT_WEIGHT_OPTIONS, FONT_FAMILY_OPTIONS, FONT_STYLE_OPTIONS, TEXT_DECORATION_OPTIONS, TEXT_DECORATION_STYLE_OPTIONS, TEXT_DECORATION_THICKNESS_OPTIONS, TEXT_UNDERLINE_OFFSET_OPTIONS, TEXT_TRANSFORM_OPTIONS, TEXT_OVERFLOW_OPTIONS, TEXT_WRAP_OPTIONS, TEXT_INDENT_OPTIONS, LINE_HEIGHT_OPTIONS, LETTER_SPACING_OPTIONS, WORD_BREAK_OPTIONS, WHITESPACE_OPTIONS, HYPHENS_OPTIONS, LINE_CLAMP_OPTIONS, VERTICAL_ALIGN_OPTIONS, LIST_STYLE_TYPE_OPTIONS, LIST_STYLE_POSITION_OPTIONS, FONT_VARIANT_NUMERIC_OPTIONS } from "@/lib/tailwind-options"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { IconToggle, TextToggle } from "@/components/playground/style-controls"
import { EditPanelRow } from "@/components/playground/edit-panel-row"
import { EditPanelSection } from "@/components/playground/edit-panel-section"

import type { SectionProps, SectionCallbacks } from "./types"

export function TypographySection({
  state,
  update,
  sectionHasValues,
  clearSection,
}: SectionProps & SectionCallbacks) {
  return (
    <EditPanelSection icon={Type} title="Typography" hasValues={sectionHasValues("typography")} onClear={() => clearSection("typography")}>
      <EditPanelRow label="Family">
        <div className="flex flex-wrap gap-0.5">
          {FONT_FAMILY_OPTIONS.map((opt) => (
            <TextToggle key={opt} value={opt} label={opt.replace("font-", "")} tooltip={opt} isActive={state.fontFamily === opt} onClick={(v) => update("fontFamily", state.fontFamily === v ? "" : v)} />
          ))}
        </div>
      </EditPanelRow>

      <EditPanelRow label="Size">
        <Select value={state.fontSize || "__none__"} onValueChange={(v) => update("fontSize", v === "__none__" ? "" : v)}>
          <SelectTrigger className="h-6 w-20 text-xs"><SelectValue placeholder="–" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">–</SelectItem>
            {FONT_SIZE_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt} className="text-xs">{opt.replace("text-", "")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </EditPanelRow>

      <EditPanelRow label="Weight">
        <Select value={state.fontWeight || "__none__"} onValueChange={(v) => update("fontWeight", v === "__none__" ? "" : v)}>
          <SelectTrigger className="h-6 w-24 text-xs"><SelectValue placeholder="–" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">–</SelectItem>
            {FONT_WEIGHT_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt} className="text-xs">{opt.replace("font-", "")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </EditPanelRow>

      <EditPanelRow label="Style">
        <div className="flex flex-wrap gap-0.5">
          {FONT_STYLE_OPTIONS.map((opt) => (
            <TextToggle key={opt} value={opt} label={opt} tooltip={opt} isActive={state.fontStyle === opt} onClick={(v) => update("fontStyle", state.fontStyle === v ? "" : v)} />
          ))}
        </div>
      </EditPanelRow>

      <EditPanelRow label="Align">
        <div className="flex flex-wrap gap-0.5">
          <IconToggle value="text-left" icon={AlignLeft} tooltip="text-left" isActive={state.textAlign === "text-left"} onClick={(v) => update("textAlign", state.textAlign === v ? "" : v)} />
          <IconToggle value="text-center" icon={AlignCenter} tooltip="text-center" isActive={state.textAlign === "text-center"} onClick={(v) => update("textAlign", state.textAlign === v ? "" : v)} />
          <IconToggle value="text-right" icon={AlignRight} tooltip="text-right" isActive={state.textAlign === "text-right"} onClick={(v) => update("textAlign", state.textAlign === v ? "" : v)} />
          {["text-justify", "text-start", "text-end"].map((opt) => (
            <TextToggle key={opt} value={opt} label={opt.replace("text-", "")} tooltip={opt} isActive={state.textAlign === opt} onClick={(v) => update("textAlign", state.textAlign === v ? "" : v)} />
          ))}
        </div>
      </EditPanelRow>

      <EditPanelRow label="Decoration">
        <div className="flex flex-wrap gap-0.5">
          {TEXT_DECORATION_OPTIONS.map((opt) => (
            <TextToggle key={opt} value={opt} label={opt.replace("no-", "none").replace("line-through", "strike")} tooltip={opt} isActive={state.textDecoration === opt} onClick={(v) => update("textDecoration", state.textDecoration === v ? "" : v)} />
          ))}
        </div>
      </EditPanelRow>

      {state.textDecoration && state.textDecoration !== "no-underline" && (
        <>
          <EditPanelRow label="Dec. style">
            <div className="flex flex-wrap gap-0.5">
              {TEXT_DECORATION_STYLE_OPTIONS.map((opt) => (
                <TextToggle key={opt} value={opt} label={opt.replace("decoration-", "")} tooltip={opt} isActive={state.textDecorationStyle === opt} onClick={(v) => update("textDecorationStyle", state.textDecorationStyle === v ? "" : v)} />
              ))}
            </div>
          </EditPanelRow>
          <EditPanelRow label="Dec. thick">
            <div className="flex flex-wrap gap-0.5">
              {TEXT_DECORATION_THICKNESS_OPTIONS.map((opt) => (
                <TextToggle key={opt} value={opt} label={opt.replace("decoration-", "")} tooltip={opt} isActive={state.textDecorationThickness === opt} onClick={(v) => update("textDecorationThickness", state.textDecorationThickness === v ? "" : v)} />
              ))}
            </div>
          </EditPanelRow>
          <EditPanelRow label="Underline offset">
            <div className="flex flex-wrap gap-0.5">
              {TEXT_UNDERLINE_OFFSET_OPTIONS.map((opt) => (
                <TextToggle key={opt} value={opt} label={opt.replace("underline-offset-", "")} tooltip={opt} isActive={state.textUnderlineOffset === opt} onClick={(v) => update("textUnderlineOffset", state.textUnderlineOffset === v ? "" : v)} />
              ))}
            </div>
          </EditPanelRow>
        </>
      )}

      <EditPanelRow label="Transform">
        <div className="flex flex-wrap gap-0.5">
          {TEXT_TRANSFORM_OPTIONS.map((opt) => (
            <TextToggle key={opt} value={opt} label={opt.replace("normal-case", "none")} tooltip={opt} isActive={state.textTransform === opt} onClick={(v) => update("textTransform", state.textTransform === v ? "" : v)} />
          ))}
        </div>
      </EditPanelRow>

      <EditPanelRow label="Line height">
        <Select value={state.lineHeight || "__none__"} onValueChange={(v) => update("lineHeight", v === "__none__" ? "" : v)}>
          <SelectTrigger className="h-6 w-28 text-xs"><SelectValue placeholder="–" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">–</SelectItem>
            {LINE_HEIGHT_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt} className="text-xs">{opt.replace("leading-", "")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </EditPanelRow>

      <EditPanelRow label="Letter space">
        <div className="flex flex-wrap gap-0.5">
          {LETTER_SPACING_OPTIONS.map((opt) => (
            <TextToggle key={opt} value={opt} label={opt.replace("tracking-", "")} tooltip={opt} isActive={state.letterSpacing === opt} onClick={(v) => update("letterSpacing", state.letterSpacing === v ? "" : v)} />
          ))}
        </div>
      </EditPanelRow>

      <EditPanelRow label="Overflow">
        <div className="flex flex-wrap gap-0.5">
          {TEXT_OVERFLOW_OPTIONS.map((opt) => (
            <TextToggle key={opt} value={opt} label={opt.replace("text-", "")} tooltip={opt} isActive={state.textOverflow === opt} onClick={(v) => update("textOverflow", state.textOverflow === v ? "" : v)} />
          ))}
        </div>
      </EditPanelRow>

      <EditPanelRow label="Wrap">
        <div className="flex flex-wrap gap-0.5">
          {TEXT_WRAP_OPTIONS.map((opt) => (
            <TextToggle key={opt} value={opt} label={opt.replace("text-", "")} tooltip={opt} isActive={state.textWrap === opt} onClick={(v) => update("textWrap", state.textWrap === v ? "" : v)} />
          ))}
        </div>
      </EditPanelRow>

      <EditPanelRow label="Whitespace">
        <Select value={state.whitespace || "__none__"} onValueChange={(v) => update("whitespace", v === "__none__" ? "" : v)}>
          <SelectTrigger className="h-6 w-28 text-xs"><SelectValue placeholder="–" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">–</SelectItem>
            {WHITESPACE_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt} className="text-xs">{opt.replace("whitespace-", "")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </EditPanelRow>

      <EditPanelRow label="Word break">
        <div className="flex flex-wrap gap-0.5">
          {WORD_BREAK_OPTIONS.map((opt) => (
            <TextToggle key={opt} value={opt} label={opt.replace("break-", "")} tooltip={opt} isActive={state.wordBreak === opt} onClick={(v) => update("wordBreak", state.wordBreak === v ? "" : v)} />
          ))}
        </div>
      </EditPanelRow>

      <EditPanelRow label="Hyphens">
        <div className="flex flex-wrap gap-0.5">
          {HYPHENS_OPTIONS.map((opt) => (
            <TextToggle key={opt} value={opt} label={opt.replace("hyphens-", "")} tooltip={opt} isActive={state.hyphens === opt} onClick={(v) => update("hyphens", state.hyphens === v ? "" : v)} />
          ))}
        </div>
      </EditPanelRow>

      <EditPanelRow label="Line clamp">
        <div className="flex flex-wrap gap-0.5">
          {LINE_CLAMP_OPTIONS.map((opt) => (
            <TextToggle key={opt} value={opt} label={opt.replace("line-clamp-", "")} tooltip={opt} isActive={state.lineClamp === opt} onClick={(v) => update("lineClamp", state.lineClamp === v ? "" : v)} />
          ))}
        </div>
      </EditPanelRow>

      <EditPanelRow label="Indent">
        <Select value={state.textIndent || "__none__"} onValueChange={(v) => update("textIndent", v === "__none__" ? "" : v)}>
          <SelectTrigger className="h-6 w-20 text-xs"><SelectValue placeholder="–" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">–</SelectItem>
            {TEXT_INDENT_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt} className="text-xs">{opt.replace("indent-", "")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </EditPanelRow>

      <EditPanelRow label="V-align">
        <Select value={state.verticalAlign || "__none__"} onValueChange={(v) => update("verticalAlign", v === "__none__" ? "" : v)}>
          <SelectTrigger className="h-6 w-24 text-xs"><SelectValue placeholder="–" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">–</SelectItem>
            {VERTICAL_ALIGN_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt} className="text-xs">{opt.replace("align-", "")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </EditPanelRow>

      <EditPanelRow label="List type">
        <div className="flex flex-wrap gap-0.5">
          {LIST_STYLE_TYPE_OPTIONS.map((opt) => (
            <TextToggle key={opt} value={opt} label={opt.replace("list-", "")} tooltip={opt} isActive={state.listStyleType === opt} onClick={(v) => update("listStyleType", state.listStyleType === v ? "" : v)} />
          ))}
        </div>
      </EditPanelRow>

      <EditPanelRow label="List pos">
        <div className="flex flex-wrap gap-0.5">
          {LIST_STYLE_POSITION_OPTIONS.map((opt) => (
            <TextToggle key={opt} value={opt} label={opt.replace("list-", "")} tooltip={opt} isActive={state.listStylePosition === opt} onClick={(v) => update("listStylePosition", state.listStylePosition === v ? "" : v)} />
          ))}
        </div>
      </EditPanelRow>

      <EditPanelRow label="Num variant">
        <Select value={state.fontVariantNumeric || "__none__"} onValueChange={(v) => update("fontVariantNumeric", v === "__none__" ? "" : v)}>
          <SelectTrigger className="h-6 w-32 text-xs"><SelectValue placeholder="–" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">–</SelectItem>
            {FONT_VARIANT_NUMERIC_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </EditPanelRow>
    </EditPanelSection>
  )
}
