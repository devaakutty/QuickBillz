"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/server/api";
import PaymentMethod from "@/components/billing/PaymentMethod";
import { useInvoicesStore } from "@/hooks/useInvoicesStore";

/* ================= TYPES ================= */

interface Customer {
  id: string;
  name: string;
}

interface Item {
  name: string;
  quantity: number;
  price: number;
}

/* ================= HELPERS ================= */

function generateInvoiceNo() {
  const prefix = "MAI";

  let userLetter = "X";
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed?.email) {
          userLetter = parsed.email.charAt(0).toUpperCase();
        }
      } catch {}
    }
  }

  const now = new Date();
  const day = now.getDate();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);

  const baseKey = `${prefix}-${userLetter}${day}${month}${year}`;
  const lastCount = Number(localStorage.getItem(baseKey)) || 0;
  const nextCount = lastCount + 1;

  localStorage.setItem(baseKey, String(nextCount));

  return `${baseKey}-${String(nextCount).padStart(3, "0")}`;
}

/* ================= PAGE ================= */

export default function CreateInvoicePage() {
  const router = useRouter();
  const { addInvoice } = useInvoicesStore();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState("");

  const [items, setItems] = useState<Item[]>([
    { name: "", quantity: 1, price: 0 },
  ]);

  /* Load customers */
  useEffect(() => {
    apiFetch<Customer[]>("/customers").then(setCustomers);
  }, []);

  /* ================= ITEMS ================= */

  const total = items.reduce(
    (sum, i) => sum + i.quantity * i.price,
    0
  );

  const addItem = () =>
    setItems([...items, { name: "", quantity: 1, price: 0 }]);

  const updateItem = (
    index: number,
    field: keyof Item,
    value: string
  ) => {
    const copy = [...items];
    copy[index][field] =
      field === "name" ? value : Number(value);
    setItems(copy);
  };

  const removeItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index));

  /* ================= SAVE WITH PAYMENT ================= */

  const handleConfirmPayment = async (
    method: "CASH" | "UPI" | "CARD",
    details: any
  ) => {
    if (!customerId || items.length === 0) {
      alert("Customer and items are required");
      return;
    }

    const invoiceNo = generateInvoiceNo();

    try {
      /* 1️⃣ SAVE TO BACKEND */
      await apiFetch("/invoices", {
        method: "POST",
        body: JSON.stringify({
          invoiceNo,
          customerId,
          items,
        }),
      });

      /* 2️⃣ SAVE TO FRONTEND STORE (🔥 THIS FIXES DASHBOARD) */
      addInvoice({
        id: crypto.randomUUID(),
        customer: { name: "", phone: "" },
        products: items.map((i) => ({
          name: i.name,
          qty: i.quantity,
          rate: i.price,
        })),
        billing: {
          subTotal: total,
          tax: 0,
          gst: 0,
          total,
        },
        payment: {
          method,
          provider: details.provider,
        },
        status: "PAID", // 🔥 REQUIRED
        createdAt: new Date().toISOString(), // 🔥 REQUIRED
      });

      router.push("/invoices");
    } catch (err: any) {
      alert(err.message || "Failed to create invoice");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold">Create Invoice</h1>

      {/* CUSTOMER SELECT */}
      <select
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        className="border px-3 py-2 rounded w-full"
      >
        <option value="">Select Customer</option>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* ITEMS */}
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={item.name}
              onChange={(e) =>
                updateItem(i, "name", e.target.value)
              }
              placeholder="Item"
              className="border px-2 py-1 flex-1"
            />

            <input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                updateItem(i, "quantity", e.target.value)
              }
              className="border px-2 py-1 w-20"
            />

            <input
              type="number"
              value={item.price}
              onChange={(e) =>
                updateItem(i, "price", e.target.value)
              }
              className="border px-2 py-1 w-28"
            />

            <button
              onClick={() => removeItem(i)}
              className="text-red-600"
            >
              Remove
            </button>
          </div>
        ))}

        <button onClick={addItem} className="text-blue-600">
          + Add Item
        </button>
      </div>

      <div className="text-right font-bold text-xl">
        Total: ₹{total.toFixed(2)}
      </div>

      {/* PAYMENT METHOD */}
      <PaymentMethod
        total={total}
        onConfirm={handleConfirmPayment}
      />
    </div>
  );
}
