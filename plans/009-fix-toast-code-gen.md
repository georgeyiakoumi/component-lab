# Plan 009: Fix toast code generator — inline helper components

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

The toast component's generated code references `<ToastTrigger />` and `<ToastList />` — components that are defined in `lib/base-ui-previews.tsx` but are NOT included in the generated output. Users who copy the code get immediate `ToastTrigger is not defined` errors. Every other component generates runnable code; toast is the only one broken.

## Current state

- `lib/base-ui-code-gen.ts:614-625` — toast template:
```tsx
toast: (cm, c) =>
    wrap(
      c,
      `    <Toast.Provider>
      <ToastTrigger />
      <Toast.Portal>
        <Toast.Viewport${cp(cm, "Viewport")}>
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>`,
    ),
```

- `lib/base-ui-previews.tsx:72-101` — the helper components that only exist in the preview file:
```tsx
function ToastTrigger() {
  const manager = Toast.useToastManager()
  return (
    <button onClick={() => manager.add({ title: "Saved", description: "..." })}>
      Show toast
    </button>
  )
}
function ToastList({ cm }: { cm: ClassMap }) {
  const manager = Toast.useToastManager()
  return (
    <>
      {manager.toasts.map((toast) => (
        <Toast.Root key={toast.id} toast={toast} className={cls(cm, "Root")}>
          ...
        </Toast.Root>
      ))}
    </>
  )
}
```

- Repo conventions: code-gen templates use template literals with `cp(cm, "Part")` for className interpolation. The `wrap()` helper produces `import + export function MyX() { return (...) }`. See `lib/base-ui-code-gen.ts:56-58` (button template) for the simplest example.

## Commands you will need

| Purpose   | Command                              | Expected on success |
|-----------|--------------------------------------|---------------------|
| Typecheck | `npm run typecheck`                  | exit 0, no errors   |
| Tests     | `npm run test`                       | all pass            |
| Build     | `npm run build`                      | exit 0              |

## Scope

**In scope**:
- `lib/base-ui-code-gen.ts` — the toast template (lines ~614-625)

**Out of scope**:
- `lib/base-ui-previews.tsx` — the preview renderer is correct; do not change it
- Any other component's template

## Steps

### Step 1: Replace toast template with inline JSX

Replace the toast template so it includes the helper component definitions inline in the generated code. The generated output should look like a self-contained component file with `Toast.useToastManager()` usage.

The new template should generate code like:
```tsx
import { Toast } from "@base-ui/react/toast"

function ToastTrigger() {
  const manager = Toast.useToastManager()
  return (
    <button onClick={() => manager.add({ title: "Saved", description: "Your changes have been saved." })}>
      Show toast
    </button>
  )
}

function ToastList() {
  const manager = Toast.useToastManager()
  return (
    <>
      {manager.toasts.map((toast) => (
        <Toast.Root key={toast.id} toast={toast} className="...">
          <Toast.Content className="...">
            <div className="flex-1">
              <Toast.Title className="..." />
              <Toast.Description className="..." />
            </div>
            <Toast.Close className="...">&times;</Toast.Close>
          </Toast.Content>
        </Toast.Root>
      ))}
    </>
  )
}

export function MyToast() {
  return (
    <Toast.Provider>
      <ToastTrigger />
      <Toast.Portal>
        <Toast.Viewport className="...">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  )
}
```

Apply the user's classMap via `cp(cm, "Root")`, `cp(cm, "Content")`, etc. on the relevant parts. Use the `wrap()` helper but prepend the helper function definitions before the export.

**Verify**: `npm run typecheck` → exit 0

### Step 2: Verify the generated output is valid

Open the dev server (`npm run dev`), navigate to `/playground/base/toast`, and confirm the code panel shows:
- `import { Toast } from "@base-ui/react/toast"` at the top
- `ToastTrigger` and `ToastList` function definitions before the export
- All `className` props populated from the default classMap

**Verify**: `npm run build` → exit 0

## Test plan

- No new test file needed for this plan (covered by plan 013).
- Manual verification: copy the generated code into a standalone file, confirm no `undefined` references.

## Done criteria

- [ ] `npm run typecheck` exits 0
- [ ] `npm run build` exits 0
- [ ] Generated code for toast includes `ToastTrigger` and `ToastList` definitions
- [ ] Generated code has no references to undefined components
- [ ] No files outside in-scope list are modified

## STOP conditions

- The toast template at `lib/base-ui-code-gen.ts:614-625` doesn't match the excerpt above.
- The `wrap()` helper signature has changed.
- A step's verification fails twice after a reasonable fix attempt.

## Maintenance notes

- If Base UI changes the Toast API (e.g., removes `useToastManager`), both the preview renderer AND this template must be updated in lockstep.
- The toast is the only component that requires helper sub-components in the generated code. If another component needs the same pattern, consider extracting a shared "helpers prefix" mechanism in the `wrap()` function.
