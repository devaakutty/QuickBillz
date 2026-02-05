"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "./sidebarConfig";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-[#0c0f1f] to-[#14172e] text-white px-5 py-6 shadow-xl">
      {/* LOGO */}
      <div className="mb-10">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Quick<span className="text-indigo-400">Billz</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Smart billing & inventory
        </p>
      </div>

      {/* NAV */}
      <nav className="space-y-1">
        {sidebarLinks.map((link) => {
          const active =
            pathname === link.href ||
            pathname.startsWith(link.href + "/");

          return (
            <Link
              key={link.id}
              href={link.href}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-indigo-500/15 text-white shadow-inner"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {/* ACTIVE INDICATOR */}
              <span
                className={`h-2 w-2 rounded-full transition ${
                  active
                    ? "bg-indigo-400"
                    : "bg-transparent group-hover:bg-indigo-400/40"
                }`}
              />

              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER / VERSION */}
      <div className="mt-auto pt-10 text-xs text-gray-500">
        © {new Date().getFullYear()} QuickBillz
      </div>
    </aside>
  );
}
