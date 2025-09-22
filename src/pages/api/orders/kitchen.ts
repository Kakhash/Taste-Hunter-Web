// pages/api/orders/kitchen.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

// prevent multiple Prisma clients in dev (hot-reload)
const globalForPrisma = global as unknown as { prisma?: PrismaClient };
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error"] : [],
  });
if (process.env.NODE_ENV === "development") globalForPrisma.prisma = prisma;

// optional simple header auth (set KITCHEN_KEY in .env.local to enable)
const KITCHEN_KEY = process.env.KITCHEN_KEY || "";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ ok: false, error: "Method not allowed" });

  if (KITCHEN_KEY) {
    const key = req.headers["x-kitchen-key"];
    if (key !== KITCHEN_KEY) return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  try {
    // show last 24h, newest first (adjust as you like)
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 50,
      // if you want only active tickets in kitchen, uncomment:
      // where: { status: { in: ["unpaid", "paid"] }, createdAt: { gte: since } },
    });

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ ok: true, orders });
  } catch (e: any) {
    console.error("[KITCHEN ORDERS ERROR]", e);
    return res.status(500).json({ ok: false, error: e.message || "Server error" });
  }
}