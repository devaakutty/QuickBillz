"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/server/api";

export default function StockSummary() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const res = await apiFetch("/dashboard/stock-summary");
      setData(res);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-400">Loading stock summary…</p>;
  }

  if (!data) {
    return <p className="text-sm text-gray-400">Stock summary not available</p>;
  }

  return (
    <div className="space-y-4">
      <Metric title="Total Products" value={data.totalProducts} />
      <Metric title="Sold Items" value={data.totalSalesItems} />
      <Metric title="Returned Items" value={data.salesReturnItems} />
      <Metric title="Purchased Items" value={data.purchaseItems} />
    </div>
  );
}

function Metric({ title, value }: { title: string; value: number }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
