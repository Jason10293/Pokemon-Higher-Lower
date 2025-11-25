"use client";

import { useEffect, useState } from "react";
import type { Card } from "./types";
import { CardView } from "./CardView";
import { GuessControls } from "./GuessControls";

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
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Pokémon Higher / Lower
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Is the card on the right worth more or less than the one on the
            left?
          </p>
        </header>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
          <section className="flex-1">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">
                Current card
              </p>
              <div className={isMovingCard ? "card-fade-out" : ""}>
                <CardView card={leftCard} showPrice />
              </div>
            </div>
            <p className="mt-2 text-xl text-zinc-600">Score: {score}</p>
          </section>

          <section className="flex flex-1 flex-col gap-4">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">
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

        {result && (
          <p
            className={`mt-6 text-sm ${
              result === "correct" ? "text-emerald-400" : "text-rose-400"
            }`}
          ></p>
        )}
      </div>
    </main>
  );
}
