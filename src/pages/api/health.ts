import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "src/server/db";
import { imageKit } from "src/server/imageUtil";

import { redis } from "./auth/[...nextauth]";

/** Health check endpoint to verify whether Menufic is able to communicate with Database, Redis & ImageKit */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await Promise.all([prisma.restaurant.findFirst(), redis.ping(), imageKit.listFiles({ limit: 1 })]);
    res.status(200).json({ status: "success" });
};

export default handler;
