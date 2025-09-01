// pages/admin/orders.tsx
import { PrismaClient } from "@prisma/client";
import type { GetServerSideProps } from "next";
import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { destroyCookie } from "nookies";
import { useRouter } from "next/router";

const prisma = new PrismaClient();

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = context.req.headers.cookie || "";
  const match = cookies.match(/admin_auth=(.*?)(;|$)/);
  const isAuthed =
    match &&
    (match[1] === process.env.ADMIN_PASS || match[1] === process.env.NEXT_PUBLIC_KITCHEN_KEY);

  if (!isAuthed) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }

  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });

  return {
    props: {
      initialOrders: JSON.parse(JSON.stringify(orders)),
    },
  };
};

export default function OrdersPage({ initialOrders }: any) {
  const [orders, setOrders] = useState(initialOrders);
  const audioRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);

        const hasUnreceived = data.orders.some(
          (o: any) => o.status === "unpaid" && !o.received
        );
        if (hasUnreceived && audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleExport = () => {
    const flatOrders = orders.map((o: any) => ({
      ID: o.id,
      Status: o.status,
      Total: o.total,
      Items: o.items.map((i: any) => `${i.name} × ${i.qty}`).join(", "),
      Created: new Date(o.createdAt).toLocaleString(),
    }));

    const ws = XLSX.utils.json_to_sheet(flatOrders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${new Date().toISOString()}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    destroyCookie(null, "admin_auth", { path: "/" });
    router.push("/admin/login");
  };

  return (
    <div style={{ padding: 20 }}>
      <audio ref={audioRef}>
        <source src="/sounds/ding.mp3" type="audio/mpeg" />
      </audio>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>🧾 Orders</h1>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#f87171",
            color: "white",
            padding: "8px 12px",
            border: "none",
            borderRadius: 4,
          }}
        >
          Logout
        </button>
      </div>

      <button
        onClick={handleExport}
        style={{
          marginBottom: 20,
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: 4,
        }}
      >
        Export to Excel
      </button>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Total</th>
            <th>Items</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: any) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.status}</td>
              <td>{order.total} GEL</td>
              <td>
                {order.items.map((item: any, idx: number) => (
                  <div key={idx}>
                    {item.name} × {item.qty}
                  </div>
                ))}
              </td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>
                {order.status === "unpaid" && !order.received && (
                  <button
                    onClick={async () => {
                      await fetch(`/api/admin/orders/${order.id}/receive`, { method: "POST" });
                      const res = await fetch("/api/admin/orders");
                      const data = await res.json();
                      setOrders(data.orders);
                    }}
                    style={{
                      backgroundColor: "#10b981",
                      color: "white",
                      padding: "5px 10px",
                      border: "none",
                      borderRadius: 4,
                    }}
                  >
                    Mark Received
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
