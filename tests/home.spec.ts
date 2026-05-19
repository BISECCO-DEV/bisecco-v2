import { test, expect } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Bisecco/i);
});

test("connexion page reachable", async ({ page }) => {
  await page.goto("/connexion");
  await expect(page.locator("form")).toBeVisible();
});
