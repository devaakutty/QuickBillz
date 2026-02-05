"use client";

import { useState } from "react";
import PaymentMethod, {
  PaymentMethodType,
} from "./PaymentMethod";

export default function PaymentSelector({
  total,
  onConfirm,
}: {
  total: number;
  onConfirm: (
    method: PaymentMethodType,
    details: {
      provider?: string;
      amount: number;
      cashAmount?: number;
      upiAmount?: number;
    }
  ) => Promise<void> | void;
}) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async (
    method: PaymentMethodType,
    details: any
  ) => {
    try {
      setLoading(true);
      await onConfirm(method, details);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaymentMethod
      total={total}
      loading={loading}
      onConfirm={handleConfirm}
    />
  );
}
