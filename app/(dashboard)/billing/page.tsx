"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/server/api";
import { motion } from "framer-motion";
import { User, ShoppingBag, CreditCard, ChevronRight } from "lucide-react";

import CustomerSelector from "@/components/billing/CustomerSelector";
import ProductTable from "@/components/billing/ProductTable";
import BillingSummary from "@/components/billing/BillingSummary";
import PaymentMethod from "@/components/billing/PaymentMethod";

// ... Types and generateInvoiceNo helpers stay the same ...

export default function BillingPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [billing, setBilling] = useState({ subTotal: 0, tax: 0, gst: 0, total: 0 });

  useEffect(() => {
    apiFetch<Customer[]>("/customers")
      .then((data) => setCustomers(data || []))
      .catch(() => setCustomers([]));
  }, []);

  return (
    <div className="p-6 bg-[#F4F4F4] min-h-screen">
      {/* 1. COMPACT HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="bg-black text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
            POS Terminal
          </span>
          <h1 className="text-3xl font-black text-black tracking-tighter mt-1">
            Billing<span className="text-gray-400">.</span>
          </h1>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID: QB-01</p>
          <p className="text-sm font-black text-black">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: 8 COLS */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* CUSTOMER SECTION - Smaller Padding & Shadows */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-black rounded-[24px] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-black p-2 rounded-lg text-white">
                <User size={18} />
              </div>
              <h2 className="text-lg font-black tracking-tight">Customer</h2>
            </div>

            <CustomerSelector
              customers={customers}
              onSelect={setCustomer}
              onAddCustomer={(c) => setCustomers((prev) => [...prev, c])}
            />
            
            {customer && (
              <div className="mt-4 flex items-center justify-between bg-gray-50 border border-dashed border-gray-300 rounded-xl p-3">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase">Profile</p>
                  <p className="text-sm font-black text-black">{customer.name}</p>
                </div>
                <div className="bg-black text-white h-8 w-8 rounded-full flex items-center justify-center scale-90">
                   <ChevronRight size={16} />
                </div>
              </div>
            )}
          </motion.div>

          {/* PRODUCT TABLE - Compact Container */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border-2 border-black rounded-[24px] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-black p-2 rounded-lg text-white">
                <ShoppingBag size={18} />
              </div>
              <h2 className="text-lg font-black tracking-tight">Cart Items</h2>
            </div>
            
            <div className="scale-95 origin-top-left">
               <ProductTable
                 onProductsChange={setProducts}
                 onBillingChange={setBilling}
               />
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: 4 COLS */}
        <div className="xl:col-span-4 sticky top-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black text-white rounded-[32px] p-6 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white p-2 rounded-lg text-black">
                <CreditCard size={18} />
              </div>
              <h2 className="text-lg font-black tracking-tight text-white">Summary</h2>
            </div>
            
            <div className="space-y-4">
               {/* Make the internal summary components smaller with a wrapper class if needed */}
               <div className="text-sm">
                  <BillingSummary billing={billing} />
               </div>
               
               <div className="pt-4 border-t border-gray-800">
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Payable</p>
                  <p className="text-3xl font-black text-white">₹{billing.total.toLocaleString()}</p>
               </div>
            </div>

            <div className="mt-8 scale-95 origin-center">
              {billing.total > 0 && (
                <PaymentMethod
                  total={billing.total}
                  loading={loading}
                  onConfirm={handlePayment}
                />
              )}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}