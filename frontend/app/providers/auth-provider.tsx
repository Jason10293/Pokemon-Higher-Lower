"use client";
import React from "react";
import { SessionProvider, useSession } from "next-auth/react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export function useAuth() {
  const { data: session, status } = useSession();
  return {
    isLoggedIn: status === "authenticated",
    isLoading: status === "loading",
    session,
  };
}

export default AuthProvider;
