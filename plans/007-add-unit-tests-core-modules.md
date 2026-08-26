# Plan 007: Add characterization tests for core state modules

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise.
>
> **Drift check (run first)**: `git diff --stat bbac9f4..HEAD -- lib/component-store.ts lib/style-state.ts`

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: LOW
- **Depends on**: none
- **Category**: tests
- **Planned at**: commit `bbac9f4`, 2026-08-26

## Why this matters

Three core modules have zero unit test coverage despite being high-churn and high-impact:

1. **`lib/component-store.ts`** (156 lines) — localStorage persistence for user-created components. A bug here silently loses user work.
2. **`lib/style-state.ts`** (1151 lines) — parses and serializes Tailwind classes into a structured `ControlState` for the style editor. Powers the entire edit panel.

These modules are the data layer. Without tests, any refactoring (e.g., the persistence abstraction needed for M5 auth) is high-risk.

## Current state

### component-store.ts
Exports: `getUserComponents()`, `getUserComponent(slug)`, `saveUserComponent(uc)`, `deleteUserComponent(slug)`, `generateId()`, `toSlug(name)`, `toPascalCase(name)`.

Uses `localStorage` directly. Tests need to mock `localStorage` (Vitest supports this with `vi.stubGlobal`).

### style-state.ts
Exports: `classesToControlState(classes)`, `controlStateToClasses(state)`, `getPartClasses(part)`, and the `ControlState` type.

Pure functions (no side effects) — ideal for unit testing. The existing test pattern is in `lib/parser/__tests__/*.test.ts`.

### Test pattern to follow
```ts
// lib/parser/__tests__/button.test.ts
import { describe, expect, it } from "vitest"
import { parseSource } from "@/lib/parser/parse-source-v2"
// ...
describe("parseSource — Button", () => {
  it("extracts the component name", () => {
    expect(tree.name).toBe("Button")
  })
})
```

## Commands you will need

| Purpose   | Command              | Expected on success |
|-----------|----------------------|---------------------|
| Typecheck | `npx tsc --noEmit`   | exit 0              |
| Tests     | `npm test`           | all pass            |

## Scope

**In scope** (create these files):
- `lib/__tests__/component-store.test.ts`
- `lib/__tests__/style-state.test.ts`

**Out of scope**:
- `lib/component-renderer.tsx` — requires React rendering context; better tested via E2E
- Any modifications to the source modules themselves
- `lib/component-source.ts` — static data, no logic to test

## Git workflow

- Branch: `advisor/007-add-core-tests`
- Commit message style: `test: <description>`
- Do NOT push or open a PR.

## Steps

### Step 1: Create component-store tests

Create `lib/__tests__/component-store.test.ts`. Mock `localStorage` using `vi.stubGlobal`. Test:

1. **`toSlug(name)`** — happy path: `"My Button"` → `"my-button"`. Edge cases: empty string, special characters, consecutive hyphens.
2. **`toPascalCase(name)`** — `"my-button"` → `"MyButton"`. Edge cases: single word, already PascalCase.
3. **`generateId()`** — returns a string, unique across calls.
4. **`saveUserComponent` + `getUserComponent`** — round-trip: save a component, retrieve it by slug, assert equality.
5. **`getUserComponents()`** — returns all saved components.
6. **`deleteUserComponent(slug)`** — deletes a component, verify it's gone.
7. **Edge case: v1 → v2 migration** — if `component-store.ts` detects a v1 tree shape on read and upgrades it, test that the upgrade happens correctly. Check the source for this behavior first.

**Verify**: `npm test -- lib/__tests__/component-store.test.ts` → all pass

### Step 2: Create style-state tests

Create `lib/__tests__/style-state.test.ts`. Test:

1. **`classesToControlState(classes)`** — basic: `"flex items-center gap-4 p-2"` → state with `display: "flex"`, `alignItems: "items-center"`, `gap: "gap-4"`, `padding: "p-2"`.
2. **`controlStateToClasses(state)`** — inverse of above: state object → class string.
3. **Round-trip**: `controlStateToClasses(classesToControlState(input))` preserves the input classes (order may differ — test set equality).
4. **Edge cases**: empty class string, unknown classes (should be preserved in a passthrough field), duplicate classes, responsive prefixes (if supported).

Read `lib/style-state.ts` first to understand the `ControlState` shape and which Tailwind categories it recognizes. The test assertions must match the actual field names.

**Verify**: `npm test -- lib/__tests__/style-state.test.ts` → all pass

### Step 3: Run full test suite

**Verify**: `npm test` → all pass (including new tests)
**Verify**: `npx tsc --noEmit` → exit 0

## Test plan

This plan IS the test plan. The deliverable is the test files themselves.

Target: 15-25 test cases total across both files. Prioritize the public API surface and the round-trip invariants.

## Done criteria

- [ ] `lib/__tests__/component-store.test.ts` exists and passes
- [ ] `lib/__tests__/style-state.test.ts` exists and passes
- [ ] `npm test` exits 0 with all tests passing (including new ones)
- [ ] `npx tsc --noEmit` exits 0
- [ ] No files outside the in-scope list are modified
- [ ] New test files follow the existing pattern (vitest, `@/` imports, describe/it structure)

## STOP conditions

Stop and report back if:

- `lib/component-store.ts` or `lib/style-state.ts` has changed since `bbac9f4`.
- The `ControlState` type is significantly more complex than expected (50+ fields) — scope down to the top 10 most-used fields.
- `component-store.ts` uses browser APIs beyond `localStorage` that can't be mocked in Node.

## Maintenance notes

- These tests should be updated whenever the public API of either module changes.
- When the persistence abstraction is built for M5, `component-store.test.ts` becomes the test for the localStorage adapter.
- `style-state.ts` round-trip tests are the safety net for adding new Tailwind categories.
