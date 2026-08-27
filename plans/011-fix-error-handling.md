# Plan 011: Add error handling to Shiki highlighting and clipboard copy

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

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `0085534`, 2026-08-27

## Why this matters

Two unhandled async operations in the code panel:

1. **Shiki highlighting** (`highlight()` at line 105) — if the dynamic import or `codeToHtml()` fails, the promise rejects silently. The user sees an infinite loading skeleton with no way to recover. This can happen if Shiki's WASM bundle fails to load (network issue, CSP block).

2. **Clipboard copy** (`handleCopy` at line 111) — if `navigator.clipboard.writeText()` fails (non-HTTPS, permission denied), the promise rejects silently. The user thinks the copy succeeded.

## Current state

- `components/playground/code-panel.tsx:71-109` — Shiki effect:
```tsx
async function highlight() {
  const { codeToHtml } = await import("shiki/bundle/web")
  const html = await codeToHtml(code, { ... })
  if (!cancelled) {
    setHighlightedHtml(html)
    setIsLoading(false)
  }
}
highlight()  // no .catch(), no try-catch
```

- `components/playground/code-panel.tsx:111-115` — clipboard:
```tsx
const handleCopy = React.useCallback(async () => {
  await navigator.clipboard.writeText(code)  // no try-catch
  setCopied(true)
  setTimeout(() => setCopied(false), 2000)
}, [code])
```

- The component already has `isLoading` state. There is no error state.

## Commands you will need

| Purpose   | Command                              | Expected on success |
|-----------|--------------------------------------|---------------------|
| Typecheck | `npm run typecheck`                  | exit 0, no errors   |
| Build     | `npm run build`                      | exit 0              |

## Scope

**In scope**:
- `components/playground/code-panel.tsx`

**Out of scope**:
- Any other component file

## Steps

### Step 1: Add error state and wrap Shiki highlight in try-catch

Add a `hasError` state (boolean, default false). Wrap the `highlight()` function body in a try-catch. On error:
- Set `hasError` to true
- Set `isLoading` to false
- `console.error` the error for debugging

Reset `hasError` to false at the start of each effect run (before `highlight()`).

In the render, when `hasError` is true, show the raw `code` as plain text (monospace, white on dark) with a small "Highlighting failed" label — instead of the skeleton or highlighted HTML. This way the user still sees the code.

**Verify**: `npm run typecheck` → exit 0

### Step 2: Wrap clipboard copy in try-catch

Wrap the `navigator.clipboard.writeText(code)` call in a try-catch. On failure, `console.error` the error. Do not set `setCopied(true)` on failure — the user should see no feedback (or optionally a brief error indicator, but keeping it simple is fine).

**Verify**: `npm run typecheck` → exit 0

### Step 3: Build and verify

**Verify**: `npm run build` → exit 0

## Test plan

- No automated test needed — these are defensive error paths triggered by browser/network failures.
- Manual verification: temporarily throw inside `highlight()` to confirm the fallback renders plain code.

## Done criteria

- [ ] `npm run typecheck` exits 0
- [ ] `npm run build` exits 0
- [ ] Shiki `highlight()` is wrapped in try-catch with error state
- [ ] Clipboard `handleCopy` is wrapped in try-catch
- [ ] Error state shows raw code as fallback (not infinite skeleton)
- [ ] No files outside in-scope list are modified

## STOP conditions

- The code-panel.tsx structure doesn't match the excerpts above.
- The Shiki import path or API has changed.

## Maintenance notes

- If Shiki is upgraded or swapped for another highlighter, the error handling pattern should be preserved.
- The `hasError` fallback (plain code) is intentionally minimal — a future enhancement could add a "Retry" button.
