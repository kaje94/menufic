import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "src/server/db";
import { imageKit } from "src/server/imageUtil";

/** Health check endpoint to verify whether Menufic is able to communicate with Database & ImageKit */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await Promise.all([prisma.restaurant.findFirst(), imageKit.listFiles({ limit: 1 })]);
    res.status(200).json({ status: "success" });
};

export default handler;
