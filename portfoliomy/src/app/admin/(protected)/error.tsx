"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center">
      <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl flex items-center gap-3">
        <AlertCircle size={24} />
        <div className="text-left">
          <p className="font-semibold">Something went wrong</p>
          <p className="text-sm opacity-80">{error.message}</p>
        </div>
      </div>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all"
      >
        <RefreshCw size={18} />
        Try again
      </button>
    </div>
  );
}
