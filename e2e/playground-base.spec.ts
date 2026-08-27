import { test, expect } from "@playwright/test"

/**
 * E2E smoke tests for the Base UI component playground.
 *
 * Verifies the /playground/base/[slug] route loads, renders
 * the preview, shows generated code, and handles basic interactions.
 */

test.describe("Base UI playground", () => {
  test("navigates to /playground/base/button and loads", async ({ page }) => {
    await page.goto("/playground/base/button")

    // Page should load without a 404
    await expect(page).not.toHaveURL(/404/)

    // Code panel should show the Button import
    await expect(page.locator("text=@base-ui/react/button")).toBeVisible({
      timeout: 10000,
    })
  })

  test("code panel shows generated code with correct import", async ({
    page,
  }) => {
    await page.goto("/playground/base/switch")

    // Wait for Shiki to highlight the code
    await expect(
      page.locator('text=from "@base-ui/react/switch"'),
    ).toBeVisible({ timeout: 10000 })

    // Should contain the export function
    await expect(page.locator("text=export function MySwitch")).toBeVisible()
  })

  test("copy button exists in code panel", async ({ page }) => {
    await page.goto("/playground/base/button")

    // The copy button has sr-only text "Copy code"
    const copyButton = page.getByRole("button", { name: "Copy code" })
    await expect(copyButton).toBeVisible({ timeout: 10000 })
  })

  test("word wrap toggle does not crash", async ({ page }) => {
    await page.goto("/playground/base/menubar")

    // Wait for code to load
    await expect(
      page.locator('text=from "@base-ui/react/menubar"'),
    ).toBeVisible({ timeout: 10000 })

    // Click word wrap toggle
    const wrapButton = page.locator('[aria-label="Toggle word wrap"]')
    if (await wrapButton.isVisible()) {
      await wrapButton.click()
      // Page should still be functional — no crash
      await expect(
        page.locator('text=from "@base-ui/react/menubar"'),
      ).toBeVisible()
    }
  })

  test("no console errors on page load", async ({ page }) => {
    const errors: string[] = []
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text())
    })
    page.on("pageerror", (err) => errors.push(err.message))

    await page.goto("/playground/base/dialog")

    // Wait for the page to settle
    await page.waitForTimeout(2000)

    // Filter out known benign errors (e.g. Shiki dynamic import noise)
    const realErrors = errors.filter(
      (e) => !e.includes("Failed to load resource"),
    )
    expect(realErrors).toHaveLength(0)
  })
})
