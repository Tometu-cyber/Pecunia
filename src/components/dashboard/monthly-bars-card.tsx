"use client";

/** Carte « Dépenses mensuelles » : bascule 6 / 12 mois, le dernier mois mis en avant. */
import { useState } from "react";
import { formatCents } from "@/lib/domain/money";
import { BarChart } from "@/components/ui/bar-chart";
import { Card } from "@/components/ui/card";
import { PECUNIA_APP } from "@/components/ui/ds";
import { SegmentedControl } from "@/components/ui/segmented-control";

/** 1 300 € → « 1,3 k€ » ; en dessous de 1 000 €, montant complet */
function formatEuros(v: number): string {
  return v >= 1000 ? `${(Math.round(v / 100) / 10).toString().replace(".", ",")} k€` : formatCents(Math.round(v * 100));
}

export function MonthlyBarsCard({ data, defaultDepth = "12" }: { data: { label: string; cents: number }[]; defaultDepth?: "6" | "12" }) {
  const [depth, setDepth] = useState<"6" | "12">(defaultDepth);
  const shown = data.slice(-Number(depth)).map((d) => ({ label: d.label, value: d.cents / 100 }));
  return (
    <Card title="Dépenses mensuelles" app={PECUNIA_APP}>
      <div className="-mt-1 mb-[18px] flex md:-mt-[46px] md:mb-[26px] md:justify-end">
        <SegmentedControl
          size="small"
          label="Période"
          value={depth}
          onChange={setDepth}
          items={[
            { id: "6", label: "6 mois" },
            { id: "12", label: "12 mois" },
          ]}
        />
      </div>
      <BarChart app={PECUNIA_APP} data={shown} highlight={shown.length - 1} height={150} title="Dépenses par mois, en euros" format={formatEuros} />
    </Card>
  );
}
