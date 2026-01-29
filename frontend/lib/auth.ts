import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PostgresAdapter(pool),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const result = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email],
        );
        const user = result.rows[0];
        if (!user || !user.password_hash) return null;
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return null;
        return {
          id: String(user.id),
          email: user.email,
          name: user.display_name,
          image: user.avatar_url,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.displayName = user.name;
        token.avatarUrl = user.image;
      }
      if (trigger === "update" && session) {
        token.displayName = session.displayName;
        token.avatarUrl = session.avatarUrl;
      }
      return token;
    },
    async session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user = session.user as any;
      user.id = token.id as string;
      user.displayName = token.displayName as string;
      user.avatarUrl = token.avatarUrl as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
