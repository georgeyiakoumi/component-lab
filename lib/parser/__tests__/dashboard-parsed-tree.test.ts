/**
 * Integration test for the unified dashboard's edit path against parsed
 * shadcn registry components.
 *
 * The dashboard mutates trees via `setPartClasses` /
 * `setDataAttrSlotClasses` and direct `cvaExports[].variants` writes.
 * The slow-path generator detects edits via byte comparison against the
 * source ranges captured at parse time, then splices the new value back
 * into `originalSource`.
 *
 * This test proves the dashboard's edit helpers preserve the source
 * ranges (`baseRange`, `variantRanges`) correctly so the slow-path
 * splice still works on parsed trees. Without this coverage, a
 * refactor that drops `baseRange` from `setPartClasses` could silently
 * break parsed-tree editing without failing any existing test.
 *
 * Pairs with `edit-flow.test.ts`, which uses the older
 * `applyClassEditToTree` API (still used by some integration paths but
 * deprecated in favour of `setPartClasses` from the dashboard's
 * perspective).
 */

import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

import { parseSource } from "@/lib/parser/parse-source-v2"
import { generateFromTreeV2 } from "@/lib/parser/generate-from-tree-v2"
import {
  findSubByPath,
  makePartPath,
  setPartClasses,
} from "@/lib/parser/v2-tree-path"

const REPO_ROOT = path.resolve(__dirname, "..", "..", "..")

function load(relPath: string): string {
  return readFileSync(path.join(REPO_ROOT, relPath), "utf-8")
}

describe("dashboard edit path on parsed trees — Card (cn-call)", () => {
  const original = load("components/ui/card.tsx")

  it("setPartClasses on the Card root rewrites the cn() base in the spliced output", () => {
    const tree = parseSource(original, "components/ui/card.tsx")
    const cardPath = makePartPath("Card", [])
    const next = setPartClasses(tree, cardPath, [
      "flex",
      "flex-col",
      "REPLACED",
    ])
    const emitted = generateFromTreeV2(next)

    // The new class string is in the output
    expect(emitted).toContain('"flex flex-col REPLACED"')
    // The CardHeader classes are untouched (a different sub-component)
    expect(emitted).toContain("@container/card-header")
    // No double Card class strings
    const matches = emitted.match(/cn\(\s*"flex flex-col REPLACED"/g)
    expect(matches?.length).toBe(1)
  })

  it("setPartClasses preserves baseRange so the splice generator can find the edit", () => {
    const tree = parseSource(original, "components/ui/card.tsx")
    const cardPath = makePartPath("Card", [])
    const next = setPartClasses(tree, cardPath, ["NEW_BASE"])
    const sub = findSubByPath(next, cardPath)!
    const className = sub.parts.root.className
    expect(className.kind).toBe("cn-call")
    if (className.kind === "cn-call") {
      // baseRange must still be present so the slow-path splicer knows
      // where to drop the new value into originalSource
      expect(className.baseRange).toBeDefined()
      expect(className.baseRange!.start).toBeGreaterThanOrEqual(0)
      expect(className.baseRange!.end).toBeGreaterThan(
        className.baseRange!.start,
      )
    }
  })

  it("editing CardHeader does not affect Card or other sub-components", () => {
    const tree = parseSource(original, "components/ui/card.tsx")
    const headerPath = makePartPath("CardHeader", [])
    const next = setPartClasses(tree, headerPath, ["HEADER_REPLACED"])
    const emitted = generateFromTreeV2(next)

    expect(emitted).toContain('"HEADER_REPLACED"')
    // Card root's classes are still intact
    expect(emitted).toMatch(/data-slot="card"\s*\n\s*className=\{cn\(\s*"flex flex-col/)
  })

  it("clearing all classes on Card emits an empty string in the cn() base", () => {
    const tree = parseSource(original, "components/ui/card.tsx")
    const cardPath = makePartPath("Card", [])
    const next = setPartClasses(tree, cardPath, [])
    const emitted = generateFromTreeV2(next)
    expect(emitted).toContain('cn(\n        "",')
  })

  it("a no-op edit (read then write the same classes) round-trips byte-equivalently", () => {
    const tree = parseSource(original, "components/ui/card.tsx")
    // Find the existing Card classes verbatim, then write them back.
    const sub = findSubByPath(tree, makePartPath("Card", []))!
    const className = sub.parts.root.className
    if (className.kind !== "cn-call") throw new Error("expected cn-call")
    const first = className.args[0]
    if (typeof first !== "string") throw new Error("expected string arg")
    // Strip surrounding quotes and split
    const existing = first.slice(1, -1).split(/\s+/).filter(Boolean)
    const next = setPartClasses(tree, makePartPath("Card", []), existing)
    const emitted = generateFromTreeV2(next)
    expect(emitted).toBe(original)
  })
})

describe("dashboard edit path on parsed trees — Button (cva)", () => {
  const original = load("components/ui/button.tsx")

  it("Button root is a cva-call, not cn-call — setPartClasses can't edit it directly", () => {
    // Button's className is `cn(buttonVariants(...))`, which is parsed
    // as kind: "cva-call" (or kind: "cn-call" wrapping a cva-call). The
    // dashboard's variant slot routing handles this case via the
    // `cvaExports[].variants[group][value]` direct mutation in
    // handlePartClassChange — NOT via setPartClasses on the cn() base.
    //
    // This test documents the architectural assumption: dashboard edits
    // for cva-strategy roots flow through the cva slot path, not the
    // base-className path.
    const tree = parseSource(original, "components/ui/button.tsx")
    const sub = findSubByPath(tree, makePartPath("Button", []))!
    expect(sub.variantStrategy.kind).toBe("cva")
  })

  it("editing buttonVariants.size.sm directly survives the slow-path splice", () => {
    const tree = parseSource(original, "components/ui/button.tsx")
    // Mutate the cva slot directly — this is the path the dashboard uses
    // for cva-strategy variants.
    const cva = tree.cvaExports.find((c) => c.name === "buttonVariants")!
    cva.variants.size.sm = "h-7 px-2 NEW_SM_CLASS"
    const emitted = generateFromTreeV2(tree)
    expect(emitted).toContain('sm: "h-7 px-2 NEW_SM_CLASS"')
    // Other slots are untouched
    expect(emitted).toContain("default: \"h-9 px-4 py-2")
    expect(emitted).toContain("destructive:")
  })

  it("editing buttonVariants base classes survives the slow-path splice", () => {
    const tree = parseSource(original, "components/ui/button.tsx")
    const cva = tree.cvaExports.find((c) => c.name === "buttonVariants")!
    cva.baseClasses =
      "inline-flex shrink-0 items-center justify-center NEW_BASE"
    const emitted = generateFromTreeV2(tree)
    expect(emitted).toContain(
      "inline-flex shrink-0 items-center justify-center NEW_BASE",
    )
  })
})
