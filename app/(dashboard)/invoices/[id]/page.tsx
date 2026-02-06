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
  total: number; // subtotal (before GST)
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

  /* ================= CALCULATIONS ================= */

  const GST_RATE = 0.18;

  const subTotal = invoice.total;
  const gstAmount = subTotal * GST_RATE;
  const grandTotal = subTotal + gstAmount;

  /* ================= MARK PAID ================= */

  const markAsPaid = async () => {
    await apiFetch(`/invoices/${invoice.id}`, {
      method: "PUT",
      body: JSON.stringify({ status: "PAID" }),
    });

    setInvoice({ ...invoice, status: "PAID" });
  };

  /* ================= PAY VIA RAZORPAY ================= */

  const handlePayNow = async () => {
    const ok = await loadRazorpay();
    if (!ok) {
      alert("Razorpay failed to load");
      return;
    }

    const options = {
      key: "rzp_test_1234567890", // replace in prod
      amount: Math.round(grandTotal * 100),
      currency: "INR",
      name: "InvoiceHub",
      description: `Invoice ${invoice.invoiceNo}`,

      handler: async () => {
        await markAsPaid();
        alert("Payment successful");
        router.push("/billing");
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
      router.push("/billing");
    } catch (err: any) {
      alert(err.message || "Payment update failed");
    }
  };

  /* ================= DOWNLOAD PDF ================= */

  const handleDownload = async () => {
    try {
      const blob = await apiFetch<Blob>(
        `/invoices/${invoice.id}/pdf`,
        { method: "GET" },
        "blob"
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `Invoice-${invoice.invoiceNo}.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);

      router.push("/billing");
    } catch (err: any) {
      alert(err.message || "Invoice download failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="relative space-y-6 max-w-5xl mx-auto p-6 bg-gray-50">
      {/* HEADER */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
      >
        ← Back
      </button>

      <div className="flex justify-between items-center">

        
        <h1 className="text-2xl font-bold">
          Invoice {invoice.invoiceNo}
        </h1>

        <span
          className={`px-3 py-1 rounded text-sm font-medium ${
            invoice.status === "PAID"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {invoice.status}
        </span>
      </div>

      {/* CUSTOMER */}
      <div className="bg-white border rounded p-4 space-y-1">
        <p><b>Customer:</b> {invoice.customer.name}</p>
        <p><b>Date:</b> {new Date(invoice.createdAt).toDateString()}</p>
      </div>

      {/* ITEMS */}
      <div className="bg-white border rounded p-4 space-y-2">
        {invoice.items.map((item, i) => (
          <div key={i} className="flex justify-between border-b pb-1">
            <span>
              {item.productName} × {item.quantity}
            </span>
            <span>₹{item.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* TOTALS */}
      <div className="bg-white border rounded p-4 space-y-2">
        <div className="flex justify-between">
          <span>Sub Total</span>
          <span>₹{subTotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>GST (18%)</span>
          <span>₹{gstAmount.toFixed(2)}</span>
        </div>

        <div className="flex justify-between font-bold border-t pt-2">
          <span>Grand Total</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="bg-white border rounded p-4 flex gap-3 flex-wrap">
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
