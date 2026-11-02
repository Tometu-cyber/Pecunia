/**
 * Button : le bouton dans le contenu (cartes, formulaires, feuilles).
 * Variantes de la plus forte à la plus discrète : filled (une par écran), tinted, gray, plain.
 * Avec `href`, c'est un lien (next/link). Voir design-system/components/Button/README.md.
 */
import Link from "next/link";
import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { appClass, Glyph, type AppId } from "./ds";

export type ButtonVariant = "filled" | "tinted" | "gray" | "plain";
export type ButtonSize = "large" | "regular" | "small";

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  app?: AppId;
  icon?: LucideIcon;
  /** Pleine largeur */
  full?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  href?: string;
  onClick?: () => void;
  /** Obligatoire pour un bouton sans texte */
  "aria-label"?: string;
  children?: ReactNode;
  className?: string;
}

export function buttonClassName({
  variant = "filled",
  size = "regular",
  app,
  full,
  className,
}: Pick<ButtonProps, "variant" | "size" | "app" | "full" | "className">) {
  return clsx(
    "pt-root pt-btn",
    `pt-btn-${variant}`,
    appClass(app),
    size !== "regular" && `pt-btn-${size}`,
    full && "pt-btn-full",
    className,
  );
}

export function Button({
  variant = "filled",
  size = "regular",
  app,
  icon,
  full,
  disabled,
  type = "button",
  href,
  onClick,
  children,
  className,
  ...aria
}: ButtonProps) {
  const cls = buttonClassName({ variant, size, app, full, className });
  const content = (
    <>
      {icon && <Glyph icon={icon} size={size === "small" ? 15 : 20} strokeWidth={2.2} />}
      {children != null && <span className="pt-label">{children}</span>}
    </>
  );
  if (href && !disabled) {
    return (
      <Link href={href} className={cls} aria-label={aria["aria-label"]}>
        {content}
      </Link>
    );
  }
  if (href && disabled) {
    return (
      <span className={cls} aria-disabled="true" aria-label={aria["aria-label"]} role="link">
        {content}
      </span>
    );
  }
  return (
    <button
      type={type}
      className={cls}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled ? "true" : undefined}
      aria-label={aria["aria-label"]}
    >
      {content}
    </button>
  );
}
