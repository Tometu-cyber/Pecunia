"use client";

/**
 * SegmentedControl : 2 à 5 choix côte à côte, pastille qui glisse sous le choix actif.
 * Flèches, Début et Fin changent de choix. Voir design-system/components/SegmentedControl/README.md.
 */
import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";
import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { appClass, Glyph, type AppId } from "./ds";

export interface SegmentedItem<T extends string = string> {
  id: T;
  label: string;
  /** Avec une icône, le segment n'affiche que le pictogramme (label lu par les lecteurs d'écran) */
  icon?: LucideIcon;
}

export interface SegmentedControlProps<T extends string = string> {
  items: SegmentedItem<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (id: T) => void;
  /** Nom du groupe pour les lecteurs d'écran (« Période ») */
  label?: string;
  /** Pleine largeur, segments égaux (mobile) */
  full?: boolean;
  size?: "regular" | "small";
  app?: AppId;
  className?: string;
}

export function SegmentedControl<T extends string = string>({
  items,
  value,
  defaultValue,
  onChange,
  label,
  full,
  size = "regular",
  app,
  className,
}: SegmentedControlProps<T>) {
  const [inner, setInner] = useState<T | undefined>(defaultValue ?? items[0]?.id);
  const current = value ?? inner;
  const idx = Math.max(
    0,
    items.findIndex((it) => it.id === current),
  );
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const pick = (i: number, focus: boolean) => {
    const it = items[i];
    if (!it) return;
    if (value === undefined) setInner(it.id);
    onChange?.(it.id);
    if (focus) refs.current[i]?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    const n = items.length;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      pick((idx + 1) % n, true);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      pick((idx - 1 + n) % n, true);
    } else if (e.key === "Home") {
      e.preventDefault();
      pick(0, true);
    } else if (e.key === "End") {
      e.preventDefault();
      pick(n - 1, true);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={clsx("pt-root pt-seg", size === "small" && "pt-seg-small", full && "pt-seg-full", appClass(app), className)}
      style={{ "--n": items.length, "--i": idx } as CSSProperties}
      onKeyDown={onKey}
    >
      <span className="pt-seg-thumb" aria-hidden />
      {items.map((it, i) => (
        <button
          key={it.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="button"
          role="radio"
          aria-checked={i === idx}
          tabIndex={i === idx ? 0 : -1}
          className="pt-seg-item"
          onClick={() => pick(i, false)}
        >
          {it.icon ? (
            <Glyph icon={it.icon} size={size === "small" ? 14 : 17} strokeWidth={2} label={it.label} />
          ) : (
            <span className="pt-label">{it.label}</span>
          )}
        </button>
      ))}
    </div>
  );
}
