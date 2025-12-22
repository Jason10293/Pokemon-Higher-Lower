import { useState, useEffect } from "react";
import type { Card, GameLogic } from "@/app/types";

export function useCardGame(): GameLogic {
  const CARD_TRANSITION_DURATION = 500; // in milliseconds
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
        }, CARD_TRANSITION_DURATION);
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

  return {
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
  };
}
