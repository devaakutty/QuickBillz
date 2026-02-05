import { InvoiceItem } from "./invoice";

export interface Invoice {
  id: string;
  customerName: string;
  items: InvoiceItem[];
  subtotal: number;
  gstAmount: number;
  total: number;
  status: "PAID" | "UNPAID";
  createdAt: string;
}
