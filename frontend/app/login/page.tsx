import PulsingDecoration from "@/components/PulsingDecoration";
export default function LoginPage() {
  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden flex items-center justify-center px-4">
      <PulsingDecoration />
      <div className="relative w-full max-w-md">
        <div className="gradient-card rounded-2xl p-8 border border-border shadow-card text-white">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl text-white font-bold">Welcome Back!</h1>
            <p className="text-muted-foreground text-sm">
              login to continue your streak
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
