// "use client";

// import { useEffect, useState } from "react";
// import StatCard from "@/components/dashboard/StatCard";
// import { apiFetch } from "@/server/api";

// type DashboardStats = {
//   totalSales: number;
//   totalExpense: number;
//   pendingAmount: number;
//   receivedAmount: number;
// };

// export default function DashboardPage() {
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const loadDashboard = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const data = await apiFetch<DashboardStats>(
//         "/dashboard/summary"
//       );
//       setStats(data);
//     } catch (err: any) {
//       console.error("Dashboard load error:", err);
//       setError(err.message || "Failed to load dashboard");
//       setStats(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadDashboard();
//   }, []);

//   /* ===== LOADING ===== */
//   if (loading) {
//     return (
//       <div className="p-6 text-gray-400">
//         Loading dashboard…
//       </div>
//     );
//   }

//   /* ===== ERROR (STAY ON PAGE) ===== */
//   if (error) {
//     return (
//       <div className="p-6 space-y-3">
//         <div className="text-red-500">
//           {error}
//         </div>

//         <button
//           onClick={loadDashboard}
//           className="px-4 py-2 rounded bg-gray-800 text-white"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   /* ===== NO DATA (EDGE CASE) ===== */
//   if (!stats) {
//     return (
//       <div className="p-6 text-red-500">
//         No dashboard data available
//       </div>
//     );
//   }

//   /* ===== SUCCESS ===== */
//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
//         <StatCard
//           title="Total Sales"
//           value={stats.totalSales}
//           type="totalSales"
//         />

//         <StatCard
//           title="Total Expense"
//           value={stats.totalExpense}
//           type="totalExpense"
//         />

//         <StatCard
//           title="Pending Amount"
//           value={stats.pendingAmount}
//           type="pendingPayment"
//         />

//         <StatCard
//           title="Received Amount"
//           value={stats.receivedAmount}
//           type="paymentReceived"
//         />
//       </div>
//     </div>
//   );
// }
