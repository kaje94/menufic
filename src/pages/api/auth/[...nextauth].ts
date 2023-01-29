import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { Redis } from "@upstash/redis";
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { env } from "src/env/server.mjs";

const redis = new Redis({
    token: env.UPSTASH_REDIS_TOKEN,
    url: env.UPSTASH_REDIS_URL,
});

export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(redis, {
        baseKeyPrefix: `menuApp-${env.NODE_ENV}:`,
    }),
    // Include user.id on session
    callbacks: {
        session({ session, user }) {
            if (session.user) {
                // eslint-disable-next-line no-param-reassign
                session.user.id = user.id;
            }
            return session;
        },
    },
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        }),
        /**
         * ...add more providers here
         *
         * Most other providers require a bit more work than the Discord provider.
         * For example, the GitHub provider requires you to add the
         * `refresh_token_expires_in` field to the Account model. Refer to the
         * NextAuth.js docs for the provider you want to use. Example:
         * @see https://next-auth.js.org/providers/github
         */
    ],
};

export default NextAuth(authOptions);
