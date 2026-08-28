import { test, expect } from "@playwright/test";

test.describe("Authentication Flow E2E Suite", () => {
  const timestamp = Date.now();
  const testUser = {
    name: `Test Student ${timestamp}`,
    email: `e2e-user-${timestamp}@example.com`,
    password: "Password123!",
  };

  test("should register a new account and land on dashboard", async ({ page }) => {
    await page.goto("/register");
    await page.fill('input[type="text"]', testUser.name);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator("h1")).toContainText(`Welcome back, ${testUser.name}`);
  });

  test("should prevent registering duplicate email addresses", async ({ page }) => {
    await page.goto("/register");
    await page.fill('input[type="text"]', testUser.name);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Should display duplicate email error
    await expect(page.locator("form")).toBeVisible();
    await expect(page.getByText(/already exists/i)).toBeVisible();
  });

  test("should sign out and redirect unauthenticated access to login", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard/);

    // Sign out
    await page.click('button:has-text("Sign out")');
    await expect(page).toHaveURL("/");

    // Unauthenticated access to dashboard should redirect to login
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});
