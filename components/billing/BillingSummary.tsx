export default function BillingSummary({
  billing,
}: {
  billing: {
    subTotal: number;
    tax: number;
    gst: number;
    total: number;
  };
}) {
  return (
    <div className="bg-white border rounded p-4 space-y-2">
      <p>Subtotal: ₹{billing.subTotal}</p>
      <p>Tax (5%): ₹{billing.tax}</p>
      <p>GST (18%): ₹{billing.gst}</p>
      <hr />
      <p className="font-bold text-lg">
        Total: ₹{billing.total}
      </p>
    </div>
  );
}
