import { GameHeader } from "@/features/game/components/GameHeader";
import Header from "@/components/Header";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="gradient-hero relative flex min-h-screen flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-4xl">
          <GameHeader />
          {children}
        </div>
      </div>
    </main>
  );
}
