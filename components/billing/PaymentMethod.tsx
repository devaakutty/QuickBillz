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
  const [method, setMethod] =
    useState<PaymentMethodType | null>(null);
  const [upiApp, setUpiApp] =
    useState<"GPay" | "PhonePe" | "Paytm">("GPay");
  const [cashPart, setCashPart] = useState<number>(0);

  /* ================= CALCULATIONS ================= */

  const upiAmount = Math.max(total - cashPart, 0);

  useEffect(() => {
    setCashPart(0);
    setUpiApp("GPay");
  }, [method]);

  /* ================= UI ================= */

  return (
    <div className="bg-white rounded-[18px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] space-y-5">
      <h3 className="font-semibold text-lg text-black">
        Payment Method
      </h3>

      {/* METHOD SELECT */}
      <div className="flex gap-3">
        {(["CASH", "UPI", "CARD"] as PaymentMethodType[]).map((m) => (
          <button
            key={m}
            disabled={loading}
            onClick={() => setMethod(m)}
            className={`px-5 py-2 rounded-full border text-sm font-medium transition ${
              method === m
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* ================= CASH ================= */}
      {method === "CASH" && (
        <button
          disabled={loading}
          onClick={() =>
            onConfirm("CASH", { amount: total })
          }
          className="w-full py-3 bg-black text-white rounded-full disabled:opacity-50"
        >
          Confirm Cash Payment ₹{total}
        </button>
      )}

      {/* ================= UPI ================= */}
      {method === "UPI" && (
        <div className="space-y-5">
          {/* UPI APPS */}
          <div className="flex gap-3">
            {(["GPay", "PhonePe", "Paytm"] as const).map((app) => (
              <button
                key={app}
                disabled={loading}
                onClick={() => setUpiApp(app)}
                className={`px-4 py-2 rounded-full border text-sm ${
                  upiApp === app
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {app}
              </button>
            ))}
          </div>

          {/* QR CODE */}
          <div className="flex flex-col items-center gap-3 border rounded-xl p-4">
            <img
              src="/qr.png"
              alt="UPI QR Code"
              className="w-40 h-40 object-contain"
            />

            <p className="text-sm text-gray-600">
              Scan with <b>{upiApp}</b> or any UPI app
            </p>

            <p className="text-lg font-semibold text-black">
              ₹{upiAmount}
            </p>
          </div>

          {/* SPLIT CASH */}
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
              className="w-full border rounded-full px-4 py-2"
            />
          </div>

          {/* CONFIRM */}
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
            className="w-full py-3 bg-black text-white rounded-full disabled:opacity-50"
          >
            Confirm UPI Payment ₹{total}
          </button>
        </div>
      )}

      {/* ================= CARD ================= */}
      {method === "CARD" && (
        <div className="space-y-3">
          <input
            placeholder="Card Number"
            className="w-full border rounded-full px-4 py-2"
          />
          <input
            placeholder="Expiry (MM/YY)"
            className="w-full border rounded-full px-4 py-2"
          />
          <input
            placeholder="CVV"
            type="password"
            className="w-full border rounded-full px-4 py-2"
          />

          <button
            disabled={loading}
            onClick={() =>
              onConfirm("CARD", {
                provider: "CARD",
                amount: total,
              })
            }
            className="w-full py-3 bg-black text-white rounded-full disabled:opacity-50"
          >
            Pay ₹{total} by Card
          </button>
        </div>
      )}
    </div>
  );
}
