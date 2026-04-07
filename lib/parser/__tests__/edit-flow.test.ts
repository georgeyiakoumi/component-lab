/**
 * Pillar 5b — unit tests for the data-slot lookup + class-edit + export
 * round-trip helpers.
 *
 * These tests don't touch the UI. They prove the lib-level edit pipeline
 * works end-to-end against real shadcn source files:
 *
 *   parse(source)
 *     → applyClassEditToTree(tree, "card", newClasses)
 *     → generateFromTreeV2(tree)
 *     → assert spliced output is correct
 *
 * Once the unit assertions are green, the Playwright test (e2e/edit-export)
 * exercises the same pipeline through the actual visual editor.
 */

import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

import { parseSource } from "@/lib/parser/parse-source-v2"
import { generateFromTreeV2 } from "@/lib/parser/generate-from-tree-v2"
import {
  findPartByDataSlot,
  type FoundPart,
} from "@/lib/parser/find-by-data-slot"
import {
  applyClassEditToTree,
  readBaseClassesForDataSlot,
} from "@/lib/parser/apply-class-edit"

const REPO_ROOT = path.resolve(__dirname, "..", "..", "..")

function load(relPath: string): string {
  return readFileSync(path.join(REPO_ROOT, relPath), "utf-8")
}

/* ── findPartByDataSlot ────────────────────────────────────────────── */

describe("findPartByDataSlot", () => {
  const tree = parseSource(
    load("components/ui/card.tsx"),
    "components/ui/card.tsx",
  )

  it("finds the Card root by data-slot 'card'", () => {
    const found = findPartByDataSlot(tree, "card")
    expect(found).not.toBeNull()
    expect(found!.sub.name).toBe("Card")
  })

  it("finds CardHeader by its data-slot", () => {
    const found = findPartByDataSlot(tree, "card-header")
    expect(found).not.toBeNull()
    expect(found!.sub.name).toBe("CardHeader")
  })

  it("returns null for unknown data-slot", () => {
    expect(findPartByDataSlot(tree, "this-does-not-exist")).toBeNull()
  })
})

/* ── readBaseClassesForDataSlot ────────────────────────────────────── */

describe("readBaseClassesForDataSlot", () => {
  const tree = parseSource(
    load("components/ui/card.tsx"),
    "components/ui/card.tsx",
  )

  it("returns the cn() first-arg literal for Card", () => {
    const classes = readBaseClassesForDataSlot(tree, "card")
    expect(classes).toContain("flex flex-col")
    expect(classes).toContain("rounded-xl")
  })

  it("returns the cn() first-arg literal for CardHeader (multi-line)", () => {
    const classes = readBaseClassesForDataSlot(tree, "card-header")
    // CardHeader has a multi-line literal — `@container/card-header grid …`
    expect(classes).toContain("@container/card-header")
  })
})

/* ── applyClassEditToTree — happy path ─────────────────────────────── */

describe("applyClassEditToTree — Card cn-call shape", () => {
  const original = load("components/ui/card.tsx")

  it("replaces Card root classes and survives generator round-trip", () => {
    const tree = parseSource(original, "components/ui/card.tsx")
    const result = applyClassEditToTree(tree, "card", ["flex", "flex-col", "REPLACED"])
    expect(result).toEqual({ ok: true })

    const emitted = generateFromTreeV2(tree)
    // The new class string is in the output
    expect(emitted).toContain('"flex flex-col REPLACED"')
    // The CardHeader classes are untouched (a different sub-component)
    expect(emitted).toContain("@container/card-header")
    // The function signature, exports, etc. are untouched
    expect(emitted).toContain("function Card({")
    expect(emitted).toContain(
      "export {\n  Card,\n  CardHeader,\n  CardFooter,\n  CardTitle,\n  CardAction,\n  CardDescription,\n  CardContent,\n}",
    )
  })

  it("multiple edits across sub-components stack correctly", () => {
    const tree = parseSource(original, "components/ui/card.tsx")
    expect(applyClassEditToTree(tree, "card", ["NEW_CARD"])).toEqual({ ok: true })
    expect(applyClassEditToTree(tree, "card-header", ["NEW_HEADER"])).toEqual({
      ok: true,
    })
    expect(applyClassEditToTree(tree, "card-title", ["NEW_TITLE"])).toEqual({
      ok: true,
    })
    const emitted = generateFromTreeV2(tree)
    expect(emitted).toContain('"NEW_CARD"')
    expect(emitted).toContain('"NEW_HEADER"')
    expect(emitted).toContain('"NEW_TITLE"')
    // CardDescription is untouched and still present
    expect(emitted).toContain("text-muted-foreground")
  })

  it("edit then revert returns to fast-path byte-equivalent source", () => {
    const tree = parseSource(original, "components/ui/card.tsx")
    const baseClasses = readBaseClassesForDataSlot(tree, "card")!
    expect(applyClassEditToTree(tree, "card", ["TEMPORARY"])).toEqual({ ok: true })
    expect(generateFromTreeV2(tree)).not.toBe(original)
    expect(applyClassEditToTree(tree, "card", baseClasses.split(/\s+/))).toEqual({
      ok: true,
    })
    expect(generateFromTreeV2(tree)).toBe(original)
  })
})

/* ── applyClassEditToTree — failure paths ─────────────────────────── */

describe("applyClassEditToTree — failure paths", () => {
  it("returns not-found for an unknown data-slot", () => {
    const tree = parseSource(
      load("components/ui/card.tsx"),
      "components/ui/card.tsx",
    )
    const result = applyClassEditToTree(tree, "nope", ["foo"])
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toBe("not-found")
  })

  it("returns cva-only for Button (cva-call className)", () => {
    const tree = parseSource(
      load("components/ui/button.tsx"),
      "components/ui/button.tsx",
    )
    const result = applyClassEditToTree(tree, "button", ["foo"])
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toBe("cva-only")
  })

  it("returns no-base-range for Badge (cva inside cn — no string literal first arg)", () => {
    // Badge wraps cva in cn: cn(badgeVariants({ variant }), className).
    // The first arg is a function call, not a string literal, so no
    // baseRange is set. Editing must surface a structured failure.
    const tree = parseSource(
      load("components/ui/badge.tsx"),
      "components/ui/badge.tsx",
    )
    const result = applyClassEditToTree(tree, "badge", ["foo"])
    // Could be cva-only OR no-base-range depending on which kind the
    // parser settled on. Either is a valid "we can't edit this in 5b" answer.
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(["cva-only", "no-base-range"]).toContain(result.reason)
    }
  })
})

/* ── End-to-end shape check ──────────────────────────────────────── */

describe("Pillar 5b — end-to-end edit pipeline", () => {
  it("edits across the full set of supported components without crashing", () => {
    const supported: Array<{ slug: string; dataSlot: string }> = [
      { slug: "card", dataSlot: "card" },
      { slug: "input", dataSlot: "input" },
      { slug: "label", dataSlot: "label" },
      { slug: "skeleton", dataSlot: "skeleton" },
      { slug: "textarea", dataSlot: "textarea" },
      { slug: "separator", dataSlot: "separator" },
      { slug: "progress", dataSlot: "progress" },
      { slug: "checkbox", dataSlot: "checkbox" },
    ]
    for (const { slug, dataSlot } of supported) {
      const source = load(`components/ui/${slug}.tsx`)
      const tree = parseSource(source, `components/ui/${slug}.tsx`)
      const before: FoundPart | null = findPartByDataSlot(tree, dataSlot)
      expect(before, `${slug} should expose ${dataSlot}`).not.toBeNull()
      const result = applyClassEditToTree(tree, dataSlot, ["edit-test-class"])
      expect(result.ok, `${slug} should accept the edit`).toBe(true)
      const emitted = generateFromTreeV2(tree)
      expect(emitted).toContain('"edit-test-class"')
    }
  })
})
