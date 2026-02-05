"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";

type Invoice = {
  status: "PAID" | "UNPAID";
  total: number;
  createdAt: string;
};

export default function PaymentsChart({
  invoices = [], // ✅ DEFAULT VALUE (IMPORTANT)
}: {
  invoices?: Invoice[];
}) {
  const chartData = useMemo(() => {
    if (!invoices || invoices.length === 0) return [];

    const map: any = {};

    invoices.forEach((inv) => {
      if (!inv.createdAt) return;

      const d = new Date(inv.createdAt);
      if (isNaN(d.getTime())) return;

      const label = d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });

      if (!map[label]) {
        map[label] = {
          date: label,
          dateObj: d,
          received: 0,
          pending: 0,
        };
      }

      if (inv.status === "PAID") {
        map[label].received += inv.total;
      } else {
        map[label].pending += inv.total;
      }
    });

    return Object.values(map).sort(
      (a: any, b: any) =>
        a.dateObj.getTime() - b.dateObj.getTime()
    );
  }, [invoices]);

  if (!chartData.length) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        No payment data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />

        <Line
          type="monotone"
          dataKey="received"
          stroke="#22c55e"
          strokeWidth={3}
        />

        <Line
          type="monotone"
          dataKey="pending"
          stroke="#ef4444"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
