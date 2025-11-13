"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [card, setCard] = useState<any>({});
  useEffect(() => {
    async function getRandomCard() {
      const res = await fetch("http://localhost:8080/cards/randomCard");
      const data = await res.json();
      setCard(data);
    }
    getRandomCard();
  }, []);

  console.log("card data:", card);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <div>
          <h1>{card.name}</h1>
          <Image src={card.image} alt={card.name} width={200} height={200} />
        </div>
      </div>
    </main>
  );
}
