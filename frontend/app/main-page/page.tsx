"use client";

import { useEffect, useState } from "react";
import { CardView } from "../CardView";
import { GuessControls } from "../GuessControls";
import type { Card } from "../types";

export default function HomePage() {
  const [leftCard, setLeftCard] = useState<Card | null>(null);
  const [rightCard, setRightCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState<number>(0);
  const [guessed, setGuessed] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isMovingCard, setIsMovingCard] = useState<boolean>(false);
  async function fetchRandomCard(): Promise<Card> {
    const res = await fetch("http://localhost:8080/cards/randomCard");
    if (!res.ok) {
      throw new Error("Failed to fetch card");
    }
    const data = await res.json();
    return {
      id: data.id,
      name: data.name,
      image: data.image,
      setName: data.setName ?? "",
      averagePrice:
        typeof data.averagePrice === "number" ? data.averagePrice : 0,
    };
  }

  useEffect(() => {
    let cancelled = false;

    async function loadCards() {
      try {
        setLoading(true);
        setError(null);
        const [first, second] = await Promise.all([
          fetchRandomCard(),
          fetchRandomCard(),
        ]);
        if (first.id === second.id) {
          // If both cards are the same, fetch a new second card
          const newSecond = await fetchRandomCard();
          if (cancelled) return;
          setLeftCard(first);
          setRightCard(newSecond);
          setResult(null);
          return;
        }
        if (cancelled) return;
        setLeftCard(first);
        setRightCard(second);
        setResult(null);
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError("Failed to load cards. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCards();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleGuess(direction: "higher" | "lower") {
    if (!leftCard || !rightCard || isAnimating) return;
    const isHigher = rightCard.averagePrice > leftCard.averagePrice;
    const guessedHigher = direction === "higher";
    const isCorrect =
      (guessedHigher && isHigher) || (!guessedHigher && !isHigher);

    setIsAnimating(true);
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setResult(isCorrect ? "correct" : "wrong");
    setGuessed(true);

    const loadNextCard = async () => {
      try {
        const newCard = await fetchRandomCard();
        setIsMovingCard(true);

        setTimeout(() => {
          setLeftCard(rightCard);
          setRightCard(newCard);
          setGuessed(false);
          setResult(null);
          setIsMovingCard(false);
          setIsAnimating(false);
        }, 500);
      } catch (err) {
        console.error(err);
        setError("Failed to load next card. Please try again.");
        setGuessed(false);
        setResult(null);
        setIsAnimating(false);
      }
    };

    loadNextCard();
  }

  return (
    <main className="gradient-hero overflow-hidden flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl">
        <header className="mb-10 text-center">
          <h1 className="text-5xl md:text-6xl text-white font-black">
            Pokémon Higher / Lower
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Is the card on the right worth more or less than the one on the
            left?
          </p>
        </header>

        {error && (
          <div className="mb-4 rounded-2xl border border-rose-300/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100 backdrop-blur">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
          <section className="flex-1">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-white/70">
                Current card
              </p>
              <div className={isMovingCard ? "card-fade-out" : ""}>
                <CardView card={leftCard} showPrice />
              </div>
            </div>
            <p className="mt-3 text-xl text-white/80">Score: {score}</p>
          </section>

          <section className="flex flex-1 flex-col gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-white/70">
                Next card
              </p>
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
            </div>

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
