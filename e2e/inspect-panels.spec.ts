import { test, expect } from "@playwright/test"

async function enterEditMode(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: /edit/i }).click()
  await page.waitForTimeout(500)
}

test.describe("Inspect Panels", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/playground/button")
  })

  test("Code panel is always visible with syntax-highlighted source", async ({ page }) => {
    const codeHeading = page.locator("text=Code").first()
    await expect(codeHeading).toBeVisible()
    const codeBlock = page.locator("pre")
    await expect(codeBlock).toBeVisible()
    await expect(page.getByText("forwardRef")).toBeVisible()
  })

  test("Code panel has copy button", async ({ page }) => {
    await expect(page.getByRole("button", { name: /copy/i })).toBeVisible()
  })

  test("Outline panel is always visible", async ({ page }) => {
    await expect(page.getByText("Outline", { exact: true }).first()).toBeVisible()
  })

  test("A11y indicator is in status bar", async ({ page }) => {
    const a11yButton = page.locator("button").filter({ hasText: "A11y" })
    await expect(a11yButton).toBeVisible()
  })

  test("Semantic indicator is in status bar", async ({ page }) => {
    const htmlButton = page.locator("button").filter({ hasText: "HTML" })
    await expect(htmlButton).toBeVisible()
  })

  test("Styles tab present in edit mode right panel", async ({ page }) => {
    await enterEditMode(page)
    await expect(page.getByRole("tab", { name: /styles/i })).toBeAttached()
  })

  test("compound component shows Parts tab in edit mode", async ({ page }) => {
    await page.goto("/playground/dialog")
    // Use exact match to avoid "Edit profile" button in Dialog preview
    await page.getByRole("button", { name: "Edit", exact: true }).click()
    await page.waitForTimeout(500)
    await expect(page.getByRole("tab", { name: /parts/i })).toBeAttached()
  })

  test("non-compound component has no Parts tab", async ({ page }) => {
    await enterEditMode(page)
    const partsTab = page.getByRole("tab", { name: /parts/i })
    await expect(partsTab).toHaveCount(0)
  })
})

test.describe("Inspect Panels - Dialog compound component", () => {
  test("Outline panel shows compound tree for Dialog", async ({ page }) => {
    await page.goto("/playground/dialog")
    await expect(page.getByText("Outline", { exact: true }).first()).toBeVisible()
    await expect(page.getByText("DialogTrigger").first()).toBeVisible({ timeout: 5000 })
    await expect(page.getByText("DialogContent").first()).toBeVisible({ timeout: 5000 })
  })
})
