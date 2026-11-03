import { PageHeader } from "@/components/ui/primitives";
import { EntrySession } from "./entry-session";

export const metadata = { title: "Saisie" };

export default function EntryPage() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader kicker="Session de saisie" title="Saisir" />
      <EntrySession />
    </div>
  );
}
