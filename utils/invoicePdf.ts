// utils/invoicePdf.ts

import jsPDF from "jspdf";
import { Invoice } from "@/hooks/useInvoicesStore";

export function generateInvoicePDF(invoice: Invoice) {
  const doc = new jsPDF();
  let y = 20;

  /* ================= HEADER ================= */

  doc.setFontSize(16);
  doc.text("QuickBillz Invoice", 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.text(`Invoice ID: ${invoice.id}`, 20, y);
  y += 6;

  doc.text(`Customer: ${invoice.customer.name}`, 20, y);
  y += 6;

  doc.text(
    `Date: ${new Date(invoice.createdAt).toDateString()}`,
    20,
    y
  );
  y += 10;

  /* ================= ITEMS ================= */

  doc.setFontSize(12);
  doc.text("Items", 20, y);
  y += 6;

  doc.setFontSize(10);

  invoice.products.forEach((item, index) => {
    doc.text(
      `${index + 1}. ${item.name} | Qty: ${item.qty} | Rate: ₹${item.rate} | Amount: ₹${
        item.qty * item.rate
      }`,
      20,
      y
    );
    y += 6;
  });

  y += 8;

  /* ================= TOTALS ================= */

  doc.text(
    `Subtotal: ₹${invoice.billing.subTotal.toFixed(2)}`,
    20,
    y
  );
  y += 6;

  doc.text(
    `GST: ₹${invoice.billing.gst.toFixed(2)}`,
    20,
    y
  );
  y += 6;

  doc.text(
    `Tax: ₹${invoice.billing.tax.toFixed(2)}`,
    20,
    y
  );
  y += 8;

  doc.setFontSize(12);
  doc.text(
    `Total: ₹${invoice.billing.total.toFixed(2)}`,
    20,
    y
  );

  /* ================= SAVE ================= */

  doc.save(`invoice-${invoice.id}.pdf`);
}
