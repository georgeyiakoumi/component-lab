import { test, expect } from "@playwright/test"

async function enterEditMode(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: /edit/i }).click()
  await page.waitForTimeout(500)
}

test.describe("Edit Features - Classes Tab", () => {
  test("Classes tab is present in edit mode", async ({ page }) => {
    await page.goto("/playground/button")
    await enterEditMode(page)
    await expect(page.getByRole("tab", { name: /classes/i })).toBeAttached()
  })
})

test.describe("Edit Features - Variants Tab", () => {
  test("Variants tab is present in edit mode", async ({ page }) => {
    await page.goto("/playground/button")
    await enterEditMode(page)
    await expect(page.getByRole("tab", { name: /variants/i })).toBeAttached()
  })
})

test.describe("Edit Features - Export", () => {
  test("Export button is visible in toolbar", async ({ page }) => {
    await page.goto("/playground/button")
    await expect(page.getByRole("button", { name: /export/i })).toBeVisible()
  })

  test("Export dialog opens with two options", async ({ page }) => {
    await page.goto("/playground/button")
    await page.getByRole("button", { name: /export/i }).click()
    await expect(page.getByText(/single.*\.tsx/i)).toBeVisible()
    await expect(page.getByText(/full.*bundle/i)).toBeVisible()
  })
})
