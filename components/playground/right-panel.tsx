"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { TwPanel } from "@/components/playground/tw-panel"
import { TwEditorPanel } from "@/components/playground/tw-editor-panel"
import { VariantPanel } from "@/components/playground/variant-panel"
import { SubComponentPanel } from "@/components/playground/sub-component-panel"
import { VisualEditor } from "@/components/playground/visual-editor"
import { DragHandle } from "@/components/playground/drag-handle"
import type { ElementInfo } from "@/components/playground/element-selector"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const MIN_WIDTH = 280
const MAX_WIDTH = 550
const DEFAULT_WIDTH = 320

interface RightPanelProps {
  isOpen: boolean
  source: string
  isCompound: boolean
  selectedElement?: ElementInfo | null
  onClassChange?: (classes: string[]) => void
  onDeselect?: () => void
  /**
   * Pillar 5c — optional header rendered above the visual editor when a
   * cva-style component is selected. Used by the slug page to mount the
   * `CvaSlotPicker` so the user can choose which cva slot their next
   * class edit will land in. Decoupled from the panel so the panel
   * stays unaware of v2-specific concerns.
   */
  editorHeader?: React.ReactNode
}

export function RightPanel({
  isOpen,
  source,
  isCompound,
  selectedElement,
  onClassChange,
  onDeselect,
  editorHeader,
}: RightPanelProps) {
  const showVisualEditor = selectedElement != null
  const [width, setWidth] = React.useState(DEFAULT_WIDTH)

  return (
    <div
      className={cn(
        "flex shrink-0 overflow-hidden",
        !isOpen && "w-0",
      )}
      style={isOpen ? { width: `${width + 4}px` } : undefined}
    >
      {/* ── Drag handle (left edge) ──────────────────────── */}
      {isOpen && (
        <DragHandle
          width={width}
          minWidth={MIN_WIDTH}
          maxWidth={MAX_WIDTH}
          onWidthChange={setWidth}
          side="right"
        />
      )}

      {/* ── Panel content ────────────────────────────────── */}
      <div
        className="flex flex-1 flex-col border-l bg-background"
        style={{ width: `${width}px` }}
      >
        {showVisualEditor ? (
          <div className="flex h-full w-full flex-col">
            {editorHeader}
            <div className="min-h-0 flex-1">
              <VisualEditor
                selectedElement={selectedElement}
                onClassChange={onClassChange ?? (() => {})}
                onDeselect={onDeselect ?? (() => {})}
              />
            </div>
          </div>
        ) : (
          <Tabs defaultValue="styles" className="flex flex-1 flex-col">
            <TabsList className="mx-2 mt-2 shrink-0">
              <TabsTrigger value="styles">Styles</TabsTrigger>
              <TabsTrigger value="classes">Classes</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
              {isCompound && (
                <TabsTrigger value="parts">Parts</TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="styles" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <TwPanel source={source} />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="classes" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <TwEditorPanel source={source} />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="variants" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <VariantPanel source={source} />
              </ScrollArea>
            </TabsContent>
            {isCompound && (
              <TabsContent value="parts" className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <SubComponentPanel />
                </ScrollArea>
              </TabsContent>
            )}
          </Tabs>
        )}
      </div>
    </div>
  )
}
