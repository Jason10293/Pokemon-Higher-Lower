import { GameHeader } from "@/features/game/components/GameHeader";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="gradient-hero overflow-hidden flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl">
        <GameHeader />
        {children}
      </div>
    </main>
  );
}
