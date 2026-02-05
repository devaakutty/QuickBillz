"use client";

import { useState } from "react";
import { InvoiceItem } from "@/types/invoice";
import { calculateInvoiceTotals } from "@/utils/gstCalculator";
import { useRouter } from "next/navigation";
import { useInvoiceDraft } from "@/hooks/useInvoiceDraft";


export default function InvoiceForm() {
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: crypto.randomUUID(),
      name: "",
      quantity: 1,
      price: 0,
      gstPercentage: 18,
    },
  ]);

  const updateItem = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        name: "",
        quantity: 1,
        price: 0,
        gstPercentage: 18,
      },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const { subtotal, gstAmount, total } =
    calculateInvoiceTotals(items);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Create Invoice</h2>

      {/* Customer */}
      <input
        className="w-full border p-2"
        placeholder="Select Customer"
      />

      {/* Items */}
      <div className="space-y-4">
        <h3 className="font-medium">Invoice Items</h3>

        {items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-5 gap-2 items-center"
          >
            <input
              className="border p-2"
              placeholder="Item name"
              value={item.name}
              onChange={(e) =>
                updateItem(item.id, "name", e.target.value)
              }
            />
            <input
              type="number"
              className="border p-2"
              value={item.quantity}
              onChange={(e) =>
                updateItem(item.id, "quantity", Number(e.target.value))
              }
            />
            <input
              type="number"
              className="border p-2"
              value={item.price}
              onChange={(e) =>
                updateItem(item.id, "price", Number(e.target.value))
              }
            />
            <input
              type="number"
              className="border p-2"
              value={item.gstPercentage}
              onChange={(e) =>
                updateItem(
                  item.id,
                  "gstPercentage",
                  Number(e.target.value)
                )
              }
            />

            <button
              onClick={() => removeItem(item.id)}
              className="text-red-600"
              disabled={items.length === 1}
            >
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={addItem}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          + Add Item
        </button>
      </div>

      {/* Summary */}
      <div className="border rounded p-4 space-y-1">
        <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
        <p>GST: ₹{gstAmount.toFixed(2)}</p>
        <p className="font-bold text-lg">
          Total: ₹{total.toFixed(2)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-gray-200 rounded">
          Preview
        </button>
        <button className="px-4 py-2 bg-black text-white rounded">
          Save Invoice
        </button>
      </div>
    </div>
  );
}
