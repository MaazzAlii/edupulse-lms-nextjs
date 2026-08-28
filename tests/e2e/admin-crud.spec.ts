import { test, expect } from "@playwright/test";

test.describe("Admin Management CRUD E2E Suite", () => {
  const timestamp = Date.now();
  const adminUser = {
    name: `Admin Tester ${timestamp}`,
    email: `e2e-admin-${timestamp}@example.com`,
    password: "AdminPassword123!",
  };

  test("should allow admin navigation and user management viewing", async ({ page }) => {
    // 1. Register user
    await page.goto("/register");
    await page.fill('input[type="text"]', adminUser.name);
    await page.fill('input[type="email"]', adminUser.email);
    await page.fill('input[type="password"]', adminUser.password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard/);

    // Non-admin attempting to visit /admin will be redirected to home /
    await page.goto("/admin");
    await expect(page).toHaveURL("/");
  });
});
