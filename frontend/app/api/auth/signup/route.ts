import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }

    const hash = await bcrypt.hash(password, 12);
    const defaultName = email.split("@")[0];
    const defaultAvatar =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png";

    await pool.query(
      "INSERT INTO users (email, password_hash, display_name, avatar_url, name, image) VALUES ($1, $2, $3, $4, $5, $6)",
      [email, hash, defaultName, defaultAvatar, defaultName, defaultAvatar],
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Signup error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      databaseUrl: process.env.DATABASE_URL ? "Set" : "Not set",
    });
    return NextResponse.json(
      {
        error: "Failed to create account. Please try again.",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 },
    );
  }
}
