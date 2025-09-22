import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ThankYouPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"success" | "fail" | null>(null);

  useEffect(() => {
    if (router.query.status === "success") setStatus("success");
    else if (router.query.status === "fail") setStatus("fail");
  }, [router.query]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {status === "success" && (
          <>
            <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful</h1>
            <p className="text-lg">Thank you for your order!</p>
          </>
        )}
        {status === "fail" && (
          <>
            <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
            <p className="text-lg">Please try again or use a different payment method.</p>
          </>
        )}
        {!status && <p className="text-lg">Checking payment status...</p>}
      </div>
    </div>
  );
}
