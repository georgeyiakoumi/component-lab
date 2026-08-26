# Plan 003: Enable React Strict Mode

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise.
>
> **Drift check (run first)**: `git diff --stat bbac9f4..HEAD -- next.config.ts`

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: MED
- **Depends on**: plans/002-fix-missing-effect-deps.md
- **Category**: bug
- **Planned at**: commit `bbac9f4`, 2026-08-26

## Why this matters

React Strict Mode is disabled (`reactStrictMode: false` in `next.config.ts:7`). Strict Mode intentionally double-invokes effects and renders in development to surface cleanup bugs, stale closures, and side-effect issues. Disabling it hides real bugs — including the kind fixed in Plan 002. Re-enabling it ensures future effect bugs are caught during development.

## Current state

`next.config.ts`:
```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
  },
  reactStrictMode: false,
}

export default nextConfig
```

## Commands you will need

| Purpose   | Command              | Expected on success |
|-----------|----------------------|---------------------|
| Typecheck | `npx tsc --noEmit`   | exit 0              |
| Tests     | `npm test`           | all pass            |
| Build     | `npm run build`      | exit 0              |

## Scope

**In scope**:
- `next.config.ts`

**Out of scope**:
- Any component files — if strict mode reveals warnings, those are separate issues to fix, not part of this plan.

## Git workflow

- Branch: `advisor/003-enable-strict-mode`
- Commit message style: `fix: <description>`
- Do NOT push or open a PR.

## Steps

### Step 1: Set reactStrictMode to true

Change line 7 of `next.config.ts` from `reactStrictMode: false` to `reactStrictMode: true`.

**Verify**: `grep 'reactStrictMode' next.config.ts` → `reactStrictMode: true`

### Step 2: Run build and tests

**Verify**: `npx tsc --noEmit` → exit 0
**Verify**: `npm test` → all pass
**Verify**: `npm run build` → exit 0

## Test plan

No new tests. Strict Mode only affects dev-mode behavior (double-renders). The build and existing tests confirm no breakage.

## Done criteria

- [ ] `grep 'reactStrictMode' next.config.ts` outputs `reactStrictMode: true`
- [ ] `npx tsc --noEmit` exits 0
- [ ] `npm run build` exits 0
- [ ] No files outside the in-scope list are modified

## STOP conditions

Stop and report back if:

- `next.config.ts` has changed since `bbac9f4`.
- Build fails after the change (unlikely but possible if a plugin depends on non-strict behavior).

## Maintenance notes

- Do not disable strict mode again without documenting why in a code comment.
- If strict mode surfaces console warnings in dev, those are real bugs worth fixing — file them as separate issues.
