"use client";

import { useEffect, useState } from "react";

/* ================= TYPES ================= */

export type PaymentMethodType = "CASH" | "UPI" | "CARD";

export type PaymentDetails = {
  provider?: string;
  amount: number;
  cashAmount?: number;
  upiAmount?: number;
};

/* ================= COMPONENT ================= */

export default function PaymentMethod({
  total,
  onConfirm,
  loading = false,
}: {
  total: number;
  loading?: boolean;
  onConfirm: (
    method: PaymentMethodType,
    details: PaymentDetails
  ) => void;
}) {
  const [method, setMethod] = useState<PaymentMethodType | null>(null);
  const [upiApp, setUpiApp] =
    useState<"GPay" | "PhonePe" | "Paytm">("GPay");
  const [cashPart, setCashPart] = useState<number>(0);

  /* ================= CALCULATIONS ================= */

  const upiAmount = Math.max(total - cashPart, 0);

  /* ================= RESET ON METHOD CHANGE ================= */

  useEffect(() => {
    setCashPart(0);
    setUpiApp("GPay");
  }, [method]);

  /* ================= UI ================= */

  return (
    <div className="bg-white border rounded-xl p-5 space-y-5">
      <h3 className="font-semibold text-lg">Payment Method</h3>

      {/* METHOD SELECT */}
      <div className="flex gap-3">
        {(["CASH", "UPI", "CARD"] as PaymentMethodType[]).map((m) => (
          <button
            key={m}
            disabled={loading}
            onClick={() => setMethod(m)}
            className={`px-4 py-2 rounded border transition ${
              method === m
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* CASH */}
      {method === "CASH" && (
        <button
          disabled={loading}
          onClick={() =>
            onConfirm("CASH", {
              amount: total,
            })
          }
          className="w-full py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
        >
          Confirm Cash Payment ₹{total}
        </button>
      )}

      {/* UPI */}
      {method === "UPI" && (
        <div className="space-y-4">
          <div className="flex gap-3">
            {(["GPay", "PhonePe", "Paytm"] as const).map((app) => (
              <button
                key={app}
                disabled={loading}
                onClick={() => setUpiApp(app)}
                className={`px-3 py-2 border rounded ${
                  upiApp === app
                    ? "bg-green-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {app}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Cash Amount (optional)
            </label>
            <input
              type="number"
              min={0}
              max={total}
              value={cashPart}
              onChange={(e) =>
                setCashPart(
                  Math.min(Number(e.target.value) || 0, total)
                )
              }
              className="w-full border rounded px-3 py-2"
            />
            <p className="text-sm text-gray-600">
              UPI Amount: ₹{upiAmount}
            </p>
          </div>

          <button
            disabled={loading}
            onClick={() =>
              onConfirm("UPI", {
                provider: upiApp,
                cashAmount: cashPart,
                upiAmount,
                amount: total,
              })
            }
            className="w-full py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          >
            Confirm UPI Payment ₹{total}
          </button>
        </div>
      )}

      {/* CARD */}
      {method === "CARD" && (
        <div className="space-y-3">
          <input
            placeholder="Card Number"
            className="w-full border rounded px-3 py-2"
          />
          <input
            placeholder="Expiry (MM/YY)"
            className="w-full border rounded px-3 py-2"
          />
          <input
            placeholder="CVV"
            type="password"
            className="w-full border rounded px-3 py-2"
          />

          <button
            disabled={loading}
            onClick={() =>
              onConfirm("CARD", {
                provider: "CARD",
                amount: total,
              })
            }
            className="w-full py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          >
            Pay ₹{total} by Card
          </button>
        </div>
      )}
    </div>
  );
}
