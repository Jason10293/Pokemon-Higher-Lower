import type { ReactNode } from "react";

type CardPanelProps = {
  label: string;
  children: ReactNode;
};

export function CardPanel({ label, children }: CardPanelProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-white/70">
        {label}
      </p>
      {children}
    </div>
  );
}
