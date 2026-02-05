"use client";

import { useRouter } from "next/navigation";
import { useInvoiceDraft } from "@/hooks/useInvoiceDraft";
import { useInvoicesStore } from "@/hooks/useInvoicesStore";
import { calculateInvoiceTotals } from "@/utils/gstCalculator";

/* ================= HELPERS ================= */

function generateInvoiceNo() {
  const prefix = "MAI";

  let userLetter = "X";
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed?.email) {
          userLetter = parsed.email.charAt(0).toUpperCase();
        }
      } catch {}
    }
  }

  const now = new Date();
  const day = now.getDate();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);

  const baseKey = `${prefix}-${userLetter}${day}${month}${year}`;
  const lastCount = Number(localStorage.getItem(baseKey)) || 0;
  const nextCount = lastCount + 1;

  localStorage.setItem(baseKey, String(nextCount));

  return `${baseKey}-${String(nextCount).padStart(3, "0")}`;
}

/* ================= PAGE ================= */

export default function InvoicePreviewPage() {
  const router = useRouter();
  const { draft, setDraft } = useInvoiceDraft();
  const { addInvoice } = useInvoicesStore();

  if (!draft || !draft.items || draft.items.length === 0) {
    return (
      <div className="p-6 text-gray-500">
        No invoice data found.
      </div>
    );
  }

  const { subtotal, gstAmount, total } =
    calculateInvoiceTotals(draft.items);

  /* ================= ACTION ================= */

  const saveInvoice = () => {
    const invoiceId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `INV-${Date.now()}`;

    const invoiceNo = generateInvoiceNo();

    addInvoice({
      id: invoiceId,
      invoiceNo,

      customer: {
        name: draft.customerName,
      },

      products: draft.items.map((item) => ({
        name: item.name,
        qty: item.quantity,
        rate: item.price,
      })),

      billing: {
        subTotal: subtotal,
        gst: gstAmount,
        tax: 0,
        total,
      },

      payment: {
        method: "PENDING",
      },

      status: "UNPAID",
      createdAt: new Date().toISOString(),
    });

    setDraft(null);
    router.push("/invoices");
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Invoice Preview</h1>

      <p>
        <b>Customer:</b> {draft.customerName}
      </p>

      <div className="border rounded p-4 space-y-2">
        {draft.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between text-sm"
          >
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>
              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>

      <div className="border rounded p-4 space-y-1 text-sm">
        <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
        <p>GST: ₹{gstAmount.toFixed(2)}</p>
        <p className="font-bold text-lg">
          Total: ₹{total.toFixed(2)}
        </p>
      </div>

      <button
        onClick={saveInvoice}
        className="px-5 py-2 bg-black text-white rounded"
      >
        Confirm & Save Invoice
      </button>
    </div>
  );
}
