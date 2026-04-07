/**
 * Pillar 5b — end-to-end smoke test for the edit-export UI surface.
 *
 * The deep edit pipeline (parse → mutate → splice → export) is proven by
 * 13 unit tests in `lib/parser/__tests__/edit-flow.test.ts`. This test
 * focuses on the *UI wiring* — the bits Vitest can't touch:
 *
 * 1. The Download .tsx button exists when in edit mode
 * 2. It starts disabled (no edits → fast path → nothing to download)
 * 3. The Reset button exists and starts disabled too
 * 4. Edit mode entry shows the controls; inspect mode hides them
 *
 * Pillar 5c will add a test that exercises the cva-only banner once the
 * cva-call selection path is wired.
 *
 * Linear: GEO-302
 */

import { test, expect } from "@playwright/test"

test.describe("Pillar 5b — edit-export UI controls", () => {
  test("Download .tsx and Reset buttons are absent in inspect mode", async ({
    page,
  }) => {
    await page.goto("/playground/card")
    // Wait for the page to settle.
    await expect(page.getByTestId("parser-v2-status")).toBeVisible()
    // Inspect mode should not show the edit-export controls.
    await expect(page.getByTestId("download-tsx-button")).toHaveCount(0)
    await expect(page.getByTestId("reset-edits-button")).toHaveCount(0)
  })

  test("Download .tsx button appears in edit mode and starts disabled", async ({
    page,
  }) => {
    await page.goto("/playground/card")
    // Wait for the parser status to confirm the page is wired up.
    await expect(page.getByTestId("parser-v2-status")).toHaveAttribute(
      "data-state",
      "ready",
      { timeout: 10_000 },
    )
    // Switch to edit mode.
    await page.getByRole("button", { name: /^edit$/i }).click()
    // The Download button is now visible.
    const download = page.getByTestId("download-tsx-button")
    await expect(download).toBeVisible()
    // It starts disabled because no edits have been made.
    await expect(download).toBeDisabled()
    await expect(download).toHaveAttribute("data-dirty", "false")
    // Reset is also visible and disabled.
    const reset = page.getByTestId("reset-edits-button")
    await expect(reset).toBeVisible()
    await expect(reset).toBeDisabled()
  })

  test("Switching to inspect mode hides the edit-export controls again", async ({
    page,
  }) => {
    await page.goto("/playground/card")
    await expect(page.getByTestId("parser-v2-status")).toHaveAttribute(
      "data-state",
      "ready",
      { timeout: 10_000 },
    )
    await page.getByRole("button", { name: /^edit$/i }).click()
    await expect(page.getByTestId("download-tsx-button")).toBeVisible()
    await page.getByRole("button", { name: /^inspect$/i }).click()
    await expect(page.getByTestId("download-tsx-button")).toHaveCount(0)
  })
})
