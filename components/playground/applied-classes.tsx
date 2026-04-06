"use client"

import * as React from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const MIN_HEIGHT = 28
const DEFAULT_HEIGHT = 120
const MAX_HEIGHT = 300

function AppliedClassesSection({ classes }: { classes: string[] }) {
  const [height, setHeight] = React.useState(DEFAULT_HEIGHT)
  const [isDragging, setIsDragging] = React.useState(false)
  const startY = React.useRef(0)
  const startHeight = React.useRef(0)
  const collapsed = height <= MIN_HEIGHT + 4

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)
      startY.current = e.clientY
      startHeight.current = height
    },
    [height],
  )

  React.useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const delta = startY.current - e.clientY
      const newHeight = Math.min(
        MAX_HEIGHT,
        Math.max(MIN_HEIGHT, startHeight.current + delta),
      )
      setHeight(newHeight)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  const toggleCollapse = () => {
    setHeight(collapsed ? DEFAULT_HEIGHT : MIN_HEIGHT)
  }

  return (
    <div
      className="shrink-0 border-t"
      style={{ height: `${height}px` }}
    >
      <div
        className={cn(
          "flex h-1.5 cursor-row-resize items-center justify-center",
          isDragging && "bg-blue-500/10",
        )}
        onMouseDown={handleMouseDown}
      >
        <div className="h-0.5 w-8 rounded-full bg-muted-foreground/30" />
      </div>

      <button
        type="button"
        className="flex w-full items-center gap-1 px-3 py-1"
        onClick={toggleCollapse}
      >
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Applied classes
        </span>
        <Badge
          variant="secondary"
          className="ml-1 h-4 px-1 text-xs"
        >
          {classes.length}
        </Badge>
        <div className="flex-1" />
        {collapsed ? (
          <ChevronRight className="size-3 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-3 text-muted-foreground" />
        )}
      </button>

      {!collapsed && (
        <div className="overflow-auto px-3 pb-2" style={{ maxHeight: `${height - 36}px` }}>
          <div className="flex flex-wrap gap-1">
            {classes.length === 0 && (
              <span className="text-xs text-muted-foreground">
                No classes applied
              </span>
            )}
            {classes.map((cls, idx) => (
              <Badge
                key={`${cls}-${idx}`}
                variant="secondary"
                className="h-5 text-xs"
              >
                {cls}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export { AppliedClassesSection }
