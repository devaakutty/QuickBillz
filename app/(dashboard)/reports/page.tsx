"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  BarChart3,
  Receipt,
  Package, // ✅ NEW ICON
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

/* ================= PAGE ================= */

export default function ReportsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // 🔐 AUTH GUARD
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Reports & Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          Analyze reports and manage business data
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ReportCard
          title="Sales Report"
          desc="Track total sales, invoices, and revenue"
          href="/reports/sales"
          icon={<TrendingUp size={22} />}
          color="bg-indigo-50 text-indigo-600"
        />

        <ReportCard
          title="Profit & Loss"
          desc="View income versus expenses"
          href="/reports/profit-loss"
          icon={<BarChart3 size={22} />}
          color="bg-emerald-50 text-emerald-600"
        />

        <ReportCard
          title="GST Report"
          desc="GST summary and tax details"
          href="/reports/gst"
          icon={<Receipt size={22} />}
          color="bg-amber-50 text-amber-600"
        />

        {/* ✅ PRODUCT CARD */}
        <ReportCard
          title="Products"
          desc="Create, update and manage products"
          href="/products"
          icon={<Package size={22} />}
          color="bg-blue-50 text-blue-600"
        />
      </div>
    </div>
  );
}

/* ================= REPORT CARD ================= */

function ReportCard({
  title,
  desc,
  href,
  icon,
  color,
}: {
  title: string;
  desc: string;
  href: string;
  icon: JSX.Element;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white border rounded-xl p-6 hover:shadow-md transition flex flex-col gap-4"
    >
      <div
        className={`h-10 w-10 rounded-lg flex items-center justify-center ${color}`}
      >
        {icon}
      </div>

      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{desc}</p>
      </div>

      <span className="text-sm text-indigo-600 font-medium mt-auto">
        View →
      </span>
    </Link>
  );
}
