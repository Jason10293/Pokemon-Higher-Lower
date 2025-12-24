import type { Card } from "@/features/game/types";

export async function fetchRandomCard(signal: AbortSignal): Promise<Card> {
  const res = await fetch("http://localhost:8080/cards/randomCard", {
    signal,
  });
  if (!res.ok) {
    throw new Error("Failed to fetch card");
  }
  const data = await res.json();
  return {
    id: data.id,
    name: data.name,
    image: data.image,
    setName: data.setName ?? "",
    averagePrice: typeof data.averagePrice === "number" ? data.averagePrice : 0,
  };
}

export async function fetchTwoDifferentCards(
  signal: AbortSignal,
): Promise<[Card, Card]> {
  const first = await fetchRandomCard(signal);
  let second = await fetchRandomCard(signal);

  while (second.id === first.id) {
    second = await fetchRandomCard(signal);
  }

  return [first, second];
}
