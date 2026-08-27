# Component Lab

A visual workspace for styling [Base UI](https://base-ui.com) components with Tailwind CSS. Browse all 37 Base UI primitives, apply styles per-part, preview interactive states, and export production-ready `.tsx` files.

Live at [comp-lab.netlify.app](https://comp-lab.netlify.app)

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 |
| Components | Base UI (`@base-ui/react`) |
| Icons | Lucide React |
| Syntax highlighting | Shiki |
| Deployment | Netlify |

---

## Features

- **37 Base UI components** — full registry with parts, data attributes, and nesting hierarchy
- **Per-part styling** — select any part of a compound component and apply Tailwind classes independently
- **State preview** — toggle data attributes (checked, disabled, open, etc.) to see state-based styles
- **Live code generation** — code panel updates in real-time as you style, with correct Base UI imports
- **Tab-based navigation** — open multiple components as tabs, state persists across sessions
- **Export dialog** — rename, copy, or download styled components as `.tsx` files
- **Component outline** — tree view showing the component's part hierarchy with Figma-inspired icons

---

## Testing

```bash
npm run typecheck    # TypeScript strict check
npm run test         # Vitest unit tests
npm run test:e2e     # Playwright E2E tests
```

---

## Deployment

Configured for Netlify via `netlify.toml`. Auto-deploys on merge to `main`.

---

## License

MIT
