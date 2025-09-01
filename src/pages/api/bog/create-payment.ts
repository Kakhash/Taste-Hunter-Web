import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getBogToken() {
  const base = process.env.BOG_BASE_URL!;
  const id = process.env.BOG_CLIENT_ID!;
  const secret = process.env.BOG_SECRET_KEY!;

  const basic = Buffer.from(`${id}:${secret}`).toString("base64");

  const r = await fetch(`${base}/api/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basic}`,
    },
    body: "grant_type=client_credentials",
  });

  const j = await r.json();
  if (!r.ok) throw new Error(`BOG token failed ${r.status}: ${JSON.stringify(j)}`);
  return j.access_token as string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  try {
    const { amount, items = [], lang = "ka" } = req.body as {
      amount: number;
      items: any[];
      lang?: "ka" | "en";
    };

    if (!amount || items.length === 0) {
      return res.status(400).json({ ok: false, error: "Amount and items required" });
    }

    // 1. Save Order
    const order = await prisma.order.create({
      data: { items, total: amount, status: "unpaid" }
    });

    // 2. Get Access Token
    const token = await getBogToken();

    // 3. Format Items for BOG
    const bogItems = items.map((item) => ({
      amount: Number(item.price).toFixed(2),
      description: item.name,
      quantity: item.qty,
      product_id: item.id,
    }));

    // 4. Prepare Payload
    const payload = {
      intent: "CAPTURE",
      items: bogItems,
      locale: lang === "en" ? "en-US" : "ka",
      shop_order_id: order.id,
      redirect_url: `${process.env.BOG_REDIRECT_URL}?status=success&orderId=${order.id}`,
      callback_url: `${process.env.BOG_CALLBACK_URL}?orderId=${order.id}`,
      show_shop_order_id_on_extract: true,
      capture_method: "AUTOMATIC",
      purchase_units: [
        {
          amount: {
            currency_code: "GEL",
            value: Number(amount).toFixed(2),
          },
        },
      ],
    };

    // 5. Create BOG Payment
    const response = await fetch(`${process.env.BOG_BASE_URL}/api/v1/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ ok: false, error: data });

    // 6. Return Approval URL
    const approve = (data.links || []).find((l: any) => l.rel.toLowerCase() === "approve") || data.links?.[0];

    return res.status(200).json({
      ok: true,
      orderId: order.id,
      paymentHash: data.payment_hash,
      redirectUrl: approve?.href || null,
      raw: data
    });
  } catch (e: any) {
    console.error("[BOG CREATE PAYMENT ERROR]", e);
    return res.status(500).json({ ok: false, error: e.message || "BOG error" });
  }
}
