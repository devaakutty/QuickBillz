"use client";

import { generateInvoicePDF } from "@/utils/invoicePdf";
import { loadRazorpay } from "@/utils/loadRazorpay";
// import type { Invoice } from "@/hooks/useInvoicesStore"; // ✅ FIX]
import type { Invoice } from "@/types/invoice";


export default function InvoiceActions({
  invoice,
  markAsPaid,
}: {
  invoice: Invoice;
  markAsPaid: (id: string) => void;
}) {
  return (
    <div className="flex gap-3 flex-wrap">
      <button
        onClick={() => generateInvoicePDF(invoice)}
        className="px-4 py-2 border rounded"
      >
        Download PDF
      </button>

      {invoice.status === "UNPAID" && (
        <button
          onClick={async () => {
            const ok = await loadRazorpay();
            if (!ok) return;

            const rzp = new (window as any).Razorpay({
              key: process.env.NEXT_PUBLIC_RAZORPAY_KEY!,
              amount: invoice.billing.total * 100, // ✅ correct source
              currency: "INR",
              handler: () => markAsPaid(invoice.id),
            });

            rzp.open();
          }}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Pay Now
        </button>
      )}
    </div>
  );
}
