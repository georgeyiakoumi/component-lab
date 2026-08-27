"use client"

import * as React from "react"
import { useParams } from "next/navigation"

import { getBaseUIComponent } from "@/lib/base-ui-registry"
import { renderBaseUIPreview } from "@/lib/base-ui-previews"
import { DEFAULT_CLASSES } from "@/lib/base-ui-default-classes"

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

  const classMap = DEFAULT_CLASSES[slug] ?? {}

  return (
    <div className="flex h-full flex-col">
      {/* ── Toolbar ──────────────────────────────────────────── */}
      <div className="flex h-12 shrink-0 items-center border-b border-border px-4">
        <h1 className="text-sm font-semibold">{component.name}</h1>
        <span className="ml-2 text-xs text-muted-foreground">
          {component.category}
        </span>
        <code className="ml-auto text-xs text-muted-foreground">
          {component.importPath}
        </code>
      </div>

      {/* ── Preview ──────────────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center p-8">
        {renderBaseUIPreview(slug, classMap)}
      </div>
    </div>
  )
}
