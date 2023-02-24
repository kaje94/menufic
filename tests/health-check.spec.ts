// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, test } from "playwright-test-coverage";

test("should ping health check endpoint", async ({ request }) => {
    const healthResponse = await request.get(`${process.env.TEST_MENUFIC_BASE_URL}/api/health`);
    expect(healthResponse.ok()).toBeTruthy();
    expect(await healthResponse.json()).toEqual(
        expect.objectContaining({
            status: "success",
        })
    );
});
