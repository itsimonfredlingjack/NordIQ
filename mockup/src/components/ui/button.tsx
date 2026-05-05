import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full font-medium transition-[background,border,box-shadow,transform,opacity] duration-150 disabled:pointer-events-none disabled:opacity-40 focus-ring [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        accent:
          "bg-[var(--color-accent)] text-[oklch(15%_0.02_250)] hover:opacity-90 active:translate-y-px",
        ghost:
          "text-[var(--color-fg-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-fg)]",
        outline:
          "border border-[var(--color-border)] bg-transparent text-[var(--color-fg)] hover:bg-[var(--color-surface)]",
        chip:
          "border border-[var(--color-border)] bg-[var(--color-bg-2)] text-[var(--color-fg-muted)] hover:border-[var(--color-border-2)] hover:bg-[var(--color-surface)] hover:text-[var(--color-fg)]",
      },
      size: {
        sm: "h-8 px-3 text-[12.5px]",
        md: "h-9 px-4 text-[13.5px]",
        lg: "h-11 px-5 text-[14px]",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
