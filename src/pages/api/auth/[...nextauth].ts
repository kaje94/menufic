import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { Redis } from "@upstash/redis";
import NextAuth, { type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { env } from "src/env/server.mjs";

const redis = new Redis({
    token: env.UPSTASH_REDIS_REST_TOKEN,
    url: env.UPSTASH_REDIS_REST_URL,
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
            allowDangerousEmailAccountLinking: true,
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        }),
        GitHubProvider({
            allowDangerousEmailAccountLinking: true,
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
        }),
    ],
};

export default NextAuth(authOptions);
