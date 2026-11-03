/**
 * ProgressRing : un à trois anneaux concentriques façon Forme, légende à droite dès deux
 * anneaux. Voir design-system/components/ProgressRing/README.md.
 */
import { clsx } from "clsx";
import type { ReactNode } from "react";
import { appClass, type AppId } from "./ds";

export interface Ring {
  app: AppId;
  /** 0 à 1 (au-delà : anneau plein, écrire la vraie valeur dans display) */
  value: number;
  label: string;
  display?: ReactNode;
}

export interface ProgressRingProps {
  rings: Ring[];
  size?: number;
  thickness?: number;
  center?: { value: ReactNode; label?: string };
  legend?: boolean;
  className?: string;
}

export function ProgressRing({ rings, size = 132, thickness, center, legend = true, className }: ProgressRingProps) {
  const t = thickness ?? Math.round(size * 0.11);
  const gap = 2;
  const c = size / 2;
  const summary = rings.map((r) => `${r.label} ${Math.round((r.value || 0) * 100)} %`).join(", ");
  return (
    <div className={clsx("pt-root pt-rings", className)}>
      <div className="pt-rings-fig" style={{ width: size, height: size }} role="img" aria-label={summary}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {rings.map((r, i) => {
            const rad = c - t / 2 - i * (t + gap);
            const len = 2 * Math.PI * rad;
            const v = Math.max(0, Math.min(1, r.value || 0));
            return (
              <g key={i} className={appClass(r.app)}>
                <circle className="pt-ring-track" cx={c} cy={c} r={rad} strokeWidth={t} />
                {v > 0 && (
                  <circle
                    className="pt-ring-bar"
                    cx={c}
                    cy={c}
                    r={rad}
                    strokeWidth={t}
                    strokeLinecap="round"
                    strokeDasharray={len}
                    strokeDashoffset={len * (1 - v)}
                  />
                )}
              </g>
            );
          })}
        </svg>
        {center && (
          <div className="pt-rings-center" aria-hidden>
            <b>{center.value}</b>
            {center.label && <span>{center.label}</span>}
          </div>
        )}
      </div>
      {legend && rings.length >= 2 && (
        <ul className="pt-legend">
          {rings.map((r, i) => (
            <li key={i} className={appClass(r.app)}>
              <i aria-hidden />
              <span className="pt-legend-name">{r.label}</span>
              <span className="pt-legend-val">{r.display ?? `${Math.round((r.value || 0) * 100)} %`}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
