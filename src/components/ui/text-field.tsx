"use client";

/**
 * TextField : libellé au-dessus, fond gris doux, contour à la couleur de l'app pendant la
 * saisie, aide ou erreur en dessous. 44 px de haut et texte à 17 px sur mobile (pas de zoom
 * Safari), 28 px sur ordi (`size: "small"`). Voir design-system/components/TextField/README.md.
 */
import { clsx } from "clsx";
import { CircleAlert, Search, type LucideIcon } from "lucide-react";
import { useId, type ComponentProps } from "react";
import { appClass, Glyph, type AppId } from "./ds";

export interface TextFieldProps extends Omit<ComponentProps<"input">, "size" | "onChange" | "value" | "defaultValue"> {
  label?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  hint?: string;
  error?: string;
  /** Unité à droite (« € ») */
  suffix?: string;
  icon?: LucideIcon;
  variant?: "default" | "search";
  size?: "regular" | "small";
  app?: AppId;
}

export function TextField({
  label,
  placeholder,
  value,
  defaultValue,
  onChange,
  hint,
  error,
  suffix,
  icon,
  variant = "default",
  size = "regular",
  app,
  type,
  id: idProp,
  className,
  ...rest
}: TextFieldProps) {
  const rid = useId();
  const id = idProp ?? `ptf${rid.replace(/[^A-Za-z0-9]/g, "")}`;
  const search = variant === "search";
  const lead = icon ?? (search ? Search : undefined);
  return (
    <div
      className={clsx("pt-root pt-field", appClass(app), search && "pt-field-search", size === "small" && "pt-field-small", error && "pt-field-error", className)}
    >
      {label && (
        <label className="pt-field-label" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="pt-field-box">
        {lead && <Glyph icon={lead} size={size === "small" ? 14 : 18} strokeWidth={2} />}
        <input
          id={id}
          type={type ?? (search ? "search" : "text")}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          aria-label={label ? undefined : placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${id}m` : undefined}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          {...rest}
        />
        {suffix && <span className="pt-field-suffix">{suffix}</span>}
      </div>
      {error ? (
        <div className="pt-field-msg" id={`${id}m`}>
          <Glyph icon={CircleAlert} size={14} strokeWidth={2} />
          {error}
        </div>
      ) : hint ? (
        <div className="pt-field-hint" id={`${id}m`}>
          {hint}
        </div>
      ) : null}
    </div>
  );
}
