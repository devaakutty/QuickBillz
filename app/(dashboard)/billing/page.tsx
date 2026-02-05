"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/server/api";

import CustomerSelector from "@/components/billing/CustomerSelector";
import ProductTable from "@/components/billing/ProductTable";
import BillingSummary from "@/components/billing/BillingSummary";
import PaymentMethod from "@/components/billing/PaymentMethod";

/* ================= TYPES ================= */

interface Customer {
  id: string;
  name: string;
  phone: string;
}

interface ProductItem {
  productName: string;
  qty: number;
  rate: number;
}

/* ================= HELPERS ================= */

function generateInvoiceNo() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `INV-${day}${month}${year}-${rand}`;
}

/* ================= PAGE ================= */

export default function BillingPage() {
  const router = useRouter();

  // const [customers, setCustomers] = useState<Customer[]>([]);
  // const [customer, setCustomer] = useState<Customer | null>(null);
  // const [customers, setCustomers] = useState<Customer[]>([]);
  // const [customer, setCustomer] = useState<Customer | null>(null);
 // ✅ REQUIRED
 const [customers, setCustomers] = useState<Customer[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [billing, setBilling] = useState({
    subTotal: 0,
    tax: 0,
    gst: 0,
    total: 0,
  });

  /* ================= LOAD CUSTOMERS ================= */

  useEffect(() => {
    apiFetch<Customer[]>("/customers")
      .then((data) => setCustomers(data || []))
      .catch(() => setCustomers([]));
  }, []);

  /* ================= PAYMENT ================= */

  const handlePayment = async (method: string, provider?: string) => {
    try {
      if (!customer || !customer.id) {
        alert("Please select a customer");
        return;
      }

      const validProducts = products.filter(
        (p) =>
          p.productName.trim() &&
          Number(p.qty) > 0 &&
          Number(p.rate) > 0
      );

      if (!validProducts.length) {
        alert("Add at least one product");
        return;
      }

      setLoading(true);

      const invoiceNo = generateInvoiceNo();

      const invoice = await apiFetch<{ id: string }>("/invoices", {
        method: "POST",
        body: JSON.stringify({
          invoiceNo,
          customerId: customer.id, // ✅ SAFE
          items: validProducts.map((p) => ({
            productName: p.productName,
            quantity: Number(p.qty),
            rate: Number(p.rate),
          })),
          payment: {
            method,
            provider,
            amount: billing.total,
          },
        }),
      });

      router.push(`/invoices/${invoice.id}`);
    } catch (err: any) {
      alert(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="text-2xl font-bold">Billing</h1>

      {/* CUSTOMER SELECTOR */}
      {/* <CustomerSelector
        customers={customers}
        onSelect={setCustomer}
        onAddCustomer={(c) =>
          setCustomers((prev) => [...prev, c])
        }
      /> */}
    <CustomerSelector
        customers={customers}
        onSelect={setCustomer}
        onAddCustomer={(c) =>
          setCustomers((prev) => [...prev, c])
        }
      />

      {customer && (
        <div className="bg-green-50 border rounded p-3 text-sm">
          Customer: <b>{customer.name}</b> ({customer.phone})
        </div>
      )}

      {/* PRODUCTS */}
      <ProductTable
        onProductsChange={setProducts}
        onBillingChange={setBilling}
      />

      {/* SUMMARY */}
      <BillingSummary billing={billing} />

      {/* PAYMENT */}
      {billing.total > 0 && (
        <PaymentMethod
          total={billing.total}
          loading={loading}
          onConfirm={handlePayment}
        />
      )}
    </div>
  );
}
