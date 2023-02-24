import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { Redis } from "@upstash/redis";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { env } from "src/env/server.mjs";

export const redis = new Redis({
    token: env.UPSTASH_REDIS_REST_TOKEN,
    url: env.UPSTASH_REDIS_REST_URL,
});

export const authOptions: NextAuthOptions = {
    // todo: check what happens when flush redis data
    adapter: UpstashRedisAdapter(redis, {
        baseKeyPrefix: `menuApp-${env.NODE_ENV}:`,
    }),
    // Include user.id on session
    callbacks: {
        session({ session, token }) {
            if (session.user && token.sub) {
                // eslint-disable-next-line no-param-reassign
                session.user.id = token.sub;
            }
            return session;
        },
    },
    pages: { signIn: "/auth/signin" },
    providers: [
        GoogleProvider({
            allowDangerousEmailAccountLinking: true,
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        }),
        GitHubProvider({
            allowDangerousEmailAccountLinking: true,
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
        }),
        CredentialsProvider({
            authorize(credentials) {
                if (env.TEST_MENUFIC_USER_LOGIN_KEY && credentials?.loginKey === env.TEST_MENUFIC_USER_LOGIN_KEY) {
                    return { email: "testUser@gmail.com", id: "testUser", image: "", name: "Test User" };
                }
                // If you return null then an error will be displayed advising the user to check their details.
                return null;
                // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
            },
            credentials: { loginKey: { label: "Login Key", type: "password" } },
            type: "credentials",
        }),
    ],
    session: {
        // Seconds - How long until an idle session expires and is no longer valid.
        maxAge: 30 * 24 * 60 * 60, // 30 days
        strategy: "jwt",
        // Seconds - Throttle how frequently to write to database to extend a session.
        // Use it to limit write operations. Set to 0 to always update the database.
        // Note: This option is ignored if using JSON Web Tokens
        updateAge: 24 * 60 * 60, // 24 hours
    },
};

export default NextAuth(authOptions);
