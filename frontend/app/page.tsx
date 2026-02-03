"use client";

import { Zap } from "lucide-react";
import { Button } from "@/components/button";
import Link from "next/link";
import Header from "@/components/Header";
import PulsingDecoration from "@/components/PulsingDecoration";
import { motion } from "framer-motion";

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
    <main>
      <div className="gradient-hero relative min-h-screen overflow-hidden">
        <Header />
        {/* Background decoration elements */}
        <PulsingDecoration />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="gradient-card shadow-card absolute top-20 left-[10%] h-44 w-32 rounded-xl opacity-20"
            animate={{ y: [0, -20, 0], rotate: [-5, 5, -5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="gradient-card shadow-card absolute top-40 right-[15%] h-40 w-28 rounded-xl opacity-15"
            animate={{ y: [0, -15, 0], rotate: [5, -5, 5] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="gradient-card shadow-card absolute bottom-32 left-[20%] h-36 w-24 rounded-xl opacity-10"
            animate={{ y: [0, -25, 0], rotate: [-3, 3, -3] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>
        {/* Hero Section Text + CTA */}
        <motion.div
          className="my-6 flex flex-col items-center pt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="flex flex-col items-center">
            <motion.p
              className="text-7xl font-black text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Higher or
            </motion.p>
            <motion.p
              className="text-primary text-7xl font-black"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Lower?
            </motion.p>
          </h1>

          <h2>
            <motion.p
              className="mx-auto mt-4 mb-10 max-w-lg text-center text-lg text-white md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Test your Pokemon knowledge by guessing which card is more
              expensive!
            </motion.p>
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link href="/gamepage">
              <Button variant="hero" size="xl" className="group">
                <Zap className="mr-2 h-6 w-6" />
                Start Playing!
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <div className="mt-20 px-6 pb-12">
          <div className="mx-auto grid max-w-4xl gap-6 text-center md:grid-cols-3">
            {featureCardData.map((card, index) => (
              <motion.div
                key={card.key}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              >
                <p className="text-2xl font-bold text-white">{card.title}</p>
                <p className="mt-2 text-sm text-white/70">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
