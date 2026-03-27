import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({
    user: {
      email: session.user.email,
      id: session.user.id,
      role: session.user.role,
    },
  });
}
