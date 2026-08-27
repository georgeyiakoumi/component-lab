"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"

import { TabBar, type Tab } from "@/components/playground/tab-bar"
import { getBaseUIComponent } from "@/lib/base-ui-registry"

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

  const TABS_STORAGE_KEY = "component-lab:open-tabs"

  // Tab state — always start with a server-safe default
  const defaultTab = React.useMemo(() => {
    const slug = activeSlug ?? "button"
    const comp = getBaseUIComponent(slug)
    return comp ? { slug: comp.slug, name: comp.name } : { slug: "button", name: "Button" }
  }, [activeSlug])

  const [tabs, setTabs] = React.useState<Tab[]>([defaultTab])
  const [hydrated, setHydrated] = React.useState(false)

  // Restore tabs from localStorage after hydration (avoids SSR mismatch)
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(TABS_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Tab[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter((t) => getBaseUIComponent(t.slug))
          if (valid.length > 0) setTabs(valid)
        }
      }
    } catch {
      // Ignore corrupted localStorage
    }
    setHydrated(true)
  }, [])

  // Persist tabs to localStorage on change (only after hydration)
  React.useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(TABS_STORAGE_KEY, JSON.stringify(tabs))
    } catch {
      // Ignore quota errors
    }
  }, [tabs, hydrated])

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

  function handleAdd(slug: string) {
    const existing = tabs.find((t) => t.slug === slug)
    if (existing) {
      // Already open — just switch to it
      router.push(`/playground/base/${slug}`)
      return
    }
    const comp = getBaseUIComponent(slug)
    if (comp) {
      setTabs((prev) => [...prev, { slug: comp.slug, name: comp.name }])
      router.push(`/playground/base/${slug}`)
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
