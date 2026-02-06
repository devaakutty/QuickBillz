export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">QuickBillz</h1>
      <p className="text-gray-600">
        Simple billing & invoicing for startups
      </p>

      <div className="flex gap-4">
        <a
          href="/login"
          className="px-4 py-2 bg-black text-white rounded"
        >
          Login
        </a>
        {/* <a
          href="/signup"
          className="px-4 py-2 border rounded"
        >
          Get Started
        </a> */}
      </div>
    </div>
  );
}
