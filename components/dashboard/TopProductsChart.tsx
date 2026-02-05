"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import { apiFetch } from "@/server/api";

const COLORS = ["#16a34a", "#6366f1", "#f59e0b", "#ef4444", "#0ea5e9"];

/* ===== Percentage label ===== */
const renderLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${Math.round(percent * 100)}%`}
    </text>
  );
};

export default function TopProductsChart() {
  const [data, setData] = useState<
    { name: string; value: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  /* ===== LOAD FROM DB ===== */
  useEffect(() => {
    loadTopProducts();
  }, []);

  const loadTopProducts = async () => {
    try {
      const res = await apiFetch<
        { product: string; percentage: number }[]
      >("/dashboard/top-products");

      setData(
        res.slice(0, 5).map((item) => ({
          name: item.product,
          value: item.percentage,
        }))
      );
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  /* ===== UI STATES ===== */
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        Loading product sales…
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        No sales data for this month
      </div>
    );
  }

  /* ===== CHART ===== */
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={45}
          outerRadius={95}
          paddingAngle={2}
          labelLine={false}
          label={renderLabel}
        >
          {data.map((_, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip formatter={(v) => `${v}%`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
