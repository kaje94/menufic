// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: false,
    swcMinify: true,
    i18n: { locales: ["en"], defaultLocale: "en" },
    images: {
        unoptimized: true,
        formats: ["image/avif", "image/webp"],
        remotePatterns: [{ protocol: "https", hostname: "ik.imagekit.io", pathname: "/**" }],
    },
};
export default config;
