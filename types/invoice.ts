// types/invoice.ts

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  gstPercentage?: number;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  customer: {
    name: string;
    phone?: string; // ✅ FIX — OPTIONAL
  };
  products: {
    name: string;
    qty: number;
    rate: number;
  }[];
  billing: {
    subTotal: number;
    tax: number;
    gst: number;
    total: number;
  };
  payment: {
    method: string;
    provider?: string;
  };
  status: "PAID" | "UNPAID";
  createdAt: string;
}
