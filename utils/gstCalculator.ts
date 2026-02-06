// utils/gstCalculator.ts

import { i } from "framer-motion/client";


export function calculateInvoiceTotals(items: {
  quantity: number;
  price: number;
  gstPercentage?: number;
}[]) {
  let subtotal = 0;
  let gstAmount = 0;

  items.forEach((item) => {
    const itemTotal = item.quantity * item.price;
    subtotal += itemTotal;

    const gst = item.gstPercentage ?? 18; // ✅ DEFAULT GST
    gstAmount += (itemTotal * gst) / 100;
  });

  const total = subtotal + gstAmount;

  return {
    subtotal,
    gstAmount,
    total,
  };
}
