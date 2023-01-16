// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET: process.env.NODE_ENV === "production" ? z.string().min(1) : z.string().min(1).optional(),
    NEXTAUTH_URL: z.preprocess(
        // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
        // Since NextAuth automatically uses the VERCEL_URL if present.
        (str) => process.env.VERCEL_URL ?? str,
        // VERCEL_URL doesnt include `https` so it cant be validated as a URL
        process.env.VERCEL ? z.string() : z.string().url()
    ),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),

    // Image kit related keys
    IMAGEKIT_PUBLIC_KEY: z.string(),
    IMAGEKIT_PRIVATE_KEY: z.string(),
    IMAGEKIT_BASE_FOLDER: z.string(),

    UPSTASH_REDIS_URL: z.string(),
    UPSTASH_REDIS_TOKEN: z.string(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: z.string(),

    // Limits
    NEXT_PUBLIC_MAX_RESTAURANTS_PER_USER: z.string().regex(/^\d+$/),
    NEXT_PUBLIC_MAX_MENUS_PER_RESTAURANT: z.string().regex(/^\d+$/),
    NEXT_PUBLIC_MAX_CATEGORIES_PER_MENU: z.string().regex(/^\d+$/),
    NEXT_PUBLIC_MAX_MENU_ITEMS_PER_CATEGORY: z.string().regex(/^\d+$/),
    NEXT_PUBLIC_MAX_BANNERS_PER_RESTAURANT: z.string().regex(/^\d+$/),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    NEXT_PUBLIC_MAX_RESTAURANTS_PER_USER: process.env.NEXT_PUBLIC_MAX_RESTAURANTS_PER_USER,
    NEXT_PUBLIC_MAX_MENUS_PER_RESTAURANT: process.env.NEXT_PUBLIC_MAX_MENUS_PER_RESTAURANT,
    NEXT_PUBLIC_MAX_CATEGORIES_PER_MENU: process.env.NEXT_PUBLIC_MAX_CATEGORIES_PER_MENU,
    NEXT_PUBLIC_MAX_MENU_ITEMS_PER_CATEGORY: process.env.NEXT_PUBLIC_MAX_MENU_ITEMS_PER_CATEGORY,
    NEXT_PUBLIC_MAX_BANNERS_PER_RESTAURANT: process.env.NEXT_PUBLIC_MAX_BANNERS_PER_RESTAURANT,
};
