/**
 * Accueil (tableau de bord) avec le design system, d'après les écrans de référence
 * design-system/components/FinancesMobile et FinancesDesktop. Ne fait que de l'affichage :
 * toutes les valeurs sont calculées par src/app/(app)/page.tsx.
 */
import type { ReactNode } from "react";
import { ArrowLeftRight, Calendar, ChevronLeft, ChevronRight, Coins, CreditCard, Euro, TrendingUp, TriangleAlert, type LucideIcon } from "lucide-react";
import type { BudgetLine, BudgetOverview, BudgetStatus } from "@/lib/domain/budgets";
import type { MonthSummary, CategoryAmount, PlaceAmount } from "@/lib/domain/stats";
import type { Account, Category } from "@/lib/domain/types";
import { ACCOUNT_TYPE_LABELS } from "@/lib/domain/defaults";
import { formatCents, formatPercent } from "@/lib/domain/money";
import { shortDate } from "@/lib/domain/dates";
import { formatList } from "@/lib/domain/text";
import { Sparkline } from "@/components/charts/sparkline";
import { iconFor } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Glyph, PECUNIA_APP } from "@/components/ui/ds";
import { List, ListRow } from "@/components/ui/list";
import { DashboardHeader, AccountFilter, type FilterOption } from "./dashboard-header";
import { MonthlyBarsCard } from "./monthly-bars-card";

export interface UpcomingItem {
  key: string;
  date: string;
  label: string;
  cents: number;
  transfer: boolean;
  meta: string;
}

export interface AccountRow {
  account: Account;
  balance: number;
  series: number[];
}

export interface DashboardViewProps {
  monthLabel: string;
  prevHref: string;
  nextHref: string | null;
  accountOptions: FilterOption[];
  accountId: string | null;
  summary: MonthSummary;
  budgets: BudgetOverview;
  categoryById: Map<string, Category>;
  breakdown: CategoryAmount[];
  places: PlaceAmount[];
  bars: { label: string; cents: number }[];
  accountRows: AccountRow[];
  netWorth: number;
  netWorthYearAgo: number;
  inBudgetNames: string[];
  upcoming: UpcomingItem[];
  overs: string[];
  warns: BudgetLine[];
}

const NEUTRAL = "var(--gray)";
/** Montant arrondi à l'euro (« 1 546 € ») pour les petits chiffres de la carte du solde */
const roundEuros = (cents: number, sign: "auto" | "always" = "auto") => formatCents(cents, sign).replace(/,\d\d/, "");

/* ——— Petites briques propres à l'écran ——— */

function Empty({ children, action }: { children: ReactNode; action?: { label: string; href: string } }) {
  return (
    <div className="flex flex-col items-start gap-1 rounded-md bg-fill-tertiary p-4 text-[15px] leading-5 tracking-[-0.23px] text-label-secondary">
      <p>{children}</p>
      {action && (
        <Button variant="plain" size="small" href={action.href} className="-ml-2">
          {action.label}
        </Button>
      )}
    </div>
  );
}

/** Jauge d'un budget, à la couleur de son seuil (vert, orange à 80 %, rouge à 100 %). */
function Gauge({ ratio, status, label, className }: { ratio: number; status: BudgetStatus; label: string; className?: string }) {
  const used = Math.max(0, Math.min(1, Number.isFinite(ratio) ? ratio : 1));
  return (
    <div
      className={`pt-tile-bar !mt-0 ${status === "warn" ? "is-warn" : status === "over" ? "is-over" : ""} ${className ?? ""}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(used * 100)}
    >
      <span style={{ width: `${Math.max(1.5, used * 100)}%` }} />
    </div>
  );
}

function Total({ value, note, app, muted }: { value: string; note?: ReactNode; app?: boolean; muted?: boolean }) {
  return (
    <div className="-mt-0.5 mb-2.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
      <b className={`font-rounded text-[28px] leading-[34px] font-bold tabular-nums ${app ? "text-finances-text" : "text-label"}`}>{value}</b>
      {note && <span className={`text-[13px] leading-[18px] ${muted ? "text-label-secondary" : "font-semibold text-finances-text"}`}>{note}</span>}
    </div>
  );
}

/* ——— Cartes ——— */

function AccountsCard({ rows, netWorth, netWorthYearAgo, sparklines }: { rows: AccountRow[]; netWorth: number; netWorthYearAgo: number; sparklines: boolean }) {
  const delta = netWorth - netWorthYearAgo;
  return (
    <Card title="Mes comptes" app={PECUNIA_APP} action={{ label: "Gérer", href: "/comptes" }}>
      <Total value={formatCents(netWorth)} note={`${roundEuros(delta, "always")} en 12 mois`} muted={delta < 0} />
      <List plain>
        {rows.map(({ account, balance, series }) => (
          <ListRow
            key={account.id}
            app={PECUNIA_APP}
            icon={iconFor(account.icon)}
            title={account.name}
            subtitle={`${ACCOUNT_TYPE_LABELS[account.type]}${account.inBudget && account.type !== "savings" ? " · dans le budget" : ""}`}
            href={`/comptes/${account.id}`}
            chevron={false}
            tone="strong"
            value={
              <span className="inline-flex items-center gap-3.5">
                {sparklines && <Sparkline values={series} color={account.color} width={90} height={26} />}
                {formatCents(balance)}
              </span>
            }
          />
        ))}
      </List>
    </Card>
  );
}

function BudgetCard({ budgets, summary, accountId, inBudgetNames }: { budgets: BudgetOverview; summary: MonthSummary; accountId: string | null; inBudgetNames: string[] }) {
  return (
    <Card title="Budget global" app={PECUNIA_APP} action={{ label: "Budgets", href: "/budgets" }}>
      {budgets.lines.length === 0 ? (
        <Empty action={{ label: "Définir un budget", href: "/budgets" }}>Aucun budget défini</Empty>
      ) : (
        <>
          <div className="-mt-0.5 mb-2.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <b className={`font-rounded text-[28px] leading-[34px] font-bold tabular-nums ${budgets.remainingCents < 0 ? "text-danger-text" : "text-finances-text"}`}>
              {formatCents(budgets.remainingCents)}
            </b>
            <span className="text-[13px] leading-[18px] text-label-secondary">reste à dépenser</span>
          </div>
          <Gauge ratio={budgets.ratio} status={budgets.status} label="Budget utilisé" />
          <div className="mt-1.5 flex justify-between gap-2 text-[13px] leading-[18px] text-label-secondary">
            <span>
              {formatCents(budgets.totalSpentCents)} sur {formatCents(budgets.totalBudgetCents)} · {formatPercent(budgets.ratio, 0)}
            </span>
            <span>Seuil d&apos;alerte 80 %</span>
          </div>
          <p className="mt-3.5 flex items-start gap-2 rounded-[12px] bg-fill-tertiary px-3 py-2.5 text-[13px] leading-[18px] text-label-secondary">
            <Glyph icon={ArrowLeftRight} size={15} strokeWidth={2} className="mt-px" />
            <span>
              Calculé sur {inBudgetNames.join(" + ") || "aucun compte"}. Les virements
              {summary.savingsTransfersCents > 0 && accountId === null ? ` (${formatCents(summary.savingsTransfersCents)} vers l'épargne ce mois-ci)` : ""} sont
              exclus.
            </span>
          </p>
        </>
      )}
    </Card>
  );
}

function upcomingIcon(u: UpcomingItem): LucideIcon {
  if (u.transfer) return ArrowLeftRight;
  return u.cents > 0 ? Euro : Calendar;
}

function UpcomingList({ items, accountId, header }: { items: UpcomingItem[]; accountId: string | null; header: string }) {
  if (items.length === 0) {
    return (
      <div className="pt-list-wrap">
        <h2 className="pt-list-header">{header}</h2>
        <Empty action={{ label: "Ajouter une récurrence", href: "/recurrences" }}>
          {accountId ? "Rien de prévu sur ce compte" : "Rien de prévu dans les 60 prochains jours"}
        </Empty>
      </div>
    );
  }
  return (
    <List header={header}>
      {items.map((u) => {
        // virement en vue « tous comptes » : montant brut, neutre
        const neutral = u.transfer && !accountId;
        return (
          <ListRow
            key={u.key}
            app={PECUNIA_APP}
            icon={upcomingIcon(u)}
            title={u.label}
            subtitle={`${shortDate(u.date)} · ${u.meta}`}
            value={formatCents(u.cents, neutral ? "never" : u.cents > 0 ? "always" : "auto")}
            tone={neutral ? "default" : u.cents > 0 ? "positive" : "negative"}
            href="/prevision"
          />
        );
      })}
    </List>
  );
}

function SplitCard({ breakdown, expenseCents, categoryById }: { breakdown: CategoryAmount[]; expenseCents: number; categoryById: Map<string, Category> }) {
  const rows = breakdown.map((b) => {
    const c = b.categoryId ? categoryById.get(b.categoryId) : undefined;
    return { key: b.categoryId ?? "none", name: c?.name ?? "Sans catégorie", color: c?.color ?? NEUTRAL, cents: b.cents, share: b.share };
  });
  return (
    <Card title="Répartition des dépenses" subtitle={rows.length ? `${formatCents(expenseCents)} ce mois-ci` : undefined} app={PECUNIA_APP}>
      {rows.length === 0 ? (
        <Empty>Aucune dépense sur ce compte - les virements ne comptent pas</Empty>
      ) : (
        <>
          <div className="mt-1 mb-3.5 flex h-3.5 gap-0.5 overflow-hidden rounded-[7px]" aria-hidden>
            {rows.map((r) => (
              <span key={r.key} style={{ flex: r.share, background: r.color }} />
            ))}
          </div>
          <ul className="flex flex-col gap-2">
            {rows.map((r) => (
              <li key={r.key} className="flex items-center gap-2.5 text-[17px] leading-[22px] tracking-[-0.43px]">
                <i className="size-2.5 shrink-0 rounded-full" style={{ background: r.color }} aria-hidden />
                <span className="min-w-0 flex-1 truncate">{r.name}</span>
                <span className="font-semibold tabular-nums">{formatCents(r.cents)}</span>
                <span className="w-12 text-right text-[15px] text-label-secondary tabular-nums">{Math.round(r.share * 100)} %</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}

function AlertsCard({ alerts }: { alerts: BudgetLine[] }) {
  return (
    <Card title="Alertes" app={PECUNIA_APP} action={{ label: "Budgets", href: "/budgets" }}>
      <ul className="flex flex-col gap-4">
        {alerts.map((l) => (
          <li key={l.category.id}>
            <div className="flex items-center justify-between gap-3 text-[17px] leading-[22px] tracking-[-0.43px]">
              <span className="flex min-w-0 items-center gap-2.5">
                <i className="size-2.5 shrink-0 rounded-full" style={{ background: l.category.color }} aria-hidden />
                <span className="truncate">{l.category.name}</span>
              </span>
              {/* budget à 0 € : « Dépassé » seul ; vrai budget dépassé : « Dépassé 462 % ». « Dépassé » reste en petit (13 px) */}
              <span className={`flex shrink-0 items-baseline gap-1.5 tabular-nums ${l.status === "over" || !Number.isFinite(l.ratio) ? "text-danger-text" : "text-label"}`}>
                {(!Number.isFinite(l.ratio) || l.remainingCents < 0) && <span className="text-[13px] leading-[18px] font-medium">Dépassé</span>}
                {Number.isFinite(l.ratio) && <span className="font-semibold">{formatPercent(l.ratio, 0)}</span>}
              </span>
            </div>
            <Gauge ratio={l.ratio} status={l.status} label={`Budget ${l.category.name} utilisé`} className="mt-2" />
            <p className="mt-1.5 text-[13px] leading-[18px] text-label-secondary">
              {formatCents(l.spentCents)} / {formatCents(l.budgetCents)} ·{" "}
              {l.remainingCents < 0 ? `Dépassé de ${formatCents(-l.remainingCents)}` : `Reste ${formatCents(l.remainingCents)}`}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function PlacesCard({ places }: { places: PlaceAmount[] }) {
  const top = places[0]?.cents || 1;
  return (
    <Card title="Top lieux" app={PECUNIA_APP} action={{ label: "Analyses", href: "/analyses" }}>
      <ol className="flex flex-col gap-3">
        {places.map((p, i) => (
          <li key={p.place} className="flex items-center gap-3 text-[17px] leading-[22px] tracking-[-0.43px]">
            <span className="w-4 text-[15px] text-label-secondary tabular-nums">{i + 1}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate">{p.place}</p>
              <div className="mt-1 h-1.5 rounded-full bg-finances" style={{ width: `${(p.cents / top) * 100}%` }} />
            </div>
            <span className="font-semibold tabular-nums">{formatCents(p.cents)}</span>
          </li>
        ))}
      </ol>
    </Card>
  );
}

function Kpi({ icon, label, value, sub, app }: { icon: LucideIcon; label: string; value: string; sub: string; app?: boolean }) {
  return (
    <Card app={PECUNIA_APP}>
      <div className="flex items-center gap-2 text-[13px] leading-[18px] font-semibold text-label-secondary">
        <span className="inline-flex size-[26px] items-center justify-center rounded-full bg-finances-bg text-finances-text">
          <Glyph icon={icon} size={15} strokeWidth={2} />
        </span>
        {label}
      </div>
      <div className={`mt-2.5 mb-0.5 font-rounded text-[28px] leading-[34px] font-bold tabular-nums ${app ? "text-finances-text" : ""}`}>{value}</div>
      <div className="text-[13px] leading-[18px] text-label-secondary">{sub}</div>
    </Card>
  );
}

/** Bandeau des budgets dépassés ou à 80 % (ordi), comme avant la refonte. */
function AlertsNote({ overs, warns }: { overs: string[]; warns: BudgetLine[] }) {
  return (
    <div role="status" className="flex items-center gap-3 rounded-lg bg-bg-grouped-secondary px-4 py-3 text-[13px] leading-[18px] shadow-card">
      <Glyph icon={TriangleAlert} size={18} className="text-warning" />
      <p className="flex-1">
        {overs.length > 0 && `${formatList(overs)} au-dessus du budget. `}
        {warns.length > 0 && `${formatList(warns.map((w) => `${w.category.name} à ${formatPercent(w.ratio, 0)}`))} - seuil de 80 % franchi.`}
      </p>
      <Button variant="tinted" size="small" app={PECUNIA_APP} href="/budgets">
        Voir les budgets
      </Button>
    </div>
  );
}

/* ——— Écran ——— */

export function DashboardView(p: DashboardViewProps) {
  const { summary } = p;
  const accountValue = p.accountId ?? "all";
  const hasAlerts = p.budgets.alerts.length > 0;
  const netApp = summary.netCents >= 0;
  return (
    // ordi : en-tête et contenu partagent la même largeur maximum (content-max + marges), centrés à droite de la barre latérale
    <div className="md:mx-auto md:max-w-[calc(var(--content-max)+44px)]">
      <DashboardHeader
        title="Tableau de bord"
        monthLabel={p.monthLabel}
        prevHref={p.prevHref}
        nextHref={p.nextHref}
        accountOptions={p.accountOptions}
        accountValue={accountValue}
      />

      {/* ——— Mobile ——— */}
      <div className="flex flex-col gap-3.5 px-4 md:hidden">
        <div className="flex items-center gap-2">
          <Button variant="gray" size="small" icon={ChevronLeft} href={p.prevHref} aria-label="Mois précédent" className="size-9 !px-0" />
          <strong className="min-w-0 text-[20px] leading-[25px] font-semibold tracking-[-0.45px]">{p.monthLabel}</strong>
          <Button
            variant="gray"
            size="small"
            icon={ChevronRight}
            href={p.nextHref ?? undefined}
            disabled={!p.nextHref}
            aria-label="Mois suivant"
            className="size-9 !px-0"
          />
        </div>
        <AccountFilter options={p.accountOptions} value={accountValue} full />

        <Card app={PECUNIA_APP}>
          <div className="text-[15px] leading-5 font-semibold text-label-secondary">Solde du mois</div>
          <p className={`mt-0.5 font-rounded text-[44px] leading-[50px] font-bold tracking-[-0.5px] tabular-nums ${netApp ? "text-finances-text" : "text-label"}`}>
            {formatCents(summary.netCents, "always")}
          </p>
          <div className="mt-3.5 grid grid-cols-3 border-t-[0.5px] border-separator pt-3">
            {[
              { label: "Entrées", value: roundEuros(summary.incomeCents) },
              { label: "Sorties", value: roundEuros(summary.expenseCents) },
              { label: "Épargné", value: roundEuros(summary.savedCents), app: true },
            ].map((t) => (
              <div key={t.label}>
                <span className="block text-[13px] leading-[18px] text-label-secondary">{t.label}</span>
                <b className={`font-rounded text-[20px] leading-[25px] font-semibold tabular-nums ${t.app ? "text-finances-text" : "text-label"}`}>{t.value}</b>
              </div>
            ))}
          </div>
        </Card>

        <AccountsCard rows={p.accountRows} netWorth={p.netWorth} netWorthYearAgo={p.netWorthYearAgo} sparklines={false} />
        <BudgetCard budgets={p.budgets} summary={summary} accountId={p.accountId} inBudgetNames={p.inBudgetNames} />
        <UpcomingList items={p.upcoming} accountId={p.accountId} header="À venir" />
        <SplitCard breakdown={p.breakdown} expenseCents={summary.expenseCents} categoryById={p.categoryById} />
        <MonthlyBarsCard data={p.bars} defaultDepth="6" />
        {hasAlerts && <AlertsCard alerts={p.budgets.alerts} />}
        {p.places.length > 0 && <PlacesCard places={p.places} />}
      </div>

      {/* ——— Ordinateur ——— */}
      <div className="flex flex-col gap-5 pt-1 pr-6 pb-7 pl-5 max-md:hidden">
        {hasAlerts && <AlertsNote overs={p.overs} warns={p.warns} />}
        <div className="grid grid-cols-4 gap-4">
          <Kpi
            icon={Euro}
            label="Entrées"
            value={formatCents(summary.incomeCents)}
            sub={summary.interestCents ? `dont ${formatCents(summary.interestCents)} d'intérêts` : "Revenus du mois"}
          />
          <Kpi icon={CreditCard} label="Sorties" value={formatCents(summary.expenseCents)} sub="Hors virements internes" />
          <Kpi
            icon={TrendingUp}
            label="Solde du mois"
            value={formatCents(summary.netCents, "always")}
            sub={summary.savingsRate === null ? "Aucune entrée ce mois-ci" : `Taux d'épargne ${formatPercent(summary.savingsRate)}`}
            app={netApp}
          />
          <Kpi icon={Coins} label="Épargné ce mois-ci" value={formatCents(summary.savedCents)} sub="Virements vers l'épargne + intérêts" />
        </div>
        <div className="grid grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] items-start gap-5">
          <div className="flex min-w-0 flex-col gap-5">
            <AccountsCard rows={p.accountRows} netWorth={p.netWorth} netWorthYearAgo={p.netWorthYearAgo} sparklines />
            <MonthlyBarsCard data={p.bars} />
            {p.places.length > 0 && <PlacesCard places={p.places} />}
          </div>
          <div className="flex min-w-0 flex-col gap-5">
            <BudgetCard budgets={p.budgets} summary={summary} accountId={p.accountId} inBudgetNames={p.inBudgetNames} />
            {hasAlerts && <AlertsCard alerts={p.budgets.alerts} />}
            <UpcomingList items={p.upcoming} accountId={p.accountId} header="À venir · 60 prochains jours" />
            <SplitCard breakdown={p.breakdown} expenseCents={summary.expenseCents} categoryById={p.categoryById} />
          </div>
        </div>
      </div>
    </div>
  );
}
