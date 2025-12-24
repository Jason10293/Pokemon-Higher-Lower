import { Zap } from "lucide-react";
import { Button } from "@/app/components/button";
import Link from "next/link";
import Header from "./components/Header";
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
    <div className="min-h-screen gradient-hero relative overflow-hidden">
      <Header />
      {/* Background decoration elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-secondary/35 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 left-1/3 w-32 h-64 bg-accent/30 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Hero Section Text + CTA */}
      <div className="flex flex-col items-center my-6 pt-12">
        <p className="text-7xl text-white font-black mt-6">Higher or</p>
        <p className="text-7xl text-primary font-black">Lower?</p>

        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg mx-auto text-center mt-4">
          Test your Pokemon knowledge by guessing which card is more expensive!
        </p>
        <Link href="/gamepage">
          <Button variant="hero" size="xl" className="group">
            <Zap className="w-6 h-6 mr-2" />
            Start Playing!
          </Button>
        </Link>
      </div>

      {/* Feature Cards */}
      <div className="mt-20 px-6 pb-12">
        <div className="mx-auto max-w-4xl grid gap-6 md:grid-cols-3 text-center">
          {featureCardData.map((card) => (
            <div
              key={card.key}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <p className="text-2xl font-bold text-white">{card.title}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
