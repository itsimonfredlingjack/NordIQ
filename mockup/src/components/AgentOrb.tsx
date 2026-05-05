import { cn } from "@/lib/utils";

export function AgentOrb({
  size = 32,
  active = false,
  className,
}: {
  size?: number;
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className={cn(
        "relative inline-grid shrink-0 place-items-center rounded-full",
        className,
      )}
    >
      <span
        className={cn(
          "absolute inset-0 rounded-full blur-[4px] transition-opacity",
          active ? "opacity-90 pulse-orb" : "opacity-60",
        )}
        style={{
          background:
            "radial-gradient(circle at 30% 30%, oklch(85% 0.13 175 / 0.95), oklch(45% 0.12 220 / 0.6) 60%, transparent 75%)",
        }}
      />
      <span
        className="relative rounded-full"
        style={{
          width: size * 0.45,
          height: size * 0.45,
          background:
            "radial-gradient(circle at 35% 30%, oklch(95% 0.05 175), oklch(70% 0.13 195) 70%)",
          boxShadow:
            "inset 0 0 6px oklch(100% 0 0 / 0.35), 0 0 12px oklch(75% 0.13 195 / 0.45)",
        }}
      />
    </span>
  );
}
