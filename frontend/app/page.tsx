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

  async function fetchRandomCard(): Promise<Card> {
    const res = await fetch("http://localhost:8080/cards/randomCard");
    if (!res.ok) {
      throw new Error("Failed to fetch card");
    }
    const data = await res.json();
    return {
      name: data.name,
      image: data.image,
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
    if (!leftCard || !rightCard) return;
    const isHigher = rightCard.averagePrice > leftCard.averagePrice;
    const guessedHigher = direction === "higher";
    const correct =
      (guessedHigher && isHigher) || (!guessedHigher && !isHigher);
    setResult(correct ? "correct" : "wrong");
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
              <CardView card={leftCard} showPrice />
            </div>
          </section>

          <section className="flex flex-1 flex-col gap-4">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">
                Next card
              </p>
              <CardView card={rightCard} showPrice={false} />
            </div>

            <GuessControls
              disabled={loading || !leftCard || !rightCard}
              onGuess={handleGuess}
            />
          </section>
        </div>

        {result && (
          <p
            className={`mt-6 text-sm ${
              result === "correct" ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {result === "correct"
              ? "Nice! You guessed correctly."
              : "Not quite. Try another round."}
          </p>
        )}
      </div>
    </main>
  );
}
