import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Composer({
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder = "Ask NordIQ anything…",
  size = "md",
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
  size?: "md" | "lg";
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!disabled && value.trim()) onSubmit();
      }}
      className={cn(
        "flex items-end gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 transition-shadow focus-within:border-[var(--color-border-2)] focus-within:shadow-[0_8px_40px_-8px_oklch(75%_0.13_195/0.18)]",
        size === "lg" ? "py-3" : "py-2.5",
      )}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!disabled && value.trim()) onSubmit();
          }
        }}
        disabled={disabled}
        placeholder={placeholder}
        rows={1}
        className={cn(
          "flex-1 resize-none border-0 bg-transparent text-[var(--color-fg)] placeholder:text-[var(--color-fg-subtle)] outline-none disabled:opacity-60",
          size === "lg" ? "text-[16px] leading-7" : "text-[14.5px] leading-6",
        )}
      />
      <Button
        type="submit"
        variant="accent"
        size="icon"
        aria-label="Send"
        disabled={disabled || !value.trim()}
        className="h-9 w-9 rounded-full"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    </form>
  );
}
