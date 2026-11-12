"use client";

import { useState } from "react";
import { Line, LineChart, ReferenceArea, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCents } from "@/lib/domain/money";
import { Segmented } from "@/components/ui/primitives";
import { BarChart, LineChart as DsLineChart } from "@portail/ui";
import { PECUNIA_APP } from "@/components/ui/app";

/** Info-bulle des graphiques recharts, au style des info-bulles du design system */
const tooltipStyle = {
  background: "var(--bg-tertiary)",
  border: "none",
  borderRadius: 10,
  boxShadow: "var(--shadow-popover)",
  fontSize: 12,
  color: "var(--label)",
};
const axisTick = { fontSize: 11, fill: "var(--label-secondary)" };

/** 1 300 € → « 1,3 k€ » ; en dessous de 1 000 €, montant complet */
export function formatEuros(v: number): string {
  return Math.abs(v) >= 1000 ? `${(Math.round(v / 100) / 10).toString().replace(".", ",")} k€` : formatCents(Math.round(v * 100));
}

/** Histogramme des dépenses mensuelles (BarChart du design system), bascule 6 / 12 mois ; le dernier mois est mis en avant. */
export function MonthlyBars({ data }: { data: { label: string; cents: number }[] }) {
  const [depth, setDepth] = useState<"6" | "12">("12");
  const shown = data.slice(-Number(depth)).map((d) => ({ label: d.label, value: d.cents / 100 }));
  return (
    <div>
      <div className="mb-3 flex justify-end">
        <Segmented
          size="sm"
          label="Période"
          value={depth}
          onChange={setDepth}
          options={[
            { value: "6", label: "6 mois" },
            { value: "12", label: "12 mois" },
          ]}
        />
      </div>
      <BarChart app={PECUNIA_APP} data={shown} highlight={shown.length - 1} height={170} title="Dépenses par mois, en euros" format={formatEuros} />
    </div>
  );
}

/** Courbe d'évolution (patrimoine, solde d'un compte) : LineChart du design system, en vert finances. */
export function BalanceArea({ data, height = 160 }: { data: { label: string; cents: number }[]; height?: number }) {
  if (data.length === 0) return null;
  return (
    <DsLineChart
      app={PECUNIA_APP}
      data={data.map((d) => ({ label: d.label, value: d.cents / 100 }))}
      height={height}
      title="Évolution du solde, en euros"
      format={formatEuros}
    />
  );
}

/** Solde projeté : une courbe par compte, zone rouge sous la ligne de zéro. */
export function ForecastChart({
  data,
  series,
}: {
  data: Record<string, number | string>[];
  series: { key: string; name: string; color: string }[];
}) {
  const values = data.flatMap((d) => series.map((s) => Number(d[s.key] ?? 0)));
  const min = Math.min(0, ...values);
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: 16, bottom: 0 }}>
          <XAxis dataKey="label" interval={0} tickLine={false} axisLine={false} tick={axisTick} />
          <YAxis hide domain={[Math.min(min * 1.1, 0), "auto"]} />
          {min < 0 && <ReferenceArea y1={min * 1.1} y2={0} fill="var(--danger)" fillOpacity={0.08} />}
          <ReferenceLine y={0} stroke="var(--danger)" strokeDasharray="4 4" strokeOpacity={0.6} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "var(--label-tertiary)" }} formatter={(v, name) => [formatCents(Number(v)), name]} />
          {series.map((s) => (
            <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
