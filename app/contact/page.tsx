"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all fields.");
      return;
    }

    // ✅ Dummy submit (API later)
    setSuccess("Message sent successfully! We’ll contact you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
        <p className="text-gray-500 mt-2 max-w-2xl">
          Have questions or need help? Our team is here to support you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* ================= CONTACT INFO ================= */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              QuickBillz
            </h2>
            <p className="text-gray-600 mt-2">
              Smart billing & invoicing platform for modern businesses.
            </p>
          </div>

          <div className="space-y-3 text-gray-700 text-sm">
            <p>
              📧 <span className="font-medium">Email:</span>{" "}
              admin@quickbillz.com
            </p>
            <p>
              📞 <span className="font-medium">Phone:</span>{" "}
              +91 98765 43210
            </p>
            <p>
              📍 <span className="font-medium">Location:</span>{" "}
              Chennai, India
            </p>
          </div>

          <div className="text-sm text-gray-500">
            Our support team usually responds within 24 hours.
          </div>
        </div>

        {/* ================= CONTACT FORM ================= */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ERROR */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">
                {success}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Message
              </label>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Write your message..."
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
