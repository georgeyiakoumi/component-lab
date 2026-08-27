import { test, expect } from "@playwright/test"

test.describe("Playground - Component Loading", () => {
  test("loads button component with preview", async ({ page }) => {
    await page.goto("/playground/base/button")
    await expect(page.locator('text=@base-ui/react/button')).toBeVisible({ timeout: 10000 })
  })

  test("tab bar shows open component tabs", async ({ page }) => {
    await page.goto("/playground/base/button")
    await expect(page.locator('text=@base-ui/react/button')).toBeVisible({ timeout: 10000 })
    // The active tab should show "Button"
    await expect(page.getByRole("button", { name: "Button", exact: true })).toBeVisible()
  })

  test("+ button opens component picker and adds a new tab", async ({ page }) => {
    await page.goto("/playground/base/button")
    await expect(page.locator('text=@base-ui/react/button')).toBeVisible({ timeout: 10000 })
    // Click the + button to open picker
    await page.getByRole("button", { name: "Open component" }).click()
    // Hover "Inputs" category to see components
    await page.getByText("Inputs", { exact: true }).hover()
    // Click "Toggle" to open it in a new tab
    await page.getByRole("button", { name: "Toggle", exact: true }).click()
    await expect(page).toHaveURL(/\/playground\/base\/toggle/)
  })

  test("closing a tab switches to the previous tab", async ({ page }) => {
    await page.goto("/playground/base/button")
    await expect(page.locator('text=@base-ui/react/button')).toBeVisible({ timeout: 10000 })
    // Open a second tab
    await page.getByRole("button", { name: "Open component" }).click()
    await page.getByText("Forms", { exact: true }).hover()
    await page.getByRole("button", { name: "Field", exact: true }).click()
    await expect(page).toHaveURL(/\/playground\/base\/field/)
    // Close the Field tab — should switch back to Button
    const closeBtn = page.locator("[aria-label='Close Field']")
    // Force click since the close button may need hover to appear
    await closeBtn.click({ force: true })
    await expect(page).toHaveURL(/\/playground\/base\/button/)
  })
})

test.describe("Playground - Theme Toggle", () => {
  test("toggle dark theme applies dark class to canvas", async ({ page }) => {
    await page.goto("/playground/base/button")
    // Wait for page to load
    await expect(page.locator('text=@base-ui/react/button')).toBeVisible({ timeout: 10000 })
    await page.getByLabel("Dark theme").click()
    const canvas = page.locator("[class*='dark']")
    await expect(canvas.first()).toBeVisible({ timeout: 5000 })
  })

  test("toggle back to light removes dark class from canvas", async ({ page }) => {
    await page.goto("/playground/base/button")
    await expect(page.locator('text=@base-ui/react/button')).toBeVisible({ timeout: 10000 })
    await page.getByLabel("Dark theme").click()
    await expect(page.locator("[class*='dark']").first()).toBeVisible({ timeout: 5000 })
    await page.getByLabel("Light theme").click()
    // Canvas should no longer have dark class
    await expect(page.locator("[contain\\:paint].dark")).toHaveCount(0)
  })
})

test.describe("Playground - Breakpoints", () => {
  test("breakpoint buttons are visible", async ({ page }) => {
    await page.goto("/playground/base/button")
    await expect(page.getByRole("button", { name: "Small (640px)" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Medium (768px)" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Large (1024px)" })).toBeVisible()
  })

  test("clicking sm breakpoint constrains canvas width", async ({ page }) => {
    await page.goto("/playground/base/button")
    await page.getByRole("button", { name: /small/i }).click()
    const inner = page.locator("[style*='max-width: 640px']")
    await expect(inner).toBeVisible()
  })
})
