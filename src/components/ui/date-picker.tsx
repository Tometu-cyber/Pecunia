"use client";

/**
 * DatePicker : sélecteur de date compact d'iOS (bouton gris + calendrier dans un panneau
 * en verre) ou calendrier toujours affiché (`inline`). Semaines du lundi au dimanche.
 * Voir design-system/components/DatePicker/README.md.
 */
import { clsx } from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { appClass, Glyph, type AppId } from "./ds";

const DAYS = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];
const DAYS_LONG = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

const sameDay = (a: Date | null | undefined, b: Date | null | undefined) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

export interface CalendarProps {
  value?: Date | null;
  onChange?: (date: Date) => void;
  min?: Date;
  max?: Date;
  app?: AppId;
  today?: Date;
  autoFocus?: boolean;
}

export function Calendar({ value, onChange, min, max, app, today: todayProp, autoFocus }: CalendarProps) {
  const selected = value ? startOfDay(value) : null;
  const today = startOfDay(todayProp ?? new Date());
  const [focus, setFocus] = useState(selected ?? today);
  const gridRef = useRef<HTMLDivElement>(null);
  const month = new Date(focus.getFullYear(), focus.getMonth(), 1);
  const start = addDays(month, -((month.getDay() + 6) % 7));
  let days = Array.from({ length: 42 }, (_, i) => addDays(start, i));
  if (days[35]!.getMonth() !== month.getMonth()) days = days.slice(0, 35);
  const title = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(month);
  const full = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const inRange = (d: Date) => !(min && d < startOfDay(min)) && !(max && d > startOfDay(max));
  const moveMonth = (n: number) => {
    const d = new Date(focus);
    d.setDate(1);
    d.setMonth(d.getMonth() + n);
    const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(Math.min(focus.getDate(), last));
    setFocus(d);
  };

  useEffect(() => {
    if (autoFocus) gridRef.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus();
  }, [autoFocus, focus]);

  const onKey = (e: KeyboardEvent) => {
    const step: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 };
    if (step[e.key] !== undefined) {
      e.preventDefault();
      setFocus(addDays(focus, step[e.key]!));
    } else if (e.key === "PageDown") {
      e.preventDefault();
      moveMonth(1);
    } else if (e.key === "PageUp") {
      e.preventDefault();
      moveMonth(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      setFocus(addDays(focus, -((focus.getDay() + 6) % 7)));
    } else if (e.key === "End") {
      e.preventDefault();
      setFocus(addDays(focus, 6 - ((focus.getDay() + 6) % 7)));
    }
  };

  return (
    <div className={clsx("pt-cal", appClass(app))}>
      <div className="pt-cal-head">
        <span className="pt-cal-title" aria-live="polite">
          {title.charAt(0).toUpperCase() + title.slice(1)}
        </span>
        <button type="button" className="pt-cal-nav" aria-label="Mois précédent" onClick={() => moveMonth(-1)}>
          <Glyph icon={ChevronLeft} size={18} strokeWidth={2.4} />
        </button>
        <button type="button" className="pt-cal-nav" aria-label="Mois suivant" onClick={() => moveMonth(1)}>
          <Glyph icon={ChevronRight} size={18} strokeWidth={2.4} />
        </button>
      </div>
      <div className="pt-cal-grid" role="grid" aria-label={title} ref={gridRef} onKeyDown={onKey}>
        {DAYS.map((d, i) => (
          <span key={d} className="pt-cal-dow" role="columnheader" aria-label={DAYS_LONG[i]}>
            {d}
          </span>
        ))}
        {days.map((d) => {
          const out = d.getMonth() !== month.getMonth();
          const sel = sameDay(d, selected);
          const tod = sameDay(d, today);
          const ok = inRange(d);
          return (
            <button
              key={d.getTime()}
              type="button"
              role="gridcell"
              tabIndex={sameDay(d, focus) ? 0 : -1}
              aria-selected={sel || undefined}
              aria-current={tod ? "date" : undefined}
              aria-disabled={ok ? undefined : "true"}
              aria-label={full.format(d)}
              className={clsx("pt-cal-day", out && "is-out", sel && "is-sel", tod && "is-today")}
              onClick={() => {
                if (!ok) return;
                setFocus(d);
                onChange?.(d);
              }}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export interface DatePickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date) => void;
  label?: string;
  placeholder?: string;
  min?: Date;
  max?: Date;
  app?: AppId;
  size?: "regular" | "small";
  format?: Intl.DateTimeFormatOptions;
  /** Calendrier directement dans la page, sans bouton */
  inline?: boolean;
  align?: "start" | "end";
  today?: Date;
  defaultOpen?: boolean;
  className?: string;
}

export function DatePicker({
  value,
  defaultValue = null,
  onChange,
  label,
  placeholder,
  min,
  max,
  app,
  size = "regular",
  format,
  inline,
  align,
  today,
  defaultOpen = false,
  className,
}: DatePickerProps) {
  const [inner, setInner] = useState<Date | null>(defaultValue);
  const current = value !== undefined ? value : inner;
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const byUser = useRef(false);
  const fmt = new Intl.DateTimeFormat("fr-FR", format ?? { day: "numeric", month: "short", year: "numeric" });
  const uid = `ptd${useId().replace(/[^A-Za-z0-9]/g, "")}`;

  const commit = (d: Date) => {
    if (value === undefined) setInner(d);
    onChange?.(d);
  };

  useEffect(() => {
    if (!open || inline) return;
    const onDown = (e: Event) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open, inline]);

  if (inline) {
    return (
      <div className={clsx("pt-root pt-datepicker-inline", className)}>
        <Calendar value={current} today={today} min={min} max={max} app={app} onChange={commit} />
      </div>
    );
  }

  const text = current ? fmt.format(current) : (placeholder ?? "Choisir");
  return (
    <div ref={rootRef} className={clsx("pt-root pt-datepicker", appClass(app), className)}>
      {label && <span className="pt-date-label">{label}</span>}
      <div className="pt-date-anchor">
        <button
          ref={btnRef}
          type="button"
          className={clsx("pt-date-btn", size === "small" && "pt-date-btn-small", open && "is-open")}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={uid}
          aria-label={`${label ? `${label} : ` : ""}${current ? fmt.format(current) : (placeholder ?? "Choisir une date")}`}
          onClick={() => {
            byUser.current = true;
            setOpen((o) => !o);
          }}
        >
          <span className="pt-label">{text}</span>
        </button>
        {open && (
          <div id={uid} role="dialog" aria-label={label ?? "Calendrier"} className={clsx("pt-date-pop pt-glass-thick", align === "end" && "pt-menu-end")}>
            <Calendar
              value={current}
              today={today}
              min={min}
              max={max}
              app={app}
              autoFocus={byUser.current}
              onChange={(d) => {
                commit(d);
                setOpen(false);
                btnRef.current?.focus();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
