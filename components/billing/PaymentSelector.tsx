"use client";

import { useState } from "react";

export type PaymentMethodType = "CASH" | "UPI" | "CARD";

export default function PaymentSelector({
  onChange,
}: {
  onChange: (payment: {
    method: PaymentMethodType;
    provider?: string;
  }) => void;
}) {
  const [method, setMethod] = useState<PaymentMethodType>("CASH");
  const [provider, setProvider] = useState("");

  const handleSelect = (m: PaymentMethodType) => {
    setMethod(m);
    onChange({ method: m, provider });
  };

  return (
    <div className="space-y-4">
      <button onClick={() => handleSelect("CASH")}>Cash</button>
      <button onClick={() => handleSelect("UPI")}>UPI</button>
      <button onClick={() => handleSelect("CARD")}>Card</button>

      {(method === "UPI" || method === "CARD") && (
        <input
          placeholder="Provider"
          value={provider}
          onChange={(e) => {
            setProvider(e.target.value);
            onChange({ method, provider: e.target.value });
          }}
        />
      )}
    </div>
  );
}
