"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  selected: boolean;
  onClick: () => void;
  label: string;
  description?: string;
}

export function OptionCard({
  selected,
  onClick,
  label,
  description,
}: OptionCardProps) {
  return (
    <Card
      className={cn(
        "relative cursor-pointer transition-all hover:border-primary",
        "p-4 flex flex-col items-center justify-center text-center min-h-[100px]",
        selected && "border-2 border-primary bg-primary/5"
      )}
      onClick={onClick}
    >
      <div className="font-semibold text-lg">{label}</div>
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
    </Card>
  );
}
