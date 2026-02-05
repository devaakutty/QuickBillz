"use client";

import { generateInvoicePDF } from "@/utils/invoicePdf";
import { loadRazorpay } from "@/utils/loadRazorpay";
import { Invoice } from "@/types/invoice";

export default function InvoiceActions({
  invoice,
  markAsPaid,
}: {
  invoice: Invoice;
  markAsPaid: (id: string) => void;
}) {
  return (
    <div className="flex gap-3 flex-wrap">
      <button onClick={() => generateInvoicePDF(invoice)}>
        Download PDF
      </button>

      {invoice.status === "UNPAID" && (
        <button
          onClick={async () => {
            const ok = await loadRazorpay();
            if (!ok) return;

            const rzp = new (window as any).Razorpay({
              key: process.env.NEXT_PUBLIC_RAZORPAY_KEY!,
              amount: invoice.total * 100,
              currency: "INR",
              handler: () => markAsPaid(invoice.id),
            });

            rzp.open();
          }}
        >
          Pay Now
        </button>
      )}
    </div>
  );
}
