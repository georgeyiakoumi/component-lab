/**
 * Read / write helpers for data-attribute variant slots.
 *
 * For a sub-component with `variantStrategy.kind === "data-attr"`, a
 * "slot" is the set of classes that apply under a specific value of a
 * specific prop. The slot classes live inline in the sub-component's
 * `parts.root.className` cn() base string, with (or without) a
 * `data-[<propName>=<value>]:` prefix.
 *
 * ## Slot semantics
 *
 * Given a variant with `propName = "size"` and `values = ["default", "sm"]`
 * and a cn() base string of `"p-4 bg-blue-500 data-[size=sm]:p-2"`:
 *
 * - `size:default` slot = every class WITHOUT a `data-[size=...]:` prefix.
 *   `["p-4", "bg-blue-500"]`. These apply when the prop is at its default,
 *   fallback for all other values too (unless overridden by a `data-[size=X]:`).
 *
 * - `size:sm` slot = every class with a `data-[size=sm]:` prefix, with the
 *   prefix stripped. `["p-2"]`.
 *
 * ## Multi-variant interaction (v1 simplification)
 *
 * When a sub-component has more than one data-attr variant (e.g. both
 * `size` and `density`), the "default" slot for one variant is the set
 * of classes without THAT variant's prefix — which includes classes
 * belonging to other variants' slots. Rewriting the default slot
 * preserves other variants' classes (they get reinserted verbatim).
 *
 * The helpers below partition the cn() base literal into:
 *   { unprefixed: string[], sameProp: Record<value, string[]>, others: string[] }
 * so rewrites can touch only the relevant group and leave the rest alone.
 *
 * Nested selectors like `data-[size=sm]:has-data-[slot=card-footer]:pb-0`
 * are attributed to the OUTERMOST `data-[size=X]:` prefix — that's the
 * user's intent ("when size is sm, AND there's a card footer, set pb-0").
 * The rest of the selector chain is preserved verbatim in the slot.
 *
 * ## What lives where
 *
 * - Recogniser: `data-attr-variant-recogniser.ts` (tells you the variant
 *   exists)
 * - Slot read/write: this file (manipulates the cn() base literal)
 * - Generator template: `generate-from-tree-v2.ts` (emits the inline prop
 *   destructuring + `data-<prop>={<prop>}` attribute)
 */

import type {
  ComponentTreeV2,
  PartNode,
  SubComponentV2,
} from "@/lib/component-tree-v2"

/* ── Public API ─────────────────────────────────────────────────── */

/**
 * Read the classes currently applied to a data-attr slot. Returns null
 * when the sub-component has no data-attr variant for the given prop.
 *
 * For the variant's default value, returns every class without a
 * `data-[<propName>=...]:` prefix. For non-default values, returns the
 * classes with that exact prefix, with the prefix stripped.
 */
export function getDataAttrSlotClasses(
  sub: SubComponentV2,
  propName: string,
  value: string,
): string[] | null {
  if (sub.variantStrategy.kind !== "data-attr") return null
  const variant = sub.variantStrategy.variants.find(
    (v) => v.propName === propName,
  )
  if (!variant) return null
  if (!variant.values.includes(value)) return null

  const base = readCnCallBase(sub.parts.root)
  if (base === null) return null

  const { unprefixed, sameProp } = partitionClasses(
    base,
    propName,
    variant.values,
  )

  if (value === variant.defaultValue) {
    return unprefixed
  }
  return sameProp[value] ?? []
}

/**
 * Write the classes for a data-attr slot. Returns a new tree with the
 * target sub-component's cn() base string rewritten. Returns the input
 * tree unchanged when the sub-component or variant doesn't exist, or
 * when the className shape isn't a cn-call with a literal base.
 *
 * Writing to the default value replaces every unprefixed class. Writing
 * to a non-default value replaces every class with that exact
 * `data-[<propName>=<value>]:` prefix. Other slots (including other
 * variants' slots on the same sub-component) are preserved verbatim.
 *
 * The emit order in the rewritten base is: unprefixed classes first,
 * then every value slot for the target prop in the variant's source
 * order, then every OTHER prefixed class (other variants, other
 * prefixes) in their original order. This keeps the output stable
 * under repeated edits.
 */
export function setDataAttrSlotClasses(
  tree: ComponentTreeV2,
  subName: string,
  propName: string,
  value: string,
  classes: string[],
): ComponentTreeV2 {
  const sub = tree.subComponents.find((s) => s.name === subName)
  if (!sub) return tree
  if (sub.variantStrategy.kind !== "data-attr") return tree
  const variant = sub.variantStrategy.variants.find(
    (v) => v.propName === propName,
  )
  if (!variant) return tree
  if (!variant.values.includes(value)) return tree

  const base = readCnCallBase(sub.parts.root)
  if (base === null) return tree

  const { unprefixed, sameProp, others } = partitionClasses(
    base,
    propName,
    variant.values,
  )

  // Replace the target slot.
  let newUnprefixed = unprefixed
  const newSameProp = { ...sameProp }
  if (value === variant.defaultValue) {
    newUnprefixed = classes.slice()
  } else {
    newSameProp[value] = classes.slice()
  }

  // Reassemble in a stable order:
  //   unprefixed → sameProp[default] (skipped — already in unprefixed)
  //   → sameProp[value1] → sameProp[value2] → ... → others
  const parts: string[] = []
  parts.push(...newUnprefixed)
  for (const v of variant.values) {
    if (v === variant.defaultValue) continue
    const slot = newSameProp[v]
    if (!slot || slot.length === 0) continue
    for (const cls of slot) {
      parts.push(`data-[${attrBodyFor(variant.attrName)}=${v}]:${cls}`)
    }
  }
  parts.push(...others)

  const newBase = parts.join(" ")

  // Rebuild the className expression with the new base literal.
  const className = sub.parts.root.className
  if (className.kind !== "cn-call") return tree
  const quoted = JSON.stringify(newBase)

  const newSub: SubComponentV2 = {
    ...sub,
    parts: {
      root: {
        ...sub.parts.root,
        className: {
          ...className,
          args: [quoted, ...className.args.slice(1)],
        },
      },
    },
  }

  return {
    ...tree,
    subComponents: tree.subComponents.map((s) =>
      s.name === subName ? newSub : s,
    ),
  }
}

/* ── Internals ──────────────────────────────────────────────────── */

/**
 * Read the first-arg literal of a cn() call on a PartNode. Returns null
 * if the className isn't a cn-call with a string-literal first arg.
 */
function readCnCallBase(part: PartNode): string | null {
  const expr = part.className
  if (expr.kind !== "cn-call") return null
  const first = expr.args[0]
  if (typeof first !== "string") return null
  if (first.length < 2) return null
  const open = first[0]
  const close = first[first.length - 1]
  if ((open !== '"' && open !== "'") || close !== open) return null
  return first.slice(1, -1)
}

/**
 * Split a cn() base string into three buckets relative to a single data-attr
 * variant:
 *
 * - `unprefixed`: classes with no `data-[<propName>=...]:` prefix (these are
 *   the default-slot classes).
 * - `sameProp`: a map of value → class list for classes with a matching
 *   prefix, with the prefix stripped. Nested selectors after the outer
 *   prefix are preserved in the stripped form.
 * - `others`: classes with `data-[...]:` prefixes for OTHER props, or any
 *   other prefix (`hover:`, `md:`, etc.) — preserved verbatim.
 */
function partitionClasses(
  base: string,
  propName: string,
  values: string[],
): {
  unprefixed: string[]
  sameProp: Record<string, string[]>
  others: string[]
} {
  const unprefixed: string[] = []
  const sameProp: Record<string, string[]> = {}
  const others: string[] = []

  const attrBody = propName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()

  for (const cls of base.split(/\s+/).filter(Boolean)) {
    const match = matchLeadingDataPrefix(cls, attrBody, values)
    if (match) {
      const bucket = sameProp[match.value] ?? []
      bucket.push(match.remainder)
      sameProp[match.value] = bucket
      continue
    }
    if (hasAnyDataPrefix(cls) || hasOtherPrefix(cls)) {
      others.push(cls)
      continue
    }
    unprefixed.push(cls)
  }

  return { unprefixed, sameProp, others }
}

/**
 * If a class starts with `data-[<attrBody>=<value>]:` for one of the given
 * values, return the matched value and the remainder (everything AFTER
 * the first `:` that terminates the prefix). Otherwise null.
 */
function matchLeadingDataPrefix(
  cls: string,
  attrBody: string,
  values: string[],
): { value: string; remainder: string } | null {
  // Expected shape: `data-[<attrBody>=<value>]:<rest>`
  for (const value of values) {
    const prefix = `data-[${attrBody}=${value}]:`
    if (cls.startsWith(prefix)) {
      return { value, remainder: cls.slice(prefix.length) }
    }
  }
  return null
}

/**
 * True if a class has ANY `data-[...]:` prefix. Used to decide whether
 * an unmatched class belongs in the "others" bucket vs the "unprefixed"
 * bucket.
 */
function hasAnyDataPrefix(cls: string): boolean {
  return /^data-\[[^\]]+\]:/.test(cls)
}

/**
 * True if a class has any non-data-attr prefix (`hover:`, `md:`, `focus-visible:`,
 * etc.). These classes belong in the "others" bucket.
 */
function hasOtherPrefix(cls: string): boolean {
  // A prefix is anything before the first `:` that contains no `[` and isn't
  // an arbitrary value. Cheap heuristic: if the class contains a `:` AND
  // doesn't start with `data-[`, it has a prefix.
  return cls.includes(":") && !cls.startsWith("data-[")
}

/**
 * Convert the attribute name (e.g. "data-size") to its body ("size") for
 * building the prefix. Accepts "data-size" or a custom attr like
 * "data-orientation".
 */
function attrBodyFor(attrName: string): string {
  if (attrName.startsWith("data-")) return attrName.slice("data-".length)
  return attrName
}
