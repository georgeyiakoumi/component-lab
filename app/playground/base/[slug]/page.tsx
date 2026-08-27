"use client"

import * as React from "react"
import { useParams } from "next/navigation"

import type { BaseUIComponent } from "@/lib/base-ui-registry"
import { getBaseUIComponent } from "@/lib/base-ui-registry"
import { DEFAULT_CLASSES } from "@/lib/base-ui-default-classes"
import { BaseUIDashboard } from "@/components/playground/base-ui-dashboard"

const CLASSMAP_STORAGE_KEY = "component-lab:classmaps"

function loadSavedClassMap(slug: string): Record<string, string> | null {
  try {
    const saved = localStorage.getItem(CLASSMAP_STORAGE_KEY)
    if (!saved) return null
    const all = JSON.parse(saved) as Record<string, Record<string, string>>
    return all[slug] ?? null
  } catch {
    return null
  }
}

function saveClassMap(slug: string, classMap: Record<string, string>) {
  try {
    const saved = localStorage.getItem(CLASSMAP_STORAGE_KEY)
    const all = saved ? (JSON.parse(saved) as Record<string, Record<string, string>>) : {}
    all[slug] = classMap
    localStorage.setItem(CLASSMAP_STORAGE_KEY, JSON.stringify(all))
  } catch {
    // Ignore storage errors
  }
}

/* ── Inner component — all hooks are unconditional ──────────── */

function BaseComponentPageInner({ component, slug }: { component: BaseUIComponent; slug: string }) {
  const defaults = DEFAULT_CLASSES[slug] ?? {}

  const initialClassMap = React.useMemo(() => {
    const saved = loadSavedClassMap(slug)
    if (!saved) return defaults
    return { ...defaults, ...saved }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const saveTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleClassMapChange = React.useCallback(
    (classMap: Record<string, string>) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = setTimeout(() => saveClassMap(slug, classMap), 300)
    },
    [slug],
  )

  React.useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [])

  return (
    <BaseUIDashboard
      key={slug}
      component={component}
      initialClassMap={initialClassMap}
      onClassMapChange={handleClassMapChange}
    />
  )
}

/* ── Page component — guard then render ─────────────────────── */

export default function BaseComponentPage() {
  const params = useParams<{ slug: string }>()
  const slug = params.slug
  const component = getBaseUIComponent(slug)

  if (!component) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">Component not found</p>
      </div>
    )
  }

  return <BaseComponentPageInner component={component} slug={slug} />
}
