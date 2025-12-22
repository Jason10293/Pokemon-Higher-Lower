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
  const {
    leftCard,
    rightCard,
    loading,
    error,
    result,
    score,
    guessed,
    isAnimating,
    isMovingCard,
    handleGuess,
  } = useCardGame();

  return (
    <main className="gradient-hero overflow-hidden flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl">
        <GameHeader />

        {error && <ErrorNotice message={error} />}

        <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
          <section className="flex-1">
            <CardPanel label="Current card">
              <div className={isMovingCard ? "card-fade-out" : ""}>
                <CardView card={leftCard} showPrice />
              </div>
            </CardPanel>
            <ScoreDisplay score={score} />
          </section>

          <section className="flex flex-1 flex-col gap-4">
            <CardPanel label="Next card">
              <div
                className={`${
                  guessed && result === "correct" && !isMovingCard
                    ? "card-correct"
                    : ""
                }${
                  guessed && result === "wrong" && !isMovingCard
                    ? " card-wrong"
                    : ""
                }${isMovingCard ? " card-moving-right-to-left" : ""}`}
              >
                <CardView card={rightCard} showPrice={guessed} />
              </div>
            </CardPanel>

            <GuessControls
              disabled={loading || !leftCard || !rightCard || isAnimating}
              onGuess={handleGuess}
            />
          </section>
        </div>
      </div>
    </main>
  );
}
