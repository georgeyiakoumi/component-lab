import { test, expect } from "@playwright/test"

test.describe("Playground - Component Loading", () => {
  test("loads button component with preview", async ({ page }) => {
    await page.goto("/playground/base/button")
    await expect(page.locator('text=@base-ui/react/button')).toBeVisible({ timeout: 10000 })
  })

  test("sidebar shows Base UI component categories", async ({ page }) => {
    await page.goto("/playground")
    const sidebar = page.locator("[data-sidebar='sidebar']")
    await expect(sidebar.getByText("Inputs")).toBeVisible()
    await expect(sidebar.getByText("Layout")).toBeVisible()
  })

  test("clicking sidebar component navigates to Base UI route", async ({ page }) => {
    await page.goto("/playground/base/button")
    // Reopen sidebar
    await page.getByRole("button", { name: /toggle sidebar/i }).last().click()
    const sidebarWrapper = page.locator("[data-state]").first()
    await expect(sidebarWrapper).toHaveAttribute("data-state", "expanded", { timeout: 5000 })
    // Sidebar items are buttons inside collapsible category groups
    const sidebar = page.locator("[data-sidebar='sidebar']")
    // Expand Inputs category and click Toggle
    await sidebar.getByRole("button", { name: "Inputs" }).click()
    const switchBtn = sidebar.getByRole("button", { name: "Toggle" })
    await expect(switchBtn).toBeVisible({ timeout: 5000 })
    await switchBtn.click()
    await expect(page).toHaveURL(/\/playground\/base\/toggle/)
  })

  test("collapsed sidebar can be reopened with trigger button", async ({ page }) => {
    await page.goto("/playground/base/button")
    await page.getByRole("button", { name: /toggle sidebar/i }).last().click()
    const sidebarWrapper = page.locator("[data-state]").first()
    await expect(sidebarWrapper).toHaveAttribute("data-state", "expanded", { timeout: 5000 })
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
