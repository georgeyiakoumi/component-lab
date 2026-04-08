/**
 * Tests for the data-attr slot read/write helpers. These are the
 * underpinnings of the unified "ContextPicker IS the slot picker" flow
 * on the custom page for from-scratch components using the data-attr
 * variant strategy.
 */

import { describe, expect, it } from "vitest"

import {
  getDataAttrSlotClasses,
  setDataAttrSlotClasses,
} from "@/lib/parser/data-attr-slot"
import type {
  ComponentTreeV2,
  SubComponentV2,
} from "@/lib/component-tree-v2"

/* ── Test builders ──────────────────────────────────────────────── */

function makeCardSub(baseClasses: string): SubComponentV2 {
  return {
    name: "Card",
    dataSlot: "card",
    exportOrder: 0,
    isDefaultExport: false,
    jsdoc: null,
    propsDecl: {
      kind: "intersection",
      parts: [
        { kind: "component-props", target: "div" },
        {
          kind: "inline",
          properties: [
            {
              name: "size",
              type: '"default" | "sm"',
              optional: true,
              defaultValue: '"default"',
            },
          ],
        },
      ],
    },
    variantStrategy: {
      kind: "data-attr",
      variants: [
        {
          propName: "size",
          values: ["default", "sm"],
          defaultValue: "default",
          attrName: "data-size",
        },
      ],
    },
    passthrough: [],
    parts: {
      root: {
        base: { kind: "html", tag: "div" },
        dataSlot: "card",
        className: {
          kind: "cn-call",
          args: [JSON.stringify(baseClasses), "className"],
        },
        propsSpread: true,
        attributes: { "data-size": "{size}" },
        asChild: false,
        children: [],
      },
    },
  }
}

function makeTree(sub: SubComponentV2): ComponentTreeV2 {
  return {
    name: "Card",
    slug: "card",
    filePath: "components/ui/card.tsx",
    roundTripRisk: "handleable",
    customHandling: false,
    directives: [],
    filePassthrough: [],
    imports: [],
    cvaExports: [],
    contextExports: [],
    hookExports: [],
    subComponents: [sub],
  }
}

function readBase(tree: ComponentTreeV2, subName: string): string {
  const sub = tree.subComponents.find((s) => s.name === subName)!
  const expr = sub.parts.root.className
  if (expr.kind !== "cn-call") throw new Error("expected cn-call")
  const first = expr.args[0]
  if (typeof first !== "string") throw new Error("expected string arg")
  return first.slice(1, -1)
}

/* ── getDataAttrSlotClasses ─────────────────────────────────────── */

describe("getDataAttrSlotClasses", () => {
  it("returns unprefixed classes for the default slot", () => {
    const sub = makeCardSub("p-4 bg-blue-500 data-[size=sm]:p-2")
    expect(getDataAttrSlotClasses(sub, "size", "default")).toEqual([
      "p-4",
      "bg-blue-500",
    ])
  })

  it("returns prefix-stripped classes for a non-default slot", () => {
    const sub = makeCardSub("p-4 data-[size=sm]:p-2 data-[size=sm]:gap-3")
    expect(getDataAttrSlotClasses(sub, "size", "sm")).toEqual([
      "p-2",
      "gap-3",
    ])
  })

  it("returns an empty array for a value with no classes yet", () => {
    const sub = makeCardSub("p-4")
    expect(getDataAttrSlotClasses(sub, "size", "sm")).toEqual([])
  })

  it("returns null for an unknown prop", () => {
    const sub = makeCardSub("p-4")
    expect(getDataAttrSlotClasses(sub, "density", "cozy")).toBeNull()
  })

  it("returns null for a value not in the variant", () => {
    const sub = makeCardSub("p-4")
    expect(getDataAttrSlotClasses(sub, "size", "lg")).toBeNull()
  })

  it("returns null for a sub-component without data-attr strategy", () => {
    const sub = makeCardSub("p-4")
    const noneSub: SubComponentV2 = {
      ...sub,
      variantStrategy: { kind: "none" },
    }
    expect(getDataAttrSlotClasses(noneSub, "size", "default")).toBeNull()
  })

  it("keeps classes with nested data-attr selectors in the right slot", () => {
    // The outer prefix is `data-[size=sm]:`, and the remainder
    // `has-data-[slot=card-footer]:pb-0` should be preserved verbatim.
    const sub = makeCardSub(
      "p-4 data-[size=sm]:has-data-[slot=card-footer]:pb-0",
    )
    expect(getDataAttrSlotClasses(sub, "size", "default")).toEqual(["p-4"])
    expect(getDataAttrSlotClasses(sub, "size", "sm")).toEqual([
      "has-data-[slot=card-footer]:pb-0",
    ])
  })

  it("treats other-prefix classes (hover:, md:) as neither slot", () => {
    const sub = makeCardSub("p-4 hover:bg-blue-600 md:p-6 data-[size=sm]:p-2")
    expect(getDataAttrSlotClasses(sub, "size", "default")).toEqual(["p-4"])
    expect(getDataAttrSlotClasses(sub, "size", "sm")).toEqual(["p-2"])
  })
})

/* ── setDataAttrSlotClasses ─────────────────────────────────────── */

describe("setDataAttrSlotClasses", () => {
  it("writes to the default slot by rewriting the unprefixed classes", () => {
    const tree = makeTree(makeCardSub("p-4 data-[size=sm]:p-2"))
    const next = setDataAttrSlotClasses(tree, "Card", "size", "default", [
      "p-6",
      "bg-muted",
    ])
    expect(readBase(next, "Card")).toBe("p-6 bg-muted data-[size=sm]:p-2")
  })

  it("writes to a non-default slot by rewriting the prefixed classes", () => {
    const tree = makeTree(makeCardSub("p-4 data-[size=sm]:p-2"))
    const next = setDataAttrSlotClasses(tree, "Card", "size", "sm", [
      "p-3",
      "gap-2",
    ])
    expect(readBase(next, "Card")).toBe(
      "p-4 data-[size=sm]:p-3 data-[size=sm]:gap-2",
    )
  })

  it("preserves other-prefix classes (hover:, md:) through a slot write", () => {
    const tree = makeTree(
      makeCardSub("p-4 hover:bg-blue-600 md:p-6 data-[size=sm]:p-2"),
    )
    const next = setDataAttrSlotClasses(tree, "Card", "size", "sm", ["p-3"])
    const base = readBase(next, "Card")
    expect(base).toContain("p-4")
    expect(base).toContain("hover:bg-blue-600")
    expect(base).toContain("md:p-6")
    expect(base).toContain("data-[size=sm]:p-3")
    expect(base).not.toContain("data-[size=sm]:p-2")
  })

  it("clears a slot when given an empty class list", () => {
    const tree = makeTree(
      makeCardSub("p-4 data-[size=sm]:p-2 data-[size=sm]:gap-3"),
    )
    const next = setDataAttrSlotClasses(tree, "Card", "size", "sm", [])
    expect(readBase(next, "Card")).toBe("p-4")
  })

  it("is a round-trip: writing what you read back produces the same tree", () => {
    const tree = makeTree(
      makeCardSub("p-4 bg-muted data-[size=sm]:p-2 data-[size=sm]:gap-3"),
    )
    const sub = tree.subComponents[0]
    const defaultSlot = getDataAttrSlotClasses(sub, "size", "default")!
    const smSlot = getDataAttrSlotClasses(sub, "size", "sm")!
    // Rewrite each slot with the same classes it already had.
    const afterDefault = setDataAttrSlotClasses(
      tree,
      "Card",
      "size",
      "default",
      defaultSlot,
    )
    const afterBoth = setDataAttrSlotClasses(
      afterDefault,
      "Card",
      "size",
      "sm",
      smSlot,
    )
    expect(readBase(afterBoth, "Card")).toBe(readBase(tree, "Card"))
  })

  it("returns the tree unchanged when the sub-component has no data-attr strategy", () => {
    const sub = makeCardSub("p-4")
    const noneSub: SubComponentV2 = {
      ...sub,
      variantStrategy: { kind: "none" },
    }
    const tree = makeTree(noneSub)
    const next = setDataAttrSlotClasses(tree, "Card", "size", "sm", ["p-2"])
    expect(next).toBe(tree)
  })

  it("returns the tree unchanged for an unknown prop", () => {
    const tree = makeTree(makeCardSub("p-4"))
    const next = setDataAttrSlotClasses(tree, "Card", "density", "cozy", [
      "gap-2",
    ])
    expect(next).toBe(tree)
  })

  it("returns the tree unchanged for a value not in the variant", () => {
    const tree = makeTree(makeCardSub("p-4"))
    const next = setDataAttrSlotClasses(tree, "Card", "size", "lg", ["p-6"])
    expect(next).toBe(tree)
  })
})
