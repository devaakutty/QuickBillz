"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/server/api";

interface StockItem {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
}

export default function StockAlert() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLowStock();
  }, []);

  const loadLowStock = async () => {
    try {
      const res = await apiFetch<StockItem[]>("/dashboard/low-stock");
      setItems(res ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card text-sm text-gray-400 text-center">
        Loading stock alerts…
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="card">
        <h3 className="font-semibold mb-2">Stock Alert</h3>
        <p className="text-sm text-green-600">
          All items are sufficiently stocked
        </p>
      </div>
    );
  }

  /* ===== GROUP BY UNIT ===== */
  const unitCount: Record<string, number> = {};

  items.forEach((item) => {
    const unit = item.unit ?? "pcs";
    unitCount[unit] = (unitCount[unit] || 0) + 1;
  });

  return (
    <div className="card space-y-4">
      <h3 className="font-semibold text-red-600">
        ⚠ Stock Alert (Below 5)
      </h3>

      {/* SUMMARY */}
      <div className="text-sm text-gray-700 space-y-1">
        {Object.entries(unitCount).map(([unit, count]) => (
          <div key={unit}>
            • <b>{count}</b> product(s) in <b>{unit}</b>
          </div>
        ))}
      </div>

      {/* LIST */}
      <ul className="space-y-3 pt-2 border-t">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between text-sm"
          >
            <span className="font-medium">{item.name}</span>

            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-semibold">
              {item.quantity} {item.unit ?? "pcs"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
