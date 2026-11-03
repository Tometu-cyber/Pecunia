/**
 * BarChart : graphique en barres, une seule série, à la couleur de l'app. Info-bulle au
 * survol de la colonne, tableau caché pour les lecteurs d'écran.
 * Voir design-system/components/BarChart/README.md.
 */
import { clsx } from "clsx";
import type { CSSProperties } from "react";
import { appClass, type AppId } from "./ds";

export interface BarChartProps {
  /** 12 barres maximum */
  data: { label: string; value: number }[];
  app?: AppId;
  /** Index de la barre mise en avant ; les autres sont à 42 % */
  highlight?: number;
  goal?: number;
  goalLabel?: string;
  max?: number;
  height?: number;
  /** Lu par les lecteurs d'écran */
  title?: string;
  format?: (v: number) => string;
  className?: string;
}

export function BarChart({ data, app, highlight, goal, goalLabel, max: maxProp, height = 140, title, format = String, className }: BarChartProps) {
  const max = maxProp ?? Math.max(...data.map((d) => d.value), goal ?? 0, 1);
  return (
    <figure className={clsx("pt-root pt-bars", appClass(app), className)} style={{ margin: 0 }}>
      <div className="pt-bars-plot" style={{ height }} aria-hidden>
        {data.map((d, i) => {
          const pct = (Math.max(0, d.value) / max) * 100;
          return (
            <div key={i} className={clsx("pt-bars-col", i === highlight && "is-hl")} style={{ "--h": `${pct}%` } as CSSProperties}>
              <span className="pt-bars-tip">
                {d.label} · {format(d.value)}
              </span>
              <span className="pt-bars-bar" style={{ height: `${pct}%` }} />
            </div>
          );
        })}
        {goal ? (
          <div className="pt-bars-goal" style={{ bottom: `${(goal / max) * 100}%` }}>
            <span>{goalLabel ?? `Objectif ${format(goal)}`}</span>
          </div>
        ) : null}
      </div>
      <div className="pt-bars-x" aria-hidden>
        {data.map((d, i) => (
          <span key={i} className={i === highlight ? "is-hl" : undefined}>
            {d.label}
          </span>
        ))}
      </div>
      <table className="pt-sr">
        {title && <caption>{title}</caption>}
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <th>{d.label}</th>
              <td>{format(d.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
