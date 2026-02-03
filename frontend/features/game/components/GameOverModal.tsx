"use client";

import { motion } from "motion/react";
import { Trophy, RotateCcw, Home } from "lucide-react";
import { useRouter } from "next/navigation";

type GameOverModalProps = {
  score: number;
  onRestart: () => void;
};

export function GameOverModal({ score, onRestart }: GameOverModalProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="gradient-card relative mx-4 w-full max-w-md rounded-2xl border border-white/10 p-8 text-white shadow-2xl"
      >
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="bg-primary/20 border-primary rounded-full border-2 p-4">
            <Trophy className="text-primary h-12 w-12" />
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-2 text-center text-3xl font-bold">Game Over!</h2>
        <p className="text-muted-foreground mb-6 text-center text-sm">
          Better luck next time!
        </p>

        {/* Score Display */}
        <div className="mb-8 rounded-xl border border-white/10 bg-white/5 p-6 text-center">
          <p className="text-muted-foreground mb-2 text-sm uppercase tracking-wider">
            Your Score
          </p>
          <p className="text-primary text-5xl font-bold">{score}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="bg-primary hover:bg-primary/90 shadow-button flex h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-2 font-semibold text-black transition-all duration-300 hover:scale-105"
          >
            <RotateCcw className="h-5 w-5" />
            Play Again
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-2 font-semibold text-white transition-all duration-300 hover:border-white/40 hover:bg-white/5"
          >
            <Home className="h-5 w-5" />
            Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
