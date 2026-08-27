"use client"

import { renderBaseUIPreview } from "@/lib/base-ui-previews"
import { BASE_UI_REGISTRY, BASE_UI_CATEGORIES, getBaseUIComponentsByCategory } from "@/lib/base-ui-registry"
import { DEFAULT_CLASSES } from "@/lib/base-ui-default-classes"

export default function BaseTestPage() {
  return (
    <div className="h-full overflow-y-auto bg-background p-8">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-foreground">
        Base UI Preview Renderer Test
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        {BASE_UI_REGISTRY.length} components registered across {BASE_UI_CATEGORIES.length} categories.
      </p>

      {BASE_UI_CATEGORIES.map((category) => {
        const components = getBaseUIComponentsByCategory(category)
        return (
          <section key={category} className="mb-12">
            <h2 className="mb-4 text-xl font-semibold text-foreground">{category}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {components.map((comp) => (
                <div key={comp.slug} className="flex flex-col overflow-hidden rounded-lg border border-border">
                  {/* Preview area */}
                  <div className="flex flex-1 items-center justify-center border-b border-dashed border-border bg-accent/20 p-8">
                    {renderBaseUIPreview(comp.slug, DEFAULT_CLASSES[comp.slug] ?? {})}
                  </div>

                  {/* Info area */}
                  <div className="space-y-3 p-4">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{comp.name}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">{comp.description}</p>
                    </div>

                    {/* Parts list */}
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">
                        {comp.parts.length} part{comp.parts.length !== 1 ? "s" : ""}
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {comp.parts.map((part) => (
                          <span
                            key={part.name}
                            className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[11px] font-mono text-muted-foreground"
                          >
                            {part.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Import path */}
                    <code className="block truncate text-[11px] text-muted-foreground/60">
                      {comp.importPath}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
