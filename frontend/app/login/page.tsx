import { Sparkles, Mail, Lock, GiftIcon } from "lucide-react";
import GoogleIcon from "../signup/icons/GoogleIcon";
import PulsingDecoration from "@/components/PulsingDecoration";
export default function LoginPage() {
  return (
    <div className="gradient-hero relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <PulsingDecoration />
      <div className="relative w-full max-w-md">
        <div className="gradient-card border-border shadow-card flex flex-col items-center rounded-2xl border p-8 text-white">
          {/* Logo and Title*/}
          <div className="bg-primary/20 border-primary mb-6 flex w-fit flex-row items-center justify-center gap-2 rounded-2xl border px-4 py-2">
            <Sparkles className="text-primary" />
            PokePrice
          </div>
          {/* Welcome Text */}
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Welcome Back!</h1>
            <p className="text-muted-foreground text-sm">
              login to continue your streak
            </p>
          </div>
          {/* Login Form */}
          <form className="w-full">
            {/*Email input field*/}
            <div className="border-border focus-within:ring-primary mt-6 flex items-center gap-3 rounded-xl border bg-black/20 px-4 py-2 text-white focus-within:ring-2">
              <Mail className="text-muted-foreground" />
              <input
                type="email"
                placeholder="Enter your email"
                className="placeholder:text-muted-foreground w-full bg-transparent text-white focus:outline-none"
              />
            </div>
            {/* Password Input */}
            <div className="border-border focus-within:ring-primary mt-4 mb-4 flex items-center gap-3 rounded-xl border bg-black/20 px-4 py-2 text-white focus-within:ring-2">
              <Lock className="text-muted-foreground" />
              <input
                type="password"
                placeholder="Enter your password"
                className="placeholder:text-muted-foreground w-full bg-transparent text-white focus:outline-none"
              />
            </div>
          </form>
          <button
            type="submit"
            className="bg-primary hover:bg-primary/90 shadow-button h-12 w-full rounded-xl px-4 py-2 font-bold text-white transition-all duration-300 hover:scale-105"
          >
            Sign In
          </button>
          <div className="text-muted-foreground my-5 flex w-full items-center gap-3 text-xs tracking-[0.2em] uppercase">
            <span className="h-px flex-1 bg-white/10" />
            or continue with
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <div className="text-primary border-primary hover:bg-primary flex h-12 w-full cursor-pointer flex-row items-center justify-center gap-3 rounded-xl border px-4 py-2 transition duration-300 hover:text-black">
            <GoogleIcon />
            <button className="font-semibold">Google</button>
          </div>
          <div>
            <p className="text-muted-foreground mt-4 text-sm">
              Don't have an account?{" "}
              <a href="/signup" className="text-primary underline">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
