"use client";

import { useState} from "react";
// import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/server/api";
// 1. Define the User type so TypeScript knows what 'receivedUser' is
interface User {
  id: string;
  email: string;
  name?: string;
  // add any other fields your API returns
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

// import { apiFetch } from "@/server/api";

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
        const data = await apiFetch<{
          token: string;
          user: { id: string; email: string };
        }>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });

        // 🔥 THIS MUST HAPPEN
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        router.replace("/dashboard");
      } catch (err: any) {
        setError(err.message || "Login failed");
      } finally {
        setLoading(false);
      }
    };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form 
        onSubmit={handleLogin} 
        className="bg-white p-8 rounded-xl w-full max-w-sm space-y-4 shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>

        {error && (
          <div className="text-sm text-red-600 text-center bg-red-50 py-2 px-3 rounded border border-red-200">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            placeholder="name@company.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-indigo-600 text-white rounded-md font-semibold disabled:opacity-50 hover:bg-indigo-700 transition-all active:scale-[0.98]"
        >
          {loading ? "Verifying..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}