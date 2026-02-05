"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/* ================= TABS ================= */

const tabs = [
  { label: "Profile", href: "/settings/profile" },
  { label: "Company", href: "/settings/company" },
  { label: "Notifications", href: "/settings/notifications" },
  { label: "Security", href: "/settings/security" },
  { label: "Appearance", href: "/settings/appearance" },
  { label: "Integrations", href: "/settings/integrations" },
  { label: "API", href: "/settings/api" },
  { label: "Audit", href: "/settings/audit" },
];

export default function SettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <section className="space-y-8">
      {/* ================= HEADER ================= */}
      <header className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl p-6 text-white shadow">
        <h1 className="text-3xl font-bold tracking-tight">
          Settings
        </h1>
        <p className="text-sm opacity-90 mt-1">
          Manage your account preferences
        </p>
      </header>

      {/* ================= TABS ================= */}
      <nav className="flex flex-wrap gap-2 bg-white dark:bg-[#0b0e14] border border-gray-200 dark:border-white/10 rounded-xl p-2">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              isActive(tab.href)
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {/* ================= CONTENT ================= */}
      <div className="bg-white dark:bg-[#0b0e14] border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
        {children}
      </div>
    </section>
  );
}
