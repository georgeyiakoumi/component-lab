/**
 * ComponentTreeV2 → source text generator.
 *
 * Pillar 3a scope: the **fast path only**. Returns the tree's preserved
 * `originalSource` verbatim when available, which guarantees byte-equivalent
 * round-trip for every component the parser reads.
 *
 * Why start with the fast path:
 *
 * Pillar 1 D1 committed to lossless round-trip as a hard principle, and
 * Lesson #16 ("Respect the source") turned that into a working philosophy.
 * The fast path is the most direct expression of that philosophy: when the
 * user has not edited anything, the tool hands them back exactly the source
 * it was given. No whitespace drift, no quote-style normalisation, no
 * import reordering, no variant reformatting. The parser and generator
 * together are a noop on unedited trees.
 *
 * Pillar 3b (the slow path) will take over when the tree has been edited.
 * That path regenerates touched fields from templates while re-emitting
 * untouched regions from source-position-anchored spans. It's the harder
 * job and it's intentionally deferred.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * Contract
 * ──────────────────────────────────────────────────────────────────────────
 *
 * generateFromTreeV2(tree) returns a string that, when compared byte-for-byte
 * to the tree's `originalSource`, is identical. For trees without an
 * `originalSource` (e.g. built programmatically by the M3 from-scratch
 * builder), this function currently throws a `GeneratorError`. Pillar 3b
 * will add the template fallback.
 *
 * Design doc: https://www.notion.so/33bfeeb2a07881b7a7bce13177051f8f (Pillar 1)
 * Linear: GEO-288
 */

import type { ComponentTreeV2 } from "@/lib/component-tree-v2"

/**
 * Error thrown when the generator cannot emit a tree. Carries enough context
 * for the caller to understand why the generator gave up (e.g. "no original
 * source and the slow path isn't implemented yet").
 */
export class GeneratorError extends Error {
  readonly name = "GeneratorError"
  constructor(reason: string) {
    super(`[generator] ${reason}`)
  }
}

/**
 * Generate source code from a `ComponentTreeV2`.
 *
 * Pillar 3a: fast path only. If `tree.originalSource` is set, return it
 * verbatim. Otherwise throw — Pillar 3b will add the template fallback.
 *
 * Edit detection and slow-path regeneration are Pillar 3b (for single-field
 * edits) and Pillar 3c (for multi-field edits + full template emission).
 */
export function generateFromTreeV2(tree: ComponentTreeV2): string {
  // Escape-hatch components (D10) always re-emit `rawSource`. This path
  // exists for future unhandleable families like ContextMenu / Drawer /
  // Command if they ever need it — currently none of the 43 components
  // require this path.
  if (tree.customHandling && tree.rawSource !== undefined) {
    return tree.rawSource
  }

  // Fast path: tree was parsed from source and hasn't been touched.
  if (tree.originalSource !== undefined) {
    return tree.originalSource
  }

  // Slow path: tree was constructed programmatically (M3 from-scratch) OR
  // was parsed but then edited and `originalSource` was cleared. Pillar 3b
  // will implement template-based emission here.
  throw new GeneratorError(
    `Cannot generate source for "${tree.name}": no originalSource available. ` +
      `Template-based emission (Pillar 3b) is not yet implemented.`,
  )
}
