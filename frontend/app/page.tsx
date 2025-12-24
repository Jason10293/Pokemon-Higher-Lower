import { Zap } from "lucide-react";
import { Button } from "@/components/button";
import Link from "next/link";
import Header from "@/components/Header";
import PulsingDecoration from "@/components/PulsingDecoration";
const featureCardData = [
  {
    key: "1",
    title: "1,000+ cards",
    description: "Pulled from real market prices.",
  },
  {
    key: "2",
    title: "Daily Streaks",
    description: "Chase your best run every day.",
  },
  { key: "3", title: "Real Prices", description: "Based on live market data." },
];

export default function HomePage() {
  return (
    <div className="gradient-hero relative min-h-screen overflow-hidden">
      <Header />
      {/* Background decoration elements */}
      <PulsingDecoration />

      {/* Hero Section Text + CTA */}
      <div className="my-6 flex flex-col items-center pt-12">
        <p className="mt-6 text-7xl font-black text-white">Higher or</p>
        <p className="text-primary text-7xl font-black">Lower?</p>

        <p className="text-muted-foreground mx-auto mt-4 mb-10 max-w-lg text-center text-lg md:text-xl">
          Test your Pokemon knowledge by guessing which card is more expensive!
        </p>
        <Link href="/gamepage">
          <Button variant="hero" size="xl" className="group">
            <Zap className="mr-2 h-6 w-6" />
            Start Playing!
          </Button>
        </Link>
      </div>

      {/* Feature Cards */}
      <div className="mt-20 px-6 pb-12">
        <div className="mx-auto grid max-w-4xl gap-6 text-center md:grid-cols-3">
          {featureCardData.map((card) => (
            <div
              key={card.key}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <p className="text-2xl font-bold text-white">{card.title}</p>
              <p className="text-muted-foreground mt-2 text-sm">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
