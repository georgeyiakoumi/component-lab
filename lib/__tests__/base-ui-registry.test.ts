import { describe, expect, it } from "vitest"
import {
  BASE_UI_REGISTRY,
  getBaseUIComponent,
  getBaseUIComponentsByCategory,
} from "@/lib/base-ui-registry"

describe("BASE_UI_REGISTRY", () => {
  it("has exactly 37 components", () => {
    expect(BASE_UI_REGISTRY).toHaveLength(37)
  })

  it("has no duplicate slugs", () => {
    const slugs = BASE_UI_REGISTRY.map((c) => c.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it("every entry has a valid category", () => {
    const validCategories = [
      "Inputs",
      "Forms",
      "Overlays",
      "Navigation",
      "Layout",
      "Feedback",
      "Data Display",
    ]
    for (const c of BASE_UI_REGISTRY) {
      expect(validCategories).toContain(c.category)
    }
  })

  it("every entry has at least one part", () => {
    for (const c of BASE_UI_REGISTRY) {
      expect(c.parts.length).toBeGreaterThan(0)
    }
  })
})

describe("getBaseUIComponent", () => {
  it("returns the button entry for 'button'", () => {
    const button = getBaseUIComponent("button")
    expect(button).toBeDefined()
    expect(button!.name).toBe("Button")
    expect(button!.importPath).toBe("@base-ui/react/button")
  })

  it("returns undefined for nonexistent slug", () => {
    expect(getBaseUIComponent("nonexistent")).toBeUndefined()
  })
})

describe("getBaseUIComponentsByCategory", () => {
  it("returns 3 Inputs components", () => {
    const inputs = getBaseUIComponentsByCategory("Inputs")
    expect(inputs).toHaveLength(3)
  })

  it("returns empty array for invalid category", () => {
    const result = getBaseUIComponentsByCategory("NonExistent" as never)
    expect(result).toHaveLength(0)
  })
})
