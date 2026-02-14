import { test } from "@playwright/test";

test.skip(
  !process.env.CAPTURE_PR_SCREENSHOTS,
  "Utility test only used when refreshing PR screenshots.",
);

test("capture PR screenshots", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
  });

  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForSelector(".odontogram-svg");

  await page.screenshot({
    path: "docs/screenshots/01-overview.png",
    fullPage: true,
  });

  const input = page.getByTestId("treatment-autocomplete-input");
  await input.click();
  await input.fill("02.0");
  await page.waitForSelector(".autocomplete-item");
  await page.screenshot({
    path: "docs/screenshots/02-autocomplete.png",
    fullPage: true,
  });

  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.waitForSelector("[data-testid='selected-treatment-code']");

  await page.getByTestId("face-hit-18-S").click();
  await page.getByTestId("face-hit-18-C").click();
  await page.getByTestId("face-hit-18-D").click();

  await page.screenshot({
    path: "docs/screenshots/03-applied-faces.png",
    fullPage: true,
  });
});
