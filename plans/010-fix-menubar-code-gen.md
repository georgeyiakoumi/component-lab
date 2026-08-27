# Plan 010: Fix menubar code generator — use Menubar component instead of div

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 0085534..HEAD -- lib/base-ui-code-gen.ts`
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

The menubar preview renders using `<Menubar>` (the actual Base UI component), but the code generator emits `<div role="menubar">` — a plain HTML div. This means the preview and generated code have different structures. The preview includes Base UI's built-in menubar behavior (keyboard navigation, focus management), but the generated code loses all of that.

## Current state

- `lib/base-ui-previews.tsx:469-494` — preview uses the real Menubar component:
```tsx
menubar: (cm, pc) => (
    <Menubar className={cls(cm, "Root")}>
      <Menu.Root>
        <Menu.Trigger className={cls(cm, "Trigger")}>File</Menu.Trigger>
        ...
      </Menu.Root>
    </Menubar>
  ),
```

- `lib/base-ui-code-gen.ts:444-473` — code-gen uses a plain div:
```tsx
menubar: (cm, c) =>
    wrap(
      c,
      `    <div${cp(cm, "Root")} role="menubar">
      <Menu.Root>
        ...
      </Menu.Root>
    </div>`,
      `import { Menu } from "@base-ui/react/menu"`,
    ),
```

- The registry at `lib/base-ui-registry.ts` lists menubar with `importPath: "@base-ui/react/menubar"` and `additionalImports: ["@base-ui/react/menu"]`.

## Commands you will need

| Purpose   | Command                              | Expected on success |
|-----------|--------------------------------------|---------------------|
| Typecheck | `npm run typecheck`                  | exit 0, no errors   |
| Build     | `npm run build`                      | exit 0              |

## Scope

**In scope**:
- `lib/base-ui-code-gen.ts` — the menubar template (lines ~444-473)

**Out of scope**:
- `lib/base-ui-previews.tsx` — preview is correct, do not change
- `lib/base-ui-registry.ts` — registry is correct, do not change

## Steps

### Step 1: Update menubar template to use Menubar component

Change the menubar code-gen template to emit `<Menubar>` instead of `<div role="menubar">`. The `wrap()` function already generates the primary import from the registry (`import { Menubar } from "@base-ui/react/menubar"`). The extra import for Menu is passed as the third argument to `wrap()`.

The updated template should produce:
```tsx
import { Menubar } from "@base-ui/react/menubar"
import { Menu } from "@base-ui/react/menu"

export function MyMenubar() {
  return (
    <Menubar className="...">
      <Menu.Root>
        <Menu.Trigger className="...">File</Menu.Trigger>
        ...
      </Menu.Root>
    </Menubar>
  )
}
```

Replace `<div${cp(cm, "Root")} role="menubar">` with `<Menubar${cp(cm, "Root")}>` and the closing `</div>` with `</Menubar>`.

**Verify**: `npm run typecheck` → exit 0

### Step 2: Verify output

Run `npm run build` and manually check `/playground/base/menubar` — the code panel should show `<Menubar>` not `<div>`.

**Verify**: `npm run build` → exit 0

## Test plan

- No new test file for this plan (covered by plan 013).
- Manual verification: generated code matches preview structure.

## Done criteria

- [ ] `npm run typecheck` exits 0
- [ ] `npm run build` exits 0
- [ ] Generated menubar code uses `<Menubar>` not `<div role="menubar">`
- [ ] Generated code includes both `Menubar` and `Menu` imports
- [ ] No files outside in-scope list are modified

## STOP conditions

- The menubar template doesn't match the excerpt above.
- The `wrap()` helper or `imports()` function has changed.

## Maintenance notes

- Menubar is the only component where the code-gen used a different root element than the preview. If this pattern recurs, audit both files in lockstep.
