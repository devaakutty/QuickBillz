"use client";

import { useRouter } from "next/navigation";

export default function SimpleBillReceipt() {
  const router = useRouter();

  const data = sessionStorage.getItem("simplebill");
  if (!data) return <p>No bill data</p>;

  const { customer, amount } = JSON.parse(data);

  return (
    <div className="min-h-screen p-6 space-y-4">
      <h1 className="text-2xl font-bold">Receipt</h1>

      <div className="border rounded p-4">
        <p><b>Customer:</b> {customer}</p>
        <p><b>Amount:</b> ₹{amount}</p>
      </div>

      <button
        onClick={() => router.push("/simplebill/pay")}
        className="w-full py-3 bg-green-600 text-white rounded"
      >
        Pay Now
      </button>
    </div>
  );
}
