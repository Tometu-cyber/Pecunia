"use client";

/**
 * Select : liste déroulante du design system, à la place du <select> natif.
 * Même apparence que les champs texte ; la liste s'ouvre dans un menu en verre épais
 * (lignes de 44 px et texte de 17 px sur mobile, menu compact façon macOS sur ordi), avec
 * une coche devant le choix courant.
 *
 * S'écrit comme un <select> : options en enfants (<option value>), `value` et
 * `onChange={(e) => … e.target.value}`. Avec `name`, la valeur part aussi dans les
 * formulaires (champ caché).
 *
 * Clavier : flèches haut / bas (ouvre la liste et se déplace), Début / Fin, Entrée ou
 * Espace pour choisir, Échap pour fermer, une lettre pour aller au premier choix qui
 * commence par elle.
 */
import { clsx } from "clsx";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Children,
  isValidElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

export interface SelectProps {
  value?: string | number;
  onChange?: (event: { target: { value: string } }) => void;
  children?: ReactNode;
  id?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  className?: string;
  /** cell : compact et sans fond, pour une cellule de tableau (import CSV) */
  variant?: "field" | "cell";
  "aria-label"?: string;
  "aria-invalid"?: boolean;
}

interface Option {
  value: string;
  label: ReactNode;
  text: string;
  disabled: boolean;
}

/** Texte brut d'un contenu React (lecteurs d'écran, recherche par lettre). */
function textOf(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

/** Les <option> des enfants, fragments et tableaux compris. */
function readOptions(children: ReactNode): Option[] {
  const out: Option[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const el = child as ReactElement<{
      value?: string | number;
      children?: ReactNode;
      disabled?: boolean;
    }>;
    if (el.type === "option") {
      const text = textOf(el.props.children);
      out.push({
        value: String(el.props.value ?? text),
        label: el.props.children,
        text,
        disabled: !!el.props.disabled,
      });
    } else if (el.props.children) {
      out.push(...readOptions(el.props.children));
    }
  });
  return out;
}

const DESKTOP = "(min-width: 768px)";

export function Select({
  value,
  onChange,
  children,
  id,
  name,
  disabled,
  required,
  placeholder = "Choisir…",
  className,
  variant = "field",
  "aria-label": ariaLabel,
  "aria-invalid": ariaInvalid,
}: SelectProps) {
  const options = readOptions(children);
  const current = value == null ? "" : String(value);
  const selected = options.find((o) => o.value === current);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [small, setSmall] = useState(false);
  const [place, setPlace] = useState<CSSProperties>({});
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const typed = useRef({ text: "", at: 0 });
  const uid = `pts${useId().replace(/[^A-Za-z0-9]/g, "")}`;

  const enabledIndex = (from: number, step: 1 | -1) => {
    for (let i = from; i >= 0 && i < options.length; i += step) if (!options[i]!.disabled) return i;
    return -1;
  };

  const show = () => {
    if (disabled) return;
    const i = options.findIndex((o) => o.value === current);
    setActive(i >= 0 ? i : enabledIndex(0, 1));
    setSmall(window.matchMedia(DESKTOP).matches);
    setOpen(true);
  };
  const close = (focusBack = true) => {
    setOpen(false);
    if (focusBack) btnRef.current?.focus({ preventScroll: true });
  };
  const choose = (i: number) => {
    const o = options[i];
    if (!o || o.disabled) return;
    if (o.value !== current) onChange?.({ target: { value: o.value } });
    close();
  };

  // Position : sous le champ, ou au-dessus s'il manque de place ; la liste suit le défilement
  useLayoutEffect(() => {
    if (!open) return;
    const placeList = () => {
      const r = btnRef.current?.getBoundingClientRect();
      if (!r) return;
      const margin = 12;
      const below = window.innerHeight - r.bottom - margin;
      const above = r.top - margin;
      const up = below < 220 && above > below;
      const maxHeight = Math.max(160, Math.min(360, up ? above : below) - 6);
      const width = Math.min(Math.max(r.width, small ? 200 : 240), window.innerWidth - 2 * margin);
      const left = Math.min(Math.max(margin, r.left), window.innerWidth - width - margin);
      setPlace({
        position: "fixed",
        left,
        right: "auto",
        width,
        maxWidth: "none",
        maxHeight,
        zIndex: 120,
        transformOrigin: up ? "bottom left" : "top left",
        ...(up ? { top: "auto", bottom: window.innerHeight - r.top + 6 } : { top: r.bottom + 6, bottom: "auto" }),
      });
    };
    placeList();
    window.addEventListener("resize", placeList);
    window.addEventListener("scroll", placeList, true);
    return () => {
      window.removeEventListener("resize", placeList);
      window.removeEventListener("scroll", placeList, true);
    };
  }, [open, small]);

  // Clic ou toucher en dehors : fermeture
  useEffect(() => {
    if (!open) return;
    const onDown = (e: Event) => {
      const t = e.target as Node;
      if (listRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      close(false);
    };
    document.addEventListener("pointerdown", onDown, true);
    return () => document.removeEventListener("pointerdown", onDown, true);
  }, [open]);

  // Choix actif visible dans la liste
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const onKey = (e: KeyboardEvent) => {
    if (disabled) return;
    const move = (i: number) => {
      e.preventDefault();
      if (i >= 0) setActive(i);
    };
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        show();
      }
      return;
    }
    if (e.key === "ArrowDown") move(enabledIndex(active + 1, 1));
    else if (e.key === "ArrowUp") move(enabledIndex(active - 1, -1));
    else if (e.key === "Home") move(enabledIndex(0, 1));
    else if (e.key === "End") move(enabledIndex(options.length - 1, -1));
    else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(active);
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation(); // ne ferme pas la modale autour
      close();
    } else if (e.key === "Tab") close(false);
    else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      // recherche par lettres tapées à la suite
      const now = Date.now();
      typed.current = {
        text: (now - typed.current.at < 700 ? typed.current.text : "") + e.key.toLocaleLowerCase("fr-FR"),
        at: now,
      };
      const i = options.findIndex((o) => !o.disabled && o.text.toLocaleLowerCase("fr-FR").startsWith(typed.current.text));
      if (i >= 0) setActive(i);
    }
  };

  const list =
    open && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={listRef}
            id={uid}
            role="listbox"
            aria-label={ariaLabel}
            className={clsx("pt-root pt-app-finances pt-menu pt-glass-thick overflow-y-auto overscroll-contain", small && "pt-menu-small")}
            style={place}
          >
            {options.map((o, i) => {
              const checked = o.value === current;
              return (
                <div
                  key={`${o.value}-${i}`}
                  id={`${uid}-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={checked}
                  aria-disabled={o.disabled || undefined}
                  className={clsx("pt-menu-item shrink-0", i === active && "is-active")}
                  onPointerEnter={() => !o.disabled && setActive(i)}
                  // garde le focus sur le champ (clavier toujours actif)
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => choose(i)}
                >
                  <span className="pt-menu-check" aria-hidden>
                    {checked && <Check size={small ? 13 : 16} strokeWidth={2.6} />}
                  </span>
                  <span className="pt-menu-text">
                    <span className="truncate">{o.label}</span>
                  </span>
                </div>
              );
            })}
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        ref={btnRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? uid : undefined}
        aria-activedescendant={open && active >= 0 ? `${uid}-${active}` : undefined}
        aria-label={ariaLabel}
        aria-invalid={ariaInvalid}
        aria-required={required}
        disabled={disabled}
        onClick={() => (open ? close() : show())}
        onKeyDown={onKey}
        className={clsx(
          "flex min-w-0 items-center gap-2 border border-transparent text-left text-label transition-[border-color,box-shadow,background-color] duration-150 focus-visible:border-finances focus-visible:bg-bg-tertiary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-danger",
          // pleine largeur, sauf largeur donnée par l'appelant (w-28, w-48…)
          !/(^|\s)w-/.test(className ?? "") && "w-full",
          variant === "field"
            ? // même apparence que les champs texte (inputClass)
              "min-h-11 rounded-[12px] bg-fill-tertiary px-3 text-[17px] leading-[22px] tracking-[-0.43px] focus-visible:shadow-[0_0_0_4px_var(--finances-bg)] md:min-h-7 md:rounded-xs md:px-2 md:text-[13px] md:leading-4 md:tracking-[-0.08px]"
            : "h-7 rounded-xs bg-transparent px-2 text-[13px] hover:bg-fill-tertiary focus-visible:shadow-[0_0_0_3px_var(--finances-bg)]",
          open && "border-finances bg-bg-tertiary",
          open && (variant === "field" ? "shadow-[0_0_0_4px_var(--finances-bg)]" : "shadow-[0_0_0_3px_var(--finances-bg)]"),
          className,
        )}
      >
        <span className={clsx("min-w-0 flex-1 truncate", !selected && "text-label-tertiary")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronsUpDown size={14} strokeWidth={2.2} className="shrink-0 text-label-secondary md:size-3" aria-hidden />
      </button>
      {name && <input type="hidden" name={name} value={current} />}
      {list}
    </>
  );
}
