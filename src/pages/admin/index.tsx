// pages/admin/index.tsx
import { parseCookies } from "nookies";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const { admin_auth } = parseCookies();

    if (
      admin_auth !== process.env.NEXT_PUBLIC_ADMIN_PASS &&
      admin_auth !== process.env.NEXT_PUBLIC_KITCHEN_KEY
    ) {
      router.push("/admin/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold">✅ Logged in to Admin Panel</h1>
    </div>
  );
}
