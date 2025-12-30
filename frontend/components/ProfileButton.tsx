import React from "react";
import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import Link from "next/link";
const ProfileButton = () => {
  const [userEmail, setUserEmail] = useState<string | null>("");
  useEffect(() => {
    const getUserEmail = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserEmail(user?.email?.split("@")[0] ?? null);
    };
    getUserEmail();
  }, []);

  return (
    <Link
      href="/profile"
      className="hover:bg-muted flex cursor-pointer flex-row gap-2 rounded-2xl bg-transparent px-4 py-2 transition-all duration-300"
    >
      <User className="text-white" />
      <div className="font-semibold text-white">{userEmail}</div>
    </Link>
  );
};

export default ProfileButton;
