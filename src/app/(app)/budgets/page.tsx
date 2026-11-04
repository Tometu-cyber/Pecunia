import Link from "next/link";
import { Plus } from "lucide-react";
import { getAccounts, getBudgets, getCategories } from "@/lib/data/queries";
import { getBudgetOverview, resolveMonth, withStartDay } from "@/lib/data/views";
import { budgetAccountIds } from "@/lib/domain/budgets";
import { formatCents, formatPercent } from "@/lib/domain/money";
import { shortAccountName } from "@/lib/domain/accounts";
import { MonthSwitcher } from "@/components/app/filters";
import { IconBadge } from "@/components/ui/icons";
import { Banner, Card, EmptyState, PageHeader, ProgressBar, statusText } from "@/components/ui/primitives";
import { BudgetEditButton, BudgetSettings } from "./budget-controls";

export const metadata = { title: "Budgets" };

export default async function BudgetsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  // profil, comptes, catégories, budgets et transactions du mois en même temps
  // (jour de début de mois deviné puis vérifié)
  const {
    profile,
    data: [accounts, categories, budgets, overview],
  } = await withStartDay((day) =>
    Promise.all([getAccounts(), getCategories(), getBudgets(), getBudgetOverview(resolveMonth(params.mois, day).month, undefined, day)]),
  );
  const { month, current } = resolveMonth(params.mois, profile.monthStartDay);
  const accountById = new Map(accounts.map((a) => [a.id, a]));
  const unbudgeted = categories.filter((c) => !c.archivedAt && !c.isIncome && !budgets.some((b) => b.categoryId === c.id));

  return (
    <div className="flex flex-col gap-4">
      <PageHeader kicker="Mois budgétaire" title="Budgets" />
      <MonthSwitcher path="/budgets" month={month} current={current} />

      {overview.alerts.length > 0 && (
        <Banner tone="warn" action={<Link href="/" className="font-semibold text-finances-text">Tableau de bord</Link>}>
          {overview.alerts.length} catégorie{overview.alerts.length > 1 ? "s" : ""} au-delà de 80 % du budget.
        </Banner>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <p className="text-sub font-semibold text-label-secondary">Reste à dépenser</p>
          <p className={`text-stat-hero font-bold tabular-nums ${overview.remainingCents < 0 ? "text-danger-text" : "text-finances-text"}`}>
            {formatCents(overview.remainingCents)}
          </p>
          <ProgressBar ratio={overview.ratio} status={overview.status} className="mt-3" />
          <p className="mt-1.5 text-foot text-label-secondary">
            {formatCents(overview.totalSpentCents)} sur {formatCents(overview.totalBudgetCents)} · {formatPercent(overview.ratio, 0)} -
            dépenses réelles uniquement
          </p>
        </Card>
        <Card>
          <BudgetSettings
            carryOver={profile.budgetCarryOver}
            carryOverCents={overview.carryOverCents}
            referenceIncomeCents={profile.referenceIncomeCents}
          />
        </Card>
      </div>

      <Card className="!p-0">
        {overview.lines.length === 0 ? (
          <div className="p-4">
            <EmptyState>Aucun budget défini. Choisis une catégorie ci-dessous pour en créer un.</EmptyState>
          </div>
        ) : (
          <ul className="pt-list-inset">
            {overview.lines.map((l) => {
              const accountNames = [...budgetAccountIds(l.category, accounts)]
                .map((id) => accountById.get(id))
                .filter((a) => a && !a.archivedAt)
                .map((a) => shortAccountName(a!));
              return (
                <li key={l.category.id}>
                  <BudgetEditButton
                    categoryId={l.category.id}
                    categoryName={l.category.name}
                    mode={l.budget.mode}
                    amountCents={l.budget.mode === "percent" ? Math.round((l.budget.percent ?? 0) * 100) : l.budget.amountCents}
                    referenceIncomeCents={profile.referenceIncomeCents}
                  >
                    <div className="flex items-center gap-3">
                      <IconBadge icon={l.category.icon} color={l.category.color} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-body">{l.category.name}</p>
                          {/* budget à 0 € : ratio infini, « Dépassé » seul ; vrai budget dépassé : « Dépassé 462 % ». « Dépassé » reste en petit */}
                          <p className={`flex shrink-0 items-baseline gap-1.5 tabular-nums ${Number.isFinite(l.ratio) ? statusText[l.status] : "text-danger-text"}`}>
                            {(!Number.isFinite(l.ratio) || l.remainingCents < 0) && <span className="text-foot font-medium">Dépassé</span>}
                            {Number.isFinite(l.ratio) && <span className="text-body font-semibold">{formatPercent(Math.min(l.ratio, 9.99), 0)}</span>}
                          </p>
                        </div>
                        <p className="text-sub text-label-secondary">
                          {accountNames.join(" + ")}
                          {l.budget.mode === "percent" && ` · ${String(l.budget.percent).replace(".", ",")} % du revenu`}
                        </p>
                        <ProgressBar ratio={l.ratio} status={l.status} className="mt-2" />
                        <div className="mt-1 flex justify-between text-foot">
                          <span className={l.remainingCents < 0 ? "font-semibold text-danger-text" : "text-label-secondary"}>
                            {l.remainingCents < 0 ? `Dépassé de ${formatCents(-l.remainingCents)}` : `Reste ${formatCents(l.remainingCents)}`}
                          </span>
                          <span className="text-label-secondary tabular-nums">
                            {formatCents(l.spentCents)} / {formatCents(l.budgetCents)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </BudgetEditButton>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {unbudgeted.length > 0 && (
        <Card>
          <h2 className="mb-3 text-heading">Catégories sans budget</h2>
          <ul className="flex flex-wrap gap-2">
            {unbudgeted.map((c) => (
              <li key={c.id}>
                <BudgetEditButton
                  categoryId={c.id}
                  categoryName={c.name}
                  mode="fixed"
                  amountCents={null}
                  referenceIncomeCents={profile.referenceIncomeCents}
                  compact
                >
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full" style={{ backgroundColor: c.color }} />
                    {c.name} <Plus size={15} strokeWidth={2.2} className="text-finances-text" aria-hidden />
                  </span>
                </BudgetEditButton>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
