"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Copy, FileCode, Plus, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  registry,
  type ComponentMeta,
} from "@/lib/registry"
import { componentSources } from "@/lib/component-source"
import { toPascalCase, generateFromTree } from "@/lib/code-generator"
import {
  generateId,
  saveUserComponent,
  toSlug,
  type UserComponent,
} from "@/lib/component-store"
import { createComponentTree } from "@/lib/component-tree"

/* ── Constants ──────────────────────────────────────────────────── */

type CreationMode = "copy" | "scratch"

const BASE_ELEMENTS = [
  { value: "div", label: "div", description: "Generic container" },
  { value: "button", label: "button", description: "Clickable action" },
  { value: "input", label: "input", description: "Text input" },
  { value: "a", label: "a", description: "Anchor / link" },
  { value: "span", label: "span", description: "Inline container" },
  { value: "form", label: "form", description: "Form wrapper" },
  { value: "textarea", label: "textarea", description: "Multi-line input" },
  { value: "select", label: "select", description: "Dropdown select" },
  { value: "img", label: "img", description: "Image element" },
] as const

const PASCAL_CASE_REGEX = /^[A-Z][a-zA-Z0-9]*$/

/* ── Page ───────────────────────────────────────────────────────── */

export default function NewComponentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialMode: CreationMode =
    searchParams.get("mode") === "copy" ? "copy" : "scratch"

  const [mode, setMode] = React.useState<CreationMode>(initialMode)
  const [name, setName] = React.useState("")
  const [selectedComponent, setSelectedComponent] = React.useState<string>("")
  const [baseElement, setBaseElement] = React.useState("div")
  const [nameError, setNameError] = React.useState<string | null>(null)

  const grouped = React.useMemo(() => getComponentsByCategory(), [])

  /* ── Validation ──────────────────────────────────────────────── */

  const validateName = React.useCallback((value: string): string | null => {
    if (value.length === 0) return null // don't show error on empty
    if (value.length < 2) return "Name must be at least 2 characters"
    if (!PASCAL_CASE_REGEX.test(value))
      return "Name must be PascalCase (e.g. MyButton)"
    return null
  }, [])

  const handleNameChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setName(value)
      setNameError(validateName(value))
    },
    [validateName],
  )

  const isValid =
    name.length >= 2 &&
    PASCAL_CASE_REGEX.test(name) &&
    (mode === "copy" ? selectedComponent.length > 0 : true)

  /* ── Source rename helper ────────────────────────────────────── */

  function renameComponentInSource(
    source: string,
    originalSlug: string,
    newName: string,
  ): string {
    const originalMeta = registry.find((c) => c.slug === originalSlug)
    if (!originalMeta) return source

    const originalName = originalMeta.name
    let result = source

    // Replace the main component name (PascalCase occurrences)
    // Be careful with compound components — replace root name only in
    // declarations and displayName, not sub-component prefixes
    if (originalMeta.isCompound) {
      // For compound components, replace the root name prefix
      // e.g. "Card" -> "MyCard", "CardHeader" -> "MyCardHeader"
      result = result.replace(
        new RegExp(`\\b${originalName}(?=[A-Z]|\\b)`, "g"),
        newName,
      )
    } else {
      // For simple components, replace exact name matches
      result = result.replace(
        new RegExp(`\\b${originalName}\\b`, "g"),
        newName,
      )
    }

    return result
  }

  /* ── Create handler ─────────────────────────────────────────── */

  function handleCreate() {
    if (!isValid) return

    const componentName = toPascalCase(name)
    const slug = toSlug(componentName)
    const now = new Date().toISOString()

    let source: string
    let tree = undefined

    if (mode === "copy") {
      const originalSource = componentSources[selectedComponent] ?? ""
      source = renameComponentInSource(originalSource, selectedComponent, componentName)
    } else {
      // Generate a from-scratch component with a tree structure
      tree = createComponentTree(componentName, baseElement)
      source = generateFromTree(tree)
    }

    const component: UserComponent = {
      id: generateId(),
      name: componentName,
      slug,
      source,
      tree,
      basedOn: mode === "copy" ? selectedComponent : undefined,
      createdAt: now,
      updatedAt: now,
    }

    saveUserComponent(component)
    router.push(`/playground/custom/${slug}`)
  }

  return (
    <>
      {/* ── Toolbar placeholder ────────────────────────────────── */}
      <div className="flex h-12 shrink-0 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <Plus className="size-4 text-muted-foreground" />
          <span className="text-sm font-semibold">Create New Component</span>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────── */}
      <div className="flex flex-1 items-start justify-center overflow-auto bg-muted/30 p-8">
        <div className="flex w-full max-w-2xl flex-col gap-6">
          {/* ── Name input ─────────────────────────────────────── */}
          <div className="space-y-2">
            <Label htmlFor="component-name" className="text-sm font-medium">
              Component Name
            </Label>
            <Input
              id="component-name"
              placeholder="e.g. MyButton"
              value={name}
              onChange={handleNameChange}
              className={cn(
                "h-10",
                nameError && "border-destructive focus-visible:ring-destructive",
              )}
            />
            {nameError && (
              <p className="text-xs text-destructive">{nameError}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Must be PascalCase. This becomes the exported component name.
            </p>
          </div>

          {/* ── Mode cards ─────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-4">
            {/* Copy from existing */}
            <Card
              className={cn(
                "cursor-pointer transition-colors",
                mode === "copy"
                  ? "border-primary ring-1 ring-primary"
                  : "hover:border-muted-foreground/30",
              )}
              onClick={() => setMode("copy")}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Copy className="size-4 text-primary" />
                  <CardTitle className="text-sm">Copy from Existing</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Fork a shadcn component as your starting point
                </CardDescription>
              </CardHeader>
            </Card>

            {/* From scratch */}
            <Card
              className={cn(
                "cursor-pointer transition-colors",
                mode === "scratch"
                  ? "border-primary ring-1 ring-primary"
                  : "hover:border-muted-foreground/30",
              )}
              onClick={() => setMode("scratch")}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  <CardTitle className="text-sm">From Scratch</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Start with a blank component shell
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* ── Mode-specific content ──────────────────────────── */}
          {mode === "copy" ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Select component to fork
              </Label>
              <Command className="rounded-lg border shadow-sm [&_[cmdk-list]]:max-h-[260px]">
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
                              setSelectedComponent(component.slug)
                            }
                            className={cn(
                              selectedComponent === component.slug &&
                                "bg-accent text-accent-foreground",
                            )}
                          >
                            <FileCode className="mr-2 size-4 text-muted-foreground" />
                            <span className="font-medium">
                              {component.name}
                            </span>
                            {selectedComponent === component.slug && (
                              <span className="ml-auto text-xs text-primary">
                                Selected
                              </span>
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )
                  })}
                </CommandList>
              </Command>
              {selectedComponent && (
                <p className="text-xs text-muted-foreground">
                  Forking from{" "}
                  <span className="font-medium text-foreground">
                    {registry.find((c) => c.slug === selectedComponent)?.name}
                  </span>
                  . All occurrences of the original name will be renamed to{" "}
                  <span className="font-medium text-foreground">
                    {name || "YourName"}
                  </span>
                  .
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Base HTML element</Label>
              <div className="grid grid-cols-3 gap-2">
                {BASE_ELEMENTS.map((el) => (
                  <button
                    key={el.value}
                    type="button"
                    onClick={() => setBaseElement(el.value)}
                    className={cn(
                      "flex flex-col items-start rounded-md border p-3 text-left transition-colors",
                      baseElement === el.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "hover:border-muted-foreground/30",
                    )}
                  >
                    <code className="text-xs font-semibold">
                      &lt;{el.label}&gt;
                    </code>
                    <span className="text-[10px] text-muted-foreground">
                      {el.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Create button ──────────────────────────────────── */}
          <Button
            size="lg"
            disabled={!isValid}
            onClick={handleCreate}
            className="w-full"
          >
            <Plus className="mr-2 size-4" />
            Create Component
          </Button>
        </div>
      </div>
    </>
  )
}

/* ── Minimal component generator ─────────────────────────────────── */

function generateMinimalComponent(name: string, baseElement: string): string {
  const elementTypeMap: Record<string, { htmlEl: string; attrs: string }> = {
    button: { htmlEl: "HTMLButtonElement", attrs: "React.ButtonHTMLAttributes<HTMLButtonElement>" },
    div: { htmlEl: "HTMLDivElement", attrs: "React.HTMLAttributes<HTMLDivElement>" },
    input: { htmlEl: "HTMLInputElement", attrs: "React.InputHTMLAttributes<HTMLInputElement>" },
    a: { htmlEl: "HTMLAnchorElement", attrs: "React.AnchorHTMLAttributes<HTMLAnchorElement>" },
    span: { htmlEl: "HTMLSpanElement", attrs: "React.HTMLAttributes<HTMLSpanElement>" },
    form: { htmlEl: "HTMLFormElement", attrs: "React.FormHTMLAttributes<HTMLFormElement>" },
    img: { htmlEl: "HTMLImageElement", attrs: "React.ImgHTMLAttributes<HTMLImageElement>" },
    textarea: { htmlEl: "HTMLTextAreaElement", attrs: "React.TextareaHTMLAttributes<HTMLTextAreaElement>" },
    select: { htmlEl: "HTMLSelectElement", attrs: "React.SelectHTMLAttributes<HTMLSelectElement>" },
  }

  const info = elementTypeMap[baseElement] ?? elementTypeMap["div"]

  return `import * as React from "react"

import { cn } from "@/lib/utils"

const ${name} = React.forwardRef<
  ${info.htmlEl},
  ${info.attrs}
>(({ className, ...props }, ref) => (
  <${baseElement}
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
${name}.displayName = "${name}"

export { ${name} }
`
}
