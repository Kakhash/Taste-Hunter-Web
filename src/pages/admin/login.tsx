import { useState } from "react";
import { setCookie } from "nookies";
import { useRouter } from "next/router";

export default function AdminLogin() {
  const [pin, setPin] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Entered PIN:", pin);
    console.log("Env ADMIN_PASS:", process.env.NEXT_PUBLIC_ADMIN_PASS);
    console.log("Env KITCHEN_KEY:", process.env.NEXT_PUBLIC_KITCHEN_KEY);

    if (
      pin === process.env.NEXT_PUBLIC_ADMIN_PASS ||
      pin === process.env.NEXT_PUBLIC_KITCHEN_KEY
    ) {
      console.log("✅ PIN match. Setting cookie...");
      setCookie(null, "admin_auth", pin, { path: "/" });
      router.push("/admin");
    } else {
      alert("Wrong PIN");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md max-w-sm w-full"
      >
        <h1 className="text-2xl font-bold mb-4">🔐 Admin Login</h1>
        <input
          type="password"
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
          placeholder="Enter PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-[--th-red] text-white py-2 rounded hover:opacity-90"
        >
          Login
        </button>
      </form>
    </div>
  );
}
