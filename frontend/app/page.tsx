"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [card, setCard] = useState<{
    name: string;
    averagePrice: number;
    image: string;
  } | null>(null);

  useEffect(() => {
    async function fetchCards() {
      try {
        const response = await fetch(
          "http://localhost:8080/cards/fetch/xy7-54"
        );
        const data = await response.json();
        setCard(data);
      } catch (error) {
        console.error("error fetching cards: ", error);
      }
    }
    fetchCards();
  }, []);
  return (
    <main>
      <h1>Welcome to Pokemon Higher lower!</h1>
      <h1>
        Card Name:
        {card?.name} {card?.averagePrice}
      </h1>
      {card && card.image && (
        <Image src={card.image} alt={card.name} width={200} height={200} />
      )}
    </main>
  );
}
