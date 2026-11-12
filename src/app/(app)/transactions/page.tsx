import { Plus, Upload } from "lucide-react";
import { getAccounts, getTransactions } from "@/lib/data/queries";
import { resolveMonth, withStartDay } from "@/lib/data/views";
import { monthPeriod } from "@/lib/domain/dates";
import { MonthSwitcher } from "@/components/app/filters";
import { PageHeader } from "@/components/ui/primitives";
import { TransactionsView } from "./transactions-view";
import { GlassButton } from "@portail/ui";
import Link from "next/link";

export const metadata = { title: "Transactions" };

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  // comptes, transactions du mois et profil en même temps (jour de début de mois deviné puis vérifié)
  const {
    profile,
    data: [accounts, txs],
  } = await withStartDay((day) => {
    const period = monthPeriod(resolveMonth(params.mois, day).month, day);
    return Promise.all([getAccounts(), getTransactions({ from: period.start, to: period.end })]);
  });
  const { month, current } = resolveMonth(params.mois, profile.monthStartDay);
  const initialAccount = accounts.some((a) => a.id === params.compte) ? params.compte! : null;

  const importHref = initialAccount ? `/import?compte=${initialAccount}` : "/import";
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        kicker="Historique"
        title="Transactions"
        actions={
          <>
            <GlassButton size="small" icon={Upload} linkAs={Link} href={importHref}>
              Importer un CSV
            </GlassButton>
            <GlassButton size="small" icon={Plus} prominent linkAs={Link} href="/saisie">
              Nouvelle saisie
            </GlassButton>
          </>
        }
        mobileActions={<GlassButton icon={Upload} label="Importer un CSV" linkAs={Link} href={importHref} />}
      />
      <MonthSwitcher path="/transactions" month={month} current={current} params={{ compte: initialAccount }} />
      <TransactionsView key={month} transactions={txs} initialAccount={initialAccount} />
    </div>
  );
}
