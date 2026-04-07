/**
 * Apply a class-list edit to a parsed `ComponentTreeV2` so the slow-path
 * generator can splice the new value into the original source on export.
 *
 * Pillar 5b (GEO-302) — bridge for the cn-call literal edit case.
 * Pillar 5c (GEO-303) — extends to cva-call components via an optional
 * slot target. The slot describes which cva slot the edit lands in:
 * the cva's base classes, or one of its variant-group values.
 *
 * Pillar 1 / Lesson #16 — every edit, regardless of slot, eventually
 * lands as a single `splice` in the original source. The generator never
 * regenerates surrounding bytes.
 */

import type {
  ComponentTreeV2,
  CvaExport,
} from "@/lib/component-tree-v2"
import { findPartByDataSlot } from "@/lib/parser/find-by-data-slot"

/**
 * The slot a class edit lands in. Used for cva-style components where
 * the editable surface isn't a single literal — it's the cva's base
 * classes or one of its variant-group values.
 *
 * For cn-call components (Pillar 5b path) the slot is implicit ("the
 * single literal in the cn() call") and callers can omit it.
 */
export type CvaEditSlot =
  | { kind: "base" }
  | { kind: "variant"; group: string; value: string }

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
        | "cva-not-found"
        | "cva-slot-not-found"
        | "cva-needs-slot"
        | "no-base-range"
        | "unsupported-className"
    }

/**
 * Mutate the part identified by `dataSlot` so its root className reflects
 * the new class list. Returns `{ ok: true }` on success or a structured
 * failure describing why the edit could not be applied.
 *
 * For cn-call (Pillar 5b) parts, omit `slot`. For cva-call (Pillar 5c)
 * parts, pass `slot` describing which cva slot to write to. Calling on
 * a cva-call without a slot returns `cva-needs-slot` so the UI can prompt.
 *
 * The mutation is in-place: the caller's `tree` reference is updated and
 * a subsequent `generateFromTreeV2(tree)` will produce spliced output.
 */
export function applyClassEditToTree(
  tree: ComponentTreeV2,
  dataSlot: string,
  newClasses: string[],
  slot?: CvaEditSlot,
): ApplyClassEditResult {
  const found = findPartByDataSlot(tree, dataSlot)
  if (!found) return { ok: false, reason: "not-found" }

  const className = found.part.className
  const newClassString = newClasses.join(" ")

  if (className.kind === "literal") {
    if (!className.range) {
      return { ok: false, reason: "no-base-range" }
    }
    className.value = newClassString
    return { ok: true }
  }

  if (className.kind === "cn-call") {
    if (!className.baseRange) {
      return { ok: false, reason: "no-base-range" }
    }
    className.args[0] = JSON.stringify(newClassString)
    return { ok: true }
  }

  if (className.kind === "cva-call") {
    if (!slot) return { ok: false, reason: "cva-needs-slot" }
    const cva = tree.cvaExports.find((c) => c.name === className.cvaRef)
    if (!cva) return { ok: false, reason: "cva-not-found" }
    return applyCvaSlotEdit(cva, slot, newClassString)
  }

  return { ok: false, reason: "unsupported-className" }
}

/**
 * Apply an edit to a single cva slot. The slow-path generator detects
 * the divergence between the mutated `baseClasses` / `variants[group][value]`
 * string and the corresponding `range` and emits a splice.
 */
function applyCvaSlotEdit(
  cva: CvaExport,
  slot: CvaEditSlot,
  newValue: string,
): ApplyClassEditResult {
  if (slot.kind === "base") {
    if (!cva.baseClassesRange) {
      return { ok: false, reason: "no-base-range" }
    }
    cva.baseClasses = newValue
    return { ok: true }
  }
  // slot.kind === "variant"
  const groupMap = cva.variants[slot.group]
  if (!groupMap || !(slot.value in groupMap)) {
    return { ok: false, reason: "cva-slot-not-found" }
  }
  if (
    !cva.variantRanges ||
    !cva.variantRanges[slot.group] ||
    !cva.variantRanges[slot.group][slot.value]
  ) {
    return { ok: false, reason: "no-base-range" }
  }
  groupMap[slot.value] = newValue
  return { ok: true }
}

/**
 * Resolve the current class string for a part, used by the visual editor
 * to populate its "currentClasses" view of the selected element. For
 * cva-call components a slot must be supplied to disambiguate which
 * slot's classes to read.
 *
 * Returns null when the className kind isn't readable as a flat list.
 */
export function readBaseClassesForDataSlot(
  tree: ComponentTreeV2,
  dataSlot: string,
  slot?: CvaEditSlot,
): string | null {
  const found = findPartByDataSlot(tree, dataSlot)
  if (!found) return null
  const className = found.part.className

  if (className.kind === "literal") return className.value

  if (className.kind === "cn-call" && className.baseRange) {
    const firstArg = className.args[0]
    if (firstArg === undefined) return null
    if (
      firstArg.length >= 2 &&
      (firstArg[0] === '"' || firstArg[0] === "'" || firstArg[0] === "`") &&
      firstArg[firstArg.length - 1] === firstArg[0]
    ) {
      return firstArg.slice(1, -1)
    }
    return null
  }

  if (className.kind === "cva-call") {
    const cva = tree.cvaExports.find((c) => c.name === className.cvaRef)
    if (!cva) return null
    if (!slot || slot.kind === "base") return cva.baseClasses
    return cva.variants[slot.group]?.[slot.value] ?? null
  }

  return null
}

/**
 * List the editable cva slots for a part. Returns null when the part isn't
 * a cva-call (or the cva export couldn't be resolved). The slot picker UI
 * uses this to render its options: a "Base classes" entry plus every
 * variant-group's values in source order.
 */
export interface CvaSlotInfo {
  cvaName: string
  baseAvailable: boolean
  groups: Array<{
    name: string
    values: string[]
  }>
}

export function getCvaSlotsForDataSlot(
  tree: ComponentTreeV2,
  dataSlot: string,
): CvaSlotInfo | null {
  const found = findPartByDataSlot(tree, dataSlot)
  if (!found) return null
  const className = found.part.className
  if (className.kind !== "cva-call") return null
  const cva = tree.cvaExports.find((c) => c.name === className.cvaRef)
  if (!cva) return null

  const groups = Object.keys(cva.variants).map((groupName) => ({
    name: groupName,
    values: Object.keys(cva.variants[groupName]),
  }))

  return {
    cvaName: cva.name,
    baseAvailable: cva.baseClassesRange !== undefined,
    groups,
  }
}
