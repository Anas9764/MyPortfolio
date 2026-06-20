import { NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/auth";
import { getAnalyticsStats } from "@/lib/services/analytics";

export const GET = withAuth(async () => {
  try {
    const stats = await getAnalyticsStats();
    return NextResponse.json(stats);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
});
