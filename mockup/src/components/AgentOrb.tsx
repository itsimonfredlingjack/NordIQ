import { cn } from "@/lib/utils";

export type OrbTone = "default" | "warm" | "alert";

const tones: Record<
  OrbTone,
  { halo: string; core: string; glow: string }
> = {
  default: {
    halo:
      "radial-gradient(circle at 30% 30%, oklch(85% 0.13 175 / 0.95), oklch(45% 0.12 220 / 0.6) 60%, transparent 75%)",
    core:
      "radial-gradient(circle at 35% 30%, oklch(95% 0.05 175), oklch(70% 0.13 195) 70%)",
    glow: "oklch(75% 0.13 195 / 0.45)",
  },
  warm: {
    halo:
      "radial-gradient(circle at 30% 30%, oklch(88% 0.13 75 / 0.95), oklch(50% 0.12 60 / 0.6) 60%, transparent 75%)",
    core:
      "radial-gradient(circle at 35% 30%, oklch(95% 0.06 75), oklch(72% 0.14 70) 70%)",
    glow: "oklch(78% 0.14 70 / 0.45)",
  },
  alert: {
    halo:
      "radial-gradient(circle at 30% 30%, oklch(82% 0.16 25 / 0.95), oklch(45% 0.14 20 / 0.6) 60%, transparent 75%)",
    core:
      "radial-gradient(circle at 35% 30%, oklch(92% 0.08 25), oklch(65% 0.18 25) 70%)",
    glow: "oklch(70% 0.16 25 / 0.5)",
  },
};

export function AgentOrb({
  size = 32,
  active = false,
  tone = "default",
  className,
}: {
  size?: number;
  active?: boolean;
  tone?: OrbTone;
  className?: string;
}) {
  const t = tones[tone];
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
        style={{ background: t.halo }}
      />
      <span
        className="relative rounded-full transition-[background,box-shadow] duration-300"
        style={{
          width: size * 0.45,
          height: size * 0.45,
          background: t.core,
          boxShadow: `inset 0 0 6px oklch(100% 0 0 / 0.35), 0 0 12px ${t.glow}`,
        }}
      />
    </span>
  );
}
