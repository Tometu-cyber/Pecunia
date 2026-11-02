"use client";

/**
 * TabBar : barre d'onglets flottante en verre (mobile, moins de 768 px), 3 à 5 onglets,
 * avec un bouton rond facultatif à droite (« + » plein à la couleur de l'app).
 * Le contenu prévoit un padding bas de tabbar-height + space-8.
 * Voir design-system/components/TabBar/README.md.
 */
import Link from "next/link";
import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { appClass, Glyph, type AppId } from "./ds";
import { GlassButton } from "./glass-button";

export interface TabItem {
  id: string;
  /** Un seul mot */
  label: string;
  icon: LucideIcon;
  href?: string;
}

export interface TabBarProps {
  items: TabItem[];
  active?: string;
  defaultActive?: string;
  onChange?: (id: string) => void;
  action?: { icon: LucideIcon; label: string; href?: string; onClick?: () => void; prominent?: boolean };
  app?: AppId;
  label?: string;
  className?: string;
}

export function TabBar({ items, active, defaultActive, onChange, action, app, label = "Navigation principale", className }: TabBarProps) {
  const [inner, setInner] = useState(defaultActive ?? items[0]?.id);
  const current = active ?? inner;
  const select = (id: string) => {
    if (active === undefined) setInner(id);
    onChange?.(id);
  };
  return (
    <div className={clsx("pt-root pt-tabbar-row", appClass(app), className)}>
      <nav className="pt-tabbar pt-glass" aria-label={label}>
        {items.map((it) => {
          const props = {
            className: "pt-tab",
            "aria-current": it.id === current ? ("page" as const) : undefined,
            onClick: () => select(it.id),
          };
          const content = (
            <>
              <Glyph icon={it.icon} size={24} />
              <span>{it.label}</span>
            </>
          );
          return it.href ? (
            <Link key={it.id} href={it.href} {...props}>
              {content}
            </Link>
          ) : (
            <button key={it.id} type="button" {...props}>
              {content}
            </button>
          );
        })}
      </nav>
      {action && (
        <GlassButton icon={action.icon} label={action.label} href={action.href} onClick={action.onClick} app={app} prominent={action.prominent} />
      )}
    </div>
  );
}
