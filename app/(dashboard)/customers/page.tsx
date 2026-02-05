"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/server/api";
// import { useAuth } from "@/hooks/useAuth";

// const { name, email, phone, address, isActive } = req.body;
/* ================= TYPES ================= */

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  userId: string;
}

type StatusFilter = "All" | "Active" | "Inactive";

/* ================= PAGE ================= */

export default function CustomersPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ================= FETCH ================= */

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<Customer[]>("/customers");
      setCustomers(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  /* ================= DELETE ================= */
    const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this customer?")) return;

      try {
        await apiFetch(`/customers/${id}`, {
          method: "DELETE",
        });

        setCustomers((prev) => prev.filter((c) => c.id !== id));
      } catch (err: any) {
        alert(err.message || "Delete failed");
      }
    };

  /* ================= FILTER ================= */

  const filteredCustomers = customers.filter((c) => {
    const q = search.toLowerCase();

    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.includes(q);

    // const isActive = c.isActive ?? true;
    const isActive = c.isActive === true;
    const status = isActive ? "Active" : "Inactive";

    return (
      matchesSearch &&
      (statusFilter === "All" || status === statusFilter)
    );
  });
//* ================= STATUS BADGE ================= */
  function StatusBadge({ isActive }: { isActive?: boolean }) {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
        isActive
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}


  /* ================= UI ================= */

  if (loading) {
    return <p className="text-center py-24">Loading customers...</p>;
  }

  if (error) {
    return (
      <p className="text-center text-red-600 py-24">
        {error}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customers</h1>

        <button
          onClick={() => router.push("/customers/add")}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          + New Customer
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, phone..."
          className="border px-3 py-2 rounded w-72"
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as StatusFilter)
          }
          className="border px-3 py-2 rounded"
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {filteredCustomers.map((c) => (
          <div
            key={c.id}
            className="border rounded p-4 bg-white space-y-2"
          >
            <h3 className="font-semibold">{c.name}</h3>
             <StatusBadge isActive={c.isActive} />
            <p className="text-sm">{c.email || "—"}</p>
            <p className="text-sm">{c.phone || "—"}</p>

            <div className="flex gap-4 pt-3">
              <button
                onClick={() => router.push(`/customers/${c.id}`)}
                className="text-sm text-indigo-600 hover:underline"
              >
                View
              </button>

              <button
                onClick={() =>
                  router.push(`/customers/${c.id}/edit`)
                }
                className="text-sm text-gray-600 hover:underline"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(c.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>

            </div>
          </div>
        ))}

        {filteredCustomers.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-20">
            No customers found
          </div>
        )}
      </div>
    </div>
  );
}
