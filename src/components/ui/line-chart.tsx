"use client";

/**
 * LineChart : courbe d'une seule série dans le temps (solde, patrimoine). Point et étiquette
 * sur la dernière valeur, suivi au survol ou au doigt, 3 lignes de repère, dates sans
 * chevauchement. Voir design-system/components/LineChart/README.md.
 */
import { clsx } from "clsx";
import { useId, useRef, useState, type PointerEvent } from "react";
import { appClass, type AppId } from "./ds";

export interface LineChartProps {
  data: { label: string; value: number }[];
  app?: AppId;
  height?: number;
  title?: string;
  format?: (v: number) => string;
  /** false : sans fond dégradé */
  area?: boolean;
  goal?: number;
  goalLabel?: string;
  min?: number;
  max?: number;
  ticks?: number[];
  labelEvery?: number;
  highlight?: number;
  className?: string;
}

export function LineChart({
  data,
  app,
  height = 160,
  title,
  format = String,
  area = true,
  goal,
  goalLabel,
  min,
  max,
  ticks: ticksProp,
  labelEvery,
  highlight,
  className,
}: LineChartProps) {
  const uid = `ptl${useId().replace(/[^A-Za-z0-9]/g, "")}`;
  const [hover, setHover] = useState<number | null>(null);
  const plotRef = useRef<HTMLDivElement>(null);
  const vals = data.map((d) => d.value);
  let lo = min ?? Math.min(...vals);
  let hi = max ?? Math.max(...vals);
  if (goal != null) {
    lo = Math.min(lo, goal);
    hi = Math.max(hi, goal);
  }
  const pad = (hi - lo) * 0.12 || 1;
  if (min == null) lo -= pad;
  if (max == null) hi += pad;
  const n = data.length;
  const X = (i: number) => (n < 2 ? 50 : (i / (n - 1)) * 100);
  const Y = (v: number) => 100 - ((v - lo) / (hi - lo)) * 100;
  const line = data.map((d, i) => `${i ? "L" : "M"}${X(i).toFixed(3)} ${Y(d.value).toFixed(3)}`).join(" ");
  const areaPath = `${line} L100 100 L0 100 Z`;
  const last = n - 1;
  const shown = hover ?? highlight ?? last;
  const point = data[shown];
  const every = labelEvery ?? Math.max(1, Math.ceil((n - 1) / 4));
  const ticks = ticksProp ?? [hi - pad, (hi + lo) / 2, lo + pad];

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = plotRef.current?.getBoundingClientRect();
    if (!r || n === 0) return;
    const x = (e.clientX - r.left) / r.width;
    setHover(Math.max(0, Math.min(n - 1, Math.round(x * (n - 1)))));
  };

  return (
    <figure className={clsx("pt-root pt-line", appClass(app), className)} style={{ margin: 0 }}>
      <div className="pt-line-plot" ref={plotRef} style={{ height }} onPointerMove={onMove} onPointerLeave={() => setHover(null)} aria-hidden>
        {ticks.map((t, i) => (
          <div key={`g${i}`} className="pt-line-grid" style={{ top: `${Y(t)}%` }}>
            <span>{format(Math.round(t))}</span>
          </div>
        ))}
        {goal != null && (
          <div className="pt-bars-goal" style={{ bottom: `${100 - Y(goal)}%` }}>
            <span>{goalLabel ?? `Objectif ${format(goal)}`}</span>
          </div>
        )}
        <svg className="pt-line-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id={uid} x1={0} y1={0} x2={0} y2={1}>
              <stop offset={0} style={{ stopColor: "var(--app)", stopOpacity: 0.28 }} />
              <stop offset={1} style={{ stopColor: "var(--app)", stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          {area && <path d={areaPath} fill={`url(#${uid})`} />}
          <path d={line} className="pt-line-path" vectorEffect="non-scaling-stroke" />
        </svg>
        {hover != null && <div className="pt-line-cross" style={{ left: `${X(hover)}%` }} />}
        {point && (
          <>
            <div className="pt-line-dot" style={{ left: `${X(shown)}%`, top: `${Y(point.value)}%` }} />
            <div
              className={clsx("pt-line-tip", X(shown) > 70 && "is-left", X(shown) < 30 && "is-right")}
              style={{ left: `${X(shown)}%`, top: `${Y(point.value)}%` }}
            >
              <b>{format(point.value)}</b>
              <span>{point.label}</span>
            </div>
          </>
        )}
      </div>
      <div className="pt-line-x" aria-hidden>
        {data.map((d, i) => {
          const show = i === last || (i % every === 0 && last - i >= every * 0.75);
          return show ? (
            <span key={i} className={i === 0 ? "is-first" : i === last ? "is-last" : undefined} style={{ left: `${X(i)}%` }}>
              {d.label}
            </span>
          ) : null;
        })}
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
