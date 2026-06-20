"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api-client";
import "@/styles/admin.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login({ email, password });
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-theme flex flex-col items-center justify-center min-h-screen bg-[#030014] text-white">
      <div className="w-full max-w-md p-8 bg-[#171721] rounded-2xl shadow-xl border border-white/10">
        <h2 className="text-3xl font-bold text-center mb-8">Admin Login</h2>
        {error && (
          <div className="p-3 mb-4 bg-red-500/20 border border-red-500/50 text-red-500 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-[#030014] border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-[#030014] border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
