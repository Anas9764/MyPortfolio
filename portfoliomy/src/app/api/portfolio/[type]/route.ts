import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/auth";
import {
  addPortfolioItem,
  isValidResourceType,
} from "@/lib/services/portfolio";

export const POST = withAuth(
  async (
    request: NextRequest,
    context?: { params: Promise<Record<string, string>> }
  ) => {
    try {
      const { type } = (await context?.params) ?? {};
      if (!type || !isValidResourceType(type)) {
        return NextResponse.json({ message: "Invalid type" }, { status: 400 });
      }
      const body = await request.json();
      const item = await addPortfolioItem(type, body);
      return NextResponse.json(item, { status: 201 });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Server error";
      return NextResponse.json({ message }, { status: 400 });
    }
  }
);
