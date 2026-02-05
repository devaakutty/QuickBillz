"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/server/api";

interface Product {
  id: number;
  name: string;
  rate: number;
  unit?: string | null;
  stock: number;
  isActive: boolean;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    apiFetch<Product[]>("/products")
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;

    try {
      setDeletingId(id);
      await apiFetch(`/products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading products…</div>;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/reports")}
            className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold">Products</h1>
        </div>

        <Link
          href="/products/create"
          className="px-4 py-2 bg-black text-white rounded"
        >
          + Add Product
        </Link>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Rate</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Unit</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4">₹{p.rate}</td>

                <td
                  className={`p-4 font-semibold ${
                    p.stock <= 5 ? "text-red-600" : ""
                  }`}
                >
                  {p.stock}
                </td>

                <td className="p-4">{p.unit ?? "—"}</td>

                <td className="p-4">
                  {p.isActive ? "Active" : "Inactive"}
                </td>

                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                    className="text-red-600 hover:underline disabled:opacity-50"
                  >
                    {deletingId === p.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-gray-400">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
