import { NextResponse } from "next/server";
import { trackVisit } from "@/lib/services/analytics";

export async function POST() {
  try {
    const stats = await trackVisit();
    return NextResponse.json(stats);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
