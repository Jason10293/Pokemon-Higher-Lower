"use client";
import { Sparkles, Mail, Lock } from "lucide-react";
import GoogleIcon from "../login/icons/GoogleIcon";
import BackButton from "@/components/BackButton";
import PulsingDecoration from "@/components/PulsingDecoration";
import { motion } from "framer-motion";
import { supabase } from "@/utils/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getDisplayName } from "next/dist/shared/lib/utils";
export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: email.split("@")[0],
          avatar_url:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
        },
      },
    });
    if (error) {
      console.log("Error signing up:", error.message);
    } else {
      router.push("/gamepage");
      console.log("Signup successful!", data);
    }
  };
  return (
    <div className="gradient-hero relative flex min-h-screen flex-col overflow-hidden">
      <PulsingDecoration />
      <BackButton href="/" />

      <div className="flex flex-1 items-center justify-center px-4">
        <div className="relative w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full max-w-md"
          >
            <div className="gradient-card border-border shadow-card flex flex-col items-center rounded-2xl border p-8 text-white">
              {/* Logo and Title*/}
              <div className="bg-primary/20 border-primary mb-6 flex w-fit flex-row items-center justify-center gap-2 rounded-2xl border px-4 py-2">
                <Sparkles className="text-primary" />
                PokePrice
              </div>
              {/* Welcome Text */}
              <div className="mb-4 flex flex-col items-center gap-1">
                <h1 className="text-2xl font-bold text-white">
                  Create Account
                </h1>
                <p className="text-muted-foreground text-sm">
                  Join the game and start playing!
                </p>
              </div>
              {/* Login Form */}
              <form
                className="w-full"
                onSubmit={handleSubmit}
                autoComplete="off"
              >
                {/*Email input field*/}
                <div className="border-border focus-within:ring-primary mt-6 flex items-center gap-3 rounded-xl border bg-black/20 px-4 py-2 text-white focus-within:ring-2">
                  <Mail className="text-muted-foreground" />
                  <input
                    type="email"
                    autoComplete="off"
                    placeholder="Enter your email"
                    className="placeholder:text-muted-foreground w-full bg-transparent text-white focus:outline-none"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {/* Password Input */}
                <div className="border-border focus-within:ring-primary mt-4 mb-4 flex items-center gap-3 rounded-xl border bg-black/20 px-4 py-2 text-white focus-within:ring-2">
                  <Lock className="text-muted-foreground" />
                  <input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Enter your password"
                    className="placeholder:text-muted-foreground w-full bg-transparent text-white focus:outline-none"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="border-border focus-within:ring-primary mt-4 mb-4 flex items-center gap-3 rounded-xl border bg-black/20 px-4 py-2 text-white focus-within:ring-2">
                  <Lock className="text-muted-foreground" />
                  <input
                    type="password"
                    autoComplete="off"
                    placeholder="Confirm your password"
                    className="placeholder:text-muted-foreground w-full bg-transparent text-white focus:outline-none"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 shadow-button h-12 w-full rounded-xl px-4 py-2 font-bold text-white transition-all duration-300 hover:scale-105"
                >
                  {loading ? "Signing up..." : "Sign Up"}
                </button>
              </form>
              <div className="text-muted-foreground my-5 flex w-full items-center gap-3 text-xs tracking-[0.2em] uppercase">
                <span className="h-px flex-1 bg-white/10" />
                or sign up with
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <div className="text-primary border-primary hover:bg-primary flex h-12 w-full cursor-pointer flex-row items-center justify-center gap-3 rounded-xl border px-4 py-2 transition duration-300 hover:text-black">
                <GoogleIcon />
                <button className="font-semibold">Google</button>
              </div>
              <div>
                <p className="text-muted-foreground mt-4 text-sm">
                  Have an account?{" "}
                  <Link href="/login" className="text-primary underline">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
