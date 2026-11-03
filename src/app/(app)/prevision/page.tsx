import Link from "next/link";
import { clsx } from "clsx";
import { TriangleAlert } from "lucide-react";
import { getAppData, getForecastDecisions, getTransactions } from "@/lib/data/queries";
import { getBudgetOverview, withParams } from "@/lib/data/views";
import { addMonths, monthAbbr, monthKeyOf, monthName, monthPeriod, todayIso } from "@/lib/domain/dates";
import { buildForecast, plannedEffects, proposalEffects } from "@/lib/domain/forecast";
import { buildOccurrences, occurrenceWindow, signedRecurrenceCents } from "@/lib/domain/recurrences";
import { formatCents, formatCentsCompact } from "@/lib/domain/money";
import { AccountChips } from "@/components/app/filters";
import { ForecastChart } from "@/components/charts/charts";
import { Banner, Card, PageHeader } from "@/components/ui/primitives";
import { AccountFilter } from "@/components/app/account-filter";
import { MonthPlanner, type PlanLine } from "./month-planner";

export const metadata = { title: "Prévisionnel" };

const HORIZONS = [1, 3, 6, 12] as const;

export default async function ForecastPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const { profile, accounts, balances, recurrences, forecastItems } = await getAppData();
  const today = todayIso();
  const startDay = profile.monthStartDay;
  const horizon = HORIZONS.find((h) => String(h) === params.horizon) ?? 3;
  const active = accounts.filter((a) => !a.archivedAt);
  const accountId = active.some((a) => a.id === params.compte) ? params.compte! : null;

  const current = monthKeyOf(today, startDay);
  const from = monthPeriod(current, startDay).start;
  const to = monthPeriod(addMonths(current, horizon - 1), startDay).end;
  const range = occurrenceWindow(from, to);
  const [txs, budgets, decisions] = await Promise.all([
    getTransactions({ from: range.from, to: range.to }),
    getBudgetOverview(current),
    getForecastDecisions(current),
  ]);
  const currentBalances = Object.fromEntries(active.map((a) => [a.id, balances.get(a.id)?.balanceCents ?? a.initialBalanceCents]));
  const { months, alerts } = buildForecast({
    accounts,
    balances: currentBalances,
    today,
    horizon,
    startDay,
    occurrences: buildOccurrences(recurrences, txs, from, to),
    forecastItems,
    decisions,
    budgets,
  });

  const shown = accountId ? active.filter((a) => a.id === accountId) : active;
  const shownIds = new Set(shown.map((a) => a.id));
  // Montant vu depuis les comptes affichés (un virement entre deux comptes affichés vaut 0)
  const viewOf = (effects: [string, number][]) => effects.reduce((s, [id, c]) => (shownIds.has(id) ? s + c : s), 0);
  const touches = (effects: [string, number][]) => effects.some(([id]) => shownIds.has(id));
  const sumShown = (pick: (id: string) => number) => shown.reduce((s, a) => s + pick(a.id), 0);

  const visibleAlerts = alerts.filter((a) => shownIds.has(a.accountId));
  const accountName = new Map(active.map((a) => [a.id, a.name]));
  const chartData = [
    { label: "Auj.", ...Object.fromEntries(shown.map((a) => [a.id, currentBalances[a.id]!])) },
    ...months.map((m) => ({ label: monthAbbr(m.month), ...Object.fromEntries(shown.map((a) => [a.id, m.perAccount[a.id]!.endBalanceCents])) })),
  ];

  const selectedIndex = Math.max(0, months.findIndex((m) => m.month === params.mois));
  const selected = months[selectedIndex]!;
  const lines: PlanLine[] = [
    ...selected.proposals
      .map((p) => ({ p, effects: proposalEffects(p) }))
      .filter(({ effects }) => touches(effects))
      .map(({ p, effects }): PlanLine => ({
        key: p.key,
        kind: p.source,
        label: p.label,
        type: p.type,
        accountId: p.accountId,
        toAccountId: p.toAccountId,
        categoryId: p.categoryId,
        amountCents: p.amountCents,
        proposedCents: p.proposedCents,
        date: p.date,
        proposedDate: p.proposedDate,
        viewCents: viewOf(effects),
        status: p.status,
        modified: p.modified,
        decided: p.decided,
        itemId: null,
        seriesId: null,
      })),
    ...selected.planned
      .map((f) => ({ f, effects: plannedEffects(f) }))
      .filter(({ effects }) => touches(effects))
      .map(({ f, effects }): PlanLine => ({
        key: f.id,
        kind: "planned",
        label: f.label,
        type: f.toAccountId ? "transfer" : f.amountCents > 0 ? "in" : "out",
        accountId: f.accountId,
        toAccountId: f.toAccountId,
        categoryId: null,
        amountCents: Math.abs(f.amountCents),
        proposedCents: Math.abs(f.amountCents),
        date: f.date,
        proposedDate: f.date,
        viewCents: viewOf(effects),
        status: "planned",
        modified: false,
        decided: true,
        itemId: f.id,
        seriesId: f.seriesId,
      })),
  ];
  const retained = lines.filter((l) => l.status === "accepted" || l.status === "planned");
  const realized = selected.realized
    .filter((o) => shownIds.has(o.recurrence.accountId) || (o.recurrence.toAccountId !== null && shownIds.has(o.recurrence.toAccountId)))
    .map((o) => ({
      key: o.key,
      label: o.recurrence.label,
      date: o.transaction?.date ?? o.date,
      cents: o.transaction ? viewOf([[o.transaction.accountId, o.transaction.amountCents], ...(o.recurrence.type === "transfer" && o.recurrence.toAccountId ? [[o.recurrence.toAccountId, -o.transaction.amountCents] as [string, number]] : [])]) : signedRecurrenceCents(o.recurrence),
      transfer: o.recurrence.type === "transfer",
    }));
  const summary = {
    startCents: selectedIndex === 0 ? sumShown((id) => currentBalances[id]!) : sumShown((id) => months[selectedIndex - 1]!.perAccount[id]!.endBalanceCents),
    inCents: retained.reduce((s, l) => s + Math.max(0, l.viewCents), 0),
    outCents: retained.reduce((s, l) => s + Math.max(0, -l.viewCents), 0),
    endCents: sumShown((id) => selected.perAccount[id]!.endBalanceCents),
    endIfAllCents: sumShown((id) => selected.perAccount[id]!.endIfAllCents),
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader kicker="Anticipation" title="Prévisionnel" />
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <AccountFilter
          label="Horizon"
          value={String(horizon)}
          full
          options={HORIZONS.map((h) => ({
            id: String(h),
            label: `${h} mois`,
            href: withParams("/prevision", { horizon: h === 3 ? null : String(h), compte: accountId }),
          }))}
        />
        <AccountChips
          path="/prevision"
          accounts={active}
          selected={accountId}
          params={{ horizon: params.horizon, mois: params.mois }}
          allLabel="Tous comptes"
          full
        />
      </div>

      {visibleAlerts.map((a) => (
        <Banner key={a.accountId} tone="danger">
          <span className="inline-flex items-center gap-2">
            <TriangleAlert size={18} strokeWidth={1.75} className="shrink-0" aria-hidden />
            <span>
              <strong>{accountName.get(a.accountId)}</strong> en négatif en {monthName(a.month)} · {formatCents(a.balanceCents)} projetés.
              Prévois un virement.
            </span>
          </span>
        </Banner>
      ))}

      <Card>
        <h2 className="mb-3 text-heading">Solde projeté en fin de mois</h2>
        <ForecastChart data={chartData} series={shown.map((a) => ({ key: a.id, name: a.name, color: a.color }))} />
        <p className="mt-2 text-foot text-label-secondary">
          Solde actuel + échéances des récurrences (retenues d&apos;office, sauf refus) + budgets acceptés + entrées / sorties prévues.
          Les budgets à valider ne sont pas comptés.
        </p>
      </Card>

      <nav aria-label="Mois" className="no-scrollbar -mx-4 -mt-2 flex gap-2 overflow-x-auto px-4 pt-2 pb-1 md:mx-0 md:pl-0 md:pr-2">
        {months.map((m, i) => {
          const end = sumShown((id) => m.perAccount[id]!.endBalanceCents);
          const pending = m.proposals.filter((p) => p.status === "pending" && touches(proposalEffects(p))).length;
          const negative = shown.some((a) => m.perAccount[a.id]!.endBalanceCents < 0);
          return (
            <Link
              key={m.month}
              href={withParams("/prevision", { horizon: horizon === 3 ? null : String(horizon), compte: accountId, mois: i === 0 ? null : m.month })}
              aria-current={i === selectedIndex ? "page" : undefined}
              className={clsx(
                "relative flex min-w-24 shrink-0 flex-col rounded-md px-3 py-2 text-left shadow-card transition-transform motion-safe:active:scale-[0.97]",
                i === selectedIndex ? "bg-finances-bg text-finances-text" : "bg-bg-grouped-secondary hover:bg-fill-tertiary",
              )}
            >
              <span className="text-foot font-semibold capitalize">{monthAbbr(m.month)}</span>
              <span className={clsx("font-rounded text-[17px] leading-[22px] font-bold tabular-nums md:text-[15px] md:leading-5", negative && "text-danger-text")}>{formatCentsCompact(end)}</span>
              {pending > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid min-w-5 place-items-center rounded-full bg-warning px-1 text-foot font-bold text-black">
                  {pending}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <MonthPlanner
        key={`${selected.month}-${accountId ?? "all"}`}
        month={selected.month}
        period={monthPeriod(selected.month, startDay)}
        today={today}
        lines={lines}
        realized={realized}
        summary={summary}
        defaultAccountId={accountId}
        multiAccount={shown.length > 1}
      />
    </div>
  );
}
