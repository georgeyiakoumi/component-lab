# Plan 012: Debounce Shiki syntax highlighting in code panel

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 0085534..HEAD -- components/playground/code-panel.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: 011 (error handling should land first so both patches apply to the same code)
- **Category**: perf
- **Planned at**: commit `0085534`, 2026-08-27

## Why this matters

Every classMap change in the style editor triggers `generateBaseUICode()` → new source string → Shiki `codeToHtml()`. Shiki's highlighting is CPU-intensive (tokenization + HTML generation). During rapid editing (e.g., typing a color class like `bg-primary`), the effect fires on every intermediate value (`b`, `bg`, `bg-`, `bg-p`, ...), causing unnecessary work and potential jank.

## Current state

- `components/playground/code-panel.tsx:71-109` — the highlighting effect:
```tsx
React.useEffect(() => {
  let cancelled = false
  setIsLoading(true)

  async function highlight() {
    const { codeToHtml } = await import("shiki/bundle/web")
    const html = await codeToHtml(code, { ... })
    if (!cancelled) {
      setHighlightedHtml(html)
      setIsLoading(false)
    }
  }

  highlight()
  return () => { cancelled = true }
}, [code, language])
```

The `cancelled` flag prevents stale results but doesn't prevent the work from starting. Each keystroke kicks off a new import + tokenize + render cycle.

## Commands you will need

| Purpose   | Command                              | Expected on success |
|-----------|--------------------------------------|---------------------|
| Typecheck | `npm run typecheck`                  | exit 0, no errors   |
| Build     | `npm run build`                      | exit 0              |

## Scope

**In scope**:
- `components/playground/code-panel.tsx` — the highlighting effect only

**Out of scope**:
- The `code` prop generation in `base-ui-dashboard.tsx` — that's already memoized
- Shiki configuration or theme

## Steps

### Step 1: Add debounce to the highlighting effect

Add a `setTimeout` delay (300ms) before calling `highlight()`. Clear the timeout on cleanup (alongside the `cancelled` flag). This ensures Shiki only runs after the user pauses typing.

The pattern:
```tsx
React.useEffect(() => {
  let cancelled = false

  const timer = setTimeout(() => {
    setIsLoading(true)

    async function highlight() {
      // ... existing try-catch from plan 011
    }

    highlight()
  }, 300)

  return () => {
    cancelled = true
    clearTimeout(timer)
  }
}, [code, language])
```

Key: `setIsLoading(true)` moves inside the timeout so the skeleton doesn't flash during the debounce window. The previous highlighted HTML stays visible until the new one is ready.

**Verify**: `npm run typecheck` → exit 0

### Step 2: Build and verify

**Verify**: `npm run build` → exit 0

Manual test: open `/playground/base/menubar`, select a part, type rapidly in the raw class input. The code panel should NOT flash/flicker on every keystroke — it should update ~300ms after you stop typing.

## Test plan

- No automated test — debounce timing is best verified interactively.
- Manual: rapid class edits should feel smooth, code panel updates after a brief pause.

## Done criteria

- [ ] `npm run typecheck` exits 0
- [ ] `npm run build` exits 0
- [ ] Shiki highlighting is debounced (300ms delay)
- [ ] Previous highlighted HTML remains visible during debounce window (no skeleton flash)
- [ ] No files outside in-scope list are modified

## STOP conditions

- The effect structure doesn't match the excerpt (especially if plan 011's error handling changed the shape significantly).
- A step's verification fails twice.

## Maintenance notes

- The 300ms value is a balance between responsiveness and performance. If users report sluggish feedback, reduce to 150ms. If highlighting is still janky on complex components, increase to 500ms.
- An alternative approach is `React.useDeferredValue(code)` — this would let React schedule the highlight at lower priority without an explicit timer. Consider this if the setTimeout approach feels wrong.
