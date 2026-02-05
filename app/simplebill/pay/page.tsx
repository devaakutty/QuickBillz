"use client";

import { loadRazorpay } from "@/utils/loadRazorpay";

export default function SimpleBillPay() {
  const data = sessionStorage.getItem("simplebill");
  if (!data) return <p>No payment data</p>;

  const { customer, amount } = JSON.parse(data);

  const payNow = async () => {
    const res = await loadRazorpay();
    if (!res) {
      alert("Razorpay failed");
      return;
    }

    const options = {
      key: "rzp_test_1234567890",
      amount: amount * 100,
      currency: "INR",
      name: "SimpleBill",
      description: "Quick Payment",
      handler: function () {
        alert("Payment successful!");
      },
      prefill: {
        name: customer,
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <button
        onClick={payNow}
        className="px-6 py-3 bg-black text-white rounded"
      >
        Pay ₹{amount}
      </button>
    </div>
  );
}
