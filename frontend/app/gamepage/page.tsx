"use client";

import { CardView } from "@/features/game/components/CardView";
import { GuessControls } from "@/features/game/components/GuessControls";
import { CardPanel } from "@/features/game/components/CardPanel";
import { ErrorNotice } from "@/features/game/components/ErrorNotice";
import { ScoreDisplay } from "@/features/game/components/ScoreDisplay";
import { useCardGame } from "@/features/game/hooks/useGameLogic";
import type { GameLogic } from "@/features/game/types";
import FloatingCards from "@/components/FloatingCards";
import PulsingDecorations from "@/components/PulsingDecoration";
export default function HomePage() {
  const game: GameLogic = useCardGame();

  return (
    <>
      {game.error && <ErrorNotice message={game.error} />}
      <div className="flex flex-col md:flex-row md:items-stretch">
        <FloatingCards />
        <PulsingDecorations />
        <section className="flex flex-1 flex-col items-center">
          <CardPanel
            label="Current card"
            className="min-h-[420px] w-full max-w-sm"
          >
            <div className={game.isMovingCard ? "card-fade-out" : ""}>
              <CardView card={game.leftCard} showPrice />
            </div>
          </CardPanel>
          <ScoreDisplay score={game.score} />
        </section>

        <section className="flex flex-1 flex-col items-center gap-4">
          <CardPanel
            label="Next card"
            className="min-h-[420px] w-full max-w-sm"
          >
            <div
              className={`${
                game.guessed && game.result === "correct" && !game.isMovingCard
                  ? "card-correct"
                  : ""
              }${
                game.guessed && game.result === "wrong" && !game.isMovingCard
                  ? "card-wrong"
                  : ""
              }${game.isMovingCard ? "card-moving-right-to-left" : ""}`}
            >
              <CardView card={game.rightCard} showPrice={game.guessed} />
            </div>
          </CardPanel>
          <GuessControls
            disabled={
              game.loading ||
              !game.leftCard ||
              !game.rightCard ||
              game.isAnimating
            }
            onGuess={game.handleGuess}
          />
        </section>
      </div>
    </>
  );
}
