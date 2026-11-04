import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppData, getGoals, getProfile, getTransactions } from "@/lib/data/queries";
import { goalStatus } from "@/lib/domain/goals";
import { todayIso } from "@/lib/domain/dates";
import { resolveMonth } from "@/lib/data/views";
import { isInPeriod, lastMonths, monthAbbr, monthName, monthPeriod, numericDate } from "@/lib/domain/dates";
import { ACCOUNT_TYPE_LABELS } from "@/lib/domain/defaults";
import { formatCents } from "@/lib/domain/money";
import { balanceSeriesFromCurrent, groupByDay, signedTotal, summarize } from "@/lib/domain/stats";
import { shortAccountName } from "@/lib/domain/accounts";
import { BalanceArea } from "@/components/charts/charts";
import { Card, Chip, EmptyState, PageHeader, cardLinkClass } from "@/components/ui/primitives";
import { AccountSettings, AdjustBalanceButton } from "@/components/accounts/account-dialogs";
import { GoalCard } from "@/components/accounts/goals-section";
import { AccountTransactions } from "./account-transactions";

export default async function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getProfile();
  const startDay = profile.monthStartDay;
  const { current } = resolveMonth(undefined, startDay);
  const months = lastMonths(current, 12);
  const period = monthPeriod(current, startDay);
  const [{ accounts, balances, recurrences }, goals, txs] = await Promise.all([
    getAppData(),
    getGoals(),
    getTransactions({ accountId: id, from: monthPeriod(months[0]!, startDay).start }),
  ]);
  const account = accounts.find((a) => a.id === id);
  if (!account) notFound();
  const balance = balances.get(id)?.balanceCents ?? account.initialBalanceCents;
  const series = balanceSeriesFromCurrent(id, balance, txs, months.map((m) => monthPeriod(m, startDay).end));
  const monthTxs = txs.filter((t) => isInPeriod(t.date, period));
  const summary = summarize(monthTxs, accounts, id);
  const transfersNet = monthTxs.filter((t) => t.type === "transfer").reduce((s, t) => s + t.amountCents, 0);
  const active = accounts.filter((a) => !a.archivedAt);

  const stats = [
    { label: "Entrées", value: summary.incomeCents, cls: "text-finances-text" },
    { label: "Sorties", value: summary.expenseCents, cls: "" },
    { label: "Virements nets", value: transfersNet, cls: "", signed: true },
  ];

  const meta = `${ACCOUNT_TYPE_LABELS[account.type]} · ${account.inBudget ? "dans le budget" : "hors budget"} · solde initial ${formatCents(account.initialBalanceCents)} au ${numericDate(account.initialBalanceDate)}${account.archivedAt ? " · archivé" : ""}`;
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        back={{ href: "/comptes", label: "Comptes" }}
        title={account.name}
        subtitle={meta}
        center={
          active.length > 1 ? (
            <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
              {active.map((a) => (
                <Chip key={a.id} active={a.id === id} href={`/comptes/${a.id}`}>
                  {shortAccountName(a)}
                </Chip>
              ))}
            </div>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sub font-semibold text-label-secondary">Solde actuel</p>
              <p className="text-stat-hero font-bold tabular-nums">{formatCents(balance)}</p>
            </div>
            <AdjustBalanceButton account={account} balanceCents={balance} />
          </div>
          <div className="mt-3">
            <BalanceArea data={months.map((m, i) => ({ label: monthAbbr(m), cents: series[i]! }))} />
          </div>
          <div className="mt-3 grid grid-cols-3 border-t border-separator pt-3 lg:hidden">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-foot text-label-secondary">{s.label}</p>
                <p className={`font-rounded text-[20px] leading-[25px] font-semibold tabular-nums ${s.cls}`}>{formatCents(s.value, s.signed ? "always" : "auto")}</p>
              </div>
            ))}
          </div>
        </Card>
        <div className="flex flex-col gap-4">
          <Card className="hidden lg:block">
            <h2 className="mb-2 text-heading">{monthName(current)}</h2>
            <dl className="flex flex-col gap-1.5 text-body">
              {stats.map((s) => (
                <div key={s.label} className="flex justify-between">
                  <dt className="text-label-secondary">{s.label}</dt>
                  <dd className={`font-semibold tabular-nums ${s.cls}`}>{formatCents(s.value, s.signed ? "always" : "auto")}</dd>
                </div>
              ))}
            </dl>
          </Card>
          {goals
            .filter((g) => g.accountId === account.id)
            .map((g) => (
              <GoalCard key={g.id} status={goalStatus(g, balance, recurrences, todayIso())} />
            ))}
          {!account.archivedAt && (
            <Card>
              <AccountSettings account={account} balanceCents={balance} />
            </Card>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h2 className="text-heading">Transactions du compte</h2>
        <div className="flex items-center gap-3">
          <span className="whitespace-nowrap text-foot text-label-secondary">{monthTxs.length} ce mois-ci</span>
          {!account.archivedAt && (
            <Link href={`/import?compte=${account.id}`} className={cardLinkClass}>
              Importer un CSV
            </Link>
          )}
        </div>
      </div>
      {txs.length === 0 ? (
        <EmptyState>Aucune transaction sur les 12 derniers mois.</EmptyState>
      ) : (
        <AccountTransactions
          groups={groupByDay(txs.slice(0, 100)).map((g) => ({ ...g, total: signedTotal(g.items, id) }))}
        />
      )}
    </div>
  );
}
