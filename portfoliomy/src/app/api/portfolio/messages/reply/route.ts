import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/auth";
import { replyToMessage } from "@/lib/services/messages";

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const result = await replyToMessage(body);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    const status = message.includes("not configured") ? 400 : 500;
    return NextResponse.json({ message }, { status });
  }
});
