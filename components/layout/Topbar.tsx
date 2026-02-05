"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

export default function Topbar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  /* ===== CLOSE ON OUTSIDE CLICK ===== */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ===== USER DATA ===== */
  const fullName = user?.name || "Deva";
  const firstName = fullName.split(" ")[0];
  const email = user?.email || "";
  const avatarLetter = firstName.charAt(0).toUpperCase();

  return (
    <header className="h-16 flex items-center justify-end px-8 bg-white border-b relative z-50">
      <div className="relative" ref={dropdownRef}>
        {/* AVATAR */}
        <motion.button
          onClick={() => setOpen((v) => !v)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center"
        >
          {avatarLetter}
        </motion.button>

        {/* DROPDOWN */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-3 w-64 bg-white border rounded-xl shadow-lg overflow-hidden"
            >
              {/* USER INFO */}
              <div className="px-5 py-4 border-b">
                <p className="text-xs text-gray-400">Username</p>
                <p className="font-semibold text-sm truncate">
                  {firstName}
                </p>

                {email && (
                  <>
                    <p className="text-xs text-gray-400 mt-2">
                      Email
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {email}
                    </p>
                  </>
                )}
              </div>

              {/* LINKS */}
              <nav className="py-1 text-sm">
                <DropdownLink href="/settings/profile">
                  Profile
                </DropdownLink>

                <DropdownLink href="/invoices/create">
                  Create Invoice
                </DropdownLink>

                <DropdownLink href="/settings">
                  Settings
                </DropdownLink>

                <button
                  onClick={logout}
                  className="w-full text-left px-5 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

/* ===== LINK HELPER ===== */
function DropdownLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block px-5 py-2 hover:bg-gray-100"
    >
      {children}
    </Link>
  );
}
