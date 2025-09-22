import React, { useEffect, useState } from "react";

type OrderItem = { name: string; qty: number };
interface Order {
  id: number;
  items: OrderItem[];
  total: number;
  status: string;      // "unpaid" | "paid" | "cancelled" etc.
  createdAt: string;
}

function StatusBadge({ status }: { status: string }) {
  const map = {
    paid: "bg-[color:var(--th-success)]/10 text-[color:var(--th-success)]",
    unpaid: "bg-[color:var(--th-warn)]/10 text-[color:var(--th-warn)]",
    cancelled: "bg-red-500/10 text-red-600",
    default: "bg-[color:var(--th-accent)]/10 text-[color:var(--th-accent)]",
  } as const;

  const cls =
    status === "paid"
      ? map.paid
      : status === "unpaid"
      ? map.unpaid
      : status === "cancelled"
      ? map.cancelled
      : map.default;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}

export default function KitchenMonitor() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/kitchen", {
          cache: "no-store",
          headers: { "x-kitchen-key": process.env.NEXT_PUBLIC_KITCHEN_KEY ?? "" },
        });
        const data = await res.json();

        if (!res.ok || !data?.ok) throw new Error(data?.error || "Failed to load orders");

        if (!cancelled) {
          setOrders(Array.isArray(data.orders) ? (data.orders as Order[]) : []);
          setError(null);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || "Network error");
          setOrders([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const list: Order[] = Array.isArray(orders) ? orders : [];

  return (
    <div className="min-h-screen bg-taste-bg text-taste-text">
      {/* Branded header */}
      <header className="sticky top-0 z-10 backdrop-blur bg-taste-bg/70 border-b border-taste-border">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            <span className="text-taste-primary">Taste Hunter</span>{" "}
            <span className="text-taste-text/90">Kitchen</span>
          </h1>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-taste-primary animate-pulse" />
            <span className="text-sm text-taste-muted">Live</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            Error: {error}
          </div>
        )}

        {loading ? (
          <div className="text-taste-muted">Loading…</div>
        ) : list.length === 0 ? (
          <div className="rounded-xl border border-dashed border-taste-border bg-taste-card p-8 text-center shadow">
            <p className="text-taste-muted">No active orders.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {list.map((order) => (
              <article
                key={order.id}
                className="rounded-2xl border border-taste-border bg-taste-card p-4 shadow-taste transition hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold">
                    Order <span className="text-taste-primary">#{order.id}</span>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="mt-1 text-sm text-taste-muted">
                  {new Date(order.createdAt).toLocaleTimeString()}
                </div>

                <ul className="mt-3 space-y-1 text-[15px]">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>{item.name}</span>
                      <span className="font-medium">× {item.qty}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-taste-muted">Total</span>
                  <span className="text-base font-bold">{order.total} GEL</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
