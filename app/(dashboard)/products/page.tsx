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
    <div className="space-y-4">
      {/* ================= PAGE HEADER (STICKY) ================= */}
      <div className="sticky top-0 z-30 bg-zinc-50 pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
            >
              ← Back
            </button>

            <h1 className="text-2xl font-bold">
              Products
              <span className="ml-2 text-sm font-medium text-gray-500">
                ({products.length})
              </span>
            </h1>
          </div>

          <div className="flex gap-3">
            <Link
              href="/products/bulk"
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Bulk Add
            </Link>

            <Link
              href="/products/create"
              className="px-4 py-2 bg-black text-white rounded"
            >
              + Add Product
            </Link>
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white border rounded-xl overflow-hidden max-h-[70vh] overflow-y-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 text-left sticky top-0 bg-gray-50 z-20">
                Name
              </th>
              <th className="p-4 text-left sticky top-0 bg-gray-50 z-20">
                Rate
              </th>
              <th className="p-4 text-left sticky top-0 bg-gray-50 z-20">
                Stock
              </th>
              <th className="p-4 text-left sticky top-0 bg-gray-50 z-20">
                Unit
              </th>
              <th className="p-4 text-left sticky top-0 bg-gray-50 z-20">
                Status
              </th>
              <th className="p-4 text-right sticky top-0 bg-gray-50 z-20">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                onClick={() => router.push(`/products/${p.id}`)}
                className="border-t hover:bg-gray-50 cursor-pointer"
              >
                <td className="p-4 font-medium">{p.name}</td>

                <td className="p-4">
                  ₹{p.rate.toLocaleString("en-IN")}
                </td>

                <td
                  className={`p-4 font-semibold ${
                    p.stock <= 5 ? "text-red-600" : "text-gray-900"
                  }`}
                >
                  {p.stock}
                </td>

                <td className="p-4">{p.unit ?? "—"}</td>

                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      p.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {p.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(p.id);
                    }}
                    disabled={deletingId === p.id}
                    className="text-red-600 hover:underline disabled:opacity-50"
                  >
                    {deletingId === p.id ? "Deleting…" : "Delete"}
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
