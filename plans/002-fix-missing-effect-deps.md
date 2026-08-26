# Plan 002: Fix missing useEffect dependency arrays

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat bbac9f4..HEAD -- components/playground/unified-dashboard.tsx app/playground/custom/\[slug\]/page.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: MED
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `bbac9f4`, 2026-08-26

## Why this matters

Two React effects have incorrect or missing dependency arrays, causing unnecessary re-runs and potential stale closure bugs:

1. **unified-dashboard.tsx:157** — useEffect with NO dependency array runs every render. The ref guard prevents repeated state updates, but the effect body still executes on every render unnecessarily.

2. **custom/[slug]/page.tsx:112-128** — Autosave effect captures `userComponent` and `isDirty` in a setTimeout closure but omits them from the dependency array (hidden behind `eslint-disable`). If `userComponent` changes between effect setup and timer execution, the save writes stale data.

## Current state

### unified-dashboard.tsx (lines 156-162)

```tsx
  // Initialise code panel width to 35% of container on mount
  React.useEffect(() => {
    if (!codePanelInitialised.current && contentRef.current) {
      codePanelInitialised.current = true
      setCodePanelWidth(Math.round(contentRef.current.offsetWidth * 0.35))
    }
  })
```

The effect is meant to run once on mount. Missing `[]` dependency array.

### custom/[slug]/page.tsx (lines 112-128)

```tsx
  React.useEffect(() => {
    if (!userComponent || !isDirty) return
    const timer = setTimeout(() => {
      const updated = {
        ...userComponent,
        name: tree?.name ?? userComponent.name,
        source,
        treeV2: tree ?? undefined,
        updatedAt: new Date().toISOString(),
      }
      saveUserComponent(updated)
      setUserComponent(updated)
      setIsDirty(false)
    }, 1000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, tree])
```

The closure captures `userComponent` and `isDirty` but deps are only `[source, tree]`. The eslint-disable hides this.

### custom/[slug]/page.tsx (lines 79-92) — two load effects

```tsx
  React.useEffect(() => {
    loadFromStore(slug)
    const uc = getUserComponent(slug)
    setMode(uc?.treeV2 ? "define" : "inspect")
    setMounted(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  // Reload from store when slug changes after mount
  React.useEffect(() => {
    if (!mounted) return
    loadFromStore(slug)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])
```

`loadFromStore` is defined inline (not memoized), causing the eslint warning. These two effects also overlap — both run on `slug` change and both call `loadFromStore(slug)`.

## Commands you will need

| Purpose   | Command                                          | Expected on success |
|-----------|--------------------------------------------------|---------------------|
| Typecheck | `npx tsc --noEmit`                               | exit 0, no errors   |
| Tests     | `npm test`                                       | all pass            |
| Lint      | `npx next lint`                                  | exit 0              |

## Scope

**In scope**:
- `components/playground/unified-dashboard.tsx` (line 157-162 only)
- `app/playground/custom/[slug]/page.tsx` (lines 79-128 only)

**Out of scope**:
- Any other files
- The visual editor rendering logic
- The autosave persistence logic itself (only fixing the effect deps)

## Git workflow

- Branch: `advisor/002-fix-effect-deps`
- Commit message style: `fix: <description>`
- Do NOT push or open a PR.

## Steps

### Step 1: Add empty dependency array to unified-dashboard.tsx

At line 157-162, add `[]` as the dependency array:

```tsx
  React.useEffect(() => {
    if (!codePanelInitialised.current && contentRef.current) {
      codePanelInitialised.current = true
      setCodePanelWidth(Math.round(contentRef.current.offsetWidth * 0.35))
    }
  }, [])
```

**Verify**: `npx tsc --noEmit` → exit 0

### Step 2: Fix autosave effect in custom/[slug]/page.tsx

For the autosave effect (lines 112-128), use refs for `userComponent` and `isDirty` so the timeout always reads current values without needing them in the dependency array:

1. Add two refs near the top of the component (after the existing state declarations):
```tsx
const userComponentRef = React.useRef(userComponent)
React.useEffect(() => { userComponentRef.current = userComponent }, [userComponent])

const isDirtyRef = React.useRef(isDirty)
React.useEffect(() => { isDirtyRef.current = isDirty }, [isDirty])
```

2. Rewrite the autosave effect to read from refs inside the timeout, and remove the eslint-disable:
```tsx
  React.useEffect(() => {
    if (!userComponentRef.current || !isDirtyRef.current) return
    const timer = setTimeout(() => {
      const uc = userComponentRef.current
      if (!uc || !isDirtyRef.current) return
      const updated = {
        ...uc,
        name: tree?.name ?? uc.name,
        source,
        treeV2: tree ?? undefined,
        updatedAt: new Date().toISOString(),
      }
      saveUserComponent(updated)
      setUserComponent(updated)
      setIsDirty(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [source, tree])
```

**Verify**: `npx tsc --noEmit` → exit 0

### Step 3: Consolidate the two load effects in custom/[slug]/page.tsx

Lines 79-92 have two effects that both trigger on `[slug]` and both call `loadFromStore(slug)`. Merge them into one and remove both eslint-disable comments:

```tsx
  React.useEffect(() => {
    loadFromStore(slug)
    if (!mounted) {
      const uc = getUserComponent(slug)
      setMode(uc?.treeV2 ? "define" : "inspect")
      setMounted(true)
    }
    // loadFromStore and getUserComponent are stable module-level functions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])
```

Note: one eslint-disable remains because `loadFromStore` is defined inline in the component and `mounted` is state. This is acceptable — the comment is now honest about what it's suppressing. If you want to eliminate it entirely, extract `loadFromStore` to a `useCallback` with `[slug]` deps. But that's a deeper refactor — the merged effect is the safe fix.

**Verify**: `npx tsc --noEmit` → exit 0

### Step 4: Run full verification

**Verify**: `npm test` → all pass
**Verify**: `npx next lint` → exit 0

## Test plan

No new unit tests — these are React effect fixes. The existing E2E tests (`e2e/playground.spec.ts`, `e2e/creation.spec.ts`) exercise the custom component flow including autosave. Run them to confirm no regression:

**Verify**: `npx playwright test e2e/playground.spec.ts e2e/creation.spec.ts` → all pass

## Done criteria

- [ ] `npx tsc --noEmit` exits 0
- [ ] `npm test` exits 0
- [ ] `grep -n 'React.useEffect(() => {' components/playground/unified-dashboard.tsx` shows the effect has `}, [])` (not missing dep array)
- [ ] The autosave effect in `app/playground/custom/[slug]/page.tsx` no longer has `userComponent` or `isDirty` in a stale closure
- [ ] No files outside the in-scope list are modified

## STOP conditions

Stop and report back if:

- Either in-scope file has changed since `bbac9f4`.
- Merging the two load effects causes the component to break on initial mount (test by navigating to `/playground/custom/button`).
- The autosave effect triggers an infinite re-render loop after the ref change.

## Maintenance notes

- If new state is added to the autosave effect, use the ref pattern — don't add it directly to the dependency array.
- The `loadFromStore` function is defined inline; if it's ever memoized with `useCallback`, the eslint-disable can be removed.
