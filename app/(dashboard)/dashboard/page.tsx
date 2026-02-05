"use client";

import { useEffect, useMemo, useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import SalesChart from "@/components/dashboard/SalesChart";
import DevicesChart from "@/components/dashboard/DevicesChart";
import RecentInvoices from "@/components/dashboard/RecentInvoices";
import StockSummary from "@/components/dashboard/StockSummary";
import PaymentsChart from "@/components/dashboard/PaymentsChart";
import StockAlert from "@/components/dashboard/StockAlert";
import { apiFetch } from "@/server/api";

/* ===== TYPES ===== */
type Invoice = {
  id: string;
  status: "PAID" | "UNPAID";
  total: number;
};

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  /* ===== LOAD YOUR DATA ===== */
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

  /* ===== CALCULATE KPIs FROM YOUR OWN DATA ===== */
  const kpis = useMemo(() => {
    let totalSales = 0;
    let pendingAmount = 0;

    invoices.forEach((inv) => {
      if (inv.status === "PAID") {
        totalSales += inv.total;
      } else {
        pendingAmount += inv.total;
      }
    });

    return {
      totalSales,
      pendingAmount,
      receivedAmount: totalSales,
      totalExpense: 0, // add expense logic later if needed
    };
  }, [invoices]);

  if (loading) {
    return (
      <div className="p-6 text-gray-400">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Sales"
          value={kpis.totalSales}
          type="totalSales"
        />

        <StatCard
          title="Total Expense"
          value={kpis.totalExpense}
          type="totalExpense"
        />

        <StatCard
          title="Pending Amount"
          value={kpis.pendingAmount}
          type="pendingPayment"
        />

        <StatCard
          title="Received Amount"
          value={kpis.receivedAmount}
          type="paymentReceived"
        />
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card h-[360px]">
          <SalesChart />
        </div>

        <div className="card h-[360px]">
          <DevicesChart />
        </div>
      </div>

      {/* ================= INVOICES + STOCK ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <RecentInvoices />
        </div>

        {/* <div className="card">
          <StockSummary />
        </div> */}

        <div className="card">
          <StockAlert />
        </div>
      </div>

      {/* ================= PAYMENTS + ALERT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* <div className="lg:col-span-2 card h-[320px]">
          <PaymentsChart />
        </div> */}


      </div>

    </div>
  );
}
