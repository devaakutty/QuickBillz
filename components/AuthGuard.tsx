"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth(); // ✅ FIX
  const router = useRouter();
  const pathname = usePathname();

  const isDashboardRoute = pathname.startsWith("/dashboard");

  useEffect(() => {
    // 🔐 Protect dashboard routes
    if (!isAuthenticated && isDashboardRoute) {
      router.replace("/login");
    }

    // 🚫 Prevent logged-in users from visiting login
    if (isAuthenticated && pathname === "/login") {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, pathname, router, isDashboardRoute]);

  // ⛔ Block dashboard render if not authenticated
  if (!isAuthenticated && isDashboardRoute) {
    return null;
  }

  return <>{children}</>;
}
