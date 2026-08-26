"use client"

import { Switch } from "@base-ui/react/switch"
import { Checkbox } from "@base-ui/react/checkbox"
import { Toggle } from "@base-ui/react/toggle"
import { Slider } from "@base-ui/react/slider"
import { Accordion } from "@base-ui/react/accordion"

/**
 * GEO-843 — Base UI integration smoke test.
 *
 * Renders several Base UI components with Tailwind classes to verify:
 * 1. @base-ui/react works with Next.js 15 App Router
 * 2. Tailwind v4 classes apply correctly via className prop
 * 3. Data-attribute state styling works (data-[checked], data-[pressed], etc.)
 * 4. Interactive states function (toggle, check, slide)
 *
 * This page is temporary — delete after M6 is confirmed working.
 */
export default function BaseTestPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-12 bg-background p-8">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Base UI Integration Test
      </h1>

      {/* ── Switch ──────────────────────────────────────────── */}
      <section className="flex flex-col items-center gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Switch</h2>
        <Switch.Root className="relative flex h-6 w-11 cursor-pointer rounded-full bg-muted transition-colors data-[checked]:bg-primary">
          <Switch.Thumb className="block h-5 w-5 translate-x-0.5 translate-y-0.5 rounded-full bg-white shadow-sm transition-transform data-[checked]:translate-x-[22px]" />
        </Switch.Root>
      </section>

      {/* ── Checkbox ────────────────────────────────────────── */}
      <section className="flex flex-col items-center gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Checkbox</h2>
        <Checkbox.Root className="flex h-5 w-5 items-center justify-center rounded border border-border bg-background transition-colors data-[checked]:border-primary data-[checked]:bg-primary">
          <Checkbox.Indicator className="text-white text-xs">
            &#10003;
          </Checkbox.Indicator>
        </Checkbox.Root>
      </section>

      {/* ── Toggle ──────────────────────────────────────────── */}
      <section className="flex flex-col items-center gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Toggle</h2>
        <Toggle className="inline-flex h-9 items-center justify-center rounded-md border border-border px-3 text-sm font-medium transition-colors hover:bg-accent data-[pressed]:bg-primary data-[pressed]:text-primary-foreground">
          Bold
        </Toggle>
      </section>

      {/* ── Slider ──────────────────────────────────────────── */}
      <section className="flex flex-col items-center gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Slider</h2>
        <Slider.Root defaultValue={50} className="relative w-48">
          <Slider.Control className="flex w-full touch-none items-center py-3">
            <Slider.Track className="h-2 w-full rounded-full bg-muted">
              <Slider.Indicator className="rounded-full bg-primary" />
              <Slider.Thumb
                aria-label="Value"
                className="block h-5 w-5 rounded-full border-2 border-primary bg-background shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>
      </section>

      {/* ── Accordion ───────────────────────────────────────── */}
      <section className="flex flex-col items-center gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Accordion</h2>
        <Accordion.Root className="w-72 rounded-lg border border-border">
          <Accordion.Item className="border-b border-border last:border-b-0">
            <Accordion.Header>
              <Accordion.Trigger className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-accent">
                What is Base UI?
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel className="px-4 pb-3 text-sm text-muted-foreground">
              An unstyled, composable React component library from MUI.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item className="border-b border-border last:border-b-0">
            <Accordion.Header>
              <Accordion.Trigger className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-accent">
                Why migrate from Radix?
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel className="px-4 pb-3 text-sm text-muted-foreground">
              Radix UI is no longer actively maintained. Base UI is actively
              developed and offers a similar unstyled primitive model.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>
      </section>

      <p className="text-xs text-muted-foreground">
        GEO-843 — delete this page after M6 is confirmed
      </p>
    </div>
  )
}
