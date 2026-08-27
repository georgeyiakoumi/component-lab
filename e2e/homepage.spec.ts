import { test, expect } from "@playwright/test"

test.describe("Homepage", () => {
  test("redirects to playground", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveURL(/\/playground\/base\/button/)
  })
})
