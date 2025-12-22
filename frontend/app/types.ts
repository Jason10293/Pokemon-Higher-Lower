export type Card = {
  id: number;
  name: string;
  image: string;
  averagePrice: number;
  setName: string;
};

export type GameLogic = {
  leftCard: Card | null;
  rightCard: Card | null;
  loading: boolean;
  error: string | null;
  result: "correct" | "wrong" | null;
  score: number;
  guessed: boolean;
  isAnimating: boolean;
  isMovingCard: boolean;
  handleGuess: (direction: "higher" | "lower") => void;
};
