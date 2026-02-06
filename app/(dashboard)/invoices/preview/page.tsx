import { Suspense } from "react";
import InvoicePreviewClient from "./InvoicePreviewClient";

export default function InvoicePreviewPage() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-400">Loading preview…</div>}>
      <InvoicePreviewClient />
    </Suspense>
  );
}
