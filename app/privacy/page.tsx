export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mt-2">
          Last updated: January 2026
        </p>
      </div>

      {/* INTRO */}
      <section className="space-y-3">
        <p className="text-gray-700">
          At <b>QuickBillz</b>, your privacy is important to us. This Privacy
          Policy explains how we collect, use, store, and protect your
          information when you use our billing and invoicing platform.
        </p>
      </section>

      {/* INFORMATION WE COLLECT */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">1. Information We Collect</h2>

        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>
            <b>Account Information:</b> Name, email address, phone number, and
            company details.
          </li>
          <li>
            <b>Billing Data:</b> Customer names, invoices, payments, GST details,
            and transaction records.
          </li>
          <li>
            <b>Usage Data:</b> Pages visited, features used, and basic analytics
            to improve the platform.
          </li>
        </ul>
      </section>

      {/* HOW WE USE DATA */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>

        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>To provide and maintain the QuickBillz service</li>
          <li>To generate invoices, reports, and payment records</li>
          <li>To improve performance, security, and user experience</li>
          <li>To communicate important updates or support messages</li>
        </ul>
      </section>

      {/* DATA SECURITY */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">3. Data Security</h2>

        <p className="text-gray-700">
          We take reasonable technical and organizational measures to protect
          your data from unauthorized access, loss, or misuse. However, no
          online system is 100% secure.
        </p>
      </section>

      {/* DATA SHARING */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">4. Data Sharing</h2>

        <p className="text-gray-700">
          We do <b>not</b> sell or rent your personal data. Your data may only be
          shared with trusted services (such as payment gateways) strictly for
          providing the service.
        </p>
      </section>

      {/* USER RIGHTS */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">5. Your Rights</h2>

        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Access and update your account information</li>
          <li>Request deletion of your data</li>
          <li>Export your invoices and reports</li>
        </ul>
      </section>

      {/* COOKIES */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">6. Cookies</h2>

        <p className="text-gray-700">
          QuickBillz may use cookies or local storage to maintain login sessions
          and improve usability. You can disable cookies in your browser
          settings.
        </p>
      </section>

      {/* CHANGES */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">7. Changes to This Policy</h2>

        <p className="text-gray-700">
          We may update this Privacy Policy from time to time. Any changes will
          be reflected on this page.
        </p>
      </section>

      {/* CONTACT */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">8. Contact Us</h2>

        <p className="text-gray-700">
          If you have any questions about this Privacy Policy, please contact us
          at:
        </p>

        <p className="text-gray-700 font-medium">
          📧 admin@quickbillz.com
        </p>
      </section>
    </div>
  );
}
