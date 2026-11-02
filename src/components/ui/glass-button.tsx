/**
 * GlassButton : bouton capsule Liquid Glass, pour les actions qui flottent au-dessus du
 * contenu (ajouter, mois précédent…). `prominent` = plein à la couleur de l'app, un seul
 * par écran. Sans texte, `label` est obligatoire. Voir design-system/components/GlassButton/README.md.
 */
import Link from "next/link";
import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { appClass, Glyph, type AppId } from "./ds";

export interface GlassButtonProps {
  icon?: LucideIcon;
  /** Nom lu par les lecteurs d'écran (obligatoire sans texte) */
  label?: string;
  children?: ReactNode;
  prominent?: boolean;
  app?: AppId;
  size?: "regular" | "small";
  type?: "button" | "submit";
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function GlassButton({ icon, label, children, prominent, app, size = "regular", type = "button", href, disabled, onClick, className }: GlassButtonProps) {
  const iconOnly = !!icon && children == null;
  const cls = clsx(
    "pt-root pt-gbtn",
    appClass(app),
    prominent ? "pt-gbtn-prominent" : "pt-glass",
    size === "small" && "pt-gbtn-small",
    iconOnly && "pt-gbtn-icon",
    disabled && "cursor-default opacity-40 active:scale-100",
    className,
  );
  const content = (
    <>
      {icon && <Glyph icon={icon} size={size === "small" ? 16 : 22} />}
      {children != null && <span className="pt-label">{children}</span>}
    </>
  );
  const ariaLabel = iconOnly ? label : undefined;
  if (href && !disabled) {
    return (
      <Link href={href} className={cls} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }
  return (
    <button
      type={type}
      className={cls}
      onClick={disabled ? undefined : onClick}
      aria-label={ariaLabel}
      aria-disabled={disabled ? "true" : undefined}
    >
      {content}
    </button>
  );
}
