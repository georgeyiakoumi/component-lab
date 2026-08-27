# Plan 013: Add test coverage for Base UI registry, code-gen, and editing flow

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 0085534..HEAD -- lib/base-ui-registry.ts lib/base-ui-code-gen.ts lib/base-ui-previews.tsx lib/base-ui-default-classes.ts e2e/`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: 009, 010 (toast and menubar fixes should land first so tests verify the corrected code)
- **Category**: tests
- **Planned at**: commit `0085534`, 2026-08-27

## Why this matters

The entire M6 Base UI surface (37 component renderers, 37 code templates, the registry, the dashboard) has zero automated tests. The old shadcn system had 55 round-trip tests and 10 unit test files. The new system has none. Any regression in a renderer or template goes undetected until a user reports it. This is the safety net for M7 refactoring.

## Current state

- `lib/base-ui-registry.ts` — exports `BASE_UI_REGISTRY` (37 entries), `getBaseUIComponent(slug)`, `getBaseUIComponentsByCategory(category)`
- `lib/base-ui-previews.tsx` — exports `renderBaseUIPreview(slug, classMap, portalContainer?)`, `getPreviewRenderer(slug)`. 37 renderer functions in a `previews` Record.
- `lib/base-ui-code-gen.ts` — exports `generateBaseUICode(component, classMap)`. 37 template functions in a `templates` Record.
- `lib/base-ui-default-classes.ts` — exports `DEFAULT_CLASSES` Record.
- Existing test patterns: `lib/__tests__/style-state.test.ts` uses Vitest with `describe`/`it`/`expect`. Tests are in `lib/__tests__/` for unit tests, `e2e/` for Playwright.
- Test commands: `npm run test` (Vitest unit), `npm run test:e2e` (Playwright).

## Commands you will need

| Purpose   | Command                              | Expected on success       |
|-----------|--------------------------------------|---------------------------|
| Unit test | `npm run test`                       | all pass, new tests exist |
| E2E test  | `npm run test:e2e`                   | all pass, new spec exists |
| Typecheck | `npm run typecheck`                  | exit 0                    |

## Scope

**In scope** (create these files):
- `lib/__tests__/base-ui-registry.test.ts`
- `lib/__tests__/base-ui-code-gen.test.ts`
- `e2e/playground-base.spec.ts`

**Out of scope**:
- `lib/base-ui-previews.tsx` — renderer tests require DOM/React rendering which is complex; defer to E2E
- Any source code changes (tests only)
- Old shadcn test files — do not modify

## Steps

### Step 1: Create registry unit tests

Create `lib/__tests__/base-ui-registry.test.ts` with these cases:

1. **Registry completeness**: `BASE_UI_REGISTRY` has exactly 37 entries
2. **Slug uniqueness**: no duplicate slugs
3. **Category coverage**: every entry has a valid category
4. **Parts non-empty**: every entry has at least one part
5. **Lookup works**: `getBaseUIComponent("button")` returns the button entry; `getBaseUIComponent("nonexistent")` returns undefined
6. **Category filter**: `getBaseUIComponentsByCategory("Inputs")` returns 3 entries (button, toggle, toggle-group)

Follow the pattern in `lib/__tests__/style-state.test.ts` — use `describe()` blocks and `it()` with clear names.

**Verify**: `npm run test -- base-ui-registry` → all pass

### Step 2: Create code-gen unit tests

Create `lib/__tests__/base-ui-code-gen.test.ts` with these cases:

1. **Every component has a template**: for each entry in `BASE_UI_REGISTRY`, call `generateBaseUICode(entry, {})` and assert the result is a non-empty string
2. **Import correctness**: for each entry, the output contains `from "${entry.importPath}"`
3. **Function name**: output contains `export function My${entry.name}`
4. **Default classes applied**: for `switch`, call `generateBaseUICode(switchEntry, { Root: "bg-primary", Thumb: "bg-white" })` and assert output contains `className="bg-primary"` and `className="bg-white"`
5. **No undefined references**: for each entry, the output does NOT contain the string `undefined`
6. **Registry-template count match**: `Object.keys(templates)` length equals `BASE_UI_REGISTRY.length` (import `templates` or verify via `generateBaseUICode` returning non-fallback output for every slug)

**Verify**: `npm run test -- base-ui-code-gen` → all pass

### Step 3: Create E2E spec for Base UI editing flow

Create `e2e/playground-base.spec.ts` modeled after `e2e/playground.spec.ts`. Include these scenarios:

1. **Navigate to component**: go to `/playground/base/button`, verify the page loads with "Button" visible in the style panel header
2. **Part selection**: click the "Button" part pill, verify the visual editor appears
3. **Code panel shows generated code**: verify the code panel contains `import { Button } from "@base-ui/react/button"`
4. **Theme toggle**: click the dark mode toggle, verify the canvas area has the `dark` class
5. **Word wrap toggle**: click the wrap toggle in the code panel, verify no crash (basic smoke test)

Use Playwright's `page.goto()`, `page.click()`, `page.locator()`, `expect().toBeVisible()`, `expect().toContainText()`.

**Verify**: `npm run test:e2e -- playground-base` → all pass

## Test plan

This plan IS the test plan. The tests themselves are the deliverable.

## Done criteria

- [ ] `npm run typecheck` exits 0
- [ ] `npm run test` exits 0 with new registry and code-gen tests passing
- [ ] `npm run test:e2e` exits 0 with new playground-base spec passing
- [ ] `lib/__tests__/base-ui-registry.test.ts` exists with 6+ test cases
- [ ] `lib/__tests__/base-ui-code-gen.test.ts` exists with 6+ test cases
- [ ] `e2e/playground-base.spec.ts` exists with 5+ test scenarios
- [ ] No files outside the in-scope list are modified

## STOP conditions

- The imports from `lib/base-ui-registry.ts` or `lib/base-ui-code-gen.ts` don't work (module structure changed).
- Playwright can't navigate to `/playground/base/button` (route missing or changed).
- A step's verification fails twice after a reasonable fix attempt.

## Maintenance notes

- When a new Base UI component is added to the registry, the "every component has a template" test will catch a missing code-gen template automatically.
- The E2E spec is deliberately minimal (smoke-level). M7 should expand it with class-editing scenarios once the style editor is more mature.
- The code-gen "no undefined references" test would have caught both the toast (plan 009) and menubar (plan 010) bugs.
