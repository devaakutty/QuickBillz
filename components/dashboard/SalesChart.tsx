"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/server/api";

type Invoice = {
  status: "PAID" | "UNPAID";
  total: number;
  createdAt: string;
};

export default function SalesChart() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const data = await apiFetch<Invoice[]>("/invoices");
      setInvoices(data);
    } catch {
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const chartData = useMemo(() => {
    if (!invoices.length) return [];

    const map: Record<
      string,
      { month: string; sales: number; purchases: number }
    > = {};

    invoices.forEach((inv) => {
      const d = new Date(inv.createdAt);
      if (isNaN(d.getTime())) return;

      const month = d.toLocaleString("en-IN", {
        month: "short",
      });

      if (!map[month]) {
        map[month] = {
          month,
          sales: 0,
          purchases: 0,
        };
      }

      if (inv.status === "PAID") {
        map[month].sales += inv.total;
      } else {
        map[month].purchases += inv.total;
      }
    });

    return Object.values(map);
  }, [invoices]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        Loading sales data…
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        No sales data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} barGap={6}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="sales"
          fill="#22c55e"
          radius={[6, 6, 0, 0]}
        />
        {/* <Bar
          dataKey="purchases"
          fill="#a78bfa"
          radius={[6, 6, 0, 0]}
        /> */}
      </BarChart>
    </ResponsiveContainer>
  );
}
