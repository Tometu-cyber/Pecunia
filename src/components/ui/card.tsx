/**
 * Card : le bloc de contenu de base. Titre en sentence case, sous-titre et action « Voir tout »
 * facultatifs. Jamais de verre ni de carte dans une carte.
 * Voir design-system/components/Card/README.md.
 */
import { clsx } from "clsx";
import type { CSSProperties, ReactNode } from "react";
import { Button } from "./button";
import { appClass, type AppId } from "./ds";

export interface CardAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface CardProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: CardAction;
  app?: AppId;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Card({ title, subtitle, action, app, children, className, style }: CardProps) {
  return (
    <section className={clsx("pt-root pt-card", appClass(app), className)} style={style}>
      {(title || action) && (
        <header className="pt-card-head">
          <div className="min-w-0">
            {title && <h2 className="pt-card-title">{title}</h2>}
            {subtitle && <p className="pt-card-sub">{subtitle}</p>}
          </div>
          {action && (
            <Button variant="plain" size="small" app={app} href={action.href} onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
