"use client";

import { useState } from "react";
import { apiFetch } from "@/server/api";
import { useRouter } from "next/navigation";

export default function BulkAddProductsPage() {
  const router = useRouter();

  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      // ✅ Split & clean lines
      const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      if (!lines.length) {
        throw new Error("Please enter at least one product");
      }

      const products: {
        name: string;
        stock: number;
        price: number;
      }[] = [];

      const invalidLines: number[] = [];

      // ✅ SAFE parsing (never crashes)
      lines.forEach((line, index) => {
        try {
          const parts = line.split(",").map((p) => p.trim());

          if (parts.length < 3) throw new Error();

          const price = Number(parts.pop());
          const stock = Number(parts.pop());
          const name = parts.join(",");

          if (!name || isNaN(stock) || isNaN(price)) {
            throw new Error();
          }

          products.push({ name, stock, price });
        } catch {
          invalidLines.push(index + 1);
        }
      });

      if (!products.length) {
        throw new Error("No valid products found");
      }

      // ✅ API call (only valid products)
      await apiFetch("/products/bulk", {
        method: "POST",
        body: JSON.stringify({ products }),
      });

      // ⚠️ Inform skipped lines
      if (invalidLines.length) {
        alert(
          `Products added successfully.\nSkipped invalid lines: ${invalidLines.join(
            ", "
          )}`
        );
      }

      router.push("/products");
    } catch (err: any) {
      setError(err.message || "Bulk add failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/products")}
          className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold">Bulk Add Products</h1>
      </div>

      {/* INFO */}
      <p className="text-sm text-gray-500">
        Enter one product per line using the format:
        <br />
        <span className="font-mono">
          Product Name, Stock, Price
        </span>
      </p>

      {/* ERROR */}
      {error && (
        <div className="text-red-600 bg-red-50 border p-2 rounded">
          {error}
        </div>
      )}

      {/* TEXTAREA */}
      <textarea
        rows={14}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Milk 1L, 50, 45
Bread White, 100, 30
Chocolate, Dark 70%, 60, 95`}
        className="w-full border rounded p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black"
      />

      {/* ACTION */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-6 py-2 bg-black text-white rounded disabled:opacity-60"
      >
        {loading ? "Adding..." : "Add Products"}
      </button>
    </div>
  );
}
