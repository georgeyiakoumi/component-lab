"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"

import { TabBar, type Tab } from "@/components/playground/tab-bar"
import { getBaseUIComponent, BASE_UI_REGISTRY } from "@/lib/base-ui-registry"

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  // Derive active slug from URL
  const activeSlug = pathname.startsWith("/playground/base/")
    ? pathname.split("/").pop() ?? null
    : null

  // Tab state
  const [tabs, setTabs] = React.useState<Tab[]>(() => {
    // Default: open the component from the URL, or Button
    const slug = activeSlug ?? "button"
    const comp = getBaseUIComponent(slug)
    return comp ? [{ slug: comp.slug, name: comp.name }] : [{ slug: "button", name: "Button" }]
  })

  // Track slugs we're navigating to after closing — don't re-add these
  const closingRef = React.useRef<string | null>(null)

  // Ensure the active component is always in the tab list (for deep links)
  React.useEffect(() => {
    if (!activeSlug) return
    if (closingRef.current === activeSlug) {
      closingRef.current = null
      return
    }
    const exists = tabs.some((t) => t.slug === activeSlug)
    if (!exists) {
      const comp = getBaseUIComponent(activeSlug)
      if (comp) {
        setTabs((prev) => {
          // Double-check inside updater to avoid race conditions
          if (prev.some((t) => t.slug === comp.slug)) return prev
          return [...prev, { slug: comp.slug, name: comp.name }]
        })
      }
    }
  }, [activeSlug, tabs])

  function handleSelect(slug: string) {
    router.push(`/playground/base/${slug}`)
  }

  function handleClose(slug: string) {
    const next = tabs.filter((t) => t.slug !== slug)

    if (next.length === 0) {
      setTabs([{ slug: "button", name: "Button" }])
      router.push("/playground/base/button")
      return
    }

    setTabs(next)

    if (slug === activeSlug) {
      const newActive = next[next.length - 1]
      // Mark this as a close-navigation so the effect doesn't re-add the closed tab
      closingRef.current = slug
      router.push(`/playground/base/${newActive.slug}`)
    }
  }

  function handleAdd() {
    // Placeholder — GEO-851 builds the real picker popover
    // For now, open a component that isn't already in the tab list
    const openSlugs = new Set(tabs.map((t) => t.slug))
    const next = BASE_UI_REGISTRY.find((c) => !openSlugs.has(c.slug))
    if (next) {
      setTabs((prev) => [...prev, { slug: next.slug, name: next.name }])
      router.push(`/playground/base/${next.slug}`)
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <TabBar
        tabs={tabs}
        activeSlug={activeSlug}
        onSelect={handleSelect}
        onClose={handleClose}
        onAdd={handleAdd}
      />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
