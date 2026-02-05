"use client";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import Footer from "@/components/layout/Footer";
import AuthGuard from "@/components/AuthGuard";
import { InvoiceStoreProvider } from "@/hooks/useInvoicesStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <InvoiceStoreProvider>
        <div className="flex min-h-screen bg-zinc-50">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <Topbar />

            <main className="p-6 flex-1">
              {children}
            </main>

            {/* Footer */}
            <Footer />
          </div>
        </div>
      </InvoiceStoreProvider>
    </AuthGuard>
  );
}
