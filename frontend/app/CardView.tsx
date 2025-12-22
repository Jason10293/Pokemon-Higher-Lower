import type { Card } from "./types";
import { Tooltip } from "./tooltip";
type CardViewProps = {
  card: Card | null;
  showPrice: boolean;
};

export function CardView({ card, showPrice }: CardViewProps) {
  if (!card) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white text-sm text-zinc-500">
        Loading card...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 overflow-hidden">
      <div className="relative h-80 w-56 overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-sm">
        {card.image ? (
          <img src={card.image} alt={card.name} className="h-full w-full" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
            No image
          </div>
        )}
      </div>
      <div className="space-y-1 text-center">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-zinc-900 line-clamp-1">
            {card.name}
          </p>
          <Tooltip content={`Set: ${card.setName}`}></Tooltip>
        </div>

        {showPrice ? (
          <p className="text-xl text-zinc-500">
            ${card.averagePrice.toFixed(2)}
          </p>
        ) : (
          <p className="text-xl tracking-[0.35em] text-zinc-400">???</p>
        )}
      </div>
    </div>
  );
}
