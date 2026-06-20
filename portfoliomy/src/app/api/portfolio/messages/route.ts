import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/auth";
import {
  createMessage,
  listMessages,
} from "@/lib/services/messages";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = await createMessage(body);
    return NextResponse.json(message, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 400 });
  }
}

export const GET = withAuth(async () => {
  try {
    const messages = await listMessages();
    return NextResponse.json(messages);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
});
