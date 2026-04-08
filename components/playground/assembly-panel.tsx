"use client"

import * as React from "react"
import {
  Plus,
  Eye,
  EyeOff,
  Trash2,
  ChevronRight,
  ChevronDown,
  Box,
  Type,
  Heading,
  MousePointer,
  Image,
  FormInput,
  List,
  Minus,
  Code2,
  Component,
  TextCursorInput,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import type {
  ComponentTreeV2,
  PartChild,
  PartNode,
  SubComponentV2,
} from "@/lib/component-tree-v2"
import { createPartNode } from "@/lib/component-tree-v2-factories"
import {
  appendChildAtPath,
  makePartPath,
  movePartByPath,
  removePartAtPath,
  type PartPath,
} from "@/lib/parser/v2-tree-path"

/* ── Types ──────────────────────────────────────────────────────── */

interface AssemblyPanelProps {
  tree: ComponentTreeV2
  onTreeChange: (tree: ComponentTreeV2) => void
  onSelectPath?: (path: PartPath | null) => void
  selectedPath?: PartPath | null
  /** Set of part paths that are hidden in the canvas */
  hiddenPaths: Set<PartPath>
  onHiddenChange: (hiddenPaths: Set<PartPath>) => void
}

type DropPosition = "before" | "after" | "inside"

/* ── Component ──────────────────────────────────────────────────── */

export function AssemblyPanel({
  tree,
  onTreeChange,
  onSelectPath,
  selectedPath,
  hiddenPaths,
  onHiddenChange,
}: AssemblyPanelProps) {
  function toggleHidden(path: PartPath) {
    const next = new Set(hiddenPaths)
    if (next.has(path)) {
      next.delete(path)
    } else {
      next.add(path)
    }
    onHiddenChange(next)
  }

  function handleRemove(path: PartPath) {
    onTreeChange(removePartAtPath(tree, path))
  }

  function handleMove(
    dragPath: PartPath,
    targetPath: PartPath,
    position: DropPosition,
  ) {
    onTreeChange(movePartByPath(tree, dragPath, targetPath, position))
  }

  function handleAddChild(parentPath: PartPath, tag: string) {
    // #text becomes a literal text child instead of a new part
    if (tag === "#text") {
      // We need to mutate the parent to add a text PartChild. The simplest
      // way is to compute it manually rather than going through
      // appendChildAtPath (which only takes PartNodes, not PartChildren).
      onTreeChange(appendTextChildAtPath(tree, parentPath, "Sample text"))
      return
    }
    const newChild = createPartNode(tag)
    onTreeChange(appendChildAtPath(tree, parentPath, newChild))
  }

  // The first sub-component is the canvas root. Any additional sub-components
  // appear as siblings further down the tree.
  const root = tree.subComponents[0]
  if (!root) return null
  const rootPath = makePartPath(root.name, [])

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex max-h-96 flex-col">
        <div className="flex shrink-0 items-center gap-1.5 border-b px-3 py-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Assembly
          </span>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="min-w-max p-1.5">
            <AssemblyNode
              part={root.parts.root}
              path={rootPath}
              depth={0}
              isRoot
              rootName={root.name}
              subComponents={tree.subComponents}
              hiddenPaths={hiddenPaths}
              selectedPath={selectedPath}
              onSelectPath={onSelectPath}
              onToggleHidden={toggleHidden}
              onRemove={handleRemove}
              onMove={handleMove}
              onAddChild={handleAddChild}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

/* ── Helpers ────────────────────────────────────────────────────── */

/**
 * Append a text child to the part at `path`. Used by the AssemblyPanel's
 * "#text" picker option, which v1 handled by setting `node.text` on a
 * fresh ElementNode. v2 represents text as a PartChild of kind "text".
 */
function appendTextChildAtPath(
  tree: ComponentTreeV2,
  path: PartPath,
  text: string,
): ComponentTreeV2 {
  // Round-trip through the path layer would require a separate
  // appendPartChildAtPath helper, but a one-off for text is simple enough
  // to do inline. We rebuild the tree by walking and replacing at the path.
  return mutatePartAtPath(tree, path, (part) => ({
    ...part,
    children: [
      ...part.children,
      { kind: "text", value: text } satisfies PartChild,
    ],
  }))
}

function mutatePartAtPath(
  tree: ComponentTreeV2,
  path: PartPath,
  mutate: (part: PartNode) => PartNode,
): ComponentTreeV2 {
  // Parse the path manually since we don't import parsePartPath here.
  // sub:NAME/IDX/IDX/...
  if (!path.startsWith("sub:")) return tree
  const slashIdx = path.indexOf("/")
  if (slashIdx === -1) return tree
  const subName = path.slice("sub:".length, slashIdx)
  const indexStr = path.slice(slashIdx + 1)
  const indices: number[] =
    indexStr === "" ? [] : indexStr.split("/").map((s) => Number(s))
  if (indices.some((n) => !Number.isInteger(n) || n < 0)) return tree

  return {
    ...tree,
    subComponents: tree.subComponents.map((sub) => {
      if (sub.name !== subName) return sub
      return {
        ...sub,
        parts: {
          root:
            indices.length === 0
              ? mutate(sub.parts.root)
              : mutateInChildren(sub.parts.root, indices, mutate),
        },
      }
    }),
  }
}

function mutateInChildren(
  parent: PartNode,
  indices: number[],
  mutate: (part: PartNode) => PartNode,
): PartNode {
  if (indices.length === 0) return mutate(parent)
  const [head, ...rest] = indices
  return {
    ...parent,
    children: parent.children.map((child, i) => {
      if (i !== head) return child
      if (child.kind !== "part") return child
      return {
        kind: "part",
        part:
          rest.length === 0
            ? mutate(child.part)
            : mutateInChildren(child.part, rest, mutate),
      }
    }),
  }
}

/* ── AssemblyNode — recursive tree node ────────────────────────── */

interface AssemblyNodeProps {
  part: PartNode
  path: PartPath
  depth: number
  isRoot: boolean
  rootName?: string
  subComponents: SubComponentV2[]
  hiddenPaths: Set<PartPath>
  selectedPath?: PartPath | null
  onSelectPath?: (path: PartPath | null) => void
  onToggleHidden: (path: PartPath) => void
  onRemove: (path: PartPath) => void
  onMove: (dragPath: PartPath, targetPath: PartPath, position: DropPosition) => void
  onAddChild: (parentPath: PartPath, tag: string) => void
}

function AssemblyNode({
  part,
  path,
  depth,
  isRoot,
  rootName,
  subComponents,
  hiddenPaths,
  selectedPath,
  onSelectPath,
  onToggleHidden,
  onRemove,
  onMove,
  onAddChild,
}: AssemblyNodeProps) {
  const [expanded, setExpanded] = React.useState(true)
  const [dropPosition, setDropPosition] = React.useState<DropPosition | null>(
    null,
  )
  const rowRef = React.useRef<HTMLDivElement>(null)

  const isHidden = hiddenPaths.has(path)
  const hasChildren = part.children.length > 0
  const isSelected = selectedPath === path
  const isComponentRef = part.base.kind === "component-ref"

  // Display name — root shows the sub-component name, refs show the
  // referenced sub-component name, html bases show the tag.
  const displayName = isRoot
    ? rootName ?? "?"
    : part.base.kind === "html"
      ? part.base.tag
      : part.base.kind === "component-ref"
        ? part.base.name
        : part.base.kind === "radix"
          ? `${part.base.primitive}.${part.base.part}`
          : part.base.kind === "third-party"
            ? part.base.component
            : part.base.localName

  // Drag handlers
  const handleDragStart = (e: React.DragEvent) => {
    if (isRoot) {
      e.preventDefault()
      return
    }
    e.dataTransfer.setData("text/plain", path)
    e.dataTransfer.effectAllowed = "move"
    e.stopPropagation()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const rect = rowRef.current?.getBoundingClientRect()
    if (!rect) return
    const y = e.clientY - rect.top
    const third = rect.height / 3
    if (y < third) setDropPosition("before")
    else if (y > third * 2) setDropPosition("after")
    else setDropPosition("inside")
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation()
    setDropPosition(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const dragPath = e.dataTransfer.getData("text/plain") as PartPath
    if (dragPath && dragPath !== path && dropPosition) {
      onMove(dragPath, path, dropPosition)
    }
    setDropPosition(null)
  }

  // The "first text child" — for displaying inline text in the row label
  const firstTextChild = part.children.find(
    (c) => c.kind === "text",
  ) as Extract<PartChild, { kind: "text" }> | undefined
  const showAsTextRow = !!firstTextChild && !hasChildrenOfKindPart(part)

  return (
    <div>
      {/* Drop indicator: before */}
      {dropPosition === "before" && !isRoot && (
        <div
          className="h-0.5 rounded-full bg-blue-500"
          style={{ marginLeft: `${depth * 14 + 20}px` }}
        />
      )}

      {/* Node row */}
      <div
        ref={rowRef}
        draggable={!isRoot}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "group flex items-center gap-1 rounded-md py-0.5 pl-1",
          isSelected && "bg-blue-500/10",
          isHidden && "opacity-40",
          dropPosition === "inside" && "ring-1 ring-blue-500 bg-blue-500/5",
          !isRoot && "cursor-grab active:cursor-grabbing",
        )}
      >
        {/* Indentation spacer */}
        {depth > 0 && (
          <div className="shrink-0" style={{ width: `${depth * 14}px` }} />
        )}

        {/* Expand/collapse */}
        <button
          type="button"
          className={cn(
            "flex size-4 shrink-0 items-center justify-center rounded-sm",
            hasChildren
              ? "text-muted-foreground hover:text-foreground"
              : "invisible",
          )}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <ChevronDown className="size-3" />
          ) : (
            <ChevronRight className="size-3" />
          )}
        </button>

        {/* Tag name — clickable for all nodes */}
        <button
          type="button"
          className={cn(
            "min-w-0 flex-1 truncate text-left font-mono text-xs",
            isComponentRef
              ? "text-blue-500/80 hover:text-blue-500"
              : isSelected
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground/70",
          )}
          onClick={() => {
            if (onSelectPath) {
              // Toggle: click again to deselect
              onSelectPath(selectedPath === path ? null : path)
            }
          }}
        >
          {showAsTextRow && firstTextChild ? (
            <span className="font-sans text-foreground/50 italic">
              &quot;
              {firstTextChild.value.length > 20
                ? firstTextChild.value.slice(0, 20) + "…"
                : firstTextChild.value}
              &quot;
            </span>
          ) : (
            <>
              &lt;{displayName}
              {!hasChildren ? " /" : ""}&gt;
            </>
          )}
        </button>

        {/* Hover actions — sticky to panel right edge */}
        <div className="sticky right-0 ml-auto flex shrink-0 items-center gap-0.5 bg-gradient-to-l from-background from-70% to-transparent pl-4 pr-1 opacity-0 transition-opacity group-hover:opacity-100">
          {/* Add inside — Popover with Command picker */}
          <AddElementPicker
            subComponents={subComponents}
            onSelect={(tag) => {
              onAddChild(path, tag)
              setExpanded(true)
            }}
          />

          {/* Toggle visibility — not on root */}
          {!isRoot && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-5"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleHidden(path)
                  }}
                >
                  {isHidden ? (
                    <EyeOff className="size-3" />
                  ) : (
                    <Eye className="size-3" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {isHidden ? "Show" : "Hide"}
              </TooltipContent>
            </Tooltip>
          )}

          {/* Remove from demo — not on root */}
          {!isRoot && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-5"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove(path)
                  }}
                >
                  <Trash2 className="size-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                Remove
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Children — only render PartChild of kind "part"; text/expression
          children are inlined into the parent's row label above */}
      {expanded && hasChildren &&
        part.children.map((child, i) => {
          if (child.kind !== "part") return null
          const childPath = appendIndexToPath(path, i)
          return (
            <AssemblyNode
              key={childPath}
              part={child.part}
              path={childPath}
              depth={depth + 1}
              isRoot={false}
              subComponents={subComponents}
              hiddenPaths={hiddenPaths}
              selectedPath={selectedPath}
              onSelectPath={onSelectPath}
              onToggleHidden={onToggleHidden}
              onRemove={onRemove}
              onMove={onMove}
              onAddChild={onAddChild}
            />
          )
        })}

      {/* Drop indicator: after */}
      {dropPosition === "after" && !isRoot && (
        <div
          className="h-0.5 rounded-full bg-blue-500"
          style={{ marginLeft: `${depth * 14 + 20}px` }}
        />
      )}
    </div>
  )
}

function hasChildrenOfKindPart(part: PartNode): boolean {
  return part.children.some((c) => c.kind === "part")
}

function appendIndexToPath(path: PartPath, index: number): PartPath {
  if (path.endsWith("/")) {
    return `${path}${index}`
  }
  return `${path}/${index}`
}

/* ── AddElementPicker — Command-based popover for adding elements ── */

const DOM_ELEMENTS = [
  { tag: "#text", label: "Plain text", description: "Raw text content", icon: TextCursorInput },
  { tag: "div", label: "div", description: "Container", icon: Box },
  { tag: "p", label: "p", description: "Paragraph", icon: Type },
  { tag: "span", label: "span", description: "Inline text", icon: Type },
  { tag: "h1", label: "h1", description: "Heading 1", icon: Heading },
  { tag: "h2", label: "h2", description: "Heading 2", icon: Heading },
  { tag: "h3", label: "h3", description: "Heading 3", icon: Heading },
  { tag: "h4", label: "h4", description: "Heading 4", icon: Heading },
  { tag: "button", label: "button", description: "Button", icon: MousePointer },
  { tag: "a", label: "a", description: "Link", icon: MousePointer },
  { tag: "img", label: "img", description: "Image", icon: Image },
  { tag: "input", label: "input", description: "Input field", icon: FormInput },
  { tag: "textarea", label: "textarea", description: "Text area", icon: FormInput },
  { tag: "ul", label: "ul", description: "Unordered list", icon: List },
  { tag: "ol", label: "ol", description: "Ordered list", icon: List },
  { tag: "li", label: "li", description: "List item", icon: Minus },
  { tag: "section", label: "section", description: "Section", icon: Box },
  { tag: "article", label: "article", description: "Article", icon: Box },
  { tag: "header", label: "header", description: "Header", icon: Box },
  { tag: "footer", label: "footer", description: "Footer", icon: Box },
  { tag: "nav", label: "nav", description: "Navigation", icon: Box },
  { tag: "form", label: "form", description: "Form", icon: FormInput },
] as const

const SHADCN_ELEMENTS = [
  { tag: "Button", label: "Button", description: "shadcn Button" },
  { tag: "Badge", label: "Badge", description: "shadcn Badge" },
  { tag: "Input", label: "Input", description: "shadcn Input" },
  { tag: "Label", label: "Label", description: "shadcn Label" },
  { tag: "Separator", label: "Separator", description: "shadcn Separator" },
  { tag: "Avatar", label: "Avatar", description: "shadcn Avatar" },
  { tag: "Checkbox", label: "Checkbox", description: "shadcn Checkbox" },
  { tag: "Switch", label: "Switch", description: "shadcn Switch" },
  { tag: "Slider", label: "Slider", description: "shadcn Slider" },
  { tag: "Progress", label: "Progress", description: "shadcn Progress" },
  { tag: "Skeleton", label: "Skeleton", description: "shadcn Skeleton" },
] as const

function AddElementPicker({
  subComponents,
  onSelect,
}: {
  subComponents: SubComponentV2[]
  onSelect: (tag: string) => void
}) {
  const [open, setOpen] = React.useState(false)

  function handleSelect(tag: string) {
    onSelect(tag)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-5"
          title="Add inside"
          onClick={(e) => e.stopPropagation()}
        >
          <Plus className="size-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end" side="right" sideOffset={4}>
        <Command className="[&_[cmdk-list]]:max-h-[240px]">
          <CommandInput placeholder="Search elements..." className="h-8 text-xs" />
          <CommandList>
            <CommandEmpty className="py-3 text-center text-xs">
              No matches.
            </CommandEmpty>

            {/* Sub-components — skip the root sub-component (index 0) since
                it's the canvas root and can't be inserted as a child of itself */}
            {subComponents.length > 1 && (
              <CommandGroup heading="Your sub-components">
                {subComponents.slice(1).map((sc) => (
                  <CommandItem
                    key={sc.name}
                    value={sc.name}
                    onSelect={() => handleSelect(sc.name)}
                    className="gap-2 text-xs"
                  >
                    <Component className="size-3.5 text-blue-500" />
                    <span className="font-medium">{sc.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* DOM elements */}
            <CommandGroup heading="HTML elements">
              {DOM_ELEMENTS.map((el) => (
                <CommandItem
                  key={el.tag}
                  value={`${el.tag} ${el.description}`}
                  onSelect={() => handleSelect(el.tag)}
                  className="gap-2 text-xs"
                >
                  <el.icon className="size-3.5 text-muted-foreground" />
                  {el.tag === "#text" ? (
                    <span className="font-medium">{el.label}</span>
                  ) : (
                    <code className="font-mono text-xs">
                      &lt;{el.label}&gt;
                    </code>
                  )}
                  <span className="text-muted-foreground">
                    {el.description}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>

            {/* shadcn components (preview only) */}
            <CommandGroup heading="shadcn (preview only)">
              {SHADCN_ELEMENTS.map((el) => (
                <CommandItem
                  key={el.tag}
                  value={`${el.tag} ${el.description}`}
                  onSelect={() => handleSelect(el.tag)}
                  className="gap-2 text-xs"
                >
                  <Code2 className="size-3.5 text-purple-500" />
                  <span className="font-medium">{el.label}</span>
                  <span className="text-muted-foreground">
                    {el.description}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
