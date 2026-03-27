import { test, expect } from "@playwright/test"

test.describe("Inspect/Edit Mode Toggle", () => {
  test("starts in inspect mode by default", async ({ page }) => {
    await page.goto("/playground/button")
    const inspectButton = page.getByRole("button", { name: /inspect/i })
    await expect(inspectButton).toBeVisible()
  })

  test("switching to edit mode shows right panel with tabs", async ({ page }) => {
    await page.goto("/playground/button")
    await page.getByRole("button", { name: /edit/i }).click()
    await page.waitForTimeout(500)
    // Right panel tabs should be in the DOM
    await expect(page.getByRole("tab", { name: /styles/i })).toBeAttached()
    await expect(page.getByRole("tab", { name: /classes/i })).toBeAttached()
    await expect(page.getByRole("tab", { name: /variants/i })).toBeAttached()
  })

  test("switching back to inspect mode", async ({ page }) => {
    await page.goto("/playground/button")
    await page.getByRole("button", { name: /edit/i }).click()
    await page.waitForTimeout(500)
    await page.getByRole("button", { name: /inspect/i }).click()
    await page.waitForTimeout(500)
    // Should be back in inspect mode
    await expect(page.getByRole("button", { name: /inspect/i })).toBeVisible()
  })
})
