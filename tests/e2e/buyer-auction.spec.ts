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
  const newBid = topBid + 1_000;

  await page.getByRole("button", { name: "Bid" }).click();
  await expect(page.getByRole("dialog", { name: "Place bid" })).toBeVisible();

  await page.locator("#bid-amount").fill(String(topBid));
  await expect(page.getByRole("button", { name: "Confirm bid" })).toBeDisabled();
  await expect(page.locator(".field-error")).toContainText(`Bid must be above ${topBidText}.`);

  await page.locator("#bid-amount").fill(String(newBid));
  await page.getByRole("button", { name: "Confirm bid" }).click();

  await expect(page.locator(".success-toast")).toContainText(`Your bid for $${newBid.toLocaleString("en-US")}`);
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
