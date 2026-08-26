/**
 * Characterization tests for component-store.ts
 *
 * Tests the public API: toSlug, generateId, and the CRUD operations
 * (getUserComponents, getUserComponent, saveUserComponent, deleteUserComponent).
 *
 * localStorage is mocked via vi.stubGlobal.
 */

import { describe, expect, it, beforeEach, vi } from "vitest"
import {
  toSlug,
  generateId,
  getUserComponents,
  getUserComponent,
  saveUserComponent,
  deleteUserComponent,
} from "@/lib/component-store"

/* ── localStorage mock ─────────────────────────────────────────── */

function mockLocalStorage() {
  const store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      for (const key of Object.keys(store)) delete store[key]
    }),
    get length() {
      return Object.keys(store).length
    },
    key: vi.fn((_i: number) => null),
  }
}

beforeEach(() => {
  const ls = mockLocalStorage()
  vi.stubGlobal("localStorage", ls)
  // readStore() checks `typeof window === "undefined"` — stub window too
  vi.stubGlobal("window", { localStorage: ls })
})

/* ── toSlug ────────────────────────────────────────────────────── */

describe("toSlug", () => {
  it("converts PascalCase to kebab-case", () => {
    expect(toSlug("MyButton")).toBe("my-button")
  })

  it("handles consecutive capitals (acronyms)", () => {
    expect(toSlug("HTTPClient")).toBe("http-client")
  })

  it("handles single word", () => {
    expect(toSlug("Button")).toBe("button")
  })

  it("handles already-lowercase input", () => {
    expect(toSlug("button")).toBe("button")
  })

  it("handles multi-word PascalCase", () => {
    expect(toSlug("MyFancyCard")).toBe("my-fancy-card")
  })
})

/* ── generateId ────────────────────────────────────────────────── */

describe("generateId", () => {
  it("returns a string starting with uc_", () => {
    const id = generateId()
    expect(id).toMatch(/^uc_/)
  })

  it("returns unique values across calls", () => {
    const ids = new Set(Array.from({ length: 20 }, () => generateId()))
    expect(ids.size).toBe(20)
  })
})

/* ── CRUD operations ───────────────────────────────────────────── */

function makeComponent(overrides: Partial<{
  id: string
  name: string
  slug: string
  source: string
  createdAt: string
  updatedAt: string
}> = {}) {
  return {
    id: overrides.id ?? generateId(),
    name: overrides.name ?? "TestComponent",
    slug: overrides.slug ?? "test-component",
    source: overrides.source ?? "<div>test</div>",
    createdAt: overrides.createdAt ?? "2026-01-01T00:00:00.000Z",
    updatedAt: overrides.updatedAt ?? "2026-01-01T00:00:00.000Z",
  }
}

describe("saveUserComponent + getUserComponent", () => {
  it("round-trips a component through save and get", () => {
    const c = makeComponent()
    saveUserComponent(c)
    const retrieved = getUserComponent("test-component")
    expect(retrieved).toBeDefined()
    expect(retrieved!.name).toBe("TestComponent")
    expect(retrieved!.source).toBe("<div>test</div>")
  })

  it("overwrites an existing component with the same id", () => {
    const c = makeComponent({ id: "fixed-id" })
    saveUserComponent(c)
    saveUserComponent({ ...c, source: "updated" })
    const retrieved = getUserComponent("test-component")
    expect(retrieved!.source).toBe("updated")
  })

  it("overwrites an existing component with the same slug", () => {
    const c1 = makeComponent({ id: "id-1", slug: "my-card" })
    const c2 = makeComponent({ id: "id-2", slug: "my-card", source: "new" })
    saveUserComponent(c1)
    saveUserComponent(c2)
    const all = getUserComponents()
    // Only one component with slug "my-card" should exist
    const matching = all.filter((c) => c.slug === "my-card")
    expect(matching).toHaveLength(1)
    expect(matching[0].source).toBe("new")
  })
})

describe("getUserComponents", () => {
  it("returns empty array when nothing is saved", () => {
    expect(getUserComponents()).toEqual([])
  })

  it("returns components sorted by updatedAt descending", () => {
    saveUserComponent(makeComponent({
      slug: "old",
      updatedAt: "2026-01-01T00:00:00.000Z",
    }))
    saveUserComponent(makeComponent({
      slug: "new",
      updatedAt: "2026-06-01T00:00:00.000Z",
    }))
    const all = getUserComponents()
    expect(all[0].slug).toBe("new")
    expect(all[1].slug).toBe("old")
  })
})

describe("deleteUserComponent", () => {
  it("removes a component by slug", () => {
    saveUserComponent(makeComponent({ slug: "to-delete" }))
    expect(getUserComponent("to-delete")).toBeDefined()
    deleteUserComponent("to-delete")
    expect(getUserComponent("to-delete")).toBeUndefined()
  })

  it("does not throw when deleting a non-existent slug", () => {
    expect(() => deleteUserComponent("nonexistent")).not.toThrow()
  })
})

describe("edge cases", () => {
  it("handles corrupted localStorage gracefully", () => {
    localStorage.setItem("playground-components", "not-json")
    expect(getUserComponents()).toEqual([])
  })

  it("handles empty localStorage", () => {
    expect(getUserComponents()).toEqual([])
  })
})
