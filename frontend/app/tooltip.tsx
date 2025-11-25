import React from "react";
import { Tooltip as FlowbiteTooltip } from "flowbite-react";
import { Info } from "lucide-react";

interface TooltipProps {
  content: React.ReactNode;
}

export function Tooltip({ content }: TooltipProps) {
  return (
    <FlowbiteTooltip style="light" content={content}>
      <Info className="h-4 w-4 text-zinc-400 hover:text-zinc-600" />
    </FlowbiteTooltip>
  );
}
