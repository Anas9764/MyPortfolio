import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/auth";
import {
  reorderPortfolioItems,
  isReorderableType,
} from "@/lib/services/portfolio";

export const POST = withAuth(
  async (
    request: NextRequest,
    context?: { params: Promise<Record<string, string>> }
  ) => {
    try {
      const { type } = (await context?.params) ?? {};
      if (!type || !isReorderableType(type)) {
        return NextResponse.json({ message: "Invalid type" }, { status: 400 });
      }
      const { orders } = await request.json();
      const result = await reorderPortfolioItems(type, orders);
      return NextResponse.json(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Server error";
      return NextResponse.json({ message }, { status: 500 });
    }
  }
);
