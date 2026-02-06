"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { InvoiceItem } from "@/types/invoice";


interface InvoiceDraft {
  customerName: string;
  items: InvoiceItem[];
}

interface InvoiceDraftContextType {
  draft: InvoiceDraft | null;
  setDraft: React.Dispatch<React.SetStateAction<InvoiceDraft | null>>;
}

const InvoiceContext =
  createContext<InvoiceDraftContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<InvoiceDraft | null>(null);

  return (
    <InvoiceContext.Provider value={{ draft, setDraft }}>
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoiceDraft(): InvoiceDraftContextType {
  const context = useContext(InvoiceContext);

  if (!context) {
    throw new Error(
      "useInvoiceDraft must be used inside InvoiceProvider"
    );
  }

  return context;
}
