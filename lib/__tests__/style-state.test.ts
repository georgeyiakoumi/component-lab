/**
 * Characterization tests for style-state.ts
 *
 * Tests the core public API:
 * - classesToControlState: parse Tailwind classes → ControlState
 * - controlStateToClasses: serialize ControlState → Tailwind classes
 * - mergeClasses: merge editor classes with original classes
 * - findMatch: utility for matching classes against options
 */

import { describe, expect, it } from "vitest"
import {
  classesToControlState,
  controlStateToClasses,
  mergeClasses,
  findMatch,
} from "@/lib/style-state"

/* ── findMatch ─────────────────────────────────────────────────── */

describe("findMatch", () => {
  it("returns the first matching class", () => {
    expect(findMatch(["flex", "p-4", "gap-2"], ["flex", "grid", "block"])).toBe("flex")
  })

  it("returns empty string when no match", () => {
    expect(findMatch(["p-4", "m-2"], ["flex", "grid"])).toBe("")
  })

  it("returns empty string for empty input", () => {
    expect(findMatch([], ["flex"])).toBe("")
  })
})

/* ── classesToControlState ─────────────────────────────────────── */

describe("classesToControlState", () => {
  it("parses layout classes", () => {
    const state = classesToControlState(["flex", "items-center", "gap-4"])
    expect(state.display).toBe("flex")
    expect(state.align).toBe("items-center")
    expect(state.gap).toBe("gap-4")
  })

  it("parses grid layout", () => {
    const state = classesToControlState(["grid", "grid-cols-3", "gap-2"])
    expect(state.display).toBe("grid")
    expect(state.gridCols).toBe("grid-cols-3")
    expect(state.gap).toBe("gap-2")
  })

  it("parses spacing classes", () => {
    const state = classesToControlState(["p-4", "m-2", "px-6"])
    expect(state.padding).toBe("p-4")
    expect(state.margin).toBe("m-2")
    expect(state.paddingX).toBe("px-6")
  })

  it("parses typography classes", () => {
    const state = classesToControlState(["text-sm", "font-bold", "text-center"])
    expect(state.fontSize).toBe("text-sm")
    expect(state.fontWeight).toBe("font-bold")
    expect(state.textAlign).toBe("text-center")
  })

  it("parses sizing classes", () => {
    const state = classesToControlState(["w-full", "h-10", "min-w-0"])
    expect(state.width).toBe("w-full")
    expect(state.height).toBe("h-10")
    expect(state.minWidth).toBe("min-w-0")
  })

  it("parses border classes", () => {
    const state = classesToControlState(["rounded-md", "border", "border-t-2"])
    expect(state.borderRadius).toBe("rounded-md")
    expect(state.borderWidth).toBe("border")
    expect(state.borderWidthT).toBe("border-t-2")
  })

  it("parses position classes", () => {
    const state = classesToControlState(["relative", "z-10", "top-0"])
    expect(state.position).toBe("relative")
    expect(state.zIndex).toBe("z-10")
    expect(state.top).toBe("top-0")
  })

  it("returns empty strings for unmatched categories", () => {
    const state = classesToControlState(["flex"])
    expect(state.gap).toBe("")
    expect(state.padding).toBe("")
    expect(state.fontSize).toBe("")
  })

  it("handles empty input", () => {
    const state = classesToControlState([])
    expect(state.display).toBe("")
    expect(state.padding).toBe("")
  })

  it("handles place-items shorthand", () => {
    const state = classesToControlState(["grid", "place-items-center"])
    expect(state.justify).toBe("justify-center")
    expect(state.align).toBe("items-center")
  })

  it("filters classes by context", () => {
    const state = classesToControlState(
      ["hover:bg-muted", "bg-primary", "hover:text-white"],
      "hover",
    )
    // Only hover-prefixed classes should be parsed (with prefix stripped)
    expect(state.bgColor).toBe("bg-muted")
  })
})

/* ── controlStateToClasses ─────────────────────────────────────── */

describe("controlStateToClasses", () => {
  it("emits layout classes", () => {
    const state = classesToControlState(["flex", "items-center", "gap-4"])
    const classes = controlStateToClasses(state)
    expect(classes).toContain("flex")
    expect(classes).toContain("items-center")
    expect(classes).toContain("gap-4")
  })

  it("skips empty values", () => {
    const state = classesToControlState(["flex"])
    const classes = controlStateToClasses(state)
    expect(classes).toContain("flex")
    expect(classes).not.toContain("")
  })

  it("adds context prefix when specified", () => {
    const state = classesToControlState(["bg-muted"], "default")
    const classes = controlStateToClasses(state, "hover")
    expect(classes).toContain("hover:bg-muted")
  })

  it("uses place-items shorthand for matching grid axes", () => {
    const state = classesToControlState(["grid", "place-items-center"])
    const classes = controlStateToClasses(state)
    expect(classes).toContain("place-items-center")
    expect(classes).not.toContain("justify-center")
    expect(classes).not.toContain("items-center")
  })
})

/* ── Round-trip: classes → state → classes ──────────────────────── */

describe("round-trip (classesToControlState → controlStateToClasses)", () => {
  const cases = [
    ["flex", "items-center", "justify-between", "gap-4"],
    ["grid", "grid-cols-2", "gap-2"],
    ["p-4", "m-2"],
    ["text-sm", "font-bold"],
    ["rounded-md", "border"],
    ["relative", "z-10"],
    ["w-full", "h-10"],
  ]

  for (const input of cases) {
    it(`round-trips: ${input.join(" ")}`, () => {
      const state = classesToControlState(input)
      const output = controlStateToClasses(state)
      // Every input class should appear in the output
      for (const cls of input) {
        expect(output).toContain(cls)
      }
    })
  }
})

/* ── mergeClasses ──────────────────────────────────────────────── */

describe("mergeClasses", () => {
  it("preserves unmanaged classes from original", () => {
    const original = ["custom-class", "flex", "p-4"]
    const state = classesToControlState(["flex", "p-4"])
    const result = mergeClasses(original, state)
    expect(result).toContain("custom-class")
  })

  it("replaces managed classes with editor values", () => {
    const original = ["flex", "gap-2"]
    const state = classesToControlState(["flex", "gap-4"])
    const result = mergeClasses(original, state)
    expect(result).toContain("gap-4")
    expect(result).not.toContain("gap-2")
  })

  it("removes managed classes when editor clears them", () => {
    const original = ["flex", "gap-2", "p-4"]
    // State with gap cleared
    const state = classesToControlState(["flex", "p-4"])
    const result = mergeClasses(original, state)
    expect(result).toContain("flex")
    expect(result).toContain("p-4")
    expect(result).not.toContain("gap-2")
  })
})
