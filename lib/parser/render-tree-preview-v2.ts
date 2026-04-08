/**
 * Canvas renderer for ComponentTreeV2 — produces live React JSX for the
 * from-scratch builder's preview canvas.
 *
 * This is the v2 equivalent of `renderTreePreview` and `renderSubComponentPreview`
 * which lived inline in `app/playground/custom/[slug]/page.tsx` and walked
 * v1's `assemblyTree` (an `ElementNode` recursive shape with `id`/`tag`/
 * `children`/`classes`/`text`).
 *
 * v2's PartNode is structurally different: it has a discriminated `base`
 * (HTML / radix / third-party / component-ref / dynamic-ref), explicit
 * className shapes, and no `id` field. Identifiers are computed via the
 * path-based addressing layer in `lib/parser/v2-tree-path.ts`.
 *
 * The renderer takes a `RenderContext` with all the page-level state it
 * needs (selection, hidden parts, variant prop values, helpers). It does
 * not import from React state directly — it's a pure function with
 * dependency injection so it can be unit-tested.
 *
 * GEO-305 Step 4b.
 */

import * as React from "react"

import type {
  Base,
  ClassNameExpr,
  ComponentTreeV2,
  PartChild,
  PartNode,
} from "@/lib/component-tree-v2"
import {
  buildSubComponentMap,
  getPartClasses,
  makePartPath,
  type PartPath,
} from "@/lib/parser/v2-tree-path"
import { resolveColorStyles } from "@/lib/resolve-color-styles"
import { shadcnPreviewMap, shadcnComponentMap } from "@/lib/shadcn-preview-map"

/* ── Render context ─────────────────────────────────────────────── */

/**
 * Everything the renderer needs from the page. Pass-through dependency
 * injection — no module-level state, no implicit access to React context.
 */
export interface RenderContextV2 {
  /** The full tree being rendered. */
  tree: ComponentTreeV2

  /** Currently selected part path, or "main" for the root, or null. */
  selectedPath: PartPath | null

  /** Set of paths the user has hidden via the AssemblyPanel. */
  hiddenPaths: Set<PartPath>

  /**
   * Resolves data-attribute variant classes to active classes based on the
   * current variant prop values. Identical to v1's `resolveVariantClasses`
   * helper — passed in to avoid duplicating the logic.
   */
  resolveVariantClasses: (classes: string[]) => string[]

  /** Variant prop values for the data-* attributes on the root element. */
  variantDataAttrs: Record<string, string>
}

/* ── Public entry point ─────────────────────────────────────────── */

/**
 * Render the canvas preview for a `ComponentTreeV2`. The first sub-component
 * is the visible root; nested sub-components are pulled in via component-ref
 * bases.
 *
 * Returns null if the tree has no sub-components.
 */
export function renderTreePreviewV2(ctx: RenderContextV2): React.ReactNode {
  const { tree } = ctx
  if (tree.subComponents.length === 0) return null

  const root = tree.subComponents[0]
  const rootPath = makePartPath(root.name, [])
  return renderPart(root.parts.root, rootPath, ctx, ctx.variantDataAttrs)
}

/* ── Recursive part renderer ────────────────────────────────────── */

function renderPart(
  part: PartNode,
  path: PartPath,
  ctx: RenderContextV2,
  extraProps?: Record<string, string>,
): React.ReactNode {
  if (ctx.hiddenPaths.has(path)) return null

  // component-ref → recurse into the referenced sub-component
  if (part.base.kind === "component-ref") {
    const subMap = buildSubComponentMap(ctx.tree)
    const sub = subMap.get(part.base.name)
    if (sub) {
      const subRootPath = makePartPath(sub.name, [])
      return renderPart(sub.parts.root, subRootPath, ctx, undefined)
    }
    // Unknown component-ref — render a placeholder so the user can see it
    return renderPlaceholder(part.base.name, path)
  }

  // Bases the from-scratch builder doesn't produce yet — render placeholders
  if (part.base.kind === "radix" || part.base.kind === "dynamic-ref") {
    const label =
      part.base.kind === "radix"
        ? `${part.base.primitive}.${part.base.part}`
        : part.base.localName
    return renderPlaceholder(label, path)
  }

  // third-party — render as a styled label too
  if (part.base.kind === "third-party") {
    return renderPlaceholder(part.base.component, path)
  }

  // html base — render as the actual HTML tag with classes/styles
  return renderHtmlPart(part, path, ctx, extraProps)
}

function renderHtmlPart(
  part: PartNode,
  path: PartPath,
  ctx: RenderContextV2,
  extraProps?: Record<string, string>,
): React.ReactNode {
  if (part.base.kind !== "html") return null

  const isSelected = ctx.selectedPath === path
  const rawClasses = getPartClasses(part)
  const resolved = ctx.resolveVariantClasses(rawClasses)
  const { remainingClasses, style: colorStyle } = resolveColorStyles(resolved)
  const allClasses = [
    ...remainingClasses,
    isSelected ? "ring-2 ring-blue-500 ring-offset-1" : "",
  ].filter(Boolean)
  const className = allClasses.length > 0 ? allClasses.join(" ") : undefined
  const inlineStyle =
    Object.keys(colorStyle).length > 0 ? colorStyle : undefined

  // PascalCase HTML tag check — the v1 renderer used `/^[A-Z]/.test(tag)`
  // to detect shadcn previews. v2 doesn't put PascalCase names in `html`
  // bases (those would be `component-ref` or `radix`), but if a stray
  // PascalCase HTML tag shows up we render it via the shadcnPreviewMap
  // for backwards compatibility with the from-scratch UI's element picker.
  const tag = part.base.tag
  const isPascalCase = /^[A-Z]/.test(tag)
  if (isPascalCase && shadcnPreviewMap[tag]) {
    return React.createElement(
      "div",
      {
        key: path,
        "data-node-id": path,
        className: isSelected
          ? "ring-2 ring-blue-500 ring-offset-1 rounded"
          : undefined,
      },
      shadcnPreviewMap[tag](),
    )
  }

  const children: React.ReactNode[] = []
  for (let i = 0; i < part.children.length; i++) {
    const child = part.children[i]
    const childRendered = renderChild(child, path, i, ctx)
    if (childRendered !== null) {
      children.push(childRendered)
    }
  }

  // Empty placeholder if no children rendered
  if (children.length === 0) {
    children.push(
      React.createElement(
        "span",
        {
          key: "__empty__",
          className: "text-xs text-muted-foreground/40 select-none",
        },
        `<${tag}>`,
      ),
    )
  }

  return React.createElement(
    tag as keyof React.JSX.IntrinsicElements,
    {
      key: path,
      className,
      style: inlineStyle,
      "data-node-id": path,
      ...extraProps,
    },
    ...children,
  )
}

function renderChild(
  child: PartChild,
  parentPath: PartPath,
  childIndex: number,
  ctx: RenderContextV2,
): React.ReactNode {
  if (child.kind === "part") {
    // Compute the child's path by appending the index. We need to parse the
    // parent path and re-encode it with the new trailing index.
    const childPath = appendIndexToPath(parentPath, childIndex)
    return renderPart(child.part, childPath, ctx, undefined)
  }
  if (child.kind === "text") {
    return child.value
  }
  if (child.kind === "expression") {
    // Expressions like `{children}` get a styled placeholder so the user
    // sees something tangible in the canvas
    return React.createElement(
      "span",
      {
        key: `expr-${childIndex}`,
        className: "text-xs text-muted-foreground/60 select-none italic",
      },
      child.source,
    )
  }
  // jsx-comment and passthrough don't render in the preview
  return null
}

/* ── Helpers ────────────────────────────────────────────────────── */

function renderPlaceholder(label: string, path: PartPath): React.ReactNode {
  return React.createElement(
    "span",
    {
      key: path,
      "data-node-id": path,
      className:
        "rounded bg-purple-500/10 px-2 py-1 text-xs font-medium text-purple-500",
    },
    label,
  )
}

/**
 * Append a child index to an existing path. The path's trailing slash is
 * preserved correctly: `sub:MyCard/` + 0 → `sub:MyCard/0`,
 * `sub:MyCard/0` + 2 → `sub:MyCard/0/2`.
 */
function appendIndexToPath(path: PartPath, index: number): PartPath {
  if (path.endsWith("/")) {
    return `${path}${index}`
  }
  return `${path}/${index}`
}
