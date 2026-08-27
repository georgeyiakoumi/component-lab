import { describe, expect, it } from "vitest"
import { generateBaseUICode } from "@/lib/base-ui-code-gen"
import { BASE_UI_REGISTRY, getBaseUIComponent } from "@/lib/base-ui-registry"

describe("generateBaseUICode", () => {
  it("produces non-empty output for every registered component", () => {
    for (const entry of BASE_UI_REGISTRY) {
      const output = generateBaseUICode(entry, {})
      expect(output.length).toBeGreaterThan(0)
    }
  })

  it("includes correct import path for every component", () => {
    for (const entry of BASE_UI_REGISTRY) {
      const output = generateBaseUICode(entry, {})
      expect(output).toContain(`from "${entry.importPath}"`)
    }
  })

  it("includes export function with My prefix for every component", () => {
    for (const entry of BASE_UI_REGISTRY) {
      const output = generateBaseUICode(entry, {})
      expect(output).toContain(`export function My${entry.name}`)
    }
  })

  it("applies classMap values as className props", () => {
    const switchEntry = getBaseUIComponent("switch")!
    const output = generateBaseUICode(switchEntry, {
      Root: "bg-primary",
      Thumb: "bg-white",
    })
    expect(output).toContain('className="bg-primary"')
    expect(output).toContain('className="bg-white"')
  })

  it("does not contain 'undefined' in any generated output", () => {
    for (const entry of BASE_UI_REGISTRY) {
      const output = generateBaseUICode(entry, {})
      expect(output).not.toContain("undefined")
    }
  })

  it("toast output includes helper component definitions", () => {
    const toast = getBaseUIComponent("toast")!
    const output = generateBaseUICode(toast, {})
    expect(output).toContain("function ToastTrigger()")
    expect(output).toContain("function ToastList()")
    expect(output).toContain("Toast.useToastManager()")
  })

  it("menubar output uses Menubar component, not div", () => {
    const menubar = getBaseUIComponent("menubar")!
    const output = generateBaseUICode(menubar, {})
    expect(output).toContain("<Menubar")
    expect(output).not.toContain('<div role="menubar">')
  })
})
