"use client";

import { CardView } from "../CardView";
import { GuessControls } from "../components/GuessControls";
import { CardPanel } from "./components/CardPanel";
import { ErrorNotice } from "./components/ErrorNotice";
import { GameHeader } from "./components/GameHeader";
import { ScoreDisplay } from "./components/ScoreDisplay";
import { useCardGame } from "./hooks/useGameLogic";
import type { GameLogic } from "../types";

export default function HomePage() {
  const game: GameLogic = useCardGame();

  return (
    <main className="gradient-hero overflow-hidden flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl">
        <GameHeader />

        {game.error && <ErrorNotice message={game.error} />}

        <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
          <section className="flex flex-1 flex-col items-center">
            <CardPanel
              label="Current card"
              className="w-full max-w-sm min-h-[420px]"
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
              className="w-full max-w-sm min-h-[420px]"
            >
              <div
                className={`${
                  game.guessed &&
                  game.result === "correct" &&
                  !game.isMovingCard
                    ? "card-correct"
                    : ""
                }${
                  game.guessed && game.result === "wrong" && !game.isMovingCard
                    ? " card-wrong"
                    : ""
                }${game.isMovingCard ? " card-moving-right-to-left" : ""}`}
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
      </div>
    </main>
  );
}
