import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./providers/auth-provider";

export const metadata: Metadata = {
  title: "Pokemon Higher / Lower",
  description: "Guess which Pokemon card is worth more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-50 text-zinc-900 antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
