"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { PlaygroundSidebar } from "@/components/playground/sidebar"
import { DragHandle } from "@/components/playground/drag-handle"
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

  function handleSelectComponent(component: ComponentMeta) {
    router.push(`/playground/${component.slug}` as `/playground/${string}`)
  }

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
      <DragHandle
        width={sidebarWidth}
        minWidth={MIN_WIDTH}
        maxWidth={MAX_WIDTH}
        onWidthChange={setSidebarWidth}
        side="left"
      />

      {/* ── Main content area ────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>

    </div>
  )
}
