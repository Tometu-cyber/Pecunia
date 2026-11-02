/**
 * Base commune des composants du design system « Portail » (design-system/README.md) :
 * identifiants d'app, pictogrammes lucide-react au trait de 1,75.
 */
import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";

/** Couleur d'app : redéfinit --app, --app-text, --app-bg et --on-app (classe pt-app-<app>). */
export type AppId = "finances" | "sport" | "alternance" | "alimentation" | "notes" | "portail";

/** Couleur d'accent de Pecunia */
export const PECUNIA_APP: AppId = "finances";

export function appClass(app: AppId | undefined): string {
  return `pt-app-${app ?? "portail"}`;
}

/** Épaisseur de trait par défaut des pictogrammes, proche des SF Symbols. */
export const ICON_STROKE = 1.75;

/** Pictogramme lucide-react. Décoratif sans `label`. */
export function Glyph({
  icon: Icon,
  size = 22,
  strokeWidth = ICON_STROKE,
  label,
  className,
}: {
  icon: LucideIcon;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}) {
  return (
    <Icon
      size={size}
      strokeWidth={strokeWidth}
      className={clsx("pt-icon", className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    />
  );
}
