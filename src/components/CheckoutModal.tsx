// src/components/CheckoutModal.tsx
import React from "react";

type Item = { id: string; name: string; price: number; qty: number };

type Props = {
  t: any;
  items: Item[];
  total: number;
  onClose: () => void;
  onCheckout: () => void;
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  onRemove: (id: string) => void;
  paymentMethod: "bog" | "tbc";
  setPaymentMethod: (v: "bog" | "tbc") => void;
};

export default function CheckoutModal({
  t,
  items,
  total,
  onClose,
  onCheckout,
  onInc,
  onDec,
  onRemove,
  paymentMethod,
  setPaymentMethod,
}: Props) {
  if (!items || items.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="font-bold text-lg">{t.checkout}</div>
          <button onClick={onClose} className="px-3 py-1.5 rounded-xl border">
            {t.close || "Close"}
          </button>
        </div>

        <div className="p-4 grid gap-2 max-h-[60vh] overflow-auto">
          {items.map((it) => (
            <div key={it.id} className="flex items-center justify-between border rounded-xl px-3 py-2">
              <div className="min-w-0">
                <div className="font-medium truncate">{it.name}</div>
                <div className="text-xs text-slate-500">
                  {(t.gel === "₾" ? "₾" : "GEL")} {it.price.toFixed(2)} · {t.qty}: {it.qty}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onDec(it.id)} className="px-2 py-1 border rounded-lg">−</button>
                <button onClick={() => onInc(it.id)} className="px-2 py-1 border rounded-lg">+</button>
                <button onClick={() => onRemove(it.id)} className="px-2 py-1 border rounded-lg">{t.remove}</button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">{t.paymentMethod}:</span>
            <label className="inline-flex items-center gap-1 text-sm">
              <input
                type="radio"
                name="pm2"
                checked={paymentMethod === "bog"}
                onChange={() => setPaymentMethod("bog")}
              />{" "}
              {t.bog}
            </label>
            <label className="inline-flex items-center gap-1 text-sm">
              <input
                type="radio"
                name="pm2"
                checked={paymentMethod === "tbc"}
                onChange={() => setPaymentMethod("tbc")}
              />{" "}
              {t.tbc}
            </label>
          </div>

          <div className="flex items-center gap-3">
            <div className="font-semibold">
              {(t.gel === "₾" ? "₾" : "GEL")} {total.toFixed(2)}
            </div>
            <button
              onClick={onCheckout}
              className="inline-flex items-center justify-center px-3 py-2 rounded-xl bg-[#FF3B2E] text-white hover:opacity-95"
            >
              {t.checkout}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}