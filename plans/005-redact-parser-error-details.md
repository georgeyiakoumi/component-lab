# Plan 005: Redact internal parser error details from API responses

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise.
>
> **Drift check (run first)**: `git diff --stat bbac9f4..HEAD -- app/api/parse/\[slug\]/route.ts`

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: security
- **Planned at**: commit `bbac9f4`, 2026-08-26

## Why this matters

The `/api/parse/[slug]` endpoint returns full `ParserError` details to the client — `filePath`, `line`, `column`, `reason`, `nodeKind`. While the repo is open-source (low actual risk), returning internal paths and implementation details in API responses is against defensive practices. The client only needs to know the parse failed and display a user-friendly message.

## Current state

`app/api/parse/[slug]/route.ts` lines 68-86:
```ts
  } catch (err) {
    if (err instanceof ParserError) {
      return NextResponse.json(
        {
          error: "ParserError",
          filePath: err.filePath,
          line: err.line,
          column: err.column,
          reason: err.reason,
          nodeKind: err.nodeKind,
        },
        { status: 422 },
      )
    }
    return NextResponse.json(
      { error: (err as Error).message ?? "Unknown parser failure" },
      { status: 500 },
    )
  }
```

## Commands you will need

| Purpose   | Command              | Expected on success |
|-----------|----------------------|---------------------|
| Typecheck | `npx tsc --noEmit`   | exit 0              |
| Tests     | `npm test`           | all pass            |

## Scope

**In scope**:
- `app/api/parse/[slug]/route.ts` (the catch block only, lines 68-86)

**Out of scope**:
- `lib/parser/parser-error.ts` — the error class itself is fine
- Any client-side code that consumes this API

## Git workflow

- Branch: `advisor/005-redact-parser-errors`
- Commit message style: `fix: <description>`
- Do NOT push or open a PR.

## Steps

### Step 1: Replace detailed ParserError response with a generic one

Change the catch block (lines 68-86) to:

```ts
  } catch (err) {
    if (err instanceof ParserError) {
      console.error("[parse] ParserError:", {
        filePath: err.filePath,
        line: err.line,
        column: err.column,
        reason: err.reason,
        nodeKind: err.nodeKind,
      })
      return NextResponse.json(
        { error: "ParserError", reason: err.reason },
        { status: 422 },
      )
    }
    console.error("[parse] Unexpected error:", err)
    return NextResponse.json(
      { error: "Internal parser failure" },
      { status: 500 },
    )
  }
```

Notes:
- `reason` is kept in the response because the client may display it as a user-facing message ("unsupported component pattern"). It does not leak internal paths.
- `filePath`, `line`, `column`, `nodeKind` are logged server-side only.
- The generic 500 error no longer exposes `(err as Error).message`.

**Verify**: `npx tsc --noEmit` → exit 0

### Step 2: Check that client-side consumers don't depend on removed fields

Search for any client code reading `filePath`, `line`, `column`, or `nodeKind` from the parse API response:

**Verify**: `grep -rn 'filePath\|\.line\|\.column\|nodeKind' app/playground/ components/playground/` — if any results reference the parse API response fields, those need updating (add to STOP conditions).

### Step 3: Run tests

**Verify**: `npm test` → all pass

## Test plan

No new tests. The API route is exercised by E2E tests (`e2e/parser-v2.spec.ts`). If that spec tests error responses, it may need updating — but per the audit, that spec is marked for rewrite (TODO), so any failure there is expected.

## Done criteria

- [ ] `npx tsc --noEmit` exits 0
- [ ] `npm test` exits 0
- [ ] `grep -n 'err.filePath' app/api/parse/\[slug\]/route.ts` returns no matches
- [ ] The 422 response still includes `error` and `reason` fields
- [ ] No files outside the in-scope list are modified

## STOP conditions

Stop and report back if:

- `app/api/parse/[slug]/route.ts` has changed since `bbac9f4`.
- Client code in `app/playground/` directly reads `filePath`, `line`, `column`, or `nodeKind` from the parse API response — those consumers need updating first.

## Maintenance notes

- When adding new error types to the API, always log details server-side and return only user-facing fields to the client.
- If structured error reporting is needed for a debugger/inspector feature, gate it behind a `?debug=1` query param that only works in development.
