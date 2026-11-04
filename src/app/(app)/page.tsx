import { getAppData, getForecastDecisions, getProfile, getTransactions } from "@/lib/data/queries";
import { getBudgetOverview, resolveMonth, withParams } from "@/lib/data/views";
import { addMonths, isInPeriod, lastMonths, monthAbbr, monthKeyOf, monthLabel, monthPeriod, todayIso } from "@/lib/domain/dates";
import { recurrenceKey } from "@/lib/domain/forecast";
import { buildOccurrences, signedRecurrenceCents } from "@/lib/domain/recurrences";
import { shortAccountName } from "@/lib/domain/accounts";
import {
  balanceSeriesFromCurrent,
  expensesByCategory,
  filterByAccount,
  monthlyExpenses,
  summarize,
  topPlaces,
} from "@/lib/domain/stats";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata = { title: "Tableau de bord" };

export default async function DashboardPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  // Le profil seul d'abord (jour de début de mois), puis tout le reste en parallèle
  const profile = await getProfile();
  const startDay = profile.monthStartDay;
  const { month, current } = resolveMonth(params.mois, startDay);
  const months = lastMonths(month, 12);
  const period = monthPeriod(month, startDay);
  const windowStart = monthPeriod(months[0]!, startDay).start;
  const today = todayIso();
  const [{ accounts, categories, balances, recurrences, forecastItems }, txs, decisions] = await Promise.all([
    getAppData(),
    // Depuis le début de la fenêtre de 12 mois jusqu'à aujourd'hui (sparklines reconstruites à rebours)
    getTransactions({ from: windowStart }),
    getForecastDecisions(monthKeyOf(today, startDay)),
  ]);
  const activeAccounts = accounts.filter((a) => !a.archivedAt);
  const accountId = activeAccounts.some((a) => a.id === params.compte) ? params.compte! : null;
  const monthTxs = txs.filter((t) => isInPeriod(t.date, period));
  const scoped = filterByAccount(monthTxs, accountId);

  const summary = summarize(monthTxs, accounts, accountId);
  const budgets = await getBudgetOverview(month, monthTxs);
  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const breakdown = expensesByCategory(scoped);
  const places = topPlaces(scoped);
  const bars = monthlyExpenses(filterByAccount(txs, accountId), months, startDay).map((m) => ({
    label: monthAbbr(m.month),
    cents: m.cents,
  }));

  const monthEnds = months.map((m) => monthPeriod(m, startDay).end);
  const accountRows = activeAccounts.map((a) => {
    const balance = balances.get(a.id)?.balanceCents ?? a.initialBalanceCents;
    return { account: a, balance, series: balanceSeriesFromCurrent(a.id, balance, txs, monthEnds) };
  });
  const netWorth = accountRows.reduce((s, r) => s + r.balance, 0);
  const netWorthYearAgo = accountRows.reduce(
    (s, r) => s + balanceSeriesFromCurrent(r.account.id, r.balance, txs, [monthPeriod(addMonths(month, -12), startDay).end])[0]!,
    0,
  );
  const inBudgetNames = activeAccounts.filter((a) => a.inBudget).map((a) => a.name);

  // À venir : 5 prochaines échéances (récurrences non réalisées + dépenses prévues)
  const horizonEnd = new Date(Date.parse(`${today}T00:00:00Z`) + 60 * 86_400_000).toISOString().slice(0, 10);
  const accountById = new Map(accounts.map((a) => [a.id, a]));
  // décisions du prévisionnel : échéances refusées masquées, montants et dates modifiés repris
  const decisionByKey = new Map(decisions.map((d) => [d.sourceKey, d]));
  const upcoming = [
    ...buildOccurrences(recurrences, txs, today, horizonEnd)
      .filter((o) => o.status === "planned" && decisionByKey.get(recurrenceKey(o.recurrence.id, o.date))?.status !== "rejected")
      .filter((o) => !accountId || o.recurrence.accountId === accountId || o.recurrence.toAccountId === accountId)
      .map((o) => {
        const d = decisionByKey.get(recurrenceKey(o.recurrence.id, o.date));
        const r = d?.amountCents ? { ...o.recurrence, amountCents: d.amountCents } : o.recurrence;
        const incoming = r.type === "transfer" && accountId !== null && r.toAccountId === accountId;
        return {
          key: o.key,
          date: d?.date ?? o.date,
          label: r.label,
          cents: r.type === "transfer" ? (incoming ? r.amountCents : -r.amountCents) : signedRecurrenceCents(r),
          transfer: r.type === "transfer",
          color: r.type === "transfer" ? "#98a1b0" : (categoryById.get(r.categoryId ?? "")?.color ?? "#98a1b0"),
          meta: [r.categoryId ? categoryById.get(r.categoryId)?.name : "Virement", accountById.get(r.accountId) && shortAccountName(accountById.get(r.accountId)!)]
            .filter(Boolean)
            .join(" · "),
        };
      }),
    ...forecastItems
      .filter(
        (f) =>
          f.status === "planned" && f.date >= today && f.date <= horizonEnd && (!accountId || f.accountId === accountId || f.toAccountId === accountId),
      )
      .map((f) => {
        const from = accountById.get(f.accountId);
        const to = f.toAccountId ? accountById.get(f.toAccountId) : undefined;
        return {
          key: f.id,
          date: f.date,
          label: f.label,
          // virement vu depuis le compte filtré : crédit si c'est le compte de destination
          cents: f.toAccountId && accountId === f.toAccountId ? -f.amountCents : f.amountCents,
          transfer: !!f.toAccountId,
          color: f.toAccountId ? "#98a1b0" : "#e9a23b",
          meta: f.toAccountId
            ? ["Virement prévu", from && to && `${shortAccountName(from)} → ${shortAccountName(to)}`].filter(Boolean).join(" · ")
            : ["Prévue", from && shortAccountName(from)].filter(Boolean).join(" · "),
        };
      }),
  ]
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
    .slice(0, 5);

  const overs = budgets.alerts.filter((l) => l.status === "over").map((l) => l.category.name);
  const warns = budgets.alerts.filter((l) => l.status === "warn");

  // Liens de navigation (mois, filtre de compte) : même comportement que MonthSwitcher et AccountChips
  const next = addMonths(month, 1);
  const prevHref = withParams("/", { compte: accountId, mois: addMonths(month, -1) });
  const nextHref = next <= current ? withParams("/", { compte: accountId, mois: next === current ? null : next }) : null;
  const accountOptions = [
    { id: "all", label: "Tous", href: withParams("/", { mois: params.mois, compte: null }) },
    ...activeAccounts.map((a) => ({ id: a.id, label: shortAccountName(a), href: withParams("/", { mois: params.mois, compte: a.id }) })),
  ];

  return (
    <DashboardView
      monthLabel={monthLabel(month)}
      prevHref={prevHref}
      nextHref={nextHref}
      accountOptions={accountOptions}
      accountId={accountId}
      summary={summary}
      budgets={budgets}
      categoryById={categoryById}
      breakdown={breakdown}
      places={places}
      bars={bars}
      accountRows={accountRows}
      netWorth={netWorth}
      netWorthYearAgo={netWorthYearAgo}
      inBudgetNames={inBudgetNames}
      upcoming={upcoming}
      overs={overs}
      warns={warns}
    />
  );
}
