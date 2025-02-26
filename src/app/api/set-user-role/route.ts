// src/app/api/set-user-role/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { userId, role } = await request.json();

    const {
      data: { user },
      error,
    } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role },
    });

    if (error) throw error;

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 },
    );
  }
}
