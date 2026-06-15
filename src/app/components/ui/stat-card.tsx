import * as React from "react";
import { cn } from "./utils";

/**
 * StatCard — the repeated "icon tile + label + big number + sublabel" metric card.
 * Default tone is neutral (no decorative colour). Use a status tone only when the
 * value itself signals genuine status (e.g. members in crisis).
 */
export type StatTone = "neutral" | "success" | "warning" | "danger";

const chip: Record<StatTone, string> = {
  neutral: "bg-secondary text-foreground",
  success: "bg-green-50 text-green-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
};

const valueColor: Record<StatTone, string> = {
  neutral: "text-foreground",
  success: "text-green-700",
  warning: "text-amber-700",
  danger: "text-red-700",
};

const card: Record<StatTone, string> = {
  neutral: "border-white/40 bg-card",
  success: "border-green-200 bg-green-50/60",
  warning: "border-amber-200 bg-amber-50/60",
  danger: "border-red-200 bg-red-50/60",
};

export interface StatCardProps extends React.ComponentProps<"div"> {
  icon?: React.ReactNode;
  label: React.ReactNode;
  value: React.ReactNode;
  sublabel?: React.ReactNode;
  tone?: StatTone;
  /** Optional trend chip (▲/▼) shown next to the value — use only with real comparison data. */
  delta?: { value: string; direction: "up" | "down"; positive: boolean };
}

export function StatCard({
  icon,
  label,
  value,
  sublabel,
  tone = "neutral",
  delta,
  className,
  ...props
}: StatCardProps) {
  return (
    <div className={cn("rounded-lg border p-5 shadow-sm backdrop-blur-xl", card[tone], className)} {...props}>
      <div className="mb-2 flex items-center gap-2.5">
        {icon != null && (
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-lg [&_svg]:size-[18px]",
              chip[tone],
            )}
          >
            {icon}
          </span>
        )}
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <div className="flex items-baseline gap-2">
        <p className={cn("text-3xl font-bold", valueColor[tone])}>{value}</p>
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium",
              delta.positive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700",
            )}
          >
            {delta.direction === "up" ? "▲" : "▼"} {delta.value}
          </span>
        )}
      </div>
      {sublabel != null && (
        <p className="mt-1 text-xs text-muted-foreground">{sublabel}</p>
      )}
    </div>
  );
}
