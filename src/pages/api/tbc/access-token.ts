// pages/api/tbc/access-token.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const base = process.env.TBC_BASE_URL!;
    const apikey = process.env.TBC_API_KEY!;
    const clientId = process.env.TBC_CLIENT_ID!;
    const clientSecret = process.env.TBC_CLIENT_SECRET!;

    if (!base || !apikey || !clientId || !clientSecret) {
      return res.status(500).json({ ok: false, error: "Missing TBC env variables" });
    }

    const body = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    });

    console.log("📤 REQUEST TO TBC ACCESS TOKEN:");
    console.log("➡️ URL:", `${base}/v1/tpay/access-token`);
    console.log("➡️ HEADERS:", {
      "Content-Type": "application/x-www-form-urlencoded",
      apikey,
    });
    console.log("➡️ BODY:", body.toString());

    const response = await fetch(`${base}/v1/tpay/access-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        apikey,
      },
      body,
    });

    const raw = await response.text();
    console.log("📥 RAW RESPONSE FROM TBC:", raw);

    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      console.error("❌ JSON PARSE ERROR:", e);
      return res.status(500).json({
        ok: false,
        error: "Invalid JSON returned (possibly HTML response)",
        raw,
      });
    }

    if (!response.ok) {
      return res.status(response.status).json({ ok: false, error: data });
    }

    return res.status(200).json({ ok: true, ...data });
  } catch (e: any) {
    console.error("❌ TBC CATCH ERROR:", e);
    return res.status(500).json({ ok: false, error: e?.message || "TBC token error" });
  }
}
