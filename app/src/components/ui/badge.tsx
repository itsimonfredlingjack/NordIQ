import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-wide whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral:
          "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-fg-muted)]",
        accent:
          "border-[var(--color-accent-border)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]",
        success:
          "border-[var(--color-success-border)] bg-[var(--color-success-soft)] text-[var(--color-success)]",
        warning:
          "border-[var(--color-warning-border)] bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
        danger:
          "border-[var(--color-danger-border)] bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
        outline:
          "border-[var(--color-border-strong)] bg-transparent text-[var(--color-fg-muted)]",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone, className }))} {...props} />;
}
