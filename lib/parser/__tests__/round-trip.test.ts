/**
 * Pillar 3a — round-trip fidelity test.
 *
 * For every `.tsx` file in `components/ui/`, this test parses the source
 * to a `ComponentTreeV2`, generates source back from the tree, and asserts
 * **byte-for-byte** equality with the original.
 *
 * This is the operationalisation of Lesson #16: the parser and generator
 * together must be a noop on unedited source. Any drift in either direction
 * is a bug.
 *
 * Pillar 3a uses the generator's fast path, which returns `originalSource`
 * verbatim. This is deliberately trivial — the fast path is the minimum
 * viable demonstration of the round-trip contract. Pillar 3b will add the
 * slow-path generator for edited trees.
 */

import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

import { parseSource } from "@/lib/parser/parse-source-v2"
import {
  GeneratorError,
  generateFromTreeV2,
} from "@/lib/parser/generate-from-tree-v2"

const REPO_ROOT = path.resolve(__dirname, "..", "..", "..")

function load(relPath: string): string {
  return readFileSync(path.join(REPO_ROOT, relPath), "utf-8")
}

/**
 * Every component in `components/ui/`. Kept in sync with the parser's
 * coverage sweep so if a new shadcn component gets added, the round-trip
 * test picks it up automatically the next time the list is updated.
 */
const ALL_COMPONENTS = [
  "accordion",
  "alert",
  "alert-dialog",
  "aspect-ratio",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "calendar",
  "card",
  "carousel",
  "checkbox",
  "collapsible",
  "command",
  "context-menu",
  "dialog",
  "drawer",
  "dropdown-menu",
  "hover-card",
  "input",
  "item",
  "label",
  "menubar",
  "navigation-menu",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "resizable",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "skeleton",
  "slider",
  "sonner",
  "switch",
  "table",
  "tabs",
  "textarea",
  "toggle",
  "toggle-group",
  "tooltip",
]

describe("round-trip fidelity — fast path", () => {
  it.each(ALL_COMPONENTS)(
    "parse → generate → byte-equivalent for %s",
    (slug) => {
      const filePath = `components/ui/${slug}.tsx`
      const source = load(filePath)
      const tree = parseSource(source, filePath)
      const emitted = generateFromTreeV2(tree)
      expect(emitted).toBe(source)
    },
  )

  it("preserves originalSource on every parsed tree", () => {
    const source = load("components/ui/button.tsx")
    const tree = parseSource(source, "components/ui/button.tsx")
    expect(tree.originalSource).toBe(source)
  })
})

describe("generator — escape hatch path", () => {
  it("returns rawSource verbatim when customHandling is true", () => {
    const rawSource = '// fake source\nconst x = 1\n'
    const fakeTree = {
      name: "Fake",
      slug: "fake",
      filePath: "fake.tsx",
      roundTripRisk: "unhandleable" as const,
      customHandling: true,
      rawSource,
      directives: [],
      filePassthrough: [],
      imports: [],
      cvaExports: [],
      contextExports: [],
      hookExports: [],
      subComponents: [],
    }
    expect(generateFromTreeV2(fakeTree)).toBe(rawSource)
  })
})

describe("generator — slow path (Pillar 3b)", () => {
  it("throws GeneratorError when no originalSource and not custom-handled", () => {
    const programmaticTree = {
      name: "Programmatic",
      slug: "programmatic",
      filePath: "programmatic.tsx",
      roundTripRisk: "handleable" as const,
      customHandling: false,
      directives: [],
      filePassthrough: [],
      imports: [],
      cvaExports: [],
      contextExports: [],
      hookExports: [],
      subComponents: [],
    }
    expect(() => generateFromTreeV2(programmaticTree)).toThrow(GeneratorError)
  })
})
