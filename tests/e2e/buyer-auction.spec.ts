import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
});

test("buyer can search inventory, open detail, place a bid, and see it after reload", async ({ page }) => {
  await expect(page.locator(".vcard")).toHaveCount(200);

  await page.getByLabel("Search inventory").fill("Tesla");
  await expect(page.locator(".vcard")).toHaveCount(9);

  const firstCard = page.locator(".vcard").first();
  await expect(firstCard).toContainText("Tesla");
  await firstCard.click();

  await expect(page.locator(".dr-title")).toContainText("Tesla");
  await expect(page.getByRole("button", { name: "Bid" })).toBeVisible();

  const topBidText = await page.locator(".top-bid b").innerText();
  const topBid = Number(topBidText.replace(/[^0-9]/g, ""));
  const minimumBid = topBid + 100;
  const newBid = topBid + 1_000;

  await page.getByRole("button", { name: "Bid" }).click();
  await expect(page.getByRole("dialog", { name: "Place bid" })).toBeVisible();

  await page.locator("#bid-amount").fill(String(topBid));
  await expect(page.getByRole("button", { name: "Confirm bid" })).toBeDisabled();
  await expect(page.locator(".field-error")).toContainText(`Bid must be at least $${minimumBid.toLocaleString("en-US")}.`);

  await page.locator("#bid-amount").fill(String(newBid));
  await page.getByRole("button", { name: "Confirm bid" }).click();

  await expect(page.locator(".success-toast")).toContainText(`Your bid of $${newBid.toLocaleString("en-US")} is in.`);
  await expect(page.locator(".top-bid b")).toHaveText(`$${newBid.toLocaleString("en-US")}`);

  await page.reload();
  await page.getByLabel("Search inventory").fill("Tesla");
  await expect(page.locator(".vcard").first()).toContainText(`$${newBid.toLocaleString("en-US")}`);
});

test("buyer flow remains usable on a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".vcard")).toHaveCount(200);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);

  await page.getByLabel("Search inventory").fill("Tesla");
  await expect(page.locator(".vcard")).toHaveCount(9);
  await page.locator(".vcard").first().click();

  await expect(page.locator(".dr-title")).toContainText("Tesla");
  await page.getByRole("button", { name: "Bid" }).click();
  await expect(page.getByRole("dialog", { name: "Place bid" })).toBeVisible();

  const modalWidth = await page.locator(".modal").evaluate((node) => node.getBoundingClientRect().width);
  expect(modalWidth).toBeLessThanOrEqual(390);
});

test("buyer can add a vehicle to the watchlist and find it after reload", async ({ page }) => {
  await page.locator(".vcard").first().click();
  await expect(page.locator(".dr-title")).toBeVisible();

  await page.getByRole("button", { name: "Watchlist" }).click();
  await expect(page.getByRole("button", { name: "Watching" })).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Back to inventory" }).click();
  await page.getByRole("button", { name: "Watchlist" }).click();
  await expect(page.locator(".vcard")).toHaveCount(1);

  await page.reload();
  await page.getByRole("button", { name: "Watchlist" }).click();
  await expect(page.locator(".vcard")).toHaveCount(1);
});

test("buyer can refine inventory from the all-filters drawer", async ({ page }) => {
  await page.getByRole("button", { name: "All filters" }).click();
  const drawer = page.getByRole("dialog", { name: "All filters" });
  await expect(drawer).toBeVisible();

  await drawer.getByRole("button", { name: "Body style" }).click();
  const bodyStyleFilter = page.getByRole("dialog", { name: "Body style filter" });
  await bodyStyleFilter.getByRole("option", { name: "SUV" }).click();
  await bodyStyleFilter.getByRole("button", { name: "Done" }).click();

  await drawer.getByRole("button", { name: "Damage" }).click();
  await page.getByRole("dialog", { name: "Damage filter" }).getByRole("option", { name: "Damage reported" }).click();

  await drawer.getByRole("button", { name: "Done" }).click();
  await expect(drawer).toBeHidden();
  await expect(page.getByLabel("Active filters")).toContainText("SUV");
  await expect(page.getByLabel("Active filters")).toContainText("Damage reported");
  await expect(page.locator(".vcard")).toHaveCount(65);

  await page.getByRole("button", { name: "Clear all" }).click();
  await expect(page.locator(".vcard")).toHaveCount(200);
});

test("buyer can open the detail image gallery and switch images", async ({ page }) => {
  await page.locator(".vcard").first().click();
  await expect(page.locator(".dr-title")).toBeVisible();

  await page.getByRole("button", { name: "Open image gallery" }).first().click();
  const gallery = page.getByRole("dialog", { name: "Vehicle image gallery" });
  await expect(gallery).toBeVisible();
  await expect(gallery.locator(".gallery-count")).toContainText(/^1 of \d+$/);

  await gallery.getByRole("button", { name: "Show image 2" }).click();
  await expect(gallery.locator(".gallery-count")).toContainText(/^2 of \d+$/);

  await page.keyboard.press("Escape");
  await expect(gallery).toBeHidden();
});
