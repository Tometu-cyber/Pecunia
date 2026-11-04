import { Plus, Upload } from "lucide-react";
import { getAccounts, getProfile, getTransactions } from "@/lib/data/queries";
import { resolveMonth } from "@/lib/data/views";
import { monthPeriod } from "@/lib/domain/dates";
import { MonthSwitcher } from "@/components/app/filters";
import { GlassButton } from "@/components/ui/glass-button";
import { PageHeader } from "@/components/ui/primitives";
import { TransactionsView } from "./transactions-view";

export const metadata = { title: "Transactions" };

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const profile = await getProfile();
  const { month, current } = resolveMonth(params.mois, profile.monthStartDay);
  const period = monthPeriod(month, profile.monthStartDay);
  const [accounts, txs] = await Promise.all([getAccounts(), getTransactions({ from: period.start, to: period.end })]);
  const initialAccount = accounts.some((a) => a.id === params.compte) ? params.compte! : null;

  const importHref = initialAccount ? `/import?compte=${initialAccount}` : "/import";
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        kicker="Historique"
        title="Transactions"
        actions={
          <>
            <GlassButton size="small" icon={Upload} href={importHref}>
              Importer un CSV
            </GlassButton>
            <GlassButton size="small" icon={Plus} prominent href="/saisie">
              Nouvelle saisie
            </GlassButton>
          </>
        }
        mobileActions={<GlassButton icon={Upload} label="Importer un CSV" href={importHref} />}
      />
      <MonthSwitcher path="/transactions" month={month} current={current} params={{ compte: initialAccount }} />
      <TransactionsView key={month} transactions={txs} initialAccount={initialAccount} />
    </div>
  );
}
