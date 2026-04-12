import { test, expect } from "@playwright/test"

test.describe("Playground - Component Loading", () => {
  test("loads button component with preview", async ({ page }) => {
    await page.goto("/playground/button")
    await expect(page.getByText("Button", { exact: true }).first()).toBeVisible()
  })

  test("sidebar shows component categories on index page", async ({ page }) => {
    // Sidebar is open on the /playground index (no component selected)
    await page.goto("/playground")
    const sidebar = page.locator("[data-sidebar='sidebar']")
    await expect(sidebar.getByText("Inputs")).toBeVisible()
    await expect(sidebar.getByText("Layout")).toBeVisible()
  })

  test("sidebar search filters components on index page", async ({ page }) => {
    await page.goto("/playground")
    const sidebar = page.locator("[data-sidebar='sidebar']")
    const search = sidebar.getByPlaceholder(/search shadcn/i)
    await search.fill("card")
    await expect(sidebar.getByText("Card", { exact: true })).toBeVisible()
  })

  test("sidebar auto-collapses when navigating to a component", async ({ page }) => {
    await page.goto("/playground")
    const sidebarWrapper = page.locator("[data-state]").first()
    await expect(sidebarWrapper).toHaveAttribute("data-state", "expanded")
    // Click a category in the sidebar, then a component
    const sidebar = page.locator("[data-sidebar='sidebar']")
    await sidebar.getByText("Inputs").click()
    await sidebar.getByText("Button", { exact: true }).first().click()
    await page.waitForURL(/\/playground\/button/)
    // Sidebar should have collapsed
    await expect(sidebarWrapper).toHaveAttribute("data-state", "collapsed", { timeout: 5000 })
  })

  test("collapsed sidebar can be reopened with trigger button", async ({ page }) => {
    await page.goto("/playground/button")
    // Sidebar is collapsed — click the trigger to expand
    await page.getByRole("button", { name: /toggle sidebar/i }).last().click()
    const sidebarWrapper = page.locator("[data-state]").first()
    await expect(sidebarWrapper).toHaveAttribute("data-state", "expanded", { timeout: 5000 })
  })

  test("clicking sidebar component navigates", async ({ page }) => {
    await page.goto("/playground/button")
    // Reopen sidebar first
    await page.getByRole("button", { name: /toggle sidebar/i }).last().click()
    const sidebarWrapper = page.locator("[data-state]").first()
    await expect(sidebarWrapper).toHaveAttribute("data-state", "expanded", { timeout: 5000 })
    // Expand Inputs category and click Checkbox
    const sidebar = page.locator("[data-sidebar='sidebar']")
    await sidebar.getByText("Inputs").click()
    await sidebar.getByText("Checkbox").click()
    await expect(page).toHaveURL(/\/playground\/checkbox/)
  })

  test("shows 'not found' for invalid slug", async ({ page }) => {
    await page.goto("/playground/nonexistent-component")
    await expect(page.getByText(/not found/i)).toBeVisible()
  })
})

test.describe("Playground - Theme Toggle", () => {
  test("toggle dark theme applies dark class to canvas", async ({ page }) => {
    await page.goto("/playground/button")
    // Click the dark theme button (Moon icon)
    await page.getByRole("button", { name: /dark theme/i }).click()
    // The canvas should have the 'dark' class
    const canvas = page.locator(".dark")
    await expect(canvas).toBeVisible()
  })

  test("toggle back to light removes dark class", async ({ page }) => {
    await page.goto("/playground/button")
    await page.getByRole("button", { name: /dark theme/i }).click()
    await page.getByRole("button", { name: /light theme/i }).click()
    const darkElements = page.locator(".dark")
    await expect(darkElements).toHaveCount(0)
  })
})

test.describe("Playground - Breakpoints", () => {
  test("breakpoint buttons are visible", async ({ page }) => {
    await page.goto("/playground/button")
    await expect(page.getByRole("button", { name: "Small (640px)" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Medium (768px)" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Large (1024px)" })).toBeVisible()
  })

  test("clicking sm breakpoint constrains canvas width", async ({ page }) => {
    await page.goto("/playground/button")
    await page.getByRole("button", { name: /small/i }).click()
    const inner = page.locator("[style*='max-width: 640px']")
    await expect(inner).toBeVisible()
  })
})

test.describe("Playground - Variant Selectors", () => {
  test("button shows variant and size groups in popover", async ({ page }) => {
    await page.goto("/playground/button")
    // Variants live in the bottom-bar Variants popover, fed by editTree.cvaExports
    await page.getByRole("button", { name: /^variants$/i }).click()
    // Button has both `variant` and `size` cva groups
    await expect(page.getByText("variant", { exact: true })).toBeVisible()
    await expect(page.getByText("size", { exact: true })).toBeVisible()
  })

  test("badge shows variant group only in popover", async ({ page }) => {
    await page.goto("/playground/badge")
    await page.getByRole("button", { name: /^variants$/i }).click()
    // Badge has a single cva group: `variant`
    await expect(page.getByText("variant", { exact: true })).toBeVisible()
    await expect(page.getByText("size", { exact: true })).not.toBeVisible()
  })

  test("card shows no variants popover trigger", async ({ page }) => {
    await page.goto("/playground/card")
    // Card has no cva exports, so the Variants popover trigger isn't rendered
    const trigger = page.getByRole("button", { name: /^variants$/i })
    await expect(trigger).toHaveCount(0)
  })
})
