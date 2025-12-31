import React from "react";
import { useState, useEffect } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import Link from "next/link";

const SettingsButton = () => {
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="hover:bg-muted flex items-center gap-2 rounded-2xl bg-transparent px-4 py-2 transition-all duration-300"
        >
          <User className="text-white" />
          <span className="font-medium text-white">{userEmail}</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[10rem] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/95 py-2 text-white shadow-xl backdrop-blur"
          align="end"
          sideOffset={10}
        >
          <DropdownMenu.Item asChild className="mx-1 rounded-lg">
            <Link
              href="/settings"
              className="focus:bg-accent flex cursor-pointer items-center px-4 py-2 text-sm transition-colors outline-none select-none"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="focus:bg-accent mx-1 flex cursor-pointer items-center rounded-lg px-4 py-2 text-sm text-white transition-colors outline-none select-none focus:text-white"
            onSelect={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default SettingsButton;
