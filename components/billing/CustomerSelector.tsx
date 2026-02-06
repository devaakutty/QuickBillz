"use client";

import { useState } from "react";
import { apiFetch } from "@/server/api";

  export interface Customer {
    id: string;
    name: string;
    phone: string; // ✅ REQUIRED
  }

export default function CustomerSelector({
  customers = [],
  onSelect,
  onAddCustomer,
}: {
  customers?: Customer[];
  onSelect: (customer: Customer) => void;
  onAddCustomer: (customer: Customer) => void;
}) {
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const handleAddCustomer = async () => {
    try {
      setError("");
      setLoading(true);

      if (!name.trim()) {
        setError("Customer name is required");
        return;
      }

      if (phone.length !== 10) {
        setError("Mobile number must be 10 digits");
        return;
      }

      const customer = await apiFetch<Customer>("/customers", {
        method: "POST",
        body: JSON.stringify({ name, phone }),
      });

      onAddCustomer(customer);
      onSelect(customer);

      setName("");
      setPhone("");
    } catch (err: any) {
      if (err.message?.includes("Session expired")) {
        window.location.href = "/login";
        return;
      }
      setError(err.message || "Failed to add customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-xl p-4 space-y-4">
      <h3 className="font-semibold text-lg">Customer</h3>

      <input
        placeholder="Search by name or phone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded px-3 py-2 text-sm"
      />

      <div className="border rounded divide-y max-h-48 overflow-y-auto">
        {filteredCustomers.map((customer) => (
          <button
            key={customer.id}
            onClick={() => onSelect(customer)}
            className="w-full text-left px-3 py-2 hover:bg-indigo-50"
          >
            <div className="font-medium">{customer.name}</div>
            <div className="text-xs text-gray-500">{customer.phone}</div>
          </button>
        ))}

        {filteredCustomers.length === 0 && (
          <div className="p-3 text-sm text-gray-500 text-center">
            No customer found
          </div>
        )}
      </div>

      <div className="border rounded-lg p-3 space-y-2">
        <h4 className="text-sm font-semibold">Add New Customer</h4>

        <input
          placeholder="Customer name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        />

        <input
          placeholder="Mobile number"
          value={phone}
          maxLength={10}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          className="w-full border rounded px-3 py-2 text-sm"
        />

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          onClick={handleAddCustomer}
          disabled={loading}
          className="w-full bg-indigo-600 text-white rounded py-2 text-sm"
        >
          {loading ? "Adding..." : "Add Customer"}
        </button>
      </div>
    </div>
  );
}
