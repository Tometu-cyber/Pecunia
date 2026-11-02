"use client";

/**
 * Toggle : interrupteur façon iOS 26. Avec `label`, ligne complète (texte à gauche,
 * interrupteur à droite). Applique son effet tout de suite.
 * Voir design-system/components/Toggle/README.md.
 */
import { clsx } from "clsx";
import { useId, useState } from "react";
import { appClass, type AppId } from "./ds";

export interface ToggleProps {
  label?: string;
  hint?: string;
  /** Nom pour les lecteurs d'écran quand l'interrupteur est seul */
  ariaLabel?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (on: boolean) => void;
  /** Couleur une fois allumé ; sans app, vert système (success) */
  app?: AppId;
  size?: "regular" | "small";
  disabled?: boolean;
  className?: string;
}

export function Toggle({ label, hint, ariaLabel, checked, defaultChecked, onChange, app, size = "regular", disabled, className }: ToggleProps) {
  const [inner, setInner] = useState(!!defaultChecked);
  const on = checked ?? inner;
  const rid = `ptt${useId().replace(/[^A-Za-z0-9]/g, "")}`;
  const flip = () => {
    if (disabled) return;
    if (checked === undefined) setInner(!on);
    onChange?.(!on);
  };
  const sw = (
    <button
      id={rid}
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label ? undefined : ariaLabel}
      aria-labelledby={label ? `${rid}l` : undefined}
      aria-disabled={disabled ? "true" : undefined}
      className={clsx("pt-switch", size === "small" && "pt-switch-small", app ? appClass(app) : "pt-switch-default")}
      onClick={flip}
    >
      <span className="pt-switch-knob" />
    </button>
  );
  if (!label) return <span className={clsx("pt-root", className)}>{sw}</span>;
  return (
    <div className={clsx("pt-root pt-toggle-row", size === "small" && "pt-toggle-row-small", className)}>
      <span className="pt-toggle-text">
        <span id={`${rid}l`} className="pt-toggle-label" onClick={flip}>
          {label}
        </span>
        {hint && <span className="pt-toggle-hint">{hint}</span>}
      </span>
      {sw}
    </div>
  );
}
