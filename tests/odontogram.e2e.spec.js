import { expect, test } from "@playwright/test";

async function selectTreatment(page, code) {
  const input = page.getByTestId("treatment-autocomplete-input");
  await input.click();
  await input.fill(code);
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("selected-treatment-code")).toHaveText(code);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
  });
  await page.goto("/");
});

test("allows selecting a treatment from autocomplete with mouse", async ({
  page,
}) => {
  const input = page.getByTestId("treatment-autocomplete-input");
  await input.click();
  await input.fill("02.0");

  const firstSuggestion = page.locator(".autocomplete-item").first();
  await expect(firstSuggestion).toBeVisible();
  await firstSuggestion.click();

  await expect(page.getByTestId("selected-treatment-code")).toHaveText("02.01");
});

test("applies treatment when moving mouse around the same face hit area", async ({
  page,
}) => {
  await selectTreatment(page, "02.01");

  const face = page.getByTestId("face-hit-18-S");
  await expect(face).toBeVisible();

  const relativePoints = [
    [0.5, 0.5],
    [0.25, 0.65],
    [0.75, 0.35],
    [0.5, 0.2],
  ];

  for (let index = 0; index < relativePoints.length; index += 1) {
    const [rx, ry] = relativePoints[index];
    const bounds = await face.boundingBox();
    if (!bounds) {
      throw new Error("Could not measure clickable area for face-hit-18-S.");
    }

    const x = bounds.x + bounds.width * rx;
    const y = bounds.y + bounds.height * ry;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.up();
    await expect(page.getByTestId("applied-treatment-item")).toHaveCount(index + 1);
  }

  await expect(page.getByTestId("applied-treatment-item").first()).toContainText(
    "P18",
  );
  await expect(page.getByTestId("applied-treatment-item").first()).toContainText(
    "Cara superior",
  );
});

test("shows warning when treatment does not allow full-tooth application", async ({
  page,
}) => {
  await selectTreatment(page, "02.01");
  await page.getByTestId("tooth-hit-18-X").click();

  const warning = page.locator(".feedback-banner--warning");
  await expect(warning).toBeVisible();
  await expect(warning).toContainText(
    "no se puede aplicar a toda la pieza",
  );
});
