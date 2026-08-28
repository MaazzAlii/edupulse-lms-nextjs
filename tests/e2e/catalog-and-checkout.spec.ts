import { test, expect } from "@playwright/test";

test.describe("Catalog & Search E2E Suite", () => {
  test("should render home page course catalog with search and filters", async ({ page }) => {
    await page.goto("/");

    // Verify main brand heading
    await expect(page.locator("h1")).toContainText("Master New Skills");

    // Search input interactions
    const searchInput = page.locator('input[placeholder*="Search courses"]');
    await expect(searchInput).toBeVisible();

    await searchInput.fill("React");
    await page.click('button:has-text("Search")');

    // Sort selector presence
    const sortSelect = page.locator("select").last();
    await expect(sortSelect).toBeVisible();
  });

  test("should handle unauthenticated checkout redirect to login", async ({ page }) => {
    await page.goto("/");

    // Click first course card if exists
    const courseCard = page.locator("a.card-surface-hover").first();
    if (await courseCard.isVisible()) {
      await courseCard.click();

      // Check for Enroll button
      const enrollBtn = page.locator('button:has-text("Enroll")').first();
      if (await enrollBtn.isVisible()) {
        await enrollBtn.click();
        // Unauthenticated user redirected to login
        await expect(page).toHaveURL(/\/login/);
      }
    }
  });
});
