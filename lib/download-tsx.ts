/**
 * Trigger a browser file download for a `.tsx` source string.
 *
 * Pillar 5b (GEO-302). Used by the slug page's Download button after the
 * user has edited a stock component.
 */

"use client"

/**
 * Download `source` as a file named `filename` in the user's browser.
 * Standard Blob + URL.createObjectURL pattern. No external dependencies.
 *
 * Always called from a user gesture (click handler) so popup blockers
 * don't intervene.
 */
export function downloadTsx(filename: string, source: string): void {
  const blob = new Blob([source], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.style.display = "none"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  // Free the blob URL on the next tick. Doing it synchronously after click()
  // can race with the actual download in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
