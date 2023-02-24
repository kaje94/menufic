// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, test } from "playwright-test-coverage";

import type { Page } from "@playwright/test";

test.describe.configure({ mode: "serial" });

let page: Page;
let restaurantName = `Thai Cafe ${Date.now()}`;

const uploadImage = async (imageName: string) => {
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByTestId("image-upload-dropzone").click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(`./tests/sample-images/${imageName}`);
    await page.getByTestId("crop-image").click({ delay: 500 });
};

const isEmptyMenuPage = async (menuPage: Page) => {
    await expect(menuPage.getByTestId("empty-placeholder")).toBeVisible();
    await expect(menuPage.getByTestId("menu-item-card")).toBeHidden();
    await expect(menuPage.getByTestId("restaurant-banner")).toBeHidden();
};

const isFilledMenuPage = async (menuPage: Page) => {
    const menuCard = menuPage.getByTestId("menu-item-card");
    await expect(menuCard).toHaveCount(2);
    await menuCard.first().click();
    const itemCardModal = menuPage.getByTestId("menu-item-card-modal");
    await expect(itemCardModal).toBeVisible();
    await itemCardModal.locator("button").click();
    await expect(menuPage.getByTestId("restaurant-banner")).toBeVisible();
};

const clickWhenEnabled = async (elementId: string, pageRef: Page) => {
    const buttonElement = pageRef.getByTestId(elementId);
    await buttonElement.scrollIntoViewIfNeeded();
    await expect(buttonElement).toBeEnabled();
    await buttonElement.click();
};

test.beforeAll(async ({ browser }) => {
    // Login using the loginKey before accessing the dashboard
    page = await browser.newPage();
    expect(process.env.TEST_MENUFIC_USER_LOGIN_KEY).toBeTruthy();
    await page.goto(`${process.env.TEST_MENUFIC_BASE_URL}/auth/signin-test-user`);
    if (process.env.TEST_MENUFIC_USER_LOGIN_KEY) {
        await page.getByLabel("Login Key").fill(process.env.TEST_MENUFIC_USER_LOGIN_KEY);
    }
    await page.getByTestId("submit-test-login").click();
    await expect(page).toHaveURL(`${process.env.TEST_MENUFIC_BASE_URL}/restaurant`);
});

test("should add new restaurant", async () => {
    await page.goto(`${process.env.TEST_MENUFIC_BASE_URL}/restaurant`);
    await page.getByTestId("add-new-restaurant").click();
    await page.getByLabel("Name").fill(restaurantName);
    await page.getByLabel("Location").fill("No 25, Colombo, Sri Lanka");
    await page.getByLabel("Contact Number").fill("+94776655443");
    await uploadImage("restaurant-image-1.jpg");
    await clickWhenEnabled("save-restaurant-form", page);
    await expect(page.getByTestId(`restaurant-card-${restaurantName}`)).toBeVisible({ timeout: 15000 });
});

test("should edit restaurant", async () => {
    const restaurantCard = page.getByTestId(`restaurant-card-${restaurantName}`);
    await restaurantCard.getByTestId("edit-delete-options").click();
    await page.getByTestId("menu-item-edit").click();
    restaurantName = `${restaurantName} edited`;
    await page.getByLabel("Name").fill(restaurantName);
    await page.getByTestId("save-restaurant-form").click();
    await expect(restaurantCard).toBeVisible();
});

test("should add first banner", async () => {
    await page.getByTestId(`restaurant-card-${restaurantName}`).click();
    await page.getByTestId("manage-banners-card").click();
    const bannerCard = page.getByTestId(`banner-card-0`);
    await expect(bannerCard).not.toBeVisible();
    await page.getByTestId("add-new-banner").click();
    await uploadImage("banner-image-1.jpg");
    await clickWhenEnabled("save-banner-form", page);
    await expect(bannerCard).toBeVisible({ timeout: 15000 });
});

test("should add & delete second banner", async () => {
    await page.getByTestId("add-new-banner").click();
    await uploadImage("banner-image-2.jpg");
    await clickWhenEnabled("save-banner-form", page);
    const bannerCard = page.getByTestId(`banner-card-1`);
    await expect(bannerCard).toBeVisible({ timeout: 15000 });
    await bannerCard.getByTestId("edit-delete-options").click();
    await page.getByTestId("menu-item-delete").click();
    await page.getByTestId("confirm-delete-modal-btn").click();
    await expect(bannerCard).toBeHidden();
});

test("should add & edit menu", async () => {
    await page.getByText(`${restaurantName}`).click();
    await page.goto(`${page.url()}/edit-menu`);
    await page.getByTestId("add-new-menu-button").click();
    await page.getByLabel("Name").fill("menu");
    await page.getByLabel("Available Time").fill("All day");
    await page.getByTestId("save-menu-form").click();
    const initialMenuLocator = page.getByTestId(`menu-item menu`);
    await expect(initialMenuLocator).toBeVisible();
    await initialMenuLocator.getByTestId("edit-delete-options").click();
    await page.getByTestId("menu-item-edit").click();
    await page.getByLabel("Name").fill("Menu");
    await page.getByTestId("save-menu-form").click();
    await expect(page.getByTestId(`menu-item Menu`)).toBeVisible();
});

test("should add & edit category", async () => {
    await page.getByTestId("add-new-category-button").click();
    await page.getByLabel("Name").fill("Items");
    await page.getByTestId("save-category-form").click();
    const initialCategoryLocator = page.getByTestId(`category-item Items`);
    await expect(initialCategoryLocator).toBeVisible();
    await initialCategoryLocator.getByTestId("edit-delete-options").click();
    await page.getByTestId("menu-item-edit").click();
    await page.getByLabel("Name").fill("All Items");
    await page.getByTestId("save-category-form").click();
    await expect(page.getByTestId(`category-item All Items`)).toBeVisible();
});

test("should add first menu item", async () => {
    const itemName = "Crab Curry";
    await page.getByTestId("add-new-menu-item-button").click();
    await page.getByLabel("Name").fill(itemName);
    await page.getByLabel("Price").fill("Rs. 1450.00");
    await page.getByLabel("Description").fill("An unforgettably flavorful and glorious Spicy Sri Lankan Crab Curry");
    await uploadImage("menu-item-image-1.jpg");
    await clickWhenEnabled("save-menu-item-form", page);
    await expect(page.getByTestId(`menu-item ${itemName}`)).toBeVisible({ timeout: 15000 });
});

test("should add second menu item & update it", async () => {
    let itemName = "Thai Fish";
    await page.getByTestId("add-new-menu-item-button").click();
    await page.getByLabel("Name").fill(itemName);
    await page.getByLabel("Price").fill("Rs. 2125.00");
    await page.getByLabel("Description").fill("Soft and succulent fish with Thai flavors is the best of seafood");
    await uploadImage("menu-item-image-2.jpg");
    await clickWhenEnabled("save-menu-item-form", page);
    await expect(page.getByTestId(`menu-item ${itemName}`)).toBeVisible({ timeout: 15000 });
    const menuItem = page.getByTestId(`menu-item-edit ${itemName}`);
    await expect(menuItem).toBeEnabled();
    await menuItem.click();
    itemName = "Thai Fish Cakes";
    await page.getByLabel("Name").fill(itemName);
    await clickWhenEnabled("save-menu-item-form", page);
    await expect(page.getByTestId(`menu-item ${itemName}`)).toBeVisible();
});

test("should add third menu item & delete", async () => {
    const itemName = "Fried Rice";
    await page.getByTestId("add-new-menu-item-button").click();
    await page.getByLabel("Name").fill(itemName);
    await page.getByLabel("Price").fill("Rs. 1350.00");
    await clickWhenEnabled("save-menu-item-form", page);
    await expect(page.getByTestId(`menu-item ${itemName}`)).toBeVisible();
    await page.getByTestId(`menu-item-delete ${itemName}`).scrollIntoViewIfNeeded();
    await page.getByTestId(`menu-item-delete ${itemName}`).click();
    await page.getByTestId("confirm-delete-modal-btn").click();
    await expect(page.getByTestId(`menu-item ${itemName}`)).not.toBeVisible();
});

test("should publish & unpublish menu", async ({ browser }) => {
    const publishButton = page.getByTestId("publish-button");
    const publishToggle = page.locator(".mantine-Switch-thumb");

    await publishButton.scrollIntoViewIfNeeded();
    await expect(publishButton).toBeVisible();
    await publishButton.click();
    await expect(page.getByText("Publish and share your menu")).toBeVisible();

    // Check preview URL before publishing
    const previewPagePromise = page.waitForEvent("popup", { timeout: 15000 });
    await page.getByTestId("restaurant-preview-url").click();
    const previewPage = await previewPagePromise;
    await expect(previewPage.getByTestId("preview-mode-banner")).toBeVisible();
    await isFilledMenuPage(previewPage);

    // Check menu URL before publishing
    const menuPage = await browser.newPage();
    await menuPage.goto(previewPage.url().replace("preview", "menu"));
    await isEmptyMenuPage(menuPage);
    await expect(menuPage.getByTestId("empty-placeholder")).toBeVisible();

    // Check menu URL after publishing
    await publishToggle.click();
    await menuPage.reload();
    await expect(menuPage.getByTestId("preview-mode-banner")).not.toBeVisible();
    await isFilledMenuPage(menuPage);

    // open the menu from the explore page
    const explorePagePromise = previewPage.waitForEvent("popup");
    await previewPage.goto(`${process.env.TEST_MENUFIC_BASE_URL}/explore`);
    await previewPage.getByTestId(`explore-card ${restaurantName}`).click();
    const explorePage = await explorePagePromise;
    await isFilledMenuPage(explorePage);

    await publishToggle.click();
    await menuPage.reload();
    await isEmptyMenuPage(menuPage);

    await previewPage.close();
    await menuPage.close();
    await explorePage.close();
});

test.afterAll(async () => {
    // Deleting the restaurant should clear all data related to it and its sub entities
    await page.goto(`${process.env.TEST_MENUFIC_BASE_URL}/restaurant`);
    const updatedCard = page.getByTestId(`restaurant-card-${restaurantName}`);
    await updatedCard.getByTestId("edit-delete-options").click();
    await page.getByTestId("menu-item-delete").click();
    await page.getByTestId("confirm-delete-modal-btn").click();
    await expect(updatedCard).not.toBeVisible();
    await page.close();
});
