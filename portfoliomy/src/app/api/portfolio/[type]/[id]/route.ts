import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/auth";
import {
  updatePortfolioItem,
  deletePortfolioItem,
  isValidResourceType,
} from "@/lib/services/portfolio";

export const PUT = withAuth(
  async (
    request: NextRequest,
    context?: { params: Promise<Record<string, string>> }
  ) => {
    try {
      const { type, id } = (await context?.params) ?? {};
      if (!type || !isValidResourceType(type)) {
        return NextResponse.json({ message: "Invalid type" }, { status: 400 });
      }
      const body = await request.json();
      const item = await updatePortfolioItem(type, id, body);
      return NextResponse.json(item);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Server error";
      return NextResponse.json({ message }, { status: 400 });
    }
  }
);

export const DELETE = withAuth(
  async (
    _request: NextRequest,
    context?: { params: Promise<Record<string, string>> }
  ) => {
    try {
      const { type, id } = (await context?.params) ?? {};
      if (!type || !isValidResourceType(type)) {
        return NextResponse.json({ message: "Invalid type" }, { status: 400 });
      }
      const result = await deletePortfolioItem(type, id);
      return NextResponse.json(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Server error";
      return NextResponse.json({ message }, { status: 500 });
    }
  }
);
