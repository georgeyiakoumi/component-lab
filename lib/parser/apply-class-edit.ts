/**
 * Apply a class-list edit to a parsed `ComponentTreeV2` so the slow-path
 * generator can splice the new value into the original source on export.
 *
 * Pillar 5b (GEO-302) — the bridge between the visual editor's class-string
 * output and the parser's structured tree.
 *
 * Scope: Pillar 5b only handles parts whose root className is a `cn-call`
 * with a `baseRange` (i.e. the cn("base classes literal", className) shape
 * shadcn uses for ~80% of its components). cva-call roots return a
 * structured failure with a clear reason so the UI can show the
 * "cva editing coming in 5c" banner.
 */

import type { ComponentTreeV2 } from "@/lib/component-tree-v2"
import { findPartByDataSlot } from "@/lib/parser/find-by-data-slot"

/**
 * Result of an attempted edit. Discriminated by `ok` for ergonomic
 * branching at the call site.
 */
export type ApplyClassEditResult =
  | { ok: true }
  | {
      ok: false
      reason:
        | "not-found"
        | "cva-only"
        | "unsupported-className"
        | "no-base-range"
    }

/**
 * Mutate the part identified by `dataSlot` so its root className reflects
 * the new class list. Returns `{ ok: true }` on success or a structured
 * failure describing why the edit could not be applied.
 *
 * The mutation is in-place: the caller's `tree` reference is updated and
 * a subsequent `generateFromTreeV2(tree)` will produce spliced output.
 *
 * Failure reasons:
 *
 * - `not-found`: no sub-component has a root part with the given data-slot
 * - `cva-only`: the className is a `cva-call`, which Pillar 5c will handle
 * - `no-base-range`: the className is a `cn-call` but the parser couldn't
 *   identify a string-literal first argument (e.g. `cn(buttonVariants(...))`)
 * - `unsupported-className`: the className kind is `passthrough` or some
 *   other shape we don't yet edit
 */
export function applyClassEditToTree(
  tree: ComponentTreeV2,
  dataSlot: string,
  newClasses: string[],
): ApplyClassEditResult {
  const found = findPartByDataSlot(tree, dataSlot)
  if (!found) return { ok: false, reason: "not-found" }

  const className = found.part.className
  const newClassString = newClasses.join(" ")

  if (className.kind === "literal") {
    // Mutate the literal value. The slow-path generator will splice the new
    // value into `range` (set by the parser at parse time).
    if (!className.range) {
      return { ok: false, reason: "no-base-range" }
    }
    className.value = newClassString
    return { ok: true }
  }

  if (className.kind === "cn-call") {
    if (!className.baseRange) {
      // The cn() first argument isn't a string literal — could be a cva
      // call wrapped in cn(), or some other expression. Editing it via
      // the visual class editor isn't supported in 5b.
      return { ok: false, reason: "no-base-range" }
    }
    // Replace the first cn() argument's source with a quoted string
    // literal carrying the new classes. The slow path's `collectClassNameSplices`
    // will read this back, strip the quotes, compare to the inner range,
    // and emit a splice.
    className.args[0] = JSON.stringify(newClassString)
    return { ok: true }
  }

  if (className.kind === "cva-call") {
    return { ok: false, reason: "cva-only" }
  }

  // passthrough or any future kind
  return { ok: false, reason: "unsupported-className" }
}

/**
 * Resolve the current class string for a part, used by the visual editor
 * to populate its "currentClasses" view of the selected element. For
 * literals returns the value directly; for cn-call returns the inner
 * string of the first argument (when it's a literal). Returns null when
 * the className kind isn't readable as a flat list.
 */
export function readBaseClassesForDataSlot(
  tree: ComponentTreeV2,
  dataSlot: string,
): string | null {
  const found = findPartByDataSlot(tree, dataSlot)
  if (!found) return null
  const className = found.part.className
  if (className.kind === "literal") return className.value
  if (className.kind === "cn-call" && className.baseRange) {
    const firstArg = className.args[0]
    if (firstArg === undefined) return null
    // Strip surrounding quotes (matches slow-path's stripStringQuotes).
    if (
      firstArg.length >= 2 &&
      (firstArg[0] === '"' || firstArg[0] === "'" || firstArg[0] === "`") &&
      firstArg[firstArg.length - 1] === firstArg[0]
    ) {
      return firstArg.slice(1, -1)
    }
    return null
  }
  return null
}
