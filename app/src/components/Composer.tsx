import { useRef, useState } from "react";
import { ArrowUp, Paperclip, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ACCEPT = "image/png,image/jpeg,image/webp,image/gif";

// Hard caps to keep us under localStorage quota + Ollama request size.
// Base64 inflates payload ~33 %, and the 8-chat ring is persisted in
// localStorage where safeWrite() silently drops on quota. 2 MB raw per
// image / 4 images per turn keeps a single chat below ~10 MB encoded.
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const MAX_IMAGES_PER_TURN = 4;

interface Pending {
  id: string;
  /** Full data URL — used only to render the thumbnail. */
  dataUrl: string;
  /** Base64 with the data: prefix stripped — what Ollama wants. */
  b64: string;
  name: string;
}

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
  onSubmit: (images?: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
  size?: "md" | "lg";
}) {
  const [pending, setPending] = useState<Pending[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [attachError, setAttachError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | File[]) => {
    const images = Array.from(files).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (images.length === 0) return;

    setAttachError(null);
    const errors: string[] = [];

    setPending((cur) => {
      const freeSlots = MAX_IMAGES_PER_TURN - cur.length;
      if (freeSlots <= 0) {
        errors.push(`Up to ${MAX_IMAGES_PER_TURN} images per turn.`);
        return cur;
      }
      if (images.length > freeSlots) {
        errors.push(
          `Only the first ${freeSlots} image${freeSlots === 1 ? "" : "s"} attached (max ${MAX_IMAGES_PER_TURN} per turn).`,
        );
      }
      const accept = images.slice(0, freeSlots).filter((f) => {
        if (f.size > MAX_IMAGE_BYTES) {
          errors.push(`${f.name} is ${(f.size / 1024 / 1024).toFixed(1)} MB — over the 2 MB cap.`);
          return false;
        }
        return true;
      });

      accept.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = String(reader.result ?? "");
          const b64 = dataUrl.includes(",") ? dataUrl.split(",", 2)[1] : "";
          if (!b64) return;
          setPending((c) => {
            // Re-check the slot count at apply time so two rapid drops
            // can't both push past the cap.
            if (c.length >= MAX_IMAGES_PER_TURN) return c;
            return [
              ...c,
              {
                id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                dataUrl,
                b64,
                name: file.name,
              },
            ];
          });
        };
        reader.readAsDataURL(file);
      });

      return cur;
    });

    if (errors.length > 0) setAttachError(errors.join(" "));
  };

  const removePending = (id: string) => {
    setPending((cur) => cur.filter((p) => p.id !== id));
    setAttachError(null);
  };

  const trySubmit = () => {
    if (disabled) return;
    const hasText = value.trim().length > 0;
    const hasImages = pending.length > 0;
    if (!hasText && !hasImages) return;
    const images = pending.map((p) => p.b64);
    setPending([]);
    setAttachError(null);
    onSubmit(hasImages ? images : undefined);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        trySubmit();
      }}
      onDragOver={(e) => {
        if (Array.from(e.dataTransfer.types).includes("Files")) {
          e.preventDefault();
          setDragActive(true);
        }
      }}
      onDragLeave={(e) => {
        // Only deactivate when the drag leaves the form, not a child.
        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
        setDragActive(false);
      }}
      onDrop={(e) => {
        if (!Array.from(e.dataTransfer.types).includes("Files")) return;
        e.preventDefault();
        setDragActive(false);
        if (disabled) return;
        addFiles(e.dataTransfer.files);
      }}
      className={cn(
        "flex flex-col gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 transition-shadow focus-within:border-[var(--color-border-2)] focus-within:shadow-[0_8px_40px_-8px_oklch(75%_0.13_195/0.18)]",
        size === "lg" ? "py-3" : "py-2.5",
        dragActive &&
          "border-[var(--color-accent-border)] shadow-[0_8px_40px_-8px_oklch(75%_0.13_195/0.32)]",
      )}
    >
      {attachError && (
        <div className="pt-1 text-[11.5px] text-[var(--color-warm)]">
          {attachError}
        </div>
      )}
      {pending.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {pending.map((p) => (
            <div
              key={p.id}
              className="group relative h-14 w-14 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-bg-2)]"
            >
              <img
                src={p.dataUrl}
                alt={p.name}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removePending(p.id)}
                className="absolute right-0.5 top-0.5 grid h-4 w-4 place-items-center rounded-full bg-[var(--color-fg)]/70 text-[var(--color-bg)] opacity-0 transition-opacity hover:bg-[var(--color-fg)] group-hover:opacity-100 focus-visible:opacity-100"
                aria-label={`Remove ${p.name}`}
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = ""; // allow re-selecting the same file
          }}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          aria-label="Attach screenshot"
          title="Attach screenshot"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[var(--color-fg-muted)] transition-colors enabled:hover:bg-[var(--color-bg-2)] enabled:hover:text-[var(--color-fg)] disabled:opacity-40"
        >
          <Paperclip className="h-4 w-4" />
        </button>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              trySubmit();
            }
          }}
          disabled={disabled}
          placeholder={
            dragActive ? "Drop image to attach…" : placeholder
          }
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
          disabled={disabled || (!value.trim() && pending.length === 0)}
          className="h-9 w-9 rounded-full"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
