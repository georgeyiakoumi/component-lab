// Export Utilities — single .tsx download
// Runs entirely client-side using Blob URLs.

/* ── File size estimation ──────────────────────────────────────── */

/**
 * Returns a human-readable size string for a code string.
 */
export function estimateFileSize(code: string): string {
  const bytes = new Blob([code]).size
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}

/* ── Single .tsx export ────────────────────────────────────────── */

/**
 * Downloads a single .tsx file by creating a temporary Blob URL and
 * triggering a click on a hidden anchor element.
 */
export function exportAsTsx(filename: string, code: string): void {
  const blob = new Blob([code], { type: "text/typescript;charset=utf-8" })
  const url = URL.createObjectURL(blob)

  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename.endsWith(".tsx") ? filename : `${filename}.tsx`
  anchor.style.display = "none"

  document.body.appendChild(anchor)
  anchor.click()

  // Clean up
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}
