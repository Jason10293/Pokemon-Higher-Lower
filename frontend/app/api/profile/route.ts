import { auth } from "@/lib/auth";
import { Pool } from "pg";
import { NextResponse } from "next/server";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { displayName, avatarUrl } = await req.json();

  await pool.query(
    "UPDATE users SET display_name = $1, avatar_url = $2, name = $1, image = $2, updated_at = now() WHERE id = $3",
    [displayName, avatarUrl, session.user.id],
  );

  return NextResponse.json({ success: true });
}
