"use client"

import { renderBaseUIPreview } from "@/lib/base-ui-previews"
import { BASE_UI_REGISTRY, BASE_UI_CATEGORIES, getBaseUIComponentsByCategory } from "@/lib/base-ui-registry"

/**
 * GEO-845 — Base UI preview renderer smoke test.
 *
 * Renders every Base UI component through the preview renderer with
 * some default Tailwind classes to verify all renderers work.
 *
 * This page is temporary — delete after M6 is confirmed working.
 */

/** Default Tailwind classes to make components visible without styling */
const DEFAULT_CLASSES: Record<string, Record<string, string>> = {
  button: { Button: "inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90" },
  toggle: { Toggle: "inline-flex h-9 items-center justify-center rounded-md border border-border px-3 text-sm hover:bg-accent data-[pressed]:bg-primary data-[pressed]:text-primary-foreground" },
  "toggle-group": {
    Root: "flex gap-1",
    Toggle: "inline-flex h-9 items-center justify-center rounded-md border border-border px-3 text-sm hover:bg-accent data-[pressed]:bg-primary data-[pressed]:text-primary-foreground",
  },
  checkbox: {
    Root: "flex h-5 w-5 items-center justify-center rounded border border-border bg-background data-[checked]:border-primary data-[checked]:bg-primary",
    Indicator: "text-white text-xs",
  },
  switch: {
    Root: "relative flex h-6 w-11 cursor-pointer rounded-full bg-muted transition-colors data-[checked]:bg-primary",
    Thumb: "block h-5 w-5 translate-x-0.5 translate-y-0.5 rounded-full bg-white shadow-sm transition-transform data-[checked]:translate-x-[22px]",
  },
  slider: {
    Root: "relative w-48",
    Control: "flex w-full touch-none items-center py-3",
    Track: "h-2 w-full rounded-full bg-muted",
    Indicator: "rounded-full bg-primary",
    Thumb: "block h-5 w-5 rounded-full border-2 border-primary bg-background shadow-sm",
  },
  input: { Input: "h-9 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" },
  field: {
    Root: "flex flex-col gap-1.5",
    Label: "text-sm font-medium text-foreground",
    Control: "h-9 rounded-md border border-border bg-background px-3 text-sm",
    Description: "text-xs text-muted-foreground",
  },
  accordion: {
    Root: "w-72 rounded-lg border border-border",
    Item: "border-b border-border last:border-b-0",
    Trigger: "flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-accent",
    Panel: "px-4 pb-3 text-sm text-muted-foreground",
  },
  tabs: {
    Root: "w-72",
    List: "flex border-b border-border",
    Tab: "px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground data-[active]:text-foreground data-[active]:border-b-2 data-[active]:border-primary",
    Panel: "p-4 text-sm",
  },
  dialog: {
    Trigger: "inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground",
    Backdrop: "fixed inset-0 bg-black/50",
    Popup: "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background p-6 shadow-lg",
    Title: "text-lg font-semibold",
    Description: "mt-2 text-sm text-muted-foreground",
    Close: "mt-4 inline-flex h-9 items-center justify-center rounded-md border border-border px-4 text-sm",
  },
  popover: {
    Trigger: "inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground",
    Popup: "rounded-lg border border-border bg-background p-4 shadow-lg",
    Arrow: "fill-background stroke-border",
    Title: "font-semibold text-sm",
    Description: "mt-1 text-sm text-muted-foreground",
    Close: "mt-2 text-sm text-muted-foreground hover:text-foreground",
  },
  menu: {
    Trigger: "inline-flex h-9 items-center justify-center rounded-md border border-border px-4 text-sm",
    Popup: "min-w-[160px] rounded-md border border-border bg-background p-1 shadow-lg",
    Item: "flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent data-[highlighted]:bg-accent",
    Separator: "my-1 h-px bg-border",
  },
  tooltip: {
    Trigger: "inline-flex h-9 items-center justify-center rounded-md border border-border px-4 text-sm",
    Popup: "rounded-md bg-foreground px-3 py-1.5 text-xs text-background",
    Arrow: "fill-foreground",
  },
  progress: {
    Root: "w-48",
    Label: "text-sm font-medium",
    Track: "mt-1 h-2 w-full overflow-hidden rounded-full bg-muted",
    Indicator: "h-full rounded-full bg-primary transition-all",
    Value: "mt-1 text-xs text-muted-foreground",
  },
  separator: { Separator: "h-px w-full bg-border" },
  avatar: {
    Root: "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
    Image: "aspect-square h-full w-full object-cover",
    Fallback: "flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium",
  },
  collapsible: {
    Root: "w-72",
    Trigger: "flex w-full items-center justify-between rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent",
    Panel: "mt-2 rounded-md border border-border px-4 py-3 text-sm text-muted-foreground",
  },
  fieldset: {
    Root: "rounded-lg border border-border p-4",
    Legend: "text-sm font-semibold text-foreground px-1",
  },
  "number-field": {
    Root: "flex flex-col gap-1",
    Group: "flex h-9",
    Decrement: "flex h-full w-9 items-center justify-center border border-border bg-background text-sm hover:bg-accent",
    Input: "h-full w-20 border-y border-border bg-background px-2 text-center text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring",
    Increment: "flex h-full w-9 items-center justify-center border border-border bg-background text-sm hover:bg-accent",
  },
  "otp-field": {
    Root: "flex gap-2",
    Input: "h-10 w-10 rounded-md border border-border bg-background text-center text-sm focus:outline-none focus:ring-2 focus:ring-ring",
    Separator: "flex items-center text-muted-foreground",
  },
  radio: {
    Group: "flex flex-col gap-2",
    Root: "flex h-5 w-5 items-center justify-center rounded-full border-2 border-border data-[checked]:border-primary",
    Indicator: "h-2.5 w-2.5 rounded-full bg-primary",
  },
  select: {
    Trigger: "inline-flex h-9 items-center justify-between gap-2 rounded-md border border-border bg-background px-3 text-sm min-w-[160px]",
    Value: "",
    Icon: "text-muted-foreground text-xs",
    Positioner: "z-50",
    Popup: "min-w-[160px] rounded-md border border-border bg-background p-1 shadow-lg",
    Item: "flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm data-[highlighted]:bg-accent",
  },
  "alert-dialog": {
    Trigger: "inline-flex h-9 items-center justify-center rounded-md bg-destructive px-4 text-sm font-medium text-destructive-foreground hover:bg-destructive/90",
    Backdrop: "fixed inset-0 z-50 bg-black/50",
    Popup: "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background p-6 shadow-lg max-w-md",
    Title: "text-lg font-semibold",
    Description: "mt-2 text-sm text-muted-foreground",
    Close: "inline-flex h-9 items-center justify-center rounded-md border border-border px-4 text-sm hover:bg-accent",
  },
  "context-menu": {
    Trigger: "flex h-24 w-full items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground",
    Popup: "min-w-[160px] rounded-md border border-border bg-background p-1 shadow-lg z-50",
    Item: "flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm data-[highlighted]:bg-accent",
    Separator: "my-1 h-px bg-border",
  },
  drawer: {
    Trigger: "inline-flex h-9 items-center justify-center rounded-md border border-border px-4 text-sm hover:bg-accent",
    Backdrop: "fixed inset-0 z-40 bg-black/50",
    Popup: "w-full rounded-t-xl border-t border-border bg-background p-6 shadow-lg",
    Title: "text-lg font-semibold",
    Description: "mt-2 text-sm text-muted-foreground",
    Close: "mt-4 inline-flex h-9 items-center justify-center rounded-md border border-border px-4 text-sm hover:bg-accent",
  },
  "preview-card": {
    Trigger: "text-sm text-primary underline underline-offset-4 hover:text-primary/80",
    Positioner: "z-50",
    Popup: "rounded-lg border border-border bg-background p-4 shadow-lg",
  },
  menubar: {
    Root: "flex items-center gap-1 rounded-md border border-border bg-background p-1",
  },
  "navigation-menu": {
    Root: "",
    List: "flex items-center gap-1",
    Trigger: "px-3 py-1.5 text-sm font-medium hover:bg-accent rounded-md inline-flex items-center gap-1",
    Icon: "text-xs text-muted-foreground",
    Content: "mt-2 rounded-md border border-border bg-background p-2 shadow-lg",
    Link: "block px-3 py-1.5 text-sm rounded-md hover:bg-accent no-underline text-foreground",
  },
  "scroll-area": {
    Root: "h-40 w-48 rounded-md border border-border",
    Viewport: "h-full p-3",
    Scrollbar: "m-0.5 flex w-2.5 justify-center rounded-full bg-muted opacity-0 transition-opacity data-[hovering]:opacity-100 data-[scrolling]:opacity-100",
    Thumb: "w-full rounded-full bg-border",
  },
  toolbar: {
    Root: "flex items-center gap-px rounded-md border border-border bg-background p-1",
    Group: "flex gap-px",
    Button: "flex h-8 items-center justify-center rounded-sm px-3 text-sm hover:bg-accent active:bg-accent/80",
    Separator: "mx-1 h-4 w-px bg-border self-center",
    Link: "ml-auto flex-none self-center text-sm text-muted-foreground no-underline hover:text-foreground px-2",
  },
  meter: {
    Root: "grid w-48 grid-cols-2 gap-y-1",
    Label: "text-sm font-medium",
    Value: "text-right text-sm text-muted-foreground",
    Track: "col-span-2 h-2 overflow-hidden rounded-full bg-muted",
    Indicator: "bg-primary transition-all duration-500",
  },
  "button-disabled": {},
  "checkbox-group": {},
  autocomplete: {
    Input: "h-9 w-48 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
    Positioner: "z-50",
    Popup: "mt-1 min-w-[192px] rounded-md border border-border bg-background p-1 shadow-lg",
    Item: "flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm data-[highlighted]:bg-accent",
  },
  combobox: {
    InputGroup: "flex h-9 rounded-md border border-border bg-background",
    Input: "flex-1 bg-transparent px-3 text-sm focus:outline-none",
    Trigger: "flex w-9 items-center justify-center border-l border-border text-xs text-muted-foreground hover:bg-accent",
    Positioner: "z-50",
    Popup: "mt-1 min-w-[192px] rounded-md border border-border bg-background p-1 shadow-lg",
    Item: "flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm data-[highlighted]:bg-accent",
    ItemIndicator: "text-xs text-primary",
  },
  toast: {
    Root: "rounded-lg border border-border bg-background p-4 shadow-lg min-w-[300px]",
    Content: "flex-1",
    Title: "text-sm font-semibold",
    Description: "mt-1 text-xs text-muted-foreground",
    Close: "text-muted-foreground hover:text-foreground text-lg leading-none",
  },
}

export default function BaseTestPage() {
  return (
    <div className="h-full overflow-y-auto bg-background p-8">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-foreground">
        Base UI Preview Renderer Test
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        {BASE_UI_REGISTRY.length} components registered across {BASE_UI_CATEGORIES.length} categories.
      </p>

      {BASE_UI_CATEGORIES.map((category) => {
        const components = getBaseUIComponentsByCategory(category)
        return (
          <section key={category} className="mb-12">
            <h2 className="mb-4 text-xl font-semibold text-foreground">{category}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {components.map((comp) => (
                <div key={comp.slug} className="flex flex-col overflow-hidden rounded-lg border border-border">
                  {/* Preview area */}
                  <div className="flex flex-1 items-center justify-center border-b border-dashed border-border bg-accent/20 p-8">
                    {renderBaseUIPreview(comp.slug, DEFAULT_CLASSES[comp.slug] ?? {})}
                  </div>

                  {/* Info area */}
                  <div className="space-y-3 p-4">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{comp.name}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">{comp.description}</p>
                    </div>

                    {/* Parts list */}
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">
                        {comp.parts.length} part{comp.parts.length !== 1 ? "s" : ""}
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {comp.parts.map((part) => (
                          <span
                            key={part.name}
                            className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[11px] font-mono text-muted-foreground"
                          >
                            {part.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Import path */}
                    <code className="block truncate text-[11px] text-muted-foreground/60">
                      {comp.importPath}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
