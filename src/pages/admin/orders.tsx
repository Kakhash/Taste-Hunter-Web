// pages/admin/orders.tsx
import { useEffect, useState } from "react";

export default function OrdersPage({ orders: initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);

  return (
    <div>
      <h1>Admin Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>{order.name} - {order.status}</li>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch("http://localhost:3000/api/admin/orders");
  const data = await res.json();

  return {
    props: {
      orders: data.orders || [],
    },
  };
}
