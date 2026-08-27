"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"

import { PlaygroundSidebar } from "@/components/playground/sidebar"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  Sidebar,
} from "@/components/ui/sidebar"
export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = React.useState(pathname === "/playground")

  // Collapse sidebar when navigating to a component page
  React.useEffect(() => {
    if (pathname !== "/playground") {
      setSidebarOpen(false)
    }
  }, [pathname])

  function handleSelectBaseComponent(slug: string) {
    router.push(`/playground/base/${slug}`)
  }

  const selectedSlug = pathname.startsWith("/playground/base/")
    ? `base/${pathname.split("/").pop()}`
    : pathname.replace("/playground/", "")

  return (
    <SidebarProvider
      open={sidebarOpen}
      onOpenChange={setSidebarOpen}
      className="h-screen !min-h-0"
    >
      <Sidebar collapsible="offcanvas">
        <PlaygroundSidebar
          onSelectBaseComponent={handleSelectBaseComponent}
          selectedSlug={selectedSlug}
        />
      </Sidebar>

      {!sidebarOpen && (
        <div className="flex shrink-0 flex-col border-r bg-sidebar px-1.5 pt-2">
          <SidebarTrigger />
        </div>
      )}

      <SidebarInset className="overflow-hidden">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
