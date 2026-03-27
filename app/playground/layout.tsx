"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { GripVertical } from "lucide-react"

import { cn } from "@/lib/utils"
import { PlaygroundSidebar } from "@/components/playground/sidebar"
import type { ComponentMeta } from "@/lib/registry"

const MIN_WIDTH = 200
const MAX_WIDTH = 480
const DEFAULT_WIDTH = 280

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [sidebarWidth, setSidebarWidth] = React.useState(DEFAULT_WIDTH)
  const [isDragging, setIsDragging] = React.useState(false)

  function handleSelectComponent(component: ComponentMeta) {
    router.push(`/playground/${component.slug}` as `/playground/${string}`)
  }

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)

      const startX = e.clientX
      const startWidth = sidebarWidth

      function onMouseMove(moveEvent: MouseEvent) {
        const delta = moveEvent.clientX - startX
        const newWidth = Math.min(
          MAX_WIDTH,
          Math.max(MIN_WIDTH, startWidth + delta)
        )
        setSidebarWidth(newWidth)
      }

      function onMouseUp() {
        setIsDragging(false)
        document.removeEventListener("mousemove", onMouseMove)
        document.removeEventListener("mouseup", onMouseUp)
      }

      document.addEventListener("mousemove", onMouseMove)
      document.addEventListener("mouseup", onMouseUp)
    },
    [sidebarWidth]
  )

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* ── Sidebar ──────────────────────────────────────────── */}
      <div
        className="shrink-0"
        style={{ width: sidebarWidth }}
      >
        <PlaygroundSidebar onSelectComponent={handleSelectComponent} />
      </div>

      {/* ── Resize handle ────────────────────────────────────── */}
      <div
        onMouseDown={handleMouseDown}
        className={cn(
          "relative flex w-1.5 shrink-0 cursor-col-resize items-center justify-center border-x bg-muted/50 transition-colors hover:bg-blue-500/20",
          isDragging && "bg-blue-500/20"
        )}
      >
        <div className="absolute z-10 flex h-8 w-4 items-center justify-center rounded-sm border bg-background shadow-sm">
          <GripVertical className="h-3 w-3 text-muted-foreground" />
        </div>
      </div>

      {/* ── Main content area ────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>

      {/* Prevent text selection while dragging */}
      {isDragging && (
        <div className="fixed inset-0 z-50 cursor-col-resize" />
      )}
    </div>
  )
}
