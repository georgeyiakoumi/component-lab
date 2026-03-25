"use client"

import { useRouter } from "next/navigation"

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { PlaygroundSidebar } from "@/components/playground/sidebar"
import type { ComponentMeta } from "@/lib/registry"

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  function handleSelectComponent(component: ComponentMeta) {
    router.push(`/playground/${component.slug}` as `/playground/${string}`)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* ── Sidebar panel ──────────────────────────────────── */}
        <ResizablePanel
          defaultSize={20}
          minSize={15}
          maxSize={30}
          className="min-w-[200px] max-w-[400px]"
        >
          <PlaygroundSidebar onSelectComponent={handleSelectComponent} />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* ── Main content area ──────────────────────────────── */}
        <ResizablePanel defaultSize={80}>
          <div className="flex h-full flex-col overflow-hidden">
            {children}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
