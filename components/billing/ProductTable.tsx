"use client";

import { useEffect, useRef, useState } from "react";
import { apiFetch } from "@/server/api";

/* ================= TYPES ================= */

export interface Product {
  productId?: number;        // 🔥 IMPORTANT
  productName: string;
  qty: number;
  rate: number;
}

interface DBProduct {
  id: number;
  name: string;
  rate: number;
  stock: number;
}

/* ================= PROPS ================= */

interface ProductTableProps {
  onProductsChange: (products: Product[]) => void;
  onBillingChange: (billing: {
    subTotal: number;
    tax: number;
    gst: number;
    total: number;
  }) => void;
}

/* ================= COMPONENT ================= */

export default function ProductTable({
  onProductsChange,
  onBillingChange,
}: ProductTableProps) {
  const [products, setProducts] = useState<Product[]>([
    { productName: "", qty: 1, rate: 0 },
  ]);

  const [allProducts, setAllProducts] = useState<DBProduct[]>([]);

  const inputRefs = useRef<HTMLInputElement[]>([]);
  const lastValueRef = useRef<string[]>([""]);

  /* ===== LOAD PRODUCTS FROM DB ===== */
  useEffect(() => {
    apiFetch<DBProduct[]>("/products")
      .then(setAllProducts)
      .catch(() => {});
  }, []);

  /* ===== BILLING CALCULATION ===== */
  useEffect(() => {
    const subTotal = products.reduce(
      (sum, p) => sum + p.qty * p.rate,
      0
    );

    const tax = Math.round(subTotal * 0.05);
    const gst = Math.round(subTotal * 0.18);
    const total = subTotal + tax + gst;

    onProductsChange(products);
    onBillingChange({ subTotal, tax, gst, total });
  }, [products, onProductsChange, onBillingChange]);

  /* ===== TYPEAHEAD (PRODUCT AUTOCOMPLETE) ===== */
  const handleTypeahead = (index: number, value: string) => {
    const lastValue = lastValueRef.current[index] ?? "";

    // allow backspace
    if (value.length < lastValue.length) {
      updateProduct(index, "productName", value);
      lastValueRef.current[index] = value;
      return;
    }

    if (!value) {
      const updated = [...products];
      updated[index] = {
        ...updated[index],
        productName: "",
        productId: undefined,
        rate: 0,
      };
      setProducts(updated);
      lastValueRef.current[index] = "";
      return;
    }

    const match = allProducts.find((p) =>
      p.name.toLowerCase().startsWith(value.toLowerCase())
    );

    // ❌ no match → manual item
    if (!match) {
      const updated = [...products];
      updated[index] = {
        ...updated[index],
        productName: value,
        productId: undefined,
      };
      setProducts(updated);
      lastValueRef.current[index] = value;
      return;
    }

    // ✅ matched product
    const completed = match.name;

    const updated = [...products];
    updated[index] = {
      ...updated[index],
      productId: match.id,     // 🔥 KEY FIX
      productName: completed,
      rate: match.rate,
    };
    setProducts(updated);
    lastValueRef.current[index] = completed;

    requestAnimationFrame(() => {
      const input = inputRefs.current[index];
      if (input) {
        input.setSelectionRange(value.length, completed.length);
      }
    });
  };

  /* ===== UPDATE PRODUCT ===== */
  const updateProduct = (
    index: number,
    field: keyof Product,
    value: string | number
  ) => {
    const updated = [...products];
    updated[index] = {
      ...updated[index],
      [field]:
        field === "qty" || field === "rate"
          ? Number(value) || 0
          : value,
    };
    setProducts(updated);
  };

  /* ===== ADD ROW ===== */
  const addRow = () => {
    lastValueRef.current.push("");
    setProducts([...products, { productName: "", qty: 1, rate: 0 }]);
  };

  /* ===== REMOVE ROW ===== */
  const removeRow = (index: number) => {
    if (products.length === 1) return;
    setProducts(products.filter((_, i) => i !== index));
    lastValueRef.current.splice(index, 1);
  };

  /* ================= UI ================= */

  return (
    <div className="bg-white border rounded p-4 space-y-3">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th>S.No</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Amount</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {products.map((p, i) => (
            <tr key={i} className="border-b">
              <td>{i + 1}</td>

              <td>
                <input
                  ref={(el) => {
                    if (el) inputRefs.current[i] = el;
                  }}
                  className="border px-2 py-1 w-full"
                  value={p.productName}
                  onChange={(e) =>
                    handleTypeahead(i, e.target.value)
                  }
                />
              </td>

              <td>
                {/* <input
                  type="number"
                  min={1}
                  className="border px-2 py-1 w-16"
                  value={p.qty}
                  onChange={(e) =>
                    updateProduct(i, "qty", e.target.value)
                  }
                /> */}
                <input
                  type="number"
                  min={1}
                  value={p.qty}
                  onChange={(e) =>
                    updateProduct(i, "qty", Math.max(1, Number(e.target.value)))
                  }
                />

              </td>

              <td>
                <input
                  type="number"
                  className="border px-2 py-1 w-20"
                  value={p.rate}
                  onChange={(e) =>
                    updateProduct(i, "rate", e.target.value)
                  }
                />
              </td>

              <td>₹{p.qty * p.rate}</td>

              <td>
                <button
                  onClick={() => removeRow(i)}
                  disabled={products.length === 1}
                  className="text-red-600 hover:underline disabled:opacity-40"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={addRow}
        className="text-sm text-blue-600 hover:underline"
      >
        + Add product
      </button>
    </div>
  );
}
