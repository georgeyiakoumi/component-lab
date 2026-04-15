import { test, expect } from "@playwright/test"

test.describe("Homepage", () => {
  test("loads with heading and tagline", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("heading", { name: /component lab/i })).toBeVisible()
  })

  test("launch button navigates to playground", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: /launch/i }).click()
    await expect(page).toHaveURL(/\/playground/)
  })
})
