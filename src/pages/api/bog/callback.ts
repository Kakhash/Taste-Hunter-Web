import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  try {
    const { shop_order_id, status } = req.body;

    if (!shop_order_id || !status || status.toUpperCase() !== "SUCCESS") {
      return res.status(400).json({ ok: false, error: "Invalid callback data" });
    }

    await prisma.order.update({
      where: { id: shop_order_id },
      data: { status: "paid" }
    });

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error("[BOG CALLBACK ERROR]", e);
    return res.status(500).json({ ok: false, error: e.message });
  }
}
