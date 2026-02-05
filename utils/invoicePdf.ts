import jsPDF from "jspdf";
import { Invoice } from "@/types/invoice";

export function generateInvoicePDF(invoice: Invoice) {
  const doc = new jsPDF();

  let y = 20;

  doc.setFontSize(16);
  doc.text("QuickBillz Invoice", 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.text(`Invoice ID: ${invoice.id}`, 20, y);
  y += 6;

  doc.text(`Customer: ${invoice.customerName}`, 20, y);
  y += 6;

  doc.text(`Date: ${new Date(invoice.createdAt).toDateString()}`, 20, y);
  y += 10;

  doc.setFontSize(12);
  doc.text("Items", 20, y);
  y += 6;

  doc.setFontSize(10);

  invoice.items.forEach((item, index) => {
    doc.text(
      `${index + 1}. ${item.name} | Qty: ${item.quantity} | Price: ₹${item.price}`,
      20,
      y
    );
    y += 6;
  });

  y += 6;

  doc.text(`Subtotal: ₹${invoice.subtotal.toFixed(2)}`, 20, y);
  y += 6;
  doc.text(`GST: ₹${invoice.gstAmount.toFixed(2)}`, 20, y);
  y += 6;

  doc.setFontSize(12);
  doc.text(`Total: ₹${invoice.total.toFixed(2)}`, 20, y);

  doc.save(`invoice-${invoice.id}.pdf`);
}
