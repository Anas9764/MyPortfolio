import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/auth";
import { deleteMessage } from "@/lib/services/messages";

export const DELETE = withAuth(
  async (
    _request: NextRequest,
    context?: { params: Promise<Record<string, string>> }
  ) => {
    try {
      const { id } = (await context?.params) ?? {};
      const result = await deleteMessage(id);
      return NextResponse.json(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Server error";
      return NextResponse.json({ message }, { status: 500 });
    }
  }
);
