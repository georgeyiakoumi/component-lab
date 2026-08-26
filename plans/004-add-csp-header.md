# Plan 004: Add Content Security Policy header

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise.
>
> **Drift check (run first)**: `git diff --stat bbac9f4..HEAD -- netlify.toml`

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: security
- **Planned at**: commit `bbac9f4`, 2026-08-26

## Why this matters

The Netlify deployment has security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) but is missing a Content Security Policy (CSP) header. CSP is the primary defense-in-depth against XSS — it tells the browser which sources of scripts, styles, and other resources are trusted. Without CSP, any injected script runs unrestricted.

## Current state

`netlify.toml` lines 27-34:
```toml
# ── Headers ───────────────────────────────────────────────────
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
```

The app uses:
- Next.js (inline scripts for hydration — requires `'unsafe-inline'` or nonces)
- Shiki (dynamic import from same origin)
- No external script sources
- No external font CDNs (Geist is bundled via `geist` npm package)
- No external API calls from the client (parser API is same-origin)

## Commands you will need

| Purpose | Command            | Expected on success |
|---------|--------------------|---------------------|
| Build   | `npm run build`    | exit 0              |

## Scope

**In scope**:
- `netlify.toml`

**Out of scope**:
- Any application code
- Next.js middleware (CSP via headers config is sufficient for Netlify)

## Git workflow

- Branch: `advisor/004-add-csp-header`
- Commit message style: `feat: <description>`
- Do NOT push or open a PR.

## Steps

### Step 1: Add CSP header to netlify.toml

Add the `Content-Security-Policy` line to the existing `[headers.values]` section:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'"
```

Notes on each directive:
- `default-src 'self'` — only same-origin by default
- `script-src 'self' 'unsafe-inline' 'unsafe-eval'` — Next.js requires inline scripts for hydration; `unsafe-eval` may be needed for shiki's WASM
- `style-src 'self' 'unsafe-inline'` — Tailwind injects styles inline
- `img-src 'self' data: blob:` — allows data URIs and blob URLs for component previews
- `font-src 'self' data:` — Geist font is bundled, may use data URIs
- `connect-src 'self'` — API calls are same-origin only
- `frame-ancestors 'none'` — matches X-Frame-Options: DENY

**Verify**: `grep 'Content-Security-Policy' netlify.toml` → shows the CSP line

### Step 2: Verify build still succeeds

**Verify**: `npm run build` → exit 0

## Test plan

No automated test can verify CSP in CI without a deployed environment. The verification is:
1. After deployment, open Chrome DevTools → Network tab → check response headers include the CSP
2. Open Console → confirm no CSP violation errors on page load or component editing

This is a manual post-deploy check, not an automated test.

## Done criteria

- [ ] `grep 'Content-Security-Policy' netlify.toml` returns the CSP line
- [ ] `npm run build` exits 0
- [ ] No files outside the in-scope list are modified

## STOP conditions

Stop and report back if:

- `netlify.toml` has changed since `bbac9f4`.
- The CSP syntax is invalid (TOML parsing error on build).

## Maintenance notes

- If external scripts/fonts/APIs are added in the future, update the CSP directives accordingly.
- The current CSP uses `'unsafe-inline'` and `'unsafe-eval'` which weaken the policy. To tighten it, Next.js supports nonce-based CSP via middleware — but that's a separate, more complex task.
- When Supabase auth is added in M5, add the Supabase project URL to `connect-src`.
