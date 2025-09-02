import { test, expect } from "@playwright/test";
import { Frodo } from "prisma/seed-data";

test.describe("Unauthenticated", () => {
  test("Sign in button is available on sign in screen", async ({ page }) => {
    await page.goto("/");
    page.getByText("Sign in with Google", { exact: true });
  });

  test("Navigates to dummy wishlist from the sign in page", async ({ page, isMobile }) => {
    await page.goto("/");
    await page.getByText("Frodo's picks", { exact: true }).click();
    await page.waitForURL(`/${Frodo.username}`);

    if (isMobile) {
      await expect(page.getByText(`@${Frodo.username}`, { exact: true })).toBeVisible();
      // Check first ACTIVE wishes are visible
      await expect(page.getByRole("button", { name: Frodo.wishes[0].name })).toBeVisible();
      await expect(page.getByRole("button", { name: Frodo.wishes[1].name })).toBeVisible();
    } else {
      await expect(page.getByRole("heading", { name: `Wishlist by @${Frodo.username}` })).toBeVisible();
      // Check first ACTIVE wishes are visible
      await expect(page.getByRole("heading", { name: Frodo.wishes[0].name })).toBeVisible();
      await expect(page.getByRole("heading", { name: Frodo.wishes[1].name })).toBeVisible();
      await expect(page.getByText(Frodo.wishes[0].comment!, { exact: true })).toBeVisible();
    }

    // Check FULFILLED wish is NOT visible
    await expect(page.getByText(Frodo.wishes[2].name, { exact: true })).toBeHidden();

    // Check ARCHIVED wish is NOT visible
    await expect(page.getByText(Frodo.wishes[3].name, { exact: true })).toBeHidden();

    // Check PRIVATE wish is NOT visible
    await expect(page.getByText(Frodo.wishes[4].name, { exact: true })).toBeHidden();
  });
});
