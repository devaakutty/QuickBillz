"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SimpleBillCreate() {
  const router = useRouter();

  const [customer, setCustomer] = useState("");
  const [amount, setAmount] = useState(0);

  const handleNext = () => {
    sessionStorage.setItem(
      "simplebill",
      JSON.stringify({ customer, amount })
    );
    router.push("/simplebill/receipt");
  };

  return (
    <div className="min-h-screen p-6 space-y-4">
      <h1 className="text-2xl font-bold">Create Bill</h1>

      <input
        className="w-full border p-3 rounded"
        placeholder="Customer name"
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
      />

      <input
        type="number"
        className="w-full border p-3 rounded"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      <button
        onClick={handleNext}
        className="w-full py-3 bg-black text-white rounded"
      >
        Generate Receipt
      </button>
    </div>
  );
}
