"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, Code2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CreateComponentDialog } from "@/components/playground/create-component-dialog"
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

export default function PlaygroundPage() {
  const router = useRouter()
  const grouped = React.useMemo(() => getComponentsByCategory(), [])

  function handleSelectComponent(slug: string) {
    router.push(`/playground/${slug}` as `/playground/${string}`)
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-muted/30">
      <div className="flex w-full max-w-lg flex-col items-center gap-6">
        {/* ── Heading ──────────────────────────────────────────── */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            What are you building?
          </h1>
          <p className="text-sm text-muted-foreground">
            Pick a shadcn component to inspect, or create one from scratch.
          </p>
        </div>

        {/* ── Command palette ─────────────────────────────────── */}
        <Command className="rounded-lg border shadow-md [&_[cmdk-list]]:max-h-[300px]">
          <CommandInput placeholder="Search shadcn components" />
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
                      onSelect={() => handleSelectComponent(component.slug)}
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

        {/* ── Create from scratch ──────────────────────────────── */}
        <CreateComponentDialog>
          <Button variant="outline">
            <Plus className="mr-2 size-4" />
            Create from scratch
          </Button>
        </CreateComponentDialog>
      </div>
    </div>
  )
}
