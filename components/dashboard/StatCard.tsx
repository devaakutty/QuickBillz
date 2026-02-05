import {
  IndianRupee,
  Wallet,
  CreditCard,
  Clock,
} from "lucide-react";

type StatType =
  | "totalSales"
  | "totalExpense"
  | "pendingPayment"
  | "paymentReceived";

export default function StatCard({
  title,
  value,
  type,
}: {
  title: string;
  value: number;
  type: StatType;
}) {
  const iconMap: Record<StatType, JSX.Element> = {
    totalSales: <IndianRupee size={18} />,
    totalExpense: <Wallet size={18} />,
    pendingPayment: <Clock size={18} />,
    paymentReceived: <CreditCard size={18} />,
  };

  const colorMap: Record<StatType, string> = {
    totalSales: "bg-purple-100 text-purple-700",
    totalExpense: "bg-blue-100 text-blue-700",
    pendingPayment: "bg-orange-100 text-orange-700",
    paymentReceived: "bg-green-100 text-green-700",
  };

  return (
    <div className="card p-5">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[type]}`}
      >
        {iconMap[type]}
      </div>

      <p className="text-sm text-gray-500 mt-3">{title}</p>

      <p className="text-2xl font-bold">
        ₹{value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}
