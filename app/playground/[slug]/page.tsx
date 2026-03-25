"use client"

import * as React from "react"
import { useParams } from "next/navigation"

import { registry } from "@/lib/registry"
import { componentSources } from "@/lib/component-source"
import { PlaygroundToolbar, type Breakpoint } from "@/components/playground/toolbar"
import { ComponentCanvas } from "@/components/playground/component-canvas"
import { CodePanel } from "@/components/playground/code-panel"
import { StructurePanel } from "@/components/playground/structure-panel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ComponentPage() {
  const params = useParams<{ slug: string }>()
  const slug = params.slug

  const [theme, setTheme] = React.useState<"light" | "dark">("light")
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint>("2xl")

  const component = registry.find((c) => c.slug === slug)

  if (!component) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">Component not found</p>
      </div>
    )
  }

  const source =
    componentSources[slug] ??
    `// Source code for ${component.name} coming soon`

  return (
    <>
      <PlaygroundToolbar
        componentName={component.name}
        theme={theme}
        onThemeChange={setTheme}
        breakpoint={breakpoint}
        onBreakpointChange={setBreakpoint}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left: Inspect panels ───────────────────────────── */}
        <div className="flex w-[400px] shrink-0 flex-col border-r">
          <Tabs defaultValue="code" className="flex flex-1 flex-col">
            <TabsList className="mx-2 mt-2">
              <TabsTrigger value="structure">Structure</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
            <TabsContent value="structure" className="flex-1 overflow-auto">
              <StructurePanel slug={slug} />
            </TabsContent>
            <TabsContent value="code" className="flex-1 overflow-hidden">
              <CodePanel code={source} />
            </TabsContent>
          </Tabs>
        </div>

        {/* ── Right: Component preview ───────────────────────── */}
        <ComponentCanvas
          slug={slug}
          componentName={component.name}
          theme={theme}
          breakpoint={breakpoint}
        />
      </div>
    </>
  )
}
