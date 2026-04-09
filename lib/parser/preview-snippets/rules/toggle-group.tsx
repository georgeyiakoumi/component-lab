/**
 * ToggleGroup composition rule.
 *
 * Source: https://ui.shadcn.com/docs/components/toggle-group
 * Fetched: 2026-04-09
 *
 * Docs canonical example:
 *
 *     <ToggleGroup type="single">
 *       <ToggleGroupItem value="bold" aria-label="Toggle bold">
 *         <Bold className="h-4 w-4" />
 *       </ToggleGroupItem>
 *       <ToggleGroupItem value="italic" aria-label="Toggle italic">
 *         <Italic className="h-4 w-4" />
 *       </ToggleGroupItem>
 *       <ToggleGroupItem value="underline" aria-label="Toggle underline">
 *         <Underline className="h-4 w-4" />
 *       </ToggleGroupItem>
 *     </ToggleGroup>
 *
 * ## Implementation notes
 *
 * The flat renderer's failure mode for ToggleGroup was twofold:
 *
 * 1. ToggleGroup's body holds `<ToggleGroupContext.Provider>{children}
 *    </Provider>`, which the parser captures as a `dynamic-ref`
 *    sub-component. Round 3 of the renderer fixes (commit 63b653e)
 *    made the renderer treat any `.Provider` dynamic-ref as a
 *    transparent Fragment, so the children pass through.
 * 2. Even with the Provider transparency fix, ToggleGroupItem rendered
 *    empty + tiny because the source has no sample content. This rule
 *    fixes that by rendering 3 sample items with Bold / Italic /
 *    Underline icons (the canonical docs example).
 *
 * ToggleGroupItem uses `cn(toggleVariants({...}), ...)` for its
 * className. Same parser limitation as PaginationLink + NavigationMenu —
 * the parser stores the cva-call expression as a literal text token,
 * so `classesFor("ToggleGroupItem")` returns garbage. Workaround:
 * import `toggleVariants` directly from `components/ui/toggle` and
 * apply it explicitly. The cva variant choice mirrors the source's
 * `defaultVariants` (variant: "default", size: "default").
 *
 * Also adds `data-spacing="0"` on each item so the source's
 * `data-[spacing=0]:rounded-none data-[spacing=0]:first:rounded-l-md
 * data-[spacing=0]:last:rounded-r-md` selectors activate, giving the
 * grouped-button look from the docs (joined edges, rounded outsides).
 */

"use client"

import * as React from "react"
import { Bold, Italic, Underline } from "lucide-react"

import { toggleVariants } from "@/components/ui/toggle"
import { cn } from "@/lib/utils"
import {
  classesFor,
  pathFor,
  withSelectionRing,
  type CompositionRule,
  type SnippetContext,
} from "../index"

const itemBaseCls = toggleVariants({ variant: "default", size: "default" })

function ToggleGroupRender(ctx: SnippetContext): React.ReactNode {
  const groupCls = classesFor(ctx, "ToggleGroup")
  const itemCls = classesFor(ctx, "ToggleGroupItem")

  const groupPath = pathFor(ctx, "ToggleGroup")
  const itemPath = pathFor(ctx, "ToggleGroupItem")

  // Each item uses the toggleVariants base + the source's grouped-
  // button extras + whatever the parser captured for ToggleGroupItem
  // (typically the literal-text leak, but classesFor strips known
  // noise tokens).
  const fullItemCls = cn(
    itemBaseCls,
    "w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10",
    "data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:first:rounded-l-md data-[spacing=0]:last:rounded-r-md",
    itemCls,
  )

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div
        role="group"
        data-variant="default"
        data-size="default"
        data-spacing="0"
        data-node-id={groupPath}
        className={withSelectionRing(
          groupCls,
          ctx.selectedPath === groupPath,
        )}
      >
        <button
          type="button"
          aria-label="Toggle bold"
          data-state="off"
          data-variant="default"
          data-size="default"
          data-spacing="0"
          data-node-id={itemPath}
          className={withSelectionRing(
            fullItemCls,
            ctx.selectedPath === itemPath,
          )}
        >
          <Bold />
        </button>
        <button
          type="button"
          aria-label="Toggle italic"
          data-state="on"
          data-variant="default"
          data-size="default"
          data-spacing="0"
          className={fullItemCls}
        >
          <Italic />
        </button>
        <button
          type="button"
          aria-label="Toggle underline"
          data-state="off"
          data-variant="default"
          data-size="default"
          data-spacing="0"
          className={fullItemCls}
        >
          <Underline />
        </button>
      </div>
    </div>
  )
}

export const toggleGroupRule: CompositionRule = {
  slug: "toggle-group",
  source:
    "https://ui.shadcn.com/docs/components/toggle-group (fetched 2026-04-09)",
  composition: {
    name: "ToggleGroup",
    children: [{ name: "ToggleGroupItem" }],
  },
  render: ToggleGroupRender,
}
