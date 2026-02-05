"use client";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">About QuickBillz</h1>
        <p className="text-gray-500 mt-2 max-w-2xl">
          QuickBillz is a modern invoicing and billing platform designed to help
          small businesses manage customers, invoices, and payments with ease.
        </p>
      </div>

      {/* ================= MISSION ================= */}
      <section className="bg-white border rounded-xl p-6 space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed">
          Our mission is to simplify business finance for everyone. We believe
          invoicing, tracking payments, and generating reports should be fast,
          clear, and stress-free.
        </p>
      </section>

      {/* ================= FEATURES ================= */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          What You Can Do with QuickBillz
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Feature
            title="Customer Management"
            desc="Add, edit, and manage your customers in one place."
          />
          <Feature
            title="Invoice Creation"
            desc="Create professional invoices in seconds."
          />
          <Feature
            title="Payment Tracking"
            desc="Track paid and unpaid invoices easily."
          />
          <Feature
            title="Reports & Analytics"
            desc="Get insights with sales, GST, and profit & loss reports."
          />
        </div>
      </section>

      {/* ================= TECH STACK ================= */}
      <section className="bg-gray-50 border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Technology Stack
        </h2>

        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Next.js (App Router)</li>
          <li>React & TypeScript</li>
          <li>Tailwind CSS</li>
          <li>Node.js & PostgreSQL (Backend)</li>
        </ul>
      </section>

      {/* ================= FOOTER NOTE ================= */}
      <section className="text-center text-sm text-gray-500 pt-6">
        © {new Date().getFullYear()} QuickBillz. All rights reserved.
      </section>
    </div>
  );
}

/* ================= FEATURE CARD ================= */

function Feature({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white border rounded-xl p-5">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600 text-sm mt-1">{desc}</p>
    </div>
  );
}
