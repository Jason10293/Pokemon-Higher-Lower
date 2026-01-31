"use client";
import { Sparkles, User } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/providers/auth-provider";
import SettingsButton from "./SettingsButton";
const Header = () => {
  const { isLoggedIn } = useAuth();
  return (
    <header className="flex justify-between p-4 px-16">
      <>
        <Link href="/" className="flex flex-row items-center gap-1">
          <Sparkles className="text-primary" />
          <h1 className="text-primary text-2xl font-bold">PokePrice</h1>
        </Link>
      </>
      {isLoggedIn ? (
        <SettingsButton />
      ) : (
        <Link
          href="/login"
          className="border-primary text-primary hover:bg-primary flex flex-row items-center gap-2 rounded-lg border-2 bg-transparent px-4 py-2 font-semibold transition hover:text-black"
        >
          <User />
          Login/Signup
        </Link>
      )}
    </header>
  );
};

export default Header;
