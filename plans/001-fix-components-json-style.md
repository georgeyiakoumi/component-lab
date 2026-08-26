# Plan 001: Fix components.json style field to match project convention

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat bbac9f4..HEAD -- components.json`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `bbac9f4`, 2026-08-26

## Why this matters

`components.json` declares `"style": "default"`, but the project convention (documented in CLAUDE.md and README.md) is `new-york`. When anyone runs `npx shadcn add <component>`, the CLI reads this field and installs the wrong component variant. The 55 round-trip fidelity tests enforce byte-equivalence against existing components, so a wrong-style component would silently break CI or produce mismatched UI.

## Current state

- `components.json:3` currently reads: `"style": "default"`
- CLAUDE.md line 12 says: `shadcn/ui (new-york style)`
- README.md line 26 says: `shadcn/ui (new-york-v4)`

Full file:
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

## Commands you will need

| Purpose   | Command              | Expected on success |
|-----------|----------------------|---------------------|
| Typecheck | `npx tsc --noEmit`   | exit 0, no errors   |
| Tests     | `npm test`           | all pass            |
| Build     | `npm run build`      | exit 0              |

## Scope

**In scope**:
- `components.json`

**Out of scope**:
- Any `components/ui/*.tsx` files — do NOT touch existing components.

## Git workflow

- Branch: `advisor/001-fix-components-json-style`
- Commit message style: `fix: <description>` (conventional commits — see `git log --oneline -5`)
- Do NOT push or open a PR.

## Steps

### Step 1: Update the style field

Change `"style": "default"` to `"style": "new-york"` in `components.json` line 3.

**Verify**: `cat components.json | grep '"style"'` → `"style": "new-york"`

### Step 2: Run typecheck

**Verify**: `npx tsc --noEmit` → exit 0

### Step 3: Run unit tests

**Verify**: `npm test` → all pass

## Test plan

No new tests needed — this is a metadata-only change. Existing round-trip tests serve as regression coverage.

## Done criteria

- [ ] `cat components.json | grep '"style"'` outputs `"style": "new-york"`
- [ ] `npx tsc --noEmit` exits 0
- [ ] `npm test` exits 0
- [ ] No files outside the in-scope list are modified (`git diff --name-only`)

## STOP conditions

Stop and report back if:

- `components.json` has changed since commit `bbac9f4`.
- The style value is already `"new-york"` (already fixed).

## Maintenance notes

- If shadcn/ui changes style naming conventions in future versions, update this field to match.
- The `components.json` style must always match what CLAUDE.md declares.
