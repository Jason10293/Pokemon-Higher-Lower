import { auth } from "@/lib/auth";
import { Pool } from "pg";
import { NextResponse } from "next/server";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { displayName, avatarUrl } = await req.json();

    await pool.query(
      "UPDATE users SET display_name = $1, avatar_url = $2, name = $3, image = $4, updated_at = now() WHERE id = $5",
      [displayName, avatarUrl, displayName, avatarUrl, session.user.id],
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile update error:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error: "Failed to update profile. Please try again.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
