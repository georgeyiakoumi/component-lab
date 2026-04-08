import { describe, expect, test } from "vitest"

import {
  appendChildAtPath,
  buildSubComponentMap,
  findPartByPath,
  findSubByPath,
  findSubNameByPath,
  getPartClasses,
  isRootPath,
  makePartPath,
  parsePartPath,
  removePartAtPath,
  replacePartByPath,
  setPartClasses,
} from "@/lib/parser/v2-tree-path"
import {
  createComponentTreeV2,
  createPartNode,
} from "@/lib/component-tree-v2-factories"
import type { PartNode } from "@/lib/component-tree-v2"

/* ── Path encoding / decoding ───────────────────────────────────── */

describe("makePartPath / parsePartPath", () => {
  test("root path round-trips", () => {
    const path = makePartPath("MyCard")
    expect(path).toBe("sub:MyCard/")
    expect(parsePartPath(path)).toEqual({
      subComponentName: "MyCard",
      childIndices: [],
    })
  })

  test("deep child path round-trips", () => {
    const path = makePartPath("MyCard", [0, 2, 1])
    expect(path).toBe("sub:MyCard/0/2/1")
    expect(parsePartPath(path)).toEqual({
      subComponentName: "MyCard",
      childIndices: [0, 2, 1],
    })
  })

  test("malformed paths return null", () => {
    expect(parsePartPath("not-a-path")).toBeNull()
    expect(parsePartPath("sub:")).toBeNull()
    expect(parsePartPath("sub:MyCard/abc")).toBeNull()
    expect(parsePartPath("sub:MyCard/-1")).toBeNull()
  })

  test("isRootPath identifies root paths", () => {
    expect(isRootPath("sub:MyCard/")).toBe(true)
    expect(isRootPath("sub:MyCard/0")).toBe(false)
    expect(isRootPath("not-a-path")).toBe(false)
  })
})

/* ── Lookup ─────────────────────────────────────────────────────── */

describe("findPartByPath / findSubByPath", () => {
  test("finds the root part of a sub-component", () => {
    const tree = createComponentTreeV2("MyCard", "div")
    const part = findPartByPath(tree, "sub:MyCard/")
    expect(part).not.toBeNull()
    expect(part?.base).toEqual({ kind: "html", tag: "div" })
  })

  test("finds the sub-component object", () => {
    const tree = createComponentTreeV2("MyCard", "div")
    const sub = findSubByPath(tree, "sub:MyCard/")
    expect(sub?.name).toBe("MyCard")
  })

  test("finds a deep child by index path", () => {
    const tree = createComponentTreeV2("MyCard", "div")
    // Build a tree manually: root → child0 → child0.0
    const child00 = createPartNode("p")
    const child0 = createPartNode("section")
    child0.children.push({ kind: "part", part: child00 })
    tree.subComponents[0].parts.root.children.push({
      kind: "part",
      part: child0,
    })

    const found = findPartByPath(tree, "sub:MyCard/0/0")
    expect(found?.base).toEqual({ kind: "html", tag: "p" })
  })

  test("returns null for out-of-bounds indices", () => {
    const tree = createComponentTreeV2("MyCard", "div")
    expect(findPartByPath(tree, "sub:MyCard/0")).toBeNull()
    expect(findPartByPath(tree, "sub:MyCard/0/0")).toBeNull()
  })

  test("returns null for unknown sub-component name", () => {
    const tree = createComponentTreeV2("MyCard", "div")
    expect(findPartByPath(tree, "sub:Nonexistent/")).toBeNull()
  })

  test("findSubNameByPath extracts the sub-component name", () => {
    expect(findSubNameByPath("sub:MyCard/")).toBe("MyCard")
    expect(findSubNameByPath("sub:MyCard/0/2")).toBe("MyCard")
    expect(findSubNameByPath("malformed")).toBeNull()
  })
})

/* ── Mutation ───────────────────────────────────────────────────── */

describe("replacePartByPath", () => {
  test("replaces the root part of a sub-component", () => {
    const tree = createComponentTreeV2("MyCard", "div")
    const replacement = createPartNode("section")

    const updated = replacePartByPath(tree, "sub:MyCard/", replacement)
    const newRoot = updated.subComponents[0].parts.root
    expect(newRoot.base).toEqual({ kind: "html", tag: "section" })
  })

  test("replaces a deep child without touching siblings", () => {
    const tree = createComponentTreeV2("MyCard", "div")
    const child0 = createPartNode("p")
    const child1 = createPartNode("span")
    tree.subComponents[0].parts.root.children.push(
      { kind: "part", part: child0 },
      { kind: "part", part: child1 },
    )

    const replacement = createPartNode("h1")
    const updated = replacePartByPath(tree, "sub:MyCard/0", replacement)
    const root = updated.subComponents[0].parts.root

    expect(root.children).toHaveLength(2)
    expect((root.children[0] as { kind: "part"; part: PartNode }).part.base).toEqual({
      kind: "html",
      tag: "h1",
    })
    expect((root.children[1] as { kind: "part"; part: PartNode }).part.base).toEqual({
      kind: "html",
      tag: "span",
    })
  })

  test("returns the original tree when path is invalid", () => {
    const tree = createComponentTreeV2("MyCard", "div")
    const updated = replacePartByPath(tree, "malformed", createPartNode("h1"))
    expect(updated).toBe(tree)
  })

  test("does not mutate the original tree", () => {
    const tree = createComponentTreeV2("MyCard", "div")
    const before = JSON.stringify(tree)
    replacePartByPath(tree, "sub:MyCard/", createPartNode("section"))
    expect(JSON.stringify(tree)).toBe(before)
  })
})

/* ── Class manipulation ─────────────────────────────────────────── */

describe("setPartClasses / getPartClasses", () => {
  test("sets classes on the cn-call literal of a factory part", () => {
    const tree = createComponentTreeV2("MyCard", "div")
    const updated = setPartClasses(tree, "sub:MyCard/", ["p-4", "bg-blue-500"])

    const root = updated.subComponents[0].parts.root
    expect(root.className.kind).toBe("cn-call")
    if (root.className.kind === "cn-call") {
      expect(root.className.args[0]).toBe('"p-4 bg-blue-500"')
      // Original cn-call had ['"', 'className'] — second arg preserved
      expect(root.className.args[1]).toBe("className")
    }
  })

  test("getPartClasses reads back the same classes", () => {
    const tree = createComponentTreeV2("MyCard", "div")
    const updated = setPartClasses(tree, "sub:MyCard/", ["p-4", "bg-blue-500"])
    const root = updated.subComponents[0].parts.root
    expect(getPartClasses(root)).toEqual(["p-4", "bg-blue-500"])
  })

  test("setPartClasses with an empty array clears the classes", () => {
    const tree = createComponentTreeV2("MyCard", "div")
    const populated = setPartClasses(tree, "sub:MyCard/", ["p-4"])
    const cleared = setPartClasses(populated, "sub:MyCard/", [])
    expect(getPartClasses(cleared.subComponents[0].parts.root)).toEqual([])
  })

  test("getPartClasses on a literal className", () => {
    const part: PartNode = {
      base: { kind: "html", tag: "div" },
      className: { kind: "literal", value: "p-4 bg-blue-500" },
      propsSpread: false,
      attributes: {},
      asChild: false,
      children: [],
    }
    expect(getPartClasses(part)).toEqual(["p-4", "bg-blue-500"])
  })
})

/* ── Walking ────────────────────────────────────────────────────── */

describe("buildSubComponentMap", () => {
  test("indexes sub-components by name", () => {
    const tree = createComponentTreeV2("MyCard", "div")
    const map = buildSubComponentMap(tree)
    expect(map.get("MyCard")?.name).toBe("MyCard")
    expect(map.size).toBe(1)
  })
})

/* ── Child management ───────────────────────────────────────────── */

describe("appendChildAtPath", () => {
  test("appends a new part child to the root", () => {
    const tree = createComponentTreeV2("MyCard", "div")
    const newChild = createPartNode("p")
    const updated = appendChildAtPath(tree, "sub:MyCard/", newChild)

    const root = updated.subComponents[0].parts.root
    expect(root.children).toHaveLength(1)
    expect((root.children[0] as { kind: "part"; part: PartNode }).part.base).toEqual({
      kind: "html",
      tag: "p",
    })
  })

  test("does not mutate the original tree", () => {
    const tree = createComponentTreeV2("MyCard", "div")
    const before = JSON.stringify(tree)
    appendChildAtPath(tree, "sub:MyCard/", createPartNode("p"))
    expect(JSON.stringify(tree)).toBe(before)
  })
})

describe("removePartAtPath", () => {
  test("removes a child by path", () => {
    const tree = createComponentTreeV2("MyCard", "div")
    const child0 = createPartNode("p")
    const child1 = createPartNode("span")
    tree.subComponents[0].parts.root.children.push(
      { kind: "part", part: child0 },
      { kind: "part", part: child1 },
    )

    const updated = removePartAtPath(tree, "sub:MyCard/0")
    const root = updated.subComponents[0].parts.root
    expect(root.children).toHaveLength(1)
    expect((root.children[0] as { kind: "part"; part: PartNode }).part.base).toEqual({
      kind: "html",
      tag: "span",
    })
  })

  test("refuses to remove a sub-component's root", () => {
    const tree = createComponentTreeV2("MyCard", "div")
    const updated = removePartAtPath(tree, "sub:MyCard/")
    // Should return the tree unchanged
    expect(updated).toBe(tree)
  })
})
