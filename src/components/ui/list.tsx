/**
 * List / ListRow : liste groupée façon Réglages d'iOS. Une ligne = un repère à gauche,
 * un titre, un sous-titre, une valeur à droite et un chevron si elle est cliquable.
 * Voir design-system/components/List/README.md et ListRow/README.md.
 */
import Link from "next/link";
import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";
import { Children, type CSSProperties, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { AppIcon } from "./app-icon";
import { appClass, Glyph, type AppId } from "./ds";

export interface ListProps {
  header?: ReactNode;
  footer?: ReactNode;
  /** false : séparateurs pleine largeur (lignes sans repère) */
  inset?: boolean;
  /** Sans fond ni arrondi, pour une liste posée dans une Card */
  plain?: boolean;
  children?: ReactNode;
  className?: string;
}

export function List({ header, footer, inset = true, plain, children, className }: ListProps) {
  return (
    <div className={clsx("pt-root pt-list-wrap", className)}>
      {header && <h2 className="pt-list-header">{header}</h2>}
      <ul
        className={clsx("pt-list", plain && "pt-list-plain")}
        style={{ "--sep-inset": inset ? "58px" : "0px" } as CSSProperties}
      >
        {Children.map(children, (c) => (c ? <li>{c}</li> : null))}
      </ul>
      {footer && <p className="pt-list-footer">{footer}</p>}
    </div>
  );
}

export type ListRowTone = "default" | "positive" | "negative" | "app" | "strong";

export interface ListRowProps {
  title: ReactNode;
  subtitle?: ReactNode;
  app?: AppId;
  /** Pictogramme dans une pastille ronde <app>-bg */
  icon?: LucideIcon;
  /** Icône d'app complète à la place de la pastille */
  appIcon?: boolean;
  /** Repère libre (remplace icon / appIcon) */
  leading?: ReactNode;
  value?: ReactNode;
  tone?: ListRowTone;
  /** Masque le chevron d'une ligne cliquable */
  chevron?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function ListRow({ title, subtitle, app, icon, appIcon, leading, value, tone, chevron = true, href, onClick, className }: ListRowProps) {
  let lead: ReactNode = leading ?? null;
  if (!lead && appIcon) lead = <AppIcon app={app} size={30} />;
  else if (!lead && icon)
    lead = (
      <span className="pt-row-lead">
        <Glyph icon={icon} size={17} strokeWidth={2} />
      </span>
    );
  const interactive = !!href || !!onClick;
  const cls = clsx("pt-row", appClass(app), !lead && "pt-row-nolead", className);
  const content = (
    <>
      {lead}
      <span className="pt-row-text">
        <span className="pt-row-title">{title}</span>
        {subtitle && <span className="pt-row-sub">{subtitle}</span>}
      </span>
      {value != null && <span className={clsx("pt-row-value", tone && tone !== "default" && `pt-tone-${tone}`)}>{value}</span>}
      {interactive && chevron && <Glyph icon={ChevronRight} size={16} strokeWidth={2.2} className="pt-row-chev" />}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={cls}>
        {content}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" className={cls} onClick={onClick}>
        {content}
      </button>
    );
  }
  return <div className={cls}>{content}</div>;
}
