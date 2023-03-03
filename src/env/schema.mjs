// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
    DATABASE_URL: z.string().url(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    IMAGEKIT_BASE_FOLDER: z.string(),
    IMAGEKIT_PRIVATE_KEY: z.string(),
    IMAGEKIT_PUBLIC_KEY: z.string(),
    NEXTAUTH_SECRET: process.env.NODE_ENV === "production" ? z.string().min(1) : z.string().min(1).optional(),
    NEXTAUTH_URL: z.preprocess(
        // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
        // Since NextAuth automatically uses the VERCEL_URL if present.
        (str) => process.env.VERCEL_URL ?? str,
        // VERCEL_URL doesnt include `https` so it cant be validated as a URL
        process.env.VERCEL ? z.string() : z.string().url()
    ),
    NODE_ENV: z.enum(["development", "test", "production"]),
    SENTRY_AUTH_TOKEN: z.string().optional(),
    SENTRY_ORG: z.string().optional(),
    SENTRY_PROJECT: z.string().optional(),
    TEST_MENUFIC_USER_LOGIN_KEY: z.string().optional(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
    NEXT_PUBLIC_CONTACT_EMAIL: z.string().optional().default("bob@email.com"),
    NEXT_PUBLIC_FORM_API_KEY: z.string().optional(),
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: z.string(),
    NEXT_PUBLIC_MAX_BANNERS_PER_RESTAURANT: z.string().regex(/^\d+$/).default("5"),
    NEXT_PUBLIC_MAX_CATEGORIES_PER_MENU: z.string().regex(/^\d+$/).default("10"),
    NEXT_PUBLIC_MAX_MENUS_PER_RESTAURANT: z.string().regex(/^\d+$/).default("5"),
    NEXT_PUBLIC_MAX_MENU_ITEMS_PER_CATEGORY: z.string().regex(/^\d+$/).default("20"),
    NEXT_PUBLIC_MAX_RESTAURANTS_PER_USER: z.string().regex(/^\d+$/).default("5"),
    NEXT_PUBLIC_PROD_URL: z.string().optional().default("https://menufic.com"),
    NEXT_PUBLIC_SAMPLE_MENU_ID: z.string().optional(),
    NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
    NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    NEXT_PUBLIC_FORM_API_KEY: process.env.NEXT_PUBLIC_FORM_API_KEY,
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    NEXT_PUBLIC_MAX_BANNERS_PER_RESTAURANT: process.env.NEXT_PUBLIC_MAX_BANNERS_PER_RESTAURANT,
    NEXT_PUBLIC_MAX_CATEGORIES_PER_MENU: process.env.NEXT_PUBLIC_MAX_CATEGORIES_PER_MENU,
    NEXT_PUBLIC_MAX_MENUS_PER_RESTAURANT: process.env.NEXT_PUBLIC_MAX_MENUS_PER_RESTAURANT,
    NEXT_PUBLIC_MAX_MENU_ITEMS_PER_CATEGORY: process.env.NEXT_PUBLIC_MAX_MENU_ITEMS_PER_CATEGORY,
    NEXT_PUBLIC_MAX_RESTAURANTS_PER_USER: process.env.NEXT_PUBLIC_MAX_RESTAURANTS_PER_USER,
    NEXT_PUBLIC_PROD_URL: process.env.NEXT_PUBLIC_PROD_URL,
    NEXT_PUBLIC_SAMPLE_MENU_ID: process.env.NEXT_PUBLIC_SAMPLE_MENU_ID,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
};
