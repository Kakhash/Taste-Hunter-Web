// pages/api/tbc/create-payment.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function getTbcAccessToken() {
  const base = process.env.TBC_BASE_URL!;
  const clientId = process.env.TBC_CLIENT_ID!;
  const clientSecret = process.env.TBC_CLIENT_SECRET!;
  if (!base || !clientId || !clientSecret) throw new Error("Missing TBC env vars");

  const resp = await fetch(`${base}/v1/tpay/access-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      apikey: process.env.TBC_API_KEY!
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials"
    })
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(`TBC token error: ${resp.status}`);
  return data.access_token;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });
  try {
    const { amount, items = [], lang = "KA" } = req.body as { amount: number; items: any[]; lang?: "KA" | "EN" };
    if (!amount || items.length === 0) {
      return res.status(400).json({ ok: false, error: "Amount and items required" });
    }

    // Save order
    const order = await prisma.order.create({
      data: { items, total: amount, status: "unpaid" }
    });

    const token = await getTbcAccessToken();

    const payload = {
      amount: { currency: "GEL", total: amount },
      returnurl: `${process.env.TBC_RETURN_URL}?status=success&orderId=${order.id}`,
      callbackUrl: `${process.env.TBC_CALLBACK_URL}?orderId=${order.id}`,
      merchantPaymentId: order.id,
      description: "Order payment",
      language: lang
    };

    const response = await fetch(`${process.env.TBC_BASE_URL}/v1/tpay/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.TBC_API_KEY!,
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ ok: false, error: data });

    const approval = (data.links || []).find((l: any) => l.rel === "approval_url");

    return res.status(200).json({
      ok: true,
      orderId: order.id,
      payId: data.payId,
      redirectUrl: approval?.uri || null,
      raw: data
    });
  } catch (e: any) {
    console.error("[TBC CREATE PAYMENT ERROR]", e);
    return res.status(500).json({ ok: false, error: e.message || "TBC error" });
  }
}

