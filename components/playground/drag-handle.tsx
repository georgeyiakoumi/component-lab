"use client"

import * as React from "react"
import { EllipsisVertical, Ellipsis } from "lucide-react"

import { cn } from "@/lib/utils"

interface DragHandleProps {
  /** Current size of the panel being resized */
  width: number
  /** Min allowed size */
  minWidth: number
  /** Max allowed size */
  maxWidth: number
  /** Callback when size changes */
  onWidthChange: (width: number) => void
  /** Which side the panel is on — determines drag direction */
  side?: "left" | "right"
  /** Orientation of the handle */
  orientation?: "horizontal" | "vertical"
}

export function DragHandle({
  width,
  minWidth,
  maxWidth,
  onWidthChange,
  side = "left",
  orientation = "horizontal",
}: DragHandleProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const isVertical = orientation === "vertical"
  // Track active listeners for cleanup on unmount
  const cleanupRef = React.useRef<(() => void) | null>(null)

  // Cleanup listeners if component unmounts while dragging
  React.useEffect(() => {
    return () => {
      cleanupRef.current?.()
    }
  }, [])

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)

      const startPos = isVertical ? e.clientY : e.clientX
      const startSize = width

      function onMouseMove(moveEvent: MouseEvent) {
        const currentPos = isVertical ? moveEvent.clientY : moveEvent.clientX
        const delta = currentPos - startPos
        const adjusted = isVertical
          ? startSize - delta
          : side === "left"
            ? startSize + delta
            : startSize - delta
        const newSize = Math.min(maxWidth, Math.max(minWidth, adjusted))
        onWidthChange(newSize)
      }

      function onMouseUp() {
        setIsDragging(false)
        document.removeEventListener("mousemove", onMouseMove)
        document.removeEventListener("mouseup", onMouseUp)
        cleanupRef.current = null
      }

      document.addEventListener("mousemove", onMouseMove)
      document.addEventListener("mouseup", onMouseUp)
      cleanupRef.current = () => {
        document.removeEventListener("mousemove", onMouseMove)
        document.removeEventListener("mouseup", onMouseUp)
      }
    },
    [width, minWidth, maxWidth, onWidthChange, side, isVertical],
  )

  const cursor = isVertical ? "cursor-row-resize" : "cursor-col-resize"

  return (
    <>
      <div
        onMouseDown={handleMouseDown}
        className={cn(
          "group relative z-10 flex shrink-0 items-center justify-center bg-muted/50 transition-colors hover:bg-blue-500/30",
          isVertical ? `h-2 ${cursor}` : `w-2 ${cursor}`,
          isDragging && "bg-blue-500/50",
        )}
      >
        {isVertical ? (
          <Ellipsis className={cn(
            "absolute size-4 text-muted-foreground transition-colors group-hover:text-blue",
            isDragging && "text-blue-500",
          )} />
        ) : (
          <EllipsisVertical className={cn(
            "absolute size-4 text-muted-foreground transition-colors group-hover:text-blue",
            isDragging && "text-blue-500",
          )} />
        )}
      </div>

      {isDragging && (
        <div className={cn("fixed inset-0 z-50", cursor)} />
      )}
    </>
  )
}
