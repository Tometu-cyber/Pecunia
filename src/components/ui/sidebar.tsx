"use client";

/**
 * Sidebar : barre latérale en verre épais, à gauche sur ordi (768 px et plus).
 * Survol en fill-tertiary, sélection en fill-secondary, texte toujours label.
 * `windowControls` : les trois boutons de fenêtre macOS (à false dans un navigateur).
 * Voir design-system/components/Sidebar/README.md.
 */
import Link from "next/link";
import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";
import { Fragment, useState, type ReactNode } from "react";
import { AppIcon } from "./app-icon";
import { appClass, Glyph, type AppId } from "./ds";

export interface SidebarItem {
  id: string;
  label: string;
  app?: AppId;
  icon?: LucideIcon;
  badge?: ReactNode;
  href?: string;
}

export interface SidebarProps {
  sections: { title?: string; items: SidebarItem[] }[];
  active?: string;
  defaultActive?: string;
  onSelect?: (id: string) => void;
  windowControls?: boolean;
  label?: string;
  footer?: ReactNode;
  /** Pictogrammes des lignes sans app : couleur d'accent de cette app */
  app?: AppId;
  className?: string;
}

export function Sidebar({ sections, active, defaultActive, onSelect, windowControls = true, label = "Apps", footer, app, className }: SidebarProps) {
  const [inner, setInner] = useState(defaultActive ?? sections[0]?.items[0]?.id);
  const current = active ?? inner;
  const select = (id: string) => {
    if (active === undefined) setInner(id);
    onSelect?.(id);
  };
  return (
    <nav className={clsx("pt-root pt-sidebar pt-glass-thick", app && appClass(app), className)} aria-label={label}>
      {windowControls && (
        <div className="pt-traffic" aria-hidden>
          <span />
          <span />
          <span />
        </div>
      )}
      {sections.map((sec, i) => (
        <Fragment key={sec.title ?? i}>
          {sec.title && <div className="pt-side-title">{sec.title}</div>}
          <ul className="pt-side-list">
            {sec.items.map((it) => {
              const props = {
                className: clsx("pt-side-item", it.app && appClass(it.app)),
                "aria-current": it.id === current ? ("page" as const) : undefined,
                onClick: () => select(it.id),
              };
              const content = (
                <>
                  {it.app ? <AppIcon app={it.app} size={20} /> : it.icon ? <Glyph icon={it.icon} size={18} /> : null}
                  <span className="pt-side-label">{it.label}</span>
                  {it.badge != null && <span className="pt-side-badge">{it.badge}</span>}
                </>
              );
              return (
                <li key={it.id}>
                  {it.href ? (
                    <Link href={it.href} {...props}>
                      {content}
                    </Link>
                  ) : (
                    <button type="button" {...props}>
                      {content}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </Fragment>
      ))}
      {footer && <div className="pt-side-footer">{footer}</div>}
    </nav>
  );
}
