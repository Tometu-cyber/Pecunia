"use client";

/**
 * Menu : menu déroulant en verre épais. Deux usages : choisir une valeur (coche, avec
 * `value` ou `defaultValue`) ou lancer une action (sans valeur). Un item avec `href`
 * est un lien. Voir design-system/components/Menu/README.md.
 */
import Link from "next/link";
import { clsx } from "clsx";
import { Check, ChevronsUpDown, Ellipsis, type LucideIcon } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AppIcon } from "./app-icon";
import { appClass, Glyph, type AppId } from "./ds";

export type MenuItem =
  | {
      id: string;
      label: string;
      icon?: LucideIcon;
      app?: AppId;
      hint?: string;
      shortcut?: string;
      destructive?: boolean;
      disabled?: boolean;
      href?: string;
      onSelect?: () => void;
    }
  | { divider: true }
  | { section: string };

type ActionItem = Extract<MenuItem, { id: string }>;

export interface MenuProps {
  items: MenuItem[];
  /** Avec value ou defaultValue : menu de choix (coche). Sans : menu d'actions. */
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (id: string) => void;
  onSelect?: (id: string) => void;
  /** Texte du bouton (actions) ou nom lu par les lecteurs d'écran */
  label?: string;
  placeholder?: string;
  icon?: LucideIcon;
  /** Bouton rond en verre « … » */
  iconOnly?: boolean;
  variant?: "filled" | "tinted" | "gray" | "plain";
  size?: "regular" | "small";
  app?: AppId;
  align?: "start" | "end";
  defaultOpen?: boolean;
  className?: string;
}

const isAction = (it: MenuItem): it is ActionItem => "id" in it;

export function Menu({
  items,
  value,
  defaultValue,
  onChange,
  onSelect,
  label,
  placeholder,
  icon,
  iconOnly,
  variant = "gray",
  size = "regular",
  app,
  align,
  defaultOpen = false,
  className,
}: MenuProps) {
  const selecting = value !== undefined || defaultValue !== undefined;
  const [inner, setInner] = useState(defaultValue);
  const current = value !== undefined ? value : inner;
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const byUser = useRef(false);
  const uid = `ptm${useId().replace(/[^A-Za-z0-9]/g, "")}`;
  const small = size === "small";
  const currentItem = items.filter(isAction).find((it) => it.id === current);

  const focusables = () =>
    listRef.current ? Array.from(listRef.current.querySelectorAll<HTMLElement>('[role^="menuitem"]:not([aria-disabled="true"])')) : [];
  const close = (back: boolean) => {
    setOpen(false);
    if (back) btnRef.current?.focus();
  };
  const choose = (it: ActionItem) => {
    if (it.disabled) return;
    if (selecting) {
      if (value === undefined) setInner(it.id);
      onChange?.(it.id);
    }
    it.onSelect?.();
    onSelect?.(it.id);
    close(!it.href);
  };

  useEffect(() => {
    if (!open) return;
    const els = focusables();
    const sel = listRef.current?.querySelector<HTMLElement>('[aria-checked="true"]');
    if (byUser.current) (sel ?? els[0])?.focus();
    const onDown = (e: Event) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open]);

  const onListKey = (e: KeyboardEvent) => {
    const els = focusables();
    if (!els.length) return;
    const i = els.indexOf(document.activeElement as HTMLElement);
    const go = (n: number) => {
      e.preventDefault();
      els[n]?.focus();
    };
    if (e.key === "ArrowDown") go((i + 1) % els.length);
    else if (e.key === "ArrowUp") go((i - 1 + els.length) % els.length);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(els.length - 1);
    else if (e.key === "Escape") {
      e.preventDefault();
      close(true);
    } else if (e.key === "Tab") close(false);
  };
  const onBtnKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      byUser.current = true;
      setOpen(true);
    }
  };
  const toggle = () => {
    byUser.current = true;
    setOpen((o) => !o);
  };

  const triggerLabel = selecting ? (currentItem?.label ?? placeholder ?? "Choisir") : label;
  const triggerIcon = currentItem?.icon ?? icon;
  const trigger = iconOnly ? (
    <button
      ref={btnRef}
      type="button"
      className={clsx("pt-gbtn pt-glass pt-gbtn-icon", small && "pt-gbtn-small")}
      aria-label={label}
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={uid}
      onClick={toggle}
      onKeyDown={onBtnKey}
    >
      <Glyph icon={icon ?? Ellipsis} size={small ? 16 : 22} />
    </button>
  ) : (
    <button
      ref={btnRef}
      type="button"
      className={clsx("pt-btn", `pt-btn-${variant}`, "pt-menu-trigger", small && "pt-btn-small")}
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={uid}
      onClick={toggle}
      onKeyDown={onBtnKey}
    >
      {triggerIcon && <Glyph icon={triggerIcon} size={small ? 15 : 18} strokeWidth={2} />}
      <span className="pt-label">{triggerLabel}</span>
      <Glyph icon={ChevronsUpDown} size={small ? 12 : 14} strokeWidth={2.4} className="pt-menu-caret" />
    </button>
  );

  return (
    <div ref={rootRef} className={clsx("pt-root pt-menu-wrap", appClass(app), className)}>
      {trigger}
      {open && (
        <div
          id={uid}
          ref={listRef}
          role="menu"
          aria-label={label ?? triggerLabel}
          className={clsx("pt-menu pt-glass-thick", small && "pt-menu-small", align === "end" && "pt-menu-end")}
          onKeyDown={onListKey}
        >
          {items.map((it, i) => {
            if ("divider" in it) return <div key={`d${i}`} className="pt-menu-sep" role="separator" />;
            if ("section" in it)
              return (
                <div key={`s${i}`} className="pt-menu-section">
                  {it.section}
                </div>
              );
            const checked = selecting && it.id === current;
            const body = (
              <>
                {selecting && (
                  <span className="pt-menu-check" aria-hidden>
                    {checked && <Glyph icon={Check} size={small ? 13 : 16} strokeWidth={2.6} />}
                  </span>
                )}
                <span className="pt-menu-text">
                  <span className="pt-label">{it.label}</span>
                  {it.hint && <span className="pt-menu-hint">{it.hint}</span>}
                </span>
                {it.app && !it.icon ? (
                  <AppIcon app={it.app} size={small ? 16 : 22} />
                ) : it.icon ? (
                  <Glyph icon={it.icon} size={small ? 15 : 20} strokeWidth={2} />
                ) : null}
                {it.shortcut && <kbd className="pt-menu-kbd">{it.shortcut}</kbd>}
              </>
            );
            const common = {
              tabIndex: -1,
              role: selecting ? "menuitemradio" : "menuitem",
              "aria-checked": selecting ? checked : undefined,
              "aria-disabled": it.disabled ? ("true" as const) : undefined,
              className: clsx("pt-menu-item", it.destructive && "is-danger", it.app && appClass(it.app)),
            };
            if (it.href && !it.disabled) {
              return (
                <Link key={it.id} href={it.href} {...common} onClick={() => choose(it)}>
                  {body}
                </Link>
              );
            }
            return (
              <button key={it.id} type="button" {...common} onClick={() => choose(it)}>
                {body}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
