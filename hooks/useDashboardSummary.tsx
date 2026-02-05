"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/server/api";

type DashboardSummary = {
  totalSales: number;
  totalExpense: number;
  paymentSent: number;
  paymentReceived: number;
};

export function useDashboardSummary() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

    const load = async () => {
    setLoading(true);
    setError(null);

    const result = await apiFetch<DashboardSummary>(
        "/dashboard/summary",
        { silent: true }
    );

    if (!result) {
        setError("Failed to load dashboard summary");
        setData(null);
    } else {
        setData(result);
    }

    setLoading(false);
    };

  useEffect(() => {
    load();
  }, []);

  return { data, loading, error, refresh: load };
}
