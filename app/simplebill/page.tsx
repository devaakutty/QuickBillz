export default function SimpleBillHome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-2">SimpleBill</h1>
      <p className="text-gray-500 mb-6">
        Create quick invoice & collect payment
      </p>

      <a
        href="/simplebill/create"
        className="px-6 py-3 bg-black text-white rounded"
      >
        Create Bill
      </a>
    </div>
  );
}
