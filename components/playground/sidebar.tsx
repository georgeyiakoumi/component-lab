"use client"

import * as React from "react"
import { Search, ChevronRight, Layers } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  categories,
  searchComponents,
  getComponentsByCategory,
  type ComponentMeta,
} from "@/lib/registry"

/* ── Types ──────────────────────────────────────────────────────── */

interface SidebarProps {
  onSelectComponent?: (component: ComponentMeta) => void
  selectedSlug?: string
  className?: string
}

/* ── Component ──────────────────────────────────────────────────── */

export function PlaygroundSidebar({
  onSelectComponent,
  selectedSlug,
  className,
}: SidebarProps) {
  const [query, setQuery] = React.useState("")
  const [expandedCategories, setExpandedCategories] = React.useState<
    Set<string>
  >(new Set())

  const grouped = React.useMemo(() => getComponentsByCategory(), [])

  const filteredComponents = React.useMemo(
    () => searchComponents(query),
    [query],
  )

  // When searching, we show a flat filtered list.
  // When browsing, we show the category-grouped collapsible list.
  const isSearching = query.trim().length > 0

  const toggleCategory = React.useCallback((categoryName: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(categoryName)) {
        next.delete(categoryName)
      } else {
        next.add(categoryName)
      }
      return next
    })
  }, [])

  return (
    <div className={cn("flex h-full flex-col border-r bg-background", className)}>
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <Layers className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-semibold tracking-tight">
          Components
        </span>
        <Badge variant="secondary" className="ml-auto text-[10px]">
          {filteredComponents.length}
        </Badge>
      </div>

      <div className="border-b px-3 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8 pl-8 text-xs"
          />
        </div>
      </div>

      {/* ── Component list ─────────────────────────────────────── */}
      <ScrollArea className="flex-1">
        <div className="py-2">
          {isSearching ? (
            /* ── Flat search results ──────────────────────────── */
            filteredComponents.length === 0 ? (
              <p className="px-4 py-6 text-center text-xs text-muted-foreground">
                No components match &ldquo;{query}&rdquo;
              </p>
            ) : (
              <div className="space-y-0.5 px-2">
                {filteredComponents.map((component) => (
                  <ComponentItem
                    key={component.slug}
                    component={component}
                    isSelected={selectedSlug === component.slug}
                    onSelect={onSelectComponent}
                    showCategory
                  />
                ))}
              </div>
            )
          ) : (
            /* ── Grouped categories ──────────────────────────── */
            categories.map((category) => {
              const components = grouped.get(category.name) ?? []
              if (components.length === 0) return null

              const isExpanded = expandedCategories.has(category.name)

              return (
                <div key={category.slug}>
                  <button
                    type="button"
                    onClick={() => toggleCategory(category.name)}
                    className={cn(
                      "flex w-full items-center gap-2 px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
                      isExpanded && "bg-muted/50",
                    )}
                  >
                    <ChevronRight
                      className={cn(
                        "h-3 w-3 transition-transform duration-200",
                        isExpanded && "rotate-90",
                      )}
                    />
                    <span>{category.name}</span>
                    <span className="ml-auto tabular-nums text-[10px] text-muted-foreground/60">
                      {components.length}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="space-y-0.5 pb-1">
                      {components.map((component) => (
                        <ComponentItem
                          key={component.slug}
                          component={component}
                          isSelected={selectedSlug === component.slug}
                          onSelect={onSelectComponent}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

/* ── ComponentItem ──────────────────────────────────────────────── */

interface ComponentItemProps {
  component: ComponentMeta
  isSelected?: boolean
  onSelect?: (component: ComponentMeta) => void
  showCategory?: boolean
}

function ComponentItem({
  component,
  isSelected,
  onSelect,
  showCategory,
}: ComponentItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(component)}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-6 py-1.5 text-left text-sm transition-colors",
        isSelected
          ? "bg-accent text-accent-foreground"
          : "text-foreground/80 hover:bg-muted hover:text-foreground",
      )}
    >
      <span className="truncate">{component.name}</span>
      {showCategory && (
        <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">
          {component.category}
        </span>
      )}
      {component.isCompound && !showCategory && (
        <Badge
          variant="outline"
          className="ml-auto h-4 px-1 text-[9px] font-normal"
        >
          compound
        </Badge>
      )}
    </button>
  )
}
