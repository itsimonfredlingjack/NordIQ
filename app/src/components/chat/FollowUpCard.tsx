// Conversational list — no framing card, just numbered lines.
export function FollowUpCard({ questions }: { questions: string[] }) {
  return (
    <ul className="mt-3 flex flex-col gap-1.5 text-[14px] text-[var(--color-fg)]">
      {questions.map((q, i) => (
        <li key={i} className="flex items-baseline gap-2.5">
          <span className="font-mono text-[10.5px] text-[var(--color-fg-subtle)]">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span>{q}</span>
        </li>
      ))}
    </ul>
  );
}
