// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, test } from "playwright-test-coverage";

test.describe.configure({ mode: "serial" });

test("should render landing page", async ({ page }) => {
    await page.goto(`${process.env.TEST_MENUFIC_BASE_URL}`);
    const themeToggle = page.getByTestId("theme-toggle-button");
    await expect(page).toHaveScreenshot("landing.png", { fullPage: true, maxDiffPixels: 0.8, timeout: 15000 });

    await themeToggle.click();
    await expect(page).toHaveScreenshot("landing-dark.png", { fullPage: true, maxDiffPixels: 8, timeout: 15000 });
    await themeToggle.click();
});

test("should render privacy policy page", async ({ page }) => {
    await page.goto(`${process.env.TEST_MENUFIC_BASE_URL}`);
    await page.click("text=Privacy Policy");
    await expect(page).toHaveURL(`${process.env.TEST_MENUFIC_BASE_URL}/privacy-policy`);
    await expect(page).toHaveScreenshot("privacy-policy.png", { fullPage: true, maxDiffPixels: 0.7, timeout: 15000 });
});

test("should render terms and conditions page", async ({ page }) => {
    await page.goto(`${process.env.TEST_MENUFIC_BASE_URL}`);
    await page.click("text=Terms & Conditions");
    await expect(page).toHaveURL(`${process.env.TEST_MENUFIC_BASE_URL}/terms-and-conditions`);
    await expect(page).toHaveScreenshot("terms-and-conditions.png", {
        fullPage: true,
        maxDiffPixels: 0.7,
        timeout: 15000,
    });
});
