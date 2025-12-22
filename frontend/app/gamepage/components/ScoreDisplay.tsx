type ScoreDisplayProps = {
  score: number;
};

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  return <p className="mt-3 text-xl text-white/80">Score: {score}</p>;
}
