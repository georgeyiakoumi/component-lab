"use client"

import * as React from "react"
import { useParams } from "next/navigation"

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

  const defaults = DEFAULT_CLASSES[slug] ?? {}

  // Merge saved classMap with defaults (so new parts from registry are included)
  const initialClassMap = React.useMemo(() => {
    const saved = loadSavedClassMap(slug)
    if (!saved) return defaults
    return { ...defaults, ...saved }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  // Debounced save on classMap change
  const saveTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleClassMapChange = React.useCallback(
    (classMap: Record<string, string>) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = setTimeout(() => saveClassMap(slug, classMap), 300)
    },
    [slug],
  )

  // Cleanup timeout on unmount
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
