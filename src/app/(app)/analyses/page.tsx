import { clsx } from "clsx";
import { getTransactions, loadData } from "@/lib/data/queries";
import { resolveMonth, withStartDay } from "@/lib/data/views";
import { addMonths, isInPeriod, lastMonths, monthAbbr, monthName, monthPeriod } from "@/lib/domain/dates";
import { categorySeries, compareMonths, savingsByAccount } from "@/lib/domain/analyses";
import { formatCents, formatPercent } from "@/lib/domain/money";
import { balanceSeriesFromCurrent, expensesByCategory, summarize, topPlaces } from "@/lib/domain/stats";
import { MonthSwitcher } from "@/components/app/filters";
import { BalanceArea, MonthlyBars } from "@/components/charts/charts";
import { Card, CardHeader, EmptyState, PageHeader } from "@/components/ui/primitives";
import { CategoryPicker } from "./category-picker";

export const metadata = { title: "Analyses" };

export default async function AnalysesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  // profil, données et transactions en même temps (jour de début de mois deviné puis vérifié)
  const {
    profile,
    data: [{ accounts, categories, balances }, txs],
  } = await withStartDay((day) =>
    Promise.all([
      loadData("accounts", "categories", "balances"),
      getTransactions({ from: monthPeriod(lastMonths(resolveMonth(params.mois, day).month, 12)[0]!, day).start }),
    ]),
  );
  const startDay = profile.monthStartDay;
  const { month, current } = resolveMonth(params.mois, startDay);
  const months = lastMonths(month, 12);

  const period = monthPeriod(month, startDay);
  const prevPeriod = monthPeriod(addMonths(month, -1), startDay);
  const monthTxs = txs.filter((t) => isInPeriod(t.date, period));
  const prevTxs = txs.filter((t) => isInPeriod(t.date, prevPeriod));
  const yearTxs = txs.filter((t) => t.date <= period.end);

  const summary = summarize(monthTxs, accounts);
  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const comparison = compareMonths(monthTxs, prevTxs).slice(0, 8);
  const savings = savingsByAccount(yearTxs, accounts);
  const savingsMax = Math.max(1, ...savings.map((s) => Math.abs(s.totalCents)));
  const places = topPlaces(yearTxs, 5);

  const active = accounts.filter((a) => !a.archivedAt);
  const ends = months.map((m) => monthPeriod(m, startDay).end);
  const netWorthSeries = months.map((m, i) => ({
    label: monthAbbr(m),
    cents: active.reduce((sum, a) => {
      const balance = balances.get(a.id)?.balanceCents ?? a.initialBalanceCents;
      return sum + balanceSeriesFromCurrent(a.id, balance, txs, ends)[i]!;
    }, 0),
  }));
  const netWorth = netWorthSeries[netWorthSeries.length - 1]!.cents;

  // Catégorie suivie : celle de l'URL, sinon la plus grosse dépense du mois
  const expenseCategories = categories.filter((c) => !c.isIncome && !c.archivedAt);
  const topCategoryId = expensesByCategory(monthTxs).find((c) => c.categoryId)?.categoryId ?? expenseCategories[0]?.id ?? null;
  const categoryId = expenseCategories.some((c) => c.id === params.categorie) ? params.categorie! : topCategoryId;
  const series = categoryId
    ? categorySeries(txs, categoryId, months, startDay).map((m) => ({ label: monthAbbr(m.month), cents: m.cents }))
    : [];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader kicker="Tendances" title="Analyses" />
      <MonthSwitcher path="/analyses" month={month} current={current} params={{ categorie: params.categorie }} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <p className="text-sub font-semibold text-label-secondary">Taux d&apos;épargne</p>
          <p className="mt-1 text-stat-hero text-finances-text">
            {summary.savingsRate === null ? "-" : formatPercent(summary.savingsRate)}
          </p>
          <p className="text-foot text-label-secondary">
            {formatCents(summary.netCents, "always")} sur {formatCents(summary.incomeCents)} d&apos;entrées en {monthName(month)}
          </p>
        </Card>
        <Card className="lg:col-span-2">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sub font-semibold text-label-secondary">Patrimoine</p>
            <p className="text-stat">{formatCents(netWorth)}</p>
          </div>
          <BalanceArea data={netWorthSeries} height={110} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Par rapport au mois dernier" />
          {comparison.length === 0 ? (
            <EmptyState>Aucune dépense ce mois-ci ni le mois précédent.</EmptyState>
          ) : (
            <ul className="flex flex-col gap-2 text-body">
              {comparison.map((c) => {
                const cat = c.categoryId ? categoryById.get(c.categoryId) : undefined;
                const up = c.currentCents > c.previousCents;
                return (
                  <li key={c.categoryId ?? "none"} className="flex items-center gap-2">
                    <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: cat?.color ?? "var(--gray)" }} />
                    <span className="flex-1 truncate">{cat?.name ?? "Sans catégorie"}</span>
                    <span className="text-foot text-label-secondary tabular-nums">
                      {formatCents(c.previousCents)} → {formatCents(c.currentCents)}
                    </span>
                    {/* une hausse de dépense n'est pas une erreur : pas de rouge (réservé aux erreurs) */}
                    <span className={clsx("w-16 text-right text-foot font-semibold tabular-nums", up ? "text-label" : "text-finances-text")}>
                      {c.change === null ? "nouveau" : `${up ? "+" : ""}${formatPercent(c.change, 0)}`}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader title="Épargne cumulée par compte · 12 mois" />
          {savings.length === 0 ? (
            <EmptyState>Aucun compte d&apos;épargne.</EmptyState>
          ) : (
            <ul className="flex flex-col gap-3 text-body">
              {savings.map((s) => (
                <li key={s.account.id}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 font-semibold">
                      <span className="size-2 rounded-full" style={{ backgroundColor: s.account.color }} />
                      {s.account.name}
                    </span>
                    <span className="font-semibold tabular-nums">{formatCents(s.totalCents, "always")}</span>
                  </div>
                  <div className="mt-1.5 flex h-1.5 overflow-hidden rounded-full bg-fill-primary">
                    <div style={{ width: `${(Math.max(0, s.transfersCents) / savingsMax) * 100}%`, backgroundColor: s.account.color }} />
                    <div className="bg-finances" style={{ width: `${(Math.max(0, s.interestCents) / savingsMax) * 100}%` }} />
                  </div>
                  <p className="mt-1 text-foot text-label-secondary">
                    Virements nets {formatCents(s.transfersCents, "always")} · intérêts {formatCents(s.interestCents)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-heading">Évolution d&apos;une catégorie · 12 mois</h2>
            <CategoryPicker categories={expenseCategories.map((c) => ({ id: c.id, name: c.name }))} value={categoryId} />
          </div>
          {series.length > 0 ? <MonthlyBars data={series} /> : <EmptyState>Aucune catégorie de dépense.</EmptyState>}
        </Card>
        <Card>
          <CardHeader title="Classement des lieux · 12 mois" />
          {places.length === 0 ? (
            <EmptyState>Aucune dépense.</EmptyState>
          ) : (
            <ol className="flex flex-col gap-2.5">
              {places.map((p, i) => (
                <li key={p.place} className="flex items-center gap-3 text-body">
                  <span className="w-4 text-foot text-label-secondary">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate">{p.place}</p>
                    <p className="text-foot text-label-secondary">
                      {p.count} passage{p.count > 1 ? "s" : ""}
                    </p>
                    <div className="mt-1 h-1.5 rounded-full bg-finances" style={{ width: `${(p.cents / places[0]!.cents) * 100}%` }} />
                  </div>
                  <span className="font-semibold tabular-nums">{formatCents(p.cents)}</span>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>
    </div>
  );
}
