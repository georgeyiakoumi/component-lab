/**
 * Locate a `SubComponentV2` and its root `PartNode` in a parsed tree by
 * `data-slot` attribute. The visual editor uses this to map a clicked DOM
 * element back to the structured tree node so the user's edit can be
 * applied to the right place.
 *
 * Pillar 5b (GEO-302) — first user-visible edit flow for stock components.
 *
 * Lookup is by the sub-component's root part `dataSlot`. Nested parts (e.g.
 * Card's CardHeader rendered inside Card's body) are NOT searched here —
 * they have their own sub-component entries with their own root data-slots.
 * The user navigates to a nested part by clicking it directly; the visual
 * editor's selection becomes that element and `findPartByDataSlot` is
 * called with the new element's data-slot.
 */

import type {
  ComponentTreeV2,
  PartNode,
  SubComponentV2,
} from "@/lib/component-tree-v2"

export interface FoundPart {
  sub: SubComponentV2
  part: PartNode
}

/**
 * Find the sub-component whose root part's `dataSlot` matches the given
 * value. Returns null if no match is found.
 *
 * Sub-component lookup is exhaustive: every sub-component in the tree is
 * checked, in source order.
 */
export function findPartByDataSlot(
  tree: ComponentTreeV2,
  dataSlot: string,
): FoundPart | null {
  for (const sub of tree.subComponents) {
    if (sub.parts.root.dataSlot === dataSlot) {
      return { sub, part: sub.parts.root }
    }
  }
  return null
}
