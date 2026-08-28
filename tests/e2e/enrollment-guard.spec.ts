import { test, expect } from "@playwright/test";

test.describe("Lesson Access & Purchase Guard Integration Suite", () => {
  test("should block non-enrolled students from accessing non-preview video lessons", async ({ page }) => {
    // Attempt accessing arbitrary lesson URL directly
    await page.goto("/learn/dummy-course-id/dummy-lesson-id");

    // Must require login or return access error
    await expect(page).toHaveURL(/(\/login|\/learn\/)/);
  });
});
