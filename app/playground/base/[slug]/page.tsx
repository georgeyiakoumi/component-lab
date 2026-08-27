"use client"

import * as React from "react"
import { useParams } from "next/navigation"

import { getBaseUIComponent } from "@/lib/base-ui-registry"
import { DEFAULT_CLASSES } from "@/lib/base-ui-default-classes"
import { BaseUIDashboard } from "@/components/playground/base-ui-dashboard"

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

  const initialClassMap = DEFAULT_CLASSES[slug] ?? {}

  return <BaseUIDashboard component={component} initialClassMap={initialClassMap} />
}
