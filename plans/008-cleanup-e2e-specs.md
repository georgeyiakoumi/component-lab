# Plan 008: Clean up deferred E2E specs

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise.
>
> **Drift check (run first)**: `git diff --stat bbac9f4..HEAD -- e2e/`

## Status

- **Priority**: P3
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: tests
- **Planned at**: commit `bbac9f4`, 2026-08-26

## Why this matters

Four E2E specs have TODO comments indicating they need rewriting or deletion. They reduce CI signal — either they pass despite testing stale UI surfaces (false confidence) or they test nothing meaningful (dead weight). Cleaning them up ensures the E2E suite reflects the actual product surface.

## Current state

Each of these files has a TODO comment near the top referencing a cleanup follow-up:

1. `e2e/edit-export.spec.ts:21` — TODO to rewrite or delete
2. `e2e/mode-toggle.spec.ts:17` — TODO to rewrite or delete
3. `e2e/edit-features.spec.ts:27` — TODO to rewrite or delete
4. `e2e/parser-v2.spec.ts:20` — TODO to rewrite or delete

The healthy specs to use as a pattern are `e2e/homepage.spec.ts`, `e2e/playground.spec.ts`, and `e2e/creation.spec.ts`.

## Commands you will need

| Purpose   | Command                      | Expected on success |
|-----------|------------------------------|---------------------|
| E2E tests | `npx playwright test`        | all pass            |
| Single    | `npx playwright test e2e/X`  | pass                |

## Scope

**In scope**:
- `e2e/edit-export.spec.ts`
- `e2e/mode-toggle.spec.ts`
- `e2e/edit-features.spec.ts`
- `e2e/parser-v2.spec.ts`

**Out of scope**:
- All other E2E specs
- Any application code

## Git workflow

- Branch: `advisor/008-cleanup-e2e-specs`
- Commit message style: `test: <description>`
- Do NOT push or open a PR.

## Steps

### Step 1: Read each spec and assess

For each of the four specs:
1. Read the full file
2. Determine: does the test navigate to a URL that still exists? Does it interact with UI elements that still exist?
3. If the test is genuinely dead (tests a removed feature or uses selectors that don't match anything), delete the file.
4. If the test is stale but the feature it tests still exists, rewrite it to match the current UI surface. Use `e2e/playground.spec.ts` as the pattern for selectors, navigation, and assertion style.

**Verify**: After each spec is deleted or rewritten, run `npx playwright test e2e/<file>` → pass (or confirm deletion)

### Step 2: Run full E2E suite

**Verify**: `npx playwright test` → all pass

## Test plan

This plan IS a test cleanup. The deliverable is a passing E2E suite with no TODO-marked dead specs.

## Done criteria

- [ ] `grep -rn 'TODO.*rewrite\|TODO.*delete\|TODO.*cleanup' e2e/` returns no matches
- [ ] `npx playwright test` exits 0 with all tests passing
- [ ] No files outside the in-scope list are modified

## STOP conditions

Stop and report back if:

- Any E2E spec file has changed since `bbac9f4`.
- A spec tests a feature you cannot identify in the current UI — ask rather than guess what it should test.
- The dev server fails to start for E2E tests.

## Maintenance notes

- New E2E specs should follow the pattern in `e2e/playground.spec.ts` — navigate, interact, assert visible text or state.
- Never leave TODO comments in test files — either the test works or it doesn't exist.
