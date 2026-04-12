import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center gap-4 px-8 pt-32 pb-16 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Component Lab
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Browse, inspect, and build shadcn/ui components visually — then
          export production-ready code.
        </p>
      </section>

      {/* ── Features (placeholder) ────────────────────────────── */}
      <section className="flex flex-col items-center gap-8 px-8 py-16">
        {/* Features will go here */}
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="flex flex-col items-center gap-4 px-8 py-16">
        <Button asChild size="lg">
          <Link href="/playground">
            Launch Component Lab
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="mt-auto py-6 text-center text-xs text-muted-foreground">
        Built with{" "}
        <a href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">shadcn/ui</a>
        {" · "}
        <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">Next.js</a>
        {" · "}
        <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">Tailwind CSS</a>
        {" · "}
        <a href="https://www.radix-ui.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">Radix</a>
        {" · "}
        <a href="https://lucide.dev" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">Lucide</a>
        {" · "}
        <a href="https://shiki.style" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">Shiki</a>
      </footer>
    </main>
  )
}
