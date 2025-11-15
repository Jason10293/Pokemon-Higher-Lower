import { ArrowDown, ArrowUp } from "lucide-react";

type GuessDirection = "higher" | "lower";

type GuessControlsProps = {
  disabled: boolean;
  onGuess: (direction: GuessDirection) => void;
};

export function GuessControls({ disabled, onGuess }: GuessControlsProps) {
  return (
    <div className="flex justify-center gap-3">
      <button
        type="button"
        onClick={() => onGuess("lower")}
        disabled={disabled}
        className="inline-flex min-w-28 items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <ArrowDown className="h-4 w-4" />
        Lower
      </button>
      <button
        type="button"
        onClick={() => onGuess("higher")}
        disabled={disabled}
        className="inline-flex min-w-28 items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Higher
        <ArrowUp className="h-4 w-4" />
      </button>
    </div>
  );
}
