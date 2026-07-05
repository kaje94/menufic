// @ts-check
/**
 * This file is included in `/next.config.mjs` which ensures the app isn't built with invalid env vars.
 * It has to be a `.mjs`-file to be imported there.
 */
import { env as clientEnv, formatErrors } from "./client.mjs";
import { serverSchema } from "./schema.mjs";

/**
 * You can't destruct `process.env` as a regular object, so we do
 * a workaround. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [key: string]: string | undefined; }}
 */
const serverEnv = {};
Object.keys(serverSchema.shape).forEach((key) => {
    serverEnv[key] = process.env[key];
});

// eslint-disable-next-line no-underscore-dangle
const parsedServerEnv = serverSchema.safeParse(serverEnv);

if (!parsedServerEnv.success) {
    // eslint-disable-next-line no-console
    console.error("❌ Invalid environment variables:\n", ...formatErrors(parsedServerEnv.error.format()));
    throw new Error("Invalid environment variables");
}

Object.keys(parsedServerEnv.data).forEach((key) => {
    if (key.startsWith("NEXT_PUBLIC_")) {
        // eslint-disable-next-line no-console
        console.warn("❌ You are exposing a server-side env-variable:", key);
        throw new Error("You are exposing a server-side env-variable");
    }
});

export const env = { ...parsedServerEnv.data, ...clientEnv };
