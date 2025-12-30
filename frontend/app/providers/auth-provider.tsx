"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

type AuthContextValue = {
  isLoggedIn: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) {
        return;
      }
      setIsLoggedIn(Boolean(data.session));
      setIsLoading(false);
    };

    loadSession();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) {
        return;
      }
      setIsLoggedIn(Boolean(session));
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export default AuthProvider;
