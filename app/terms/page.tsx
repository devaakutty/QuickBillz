"use client";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Terms & Conditions</h1>
        <p className="text-gray-500 mt-2">
          Last updated: February 2026
        </p>
      </div>

      {/* CONTENT */}
      <div className="space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-2">
            1. Introduction
          </h2>
          <p>
            Welcome to <b>QuickBillz</b>. By accessing or using our
            application, you agree to be bound by these Terms &
            Conditions. If you do not agree, please do not use the
            service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            2. Use of Service
          </h2>
          <p>
            You agree to use QuickBillz only for lawful purposes and
            in compliance with all applicable laws and regulations.
            You are responsible for maintaining the confidentiality
            of your account credentials.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            3. Account & Security
          </h2>
          <p>
            You are responsible for all activities that occur under
            your account. We are not liable for any loss or damage
            arising from unauthorized access to your account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            4. Billing & Payments
          </h2>
          <p>
            Subscription fees, if applicable, are billed on a monthly
            or yearly basis. Payments are non-refundable unless
            otherwise stated.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            5. Data & Privacy
          </h2>
          <p>
            Your data is handled according to our Privacy Policy.
            We take reasonable measures to protect your information,
            but we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            6. Limitation of Liability
          </h2>
          <p>
            QuickBillz shall not be liable for any indirect, incidental,
            or consequential damages arising from the use or inability
            to use the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            7. Changes to Terms
          </h2>
          <p>
            We reserve the right to update these Terms at any time.
            Continued use of the service after changes constitutes
            acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            8. Contact Us
          </h2>
          <p>
            If you have any questions about these Terms, please contact
            us at{" "}
            <span className="font-medium">
              admin@quickbillz.com
            </span>.
          </p>
        </section>
      </div>
    </div>
  );
}
