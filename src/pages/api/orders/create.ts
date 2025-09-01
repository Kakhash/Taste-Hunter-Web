import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  try {
    const { items, total } = req.body;

    if (!items || !Array.isArray(items) || typeof total !== "number") {
      return res.status(400).json({ error: "Invalid request" });
    }

    const order = await prisma.order.create({
      data: {
        items,
        total,
        status: "unpaid",
      },
    });

    return res.status(201).json({ orderId: order.id });
  } catch (error) {
    console.error("[ORDER CREATE ERROR]", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}