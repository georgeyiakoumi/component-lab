# shadcn-component-playground

**Type:** Web app
**Stack:** Next.js · shadcn/ui · Tailwind CSS · Supabase · Netlify

---

## Getting started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

After the script runs, open `.env.local` and fill in your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Find these in your Supabase project under **Settings → API**.

---

## Deployment

Configured for Netlify via `netlify.toml`. To connect:

1. Push the repo to GitHub
2. Go to [netlify.com](https://netlify.com) → Add new site → Import from GitHub
3. Select the repo — build settings are pre-configured
4. Add environment variables in **Site → Environment variables**
5. Deploy

---

## Repo structure

```
├── CLAUDE.md
├── .claude/
│   ├── project-setup.md
│   ├── design-psychology.md
│   ├── ui-standards.md
│   └── ux-process.md
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/ui/
├── lib/
│   ├── utils.ts
│   └── supabase/
│       ├── client.ts
│       └── server.ts
├── supabase/
│   └── config.toml
├── public/
├── .env.example
├── netlify.toml
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Adding shadcn components

```bash
npx shadcn add button
npx shadcn add card dialog select table tabs
```

Components land in `components/ui/` and inherit your brand tokens automatically.

---

## Applying your brand

**`app/globals.css`** — update the HSL values for `--primary`, `--accent`, `--radius`, and any other shadcn tokens.

**`tailwind.config.ts`** — update `fontFamily.sans` to your chosen typeface. Add the font import to `layout.tsx` using `next/font`.

Both light (`:root`) and dark (`.dark`) variants are pre-wired. Update both when changing colours.
