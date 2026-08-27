/**
 * Default Tailwind classes for Base UI component previews.
 *
 * Validated against official Base UI docs for visual correctness.
 * Used by the preview renderer test page and the per-component
 * playground route.
 */

export const DEFAULT_CLASSES: Record<string, Record<string, string>> = {
  /* ── Inputs ────────────────────────────────────────────────────── */
  button: { Button: "inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 data-[disabled]:opacity-50 data-[disabled]:pointer-events-none" },
  toggle: { Toggle: "inline-flex h-9 items-center justify-center rounded-md border border-border px-3 text-sm hover:bg-accent data-[pressed]:bg-primary data-[pressed]:text-primary-foreground" },
  "toggle-group": {
    Root: "flex gap-1",
    Toggle: "inline-flex h-9 items-center justify-center rounded-md border border-border px-3 text-sm hover:bg-accent data-[pressed]:bg-primary data-[pressed]:text-primary-foreground",
  },

  /* ── Forms ─────────────────────────────────────────────────────── */
  checkbox: {
    Root: "flex h-5 w-5 shrink-0 items-center justify-center rounded border border-border bg-background text-primary-foreground data-[checked]:border-primary data-[checked]:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    Indicator: "flex data-[unchecked]:hidden",
  },
  "checkbox-group": {
    GroupRoot: "flex flex-col gap-2",
    Root: "flex h-5 w-5 shrink-0 items-center justify-center rounded border border-border bg-background text-primary-foreground data-[checked]:border-primary data-[checked]:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    Indicator: "flex data-[unchecked]:hidden",
  },
  switch: {
    Root: "relative flex h-6 w-11 cursor-pointer rounded-full bg-muted transition-colors data-[checked]:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
    Thumb: "block h-5 w-5 translate-x-0.5 translate-y-0.5 rounded-full bg-white shadow-sm transition-transform data-[checked]:translate-x-5",
  },
  slider: {
    Root: "relative w-48",
    Control: "flex w-full touch-none select-none items-center py-3",
    Track: "relative h-2 w-full rounded-full bg-muted",
    Indicator: "h-full rounded-full bg-primary",
    Thumb: "block h-5 w-5 rounded-full border-2 border-primary bg-background shadow-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring data-[disabled]:opacity-50",
  },
  input: { Input: "h-9 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed" },
  field: {
    Root: "flex flex-col gap-1.5",
    Label: "text-sm font-medium text-foreground",
    Control: "h-9 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
    Description: "text-xs text-muted-foreground",
  },
  fieldset: {
    Root: "rounded-lg border border-border p-4",
    Legend: "text-sm font-semibold text-foreground px-1",
  },
  "number-field": {
    Root: "flex flex-col gap-1",
    Group: "flex h-9",
    Decrement: "flex h-full w-9 items-center justify-center border border-border border-r-0 bg-background text-sm hover:bg-accent data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
    Input: "h-full w-20 border-y border-border bg-background px-2 text-center text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring",
    Increment: "flex h-full w-9 items-center justify-center border border-border border-l-0 bg-background text-sm hover:bg-accent data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
  },
  "otp-field": {
    Root: "flex gap-2",
    Input: "h-10 w-10 rounded-md border border-border bg-background text-center text-sm focus:outline-none focus:ring-2 focus:ring-ring",
    Separator: "flex items-center text-muted-foreground",
  },
  radio: {
    Group: "flex flex-col gap-2",
    Root: "flex size-4 shrink-0 items-center justify-center rounded-full border border-border text-primary data-[checked]:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[disabled]:opacity-50",
    Indicator: "flex items-center justify-center data-[unchecked]:hidden before:size-2 before:rounded-full before:bg-current",
  },
  select: {
    Trigger: "inline-flex h-9 items-center justify-between gap-2 rounded-md border border-border bg-background px-3 text-sm min-w-[160px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    Value: "",
    Icon: "text-muted-foreground text-xs",
    Positioner: "outline-hidden",
    Popup: "min-w-[160px] rounded-md border border-border bg-background p-1 shadow-lg origin-[var(--transform-origin)] transition-[scale,opacity] duration-100 ease-out data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0 data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0",
    Item: "flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm data-[highlighted]:bg-accent",
  },
  autocomplete: {
    Input: "h-9 w-48 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
    Positioner: "outline-hidden",
    Popup: "mt-1 min-w-[192px] rounded-md border border-border bg-background p-1 shadow-lg",
    Item: "flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm data-[highlighted]:bg-accent",
  },
  combobox: {
    InputGroup: "flex h-9 rounded-md border border-border bg-background",
    Input: "flex-1 bg-transparent px-3 text-sm focus:outline-none",
    Trigger: "flex w-9 items-center justify-center border-l border-border text-xs text-muted-foreground hover:bg-accent",
    Positioner: "outline-hidden",
    Popup: "mt-1 min-w-[192px] rounded-md border border-border bg-background p-1 shadow-lg origin-[var(--transform-origin)] transition-[scale,opacity] duration-100 ease-out data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
    Item: "flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm data-[highlighted]:bg-accent",
    ItemIndicator: "text-xs text-primary",
  },

  /* ── Overlays ──────────────────────────────────────────────────── */
  dialog: {
    Trigger: "inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90",
    Backdrop: "fixed inset-0 z-50 bg-black/50 transition-opacity duration-150 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
    Popup: "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background p-6 shadow-lg transition-[scale,opacity] duration-100 ease-out data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0 data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0",
    Title: "text-lg font-semibold",
    Description: "mt-2 text-sm text-muted-foreground",
    Close: "mt-4 inline-flex h-9 items-center justify-center rounded-md border border-border px-4 text-sm hover:bg-accent",
  },
  "alert-dialog": {
    Trigger: "inline-flex h-9 items-center justify-center rounded-md bg-destructive px-4 text-sm font-medium text-destructive-foreground hover:bg-destructive/90",
    Backdrop: "fixed inset-0 z-50 bg-black/50 transition-opacity duration-150 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
    Popup: "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background p-6 shadow-lg max-w-md transition-[scale,opacity] duration-100 ease-out data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0 data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0",
    Title: "text-lg font-semibold",
    Description: "mt-2 text-sm text-muted-foreground",
    Close: "inline-flex h-9 items-center justify-center rounded-md border border-border px-4 text-sm hover:bg-accent",
  },
  "context-menu": {
    Trigger: "flex h-24 w-full items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground",
    Positioner: "outline-hidden",
    Popup: "min-w-[160px] rounded-md border border-border bg-background p-1 shadow-lg origin-[var(--transform-origin)] transition-[scale,opacity] duration-100 ease-out data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0 data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0",
    Item: "flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm data-[highlighted]:bg-accent",
    Separator: "my-1 h-px bg-border",
  },
  drawer: {
    Trigger: "inline-flex h-9 items-center justify-center rounded-md border border-border px-4 text-sm hover:bg-accent",
    Backdrop: "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
    Popup: "w-full max-h-[80vh] rounded-t-xl border-t border-border bg-background p-6 shadow-lg outline-none overflow-y-auto transition-transform duration-300 ease-out data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full",
    Title: "text-lg font-semibold",
    Description: "mt-2 text-sm text-muted-foreground",
    Close: "mt-4 inline-flex h-9 items-center justify-center rounded-md border border-border px-4 text-sm hover:bg-accent",
  },
  menu: {
    Trigger: "inline-flex h-9 items-center justify-center rounded-md border border-border px-4 text-sm",
    Positioner: "outline-hidden",
    Popup: "min-w-[160px] rounded-md border border-border bg-background p-1 shadow-lg origin-[var(--transform-origin)] transition-[scale,opacity] duration-100 ease-out data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0 data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0",
    Item: "flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm data-[highlighted]:bg-accent",
    Separator: "my-1 h-px bg-border",
  },
  popover: {
    Trigger: "inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90",
    Positioner: "outline-hidden",
    Popup: "rounded-lg border border-border bg-background p-4 shadow-lg origin-[var(--transform-origin)] transition-[scale,opacity] duration-100 ease-out data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0 data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0",
    Arrow: "fill-background stroke-border",
    Title: "font-semibold text-sm",
    Description: "mt-1 text-sm text-muted-foreground",
    Close: "mt-2 text-sm text-muted-foreground hover:text-foreground",
  },
  tooltip: {
    Trigger: "inline-flex h-9 items-center justify-center rounded-md border border-border px-4 text-sm",
    Positioner: "outline-hidden",
    Popup: "rounded-md bg-foreground px-3 py-1.5 text-xs text-background origin-[var(--transform-origin)] transition-[transform,opacity] duration-100 ease-out data-[starting-style]:opacity-0 data-[starting-style]:scale-[0.98] data-[ending-style]:opacity-0 data-[ending-style]:scale-[0.98] data-[instant]:transition-none",
    Arrow: "fill-foreground",
  },
  "preview-card": {
    Trigger: "text-sm text-primary underline underline-offset-4 hover:text-primary/80",
    Positioner: "outline-hidden",
    Popup: "rounded-lg border border-border bg-background p-4 shadow-lg origin-[var(--transform-origin)] transition-[transform,opacity] duration-100 ease-out data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0 data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0",
  },

  /* ── Navigation ────────────────────────────────────────────────── */
  menubar: {
    Root: "flex items-center",
    Trigger: "border-0 bg-transparent px-3 py-1.5 text-sm font-medium hover:bg-accent rounded-md data-[popup-open]:bg-accent",
    Positioner: "outline-hidden",
    Popup: "min-w-[160px] rounded-md border border-border bg-background p-1 shadow-lg origin-[var(--transform-origin)] transition-[scale,opacity] duration-100 ease-out data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0 data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0 data-[instant]:transition-none",
    Item: "flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm data-[highlighted]:bg-accent",
  },
  "navigation-menu": {
    Root: "",
    List: "flex items-center gap-1",
    Trigger: "px-3 py-1.5 text-sm font-medium hover:bg-accent rounded-md inline-flex items-center gap-1",
    Icon: "text-xs text-muted-foreground",
    Content: "p-2",
    Link: "block px-3 py-1.5 text-sm rounded-md hover:bg-accent no-underline text-foreground",
    Popup: "h-[var(--popup-height)] w-[var(--popup-width)] rounded-md border border-border bg-background shadow-lg overflow-hidden origin-[var(--transform-origin)] transition-[width,height,scale,opacity] duration-150 ease-out data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0 data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0",
    Positioner: "outline-hidden",
  },
  tabs: {
    Root: "w-72",
    List: "relative flex border-b border-border",
    Tab: "px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground data-[active]:text-foreground",
    Indicator: "absolute bottom-0 h-0.5 w-(--active-tab-width) translate-x-(--active-tab-left) bg-primary transition-[translate,width] duration-200 ease-out",
    Panel: "p-4 text-sm",
  },

  /* ── Layout ────────────────────────────────────────────────────── */
  accordion: {
    Root: "w-72 rounded-lg border border-border",
    Item: "border-b border-border last:border-b-0",
    Trigger: "flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-accent",
    Panel: "h-[var(--accordion-panel-height)] overflow-hidden text-sm text-muted-foreground transition-[height] duration-150 ease-out data-[starting-style]:h-0 data-[ending-style]:h-0",
    PanelContent: "px-4 pb-3",
  },
  collapsible: {
    Root: "w-72",
    Trigger: "flex w-full items-center justify-between rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent",
    Panel: "h-[var(--collapsible-panel-height)] overflow-hidden mt-2 rounded-md border border-border text-sm text-muted-foreground transition-[height] duration-150 ease-out data-[starting-style]:h-0 data-[ending-style]:h-0",
    PanelContent: "px-4 py-3",
  },
  "scroll-area": {
    Root: "h-40 w-48 rounded-md border border-border",
    Viewport: "h-full",
    Content: "flex flex-col gap-0.5 p-3 text-sm",
    Scrollbar: "m-0.5 flex w-2.5 justify-center opacity-0 transition-opacity pointer-events-none data-[hovering]:opacity-100 data-[hovering]:pointer-events-auto data-[scrolling]:opacity-100 data-[scrolling]:pointer-events-auto",
    Thumb: "w-full bg-border",
  },
  separator: { Separator: "h-px w-full bg-border" },
  toolbar: {
    Root: "flex items-center gap-px rounded-md border border-border bg-background p-1",
    Group: "flex gap-px",
    Button: "flex h-8 items-center justify-center rounded-sm px-3 text-sm hover:bg-accent active:bg-accent/80 data-[disabled]:opacity-50",
    Separator: "mx-1 h-4 w-px bg-border self-center",
    Link: "ml-auto flex-none self-center text-sm text-muted-foreground no-underline hover:text-foreground px-2",
  },

  /* ── Feedback ──────────────────────────────────────────────────── */
  meter: {
    Root: "grid w-60 grid-cols-2 gap-y-2",
    Label: "text-sm font-medium",
    Value: "text-right text-sm text-muted-foreground",
    Track: "col-span-2 h-3 overflow-hidden bg-muted",
    Indicator: "bg-primary transition-[width] duration-500",
  },
  progress: {
    Root: "grid w-60 grid-cols-2 gap-y-1",
    Label: "text-sm font-medium",
    Value: "text-right text-sm text-muted-foreground",
    Track: "col-span-2 h-1 overflow-hidden bg-muted",
    Indicator: "bg-primary transition-[width] duration-500",
  },
  toast: {
    Viewport: "fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-[calc(100vw-2rem)] sm:w-[22.5rem]",
    Root: "rounded-lg border border-border bg-background p-4 shadow-lg min-w-[300px] [transition:transform_0.5s_cubic-bezier(0.22,1,0.36,1),opacity_0.5s] data-[starting-style]:[transform:translateY(150%)] data-[ending-style]:opacity-0",
    Content: "flex items-start gap-2",
    Title: "text-sm font-semibold",
    Description: "mt-1 text-xs text-muted-foreground",
    Close: "text-muted-foreground hover:text-foreground text-lg leading-none",
  },

  /* ── Data Display ──────────────────────────────────────────────── */
  avatar: {
    Root: "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
    Image: "aspect-square h-full w-full object-cover",
    Fallback: "flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium",
  },
}
