"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/server/api";

interface StockItem {
  id: string;
  name: string;
  quantity: number; // backend maps this from product.stock
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
      const res = await apiFetch<StockItem[]>(
        "/dashboard/low-stock"
      );
      setItems(res ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  /* ===== LOADING ===== */
  if (loading) {
    return (
      <div className="card flex items-center justify-center text-sm text-gray-400">
        Loading stock alerts…
      </div>
    );
  }

  /* ===== NO LOW STOCK (ALL > 5) ===== */
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

  /* ===== LOW STOCK LIST (≤ 5) ===== */
  return (
    <div className="card">
      <h3 className="font-semibold mb-4 text-red-600">
        ⚠ Stock Alert (Below 5)
      </h3>

      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between text-sm"
          >
            <span className="font-medium">
              {item.name}
            </span>

            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-semibold">
              {item.quantity} {item.unit ?? ""}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
