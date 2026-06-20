import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/auth";
import { updateBio } from "@/lib/services/portfolio";

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const bio = await updateBio(body);
    return NextResponse.json(bio);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 400 });
  }
});
