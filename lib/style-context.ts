/**
 * Style context helpers — manages responsive/state/variant prefixes
 * for the visual editor's context-aware class editing.
 */

export type StyleContext = string // "default", "sm", "hover", or "variant:size:sm" etc.

export interface ContextGroup {
  label: string
  section?: string
  options: Array<{ value: string; label: string }>
}

export function buildContextGroups(
  variants?: Array<{ name: string; options: string[] }>,
  props?: Array<{ name: string; type: string }>,
  parentVariants?: Array<{ name: string; options: string[]; parentName: string }>,
  subComponentNames?: string[],
): ContextGroup[] {
  const groups: ContextGroup[] = []

  // Own variants
  if (variants && variants.length > 0) {
    let first = true
    for (const v of variants) {
      groups.push({
        section: first ? "Own variants" : undefined,
        label: v.name,
        options: v.options.map((opt) => ({
          value: `variant:${v.name}:${opt}`,
          label: opt,
        })),
      })
      first = false
    }
  }

  // Parent variants (cascade via group-data-[variant=value]/parentName:)
  if (parentVariants && parentVariants.length > 0) {
    let first = true
    for (const v of parentVariants) {
      const parentSlug = v.parentName.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
      groups.push({
        section: first ? `${v.parentName} variants` : undefined,
        label: v.name,
        options: v.options.map((opt) => ({
          value: `group-data-[${v.name}=${opt}]/${parentSlug}`,
          label: `${v.name}=${opt}`,
        })),
      })
      first = false
    }
  }

  // Props (boolean props become data-attribute modifiers)
  const boolProps = (props ?? []).filter((p) => p.type === "boolean")
  if (boolProps.length > 0) {
    groups.push({
      section: "Props",
      label: "Boolean props",
      options: boolProps.flatMap((p) => [
        { value: `data-[${p.name}=true]`, label: `${p.name}=true` },
        { value: `data-[${p.name}=false]`, label: `${p.name}=false` },
      ]),
    })
  }

  // Responsive
  groups.push({
    section: "Responsive",
    label: "Breakpoints",
    options: [
      { value: "bp-none", label: "None" },
      { value: "sm", label: "sm" },
      { value: "md", label: "md" },
      { value: "lg", label: "lg" },
      { value: "xl", label: "xl" },
      { value: "2xl", label: "2xl" },
    ],
  })

  // States — pseudo-classes
  groups.push({
    section: "States",
    label: "Pseudo-classes",
    options: [
      { value: "hover", label: "hover" },
      { value: "focus", label: "focus" },
      { value: "focus-visible", label: "focus-visible" },
      { value: "focus-within", label: "focus-within" },
      { value: "active", label: "active" },
      { value: "disabled", label: "disabled" },
      { value: "enabled", label: "enabled" },
      { value: "checked", label: "checked" },
      { value: "indeterminate", label: "indeterminate" },
      { value: "required", label: "required" },
      { value: "invalid", label: "invalid" },
      { value: "valid", label: "valid" },
      { value: "placeholder-shown", label: "placeholder-shown" },
      { value: "read-only", label: "read-only" },
      { value: "empty", label: "empty" },
      { value: "dark", label: "dark" },
    ],
  })

  // Structural selectors
  groups.push({
    label: "Structural",
    options: [
      { value: "first", label: "first" },
      { value: "last", label: "last" },
      { value: "only", label: "only" },
      { value: "odd", label: "odd" },
      { value: "even", label: "even" },
      { value: "first-of-type", label: "first-of-type" },
      { value: "last-of-type", label: "last-of-type" },
    ],
  })

  // Data attributes — Radix UI states
  groups.push({
    section: "Data attributes",
    label: "Radix state",
    options: [
      { value: "data-[state=open]", label: "state=open" },
      { value: "data-[state=closed]", label: "state=closed" },
      { value: "data-[state=active]", label: "state=active" },
      { value: "data-[state=inactive]", label: "state=inactive" },
      { value: "data-[state=checked]", label: "state=checked" },
      { value: "data-[state=unchecked]", label: "state=unchecked" },
      { value: "data-[state=on]", label: "state=on" },
      { value: "data-[state=off]", label: "state=off" },
    ],
  })

  groups.push({
    label: "Radix side/align",
    options: [
      { value: "data-[side=top]", label: "side=top" },
      { value: "data-[side=right]", label: "side=right" },
      { value: "data-[side=bottom]", label: "side=bottom" },
      { value: "data-[side=left]", label: "side=left" },
      { value: "data-[align=start]", label: "align=start" },
      { value: "data-[align=center]", label: "align=center" },
      { value: "data-[align=end]", label: "align=end" },
    ],
  })

  groups.push({
    label: "Radix misc",
    options: [
      { value: "data-[disabled]", label: "disabled" },
      { value: "data-[highlighted]", label: "highlighted" },
      { value: "data-[placeholder]", label: "placeholder" },
      { value: "data-[orientation=horizontal]", label: "orientation=horizontal" },
      { value: "data-[orientation=vertical]", label: "orientation=vertical" },
      { value: "data-[motion=from-start]", label: "motion=from-start" },
      { value: "data-[motion=from-end]", label: "motion=from-end" },
      { value: "data-[motion=to-start]", label: "motion=to-start" },
      { value: "data-[motion=to-end]", label: "motion=to-end" },
      { value: "data-[swipe=start]", label: "swipe=start" },
      { value: "data-[swipe=move]", label: "swipe=move" },
      { value: "data-[swipe=end]", label: "swipe=end" },
      { value: "data-[swipe=cancel]", label: "swipe=cancel" },
    ],
  })

  // ARIA attributes
  groups.push({
    section: "ARIA",
    label: "ARIA states",
    options: [
      { value: "aria-checked", label: "aria-checked" },
      { value: "aria-disabled", label: "aria-disabled" },
      { value: "aria-expanded", label: "aria-expanded" },
      { value: "aria-hidden", label: "aria-hidden" },
      { value: "aria-pressed", label: "aria-pressed" },
      { value: "aria-readonly", label: "aria-readonly" },
      { value: "aria-required", label: "aria-required" },
      { value: "aria-selected", label: "aria-selected" },
    ],
  })

  // Group states
  groups.push({
    section: "Group / Peer",
    label: "Group states",
    options: [
      { value: "group-hover", label: "group-hover" },
      { value: "group-focus", label: "group-focus" },
      { value: "group-focus-within", label: "group-focus-within" },
      { value: "group-active", label: "group-active" },
      { value: "group-disabled", label: "group-disabled" },
      { value: "group-data-[state=open]", label: "group-data-[state=open]" },
      { value: "group-data-[state=closed]", label: "group-data-[state=closed]" },
    ],
  })

  // Peer states
  groups.push({
    label: "Peer states",
    options: [
      { value: "peer-hover", label: "peer-hover" },
      { value: "peer-focus", label: "peer-focus" },
      { value: "peer-focus-visible", label: "peer-focus-visible" },
      { value: "peer-checked", label: "peer-checked" },
      { value: "peer-disabled", label: "peer-disabled" },
      { value: "peer-invalid", label: "peer-invalid" },
      { value: "peer-placeholder-shown", label: "peer-placeholder-shown" },
      { value: "peer-data-[state=open]", label: "peer-data-[state=open]" },
      { value: "peer-data-[state=closed]", label: "peer-data-[state=closed]" },
    ],
  })

  // Has selectors (slot-based conditional styling)
  const hasOptions: Array<{ value: string; label: string }> = []
  if (subComponentNames && subComponentNames.length > 0) {
    for (const name of subComponentNames) {
      const slot = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
      hasOptions.push({
        value: `has-[data-slot=${slot}]`,
        label: `has-[data-slot=${slot}]`,
      })
    }
  }
  hasOptions.push(
    { value: "has-[>svg]", label: "has-[>svg]" },
    { value: "has-[>img]", label: "has-[>img]" },
    { value: "has-[:focus]", label: "has-[:focus]" },
    { value: "has-[:checked]", label: "has-[:checked]" },
    { value: "has-[:disabled]", label: "has-[:disabled]" },
  )
  if (hasOptions.length > 0) {
    groups.push({
      section: "Has / Slot",
      label: "Has selectors",
      options: hasOptions,
    })
  }

  return groups
}

/** Get the CSS prefix for a context. Variant contexts become data-attribute selectors. */
export function getCssPrefix(context: string): string {
  if (context === "default") return "default"
  if (context.startsWith("variant:")) {
    const parts = context.split(":")
    return `data-[${parts[1]}=${parts[2]}]`
  }
  return context
}

/** Strip a context prefix from a class, e.g. "hover:bg-muted" → "bg-muted" */
export function stripPrefix(cls: string, prefix: string): string | null {
  const cssPrefix = getCssPrefix(prefix)
  if (cssPrefix === "default") return cls.includes(":") ? null : cls
  if (cls.startsWith(`${cssPrefix}:`)) return cls.slice(cssPrefix.length + 1)
  return null
}

/** Add a context prefix to a class, e.g. "bg-muted" + "hover" → "hover:bg-muted" */
export function addPrefix(cls: string, prefix: string): string {
  const cssPrefix = getCssPrefix(prefix)
  if (cssPrefix === "default") return cls
  return `${cssPrefix}:${cls}`
}

/** Check if a class belongs to a specific context */
export function hasPrefix(cls: string, prefix: string): boolean {
  const cssPrefix = getCssPrefix(prefix)
  if (cssPrefix === "default") return !cls.includes(":")
  return cls.startsWith(`${cssPrefix}:`)
}
