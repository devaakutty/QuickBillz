"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/server/api";
import { loadRazorpay } from "@/utils/loadRazorpay";

/* ================= TYPES ================= */

interface InvoiceItem {
  productName: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNo: string;
  status: "PAID" | "UNPAID";
  total: number;
  createdAt: string;
  customer: {
    name: string;
    phone?: string;
  };
  items: InvoiceItem[];
}

/* ================= PAGE ================= */

export default function InvoiceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD INVOICE ================= */

  useEffect(() => {
    apiFetch<Invoice>(`/invoices/${id}`)
      .then(setInvoice)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Loading invoice…</div>;
  if (!invoice) return <div className="p-6">Invoice not found</div>;

  /* ================= MARK PAID (COMMON) ================= */

  const markAsPaid = async () => {
    await apiFetch(`/invoices/${invoice.id}`, {
      method: "PUT",
      body: JSON.stringify({ status: "PAID" }),
    });

    setInvoice({ ...invoice, status: "PAID" });
  };

  /* ================= PAY VIA UPI / CARD ================= */

  const handlePayNow = async () => {
    const ok = await loadRazorpay();
    if (!ok) {
      alert("Razorpay failed to load");
      return;
    }

    const options = {
      key: "rzp_test_1234567890", // replace with real key later
      amount: invoice.total * 100,
      currency: "INR",
      name: "InvoiceHub",
      description: `Invoice ${invoice.invoiceNo}`,

      handler: async () => {
        await markAsPaid();
        alert("Payment Successful");
      },

      prefill: {
        name: invoice.customer.name,
        contact: invoice.customer.phone ?? "",
      },

      theme: { color: "#000000" },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  /* ================= CASH PAYMENT ================= */

    const handleCashPayment = async () => {
      const ok = confirm("Confirm cash payment?");
      if (!ok) return;

      try {
        await apiFetch(`/invoices/${invoice.id}/pay`, {
          method: "PUT",
        });

        setInvoice({ ...invoice, status: "PAID" });

        alert("Cash payment successful");

        // ✅ Redirect to billing page
        router.push("/billing");

      } catch (err) {
        alert("Payment update failed");
      }
    };


  /* ================= DOWNLOAD PDF ================= */

  const handleDownload = () => {
    window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/api/invoices/${invoice.id}/pdf`,
      "_blank"
    );

    setTimeout(() => {
      router.push("/billing");
    }, 500);
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">
          Invoice {invoice.invoiceNo}
        </h1>

        <span
          className={`px-3 py-1 rounded ${
            invoice.status === "PAID"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {invoice.status}
        </span>
      </div>

      <div className="bg-white border p-4">
        <p><b>Customer:</b> {invoice.customer.name}</p>
        <p><b>Date:</b> {new Date(invoice.createdAt).toDateString()}</p>
      </div>

      <div className="bg-white border p-4">
        {invoice.items.map((item, i) => (
          <div key={i} className="flex justify-between border-b py-1">
            <span>{item.productName} × {item.quantity}</span>
            <span>₹{item.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="bg-white border p-4 flex justify-between font-bold">
        <span>Total</span>
        <span>₹{invoice.total.toFixed(2)}</span>
      </div>

      <div className="bg-white border p-4 flex gap-3 flex-wrap">
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-gray-800 text-white rounded"
        >
          Download Invoice (PDF)
        </button>

        {invoice.status === "UNPAID" && (
          <>
            <button
              onClick={handlePayNow}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Pay via UPI / Card
            </button>

            <button
              onClick={handleCashPayment}
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              Cash Payment
            </button>
          </>
        )}
      </div>
    </div>
  );
}
