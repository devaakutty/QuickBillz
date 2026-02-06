"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isDashboardRoute = pathname.startsWith("/dashboard");

  useEffect(() => {
    if (isLoading) return;

    // 🔐 Protect ONLY dashboard routes
    if (!isAuthenticated && isDashboardRoute) {
      router.replace("/login");
    }

    // 🚫 Prevent logged-in users from visiting login
    if (isAuthenticated && pathname === "/login") {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, pathname, router, isDashboardRoute]);

  // ⏳ Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-sm text-gray-400">
          Checking session…
        </span>
      </div>
    );
  }

  // ⛔ Block dashboard render if not authenticated
  if (!isAuthenticated && isDashboardRoute) {
    return null;
  }

  return <>{children}</>;
}
