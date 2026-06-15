import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

/**
 * StatusBadge — a small pill for *genuine status* (success / warning / danger).
 * Use `neutral` for non-status labels so colour stays meaningful and sparing.
 */
const statusBadgeVariants = cva(
  "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "bg-secondary text-muted-foreground",
        success: "bg-green-50 text-green-700",
        warning: "bg-amber-50 text-amber-700",
        danger: "bg-red-50 text-red-700",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

const dotColor: Record<string, string> = {
  neutral: "bg-muted-foreground",
  success: "bg-green-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
};

export interface StatusBadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof statusBadgeVariants> {
  dot?: boolean;
}

export function StatusBadge({
  className,
  tone = "neutral",
  dot = false,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ tone }), className)} {...props}>
      {dot && (
        <span className={cn("size-1.5 rounded-full", dotColor[tone ?? "neutral"])} />
      )}
      {children}
    </span>
  );
}
