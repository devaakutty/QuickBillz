import { InvoiceItem } from "@/types/invoice";

export function calculateInvoiceTotals(items: InvoiceItem[]) {
  let subtotal = 0;
  let gstAmount = 0;

  items.forEach((item) => {
    const itemTotal = item.quantity * item.price;
    subtotal += itemTotal;
    gstAmount += (itemTotal * item.gstPercentage) / 100;
  });

  const total = subtotal + gstAmount;

  return {
    subtotal,
    gstAmount,
    total,
  };
}
