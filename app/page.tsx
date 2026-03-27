"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Copy, Code2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  categories,
  getComponentsByCategory,
  type ComponentMeta,
} from "@/lib/registry"

export default function Home() {
  const router = useRouter()
  const grouped = React.useMemo(() => getComponentsByCategory(), [])

  function handleSelectComponent(slug: string) {
    router.push(`/playground/${slug}` as `/playground/${string}`)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="flex w-full max-w-lg flex-col items-center gap-6">
        {/* ── Heading ──────────────────────────────────────────── */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            shadcn Playground
          </h1>
          <p className="text-sm text-muted-foreground">
            Browse, inspect, and build with shadcn/ui components.
            <br />
            Built with shadcn, for shadcn.
          </p>
        </div>

        {/* ── Command palette ─────────────────────────────────── */}
        <p className="text-sm font-medium text-muted-foreground">Load component</p>
        <Command className="rounded-lg border shadow-md [&_[cmdk-list]]:max-h-[300px]">
          <CommandInput placeholder="Search components..." />
          <CommandList>
            <CommandEmpty>No components found.</CommandEmpty>
            {categories.map((category) => {
              const components = grouped.get(category.name) ?? []
              if (components.length === 0) return null
              return (
                <CommandGroup key={category.slug} heading={category.name}>
                  {components.map((component: ComponentMeta) => (
                    <CommandItem
                      key={component.slug}
                      value={`${component.name} ${component.keywords.join(" ")}`}
                      onSelect={() =>
                        handleSelectComponent(component.slug)
                      }
                    >
                      <Code2 className="mr-2 size-4 text-muted-foreground" />
                      <span className="font-medium">{component.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            })}
          </CommandList>
        </Command>

        {/* ── Action buttons ──────────────────────────────────── */}
        <p className="text-sm font-medium text-muted-foreground">Create new</p>
        <div className="flex items-center gap-3">
          <Button asChild>
            <Link href="/playground/new?mode=scratch">
              <Plus className="mr-2 size-4" />
              From Scratch
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/playground/new?mode=copy">
              <Copy className="mr-2 size-4" />
              From Existing
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
