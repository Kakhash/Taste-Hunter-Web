import React from "react";

type Item = { id: string; name: string; price: number; qty: number };

type Props = {
  t: any;
  items: Item[];
  total: number;
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  paymentMethod: "bog" | "tbc";
  setPaymentMethod: (v: "bog" | "tbc") => void;
  onClose: () => void;
};

export default function Cart({
  t,
  items,
  total,
  onInc,
  onDec,
  onRemove,
  onCheckout,
  paymentMethod,
  setPaymentMethod,
  onClose,
}: Props) {
  return (
    // wrapper lets clicks pass through, only the panel is interactive
    <div className="pointer-events-none fixed inset-0 z-50">
      {/* Compact panel – bottom-left so it doesn't cover right-side products */}
      <div className="pointer-events-auto fixed bottom-4 left-4 w-[20rem] max-w-[85vw] max-h-[70vh] bg-white border rounded-2xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="font-semibold">{t.cartTitle ?? "Your order"}</div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">✕</button>
        </div>

        {/* Items */}
        <div className="px-4 py-3 flex-1 overflow-y-auto space-y-3">
          {items.length === 0 ? (
            <div className="text-sm text-slate-500">{t.emptyCart}</div>
          ) : (
            items.map((it) => (
              <div key={it.id} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium truncate">{it.name}</div>
                  <div className="text-xs text-slate-500">
                    {(t.lang === "ka" ? "₾" : "GEL")} {(it.price * it.qty).toFixed(2)}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <button onClick={() => onDec(it.id)} className="px-2 py-1 border rounded">−</button>
                    <span className="text-sm">{it.qty}</span>
                    <button onClick={() => onInc(it.id)} className="px-2 py-1 border rounded">+</button>
                  </div>
                </div>
                <button onClick={() => onRemove(it.id)} className="text-[var(--th-red)] text-sm">Remove</button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold">{t.total}:</span>
            <span className="font-bold text-[var(--th-red)]">
              {(t.lang === "ka" ? "₾" : "GEL")} {total.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => setPaymentMethod("bog")}
              className={`px-3 py-1 rounded border ${paymentMethod === "bog" ? "bg-[var(--th-red)] text-white" : ""}`}
            >
              {t.bog ?? "BOG"}
            </button>
            <button
              onClick={() => setPaymentMethod("tbc")}
              className={`px-3 py-1 rounded border ${paymentMethod === "tbc" ? "bg-[var(--th-red)] text-white" : ""}`}
            >
              {t.tbc ?? "TBC"}
            </button>
          </div>

          <button
            onClick={onCheckout}
            disabled={items.length === 0}
            className="w-full bg-[var(--th-red)] text-white py-2 rounded-xl font-semibold hover:opacity-95 disabled:opacity-50"
          >
            {t.checkout}
          </button>
        </div>
      </div>
    </div>
  );
}
