import { getProfile } from "@/lib/data/queries";
import { PageHeader } from "@/components/ui/primitives";
import { SettingsForm } from "./settings-form";

export const metadata = { title: "Paramètres" };

export default async function SettingsPage() {
  const profile = await getProfile();
  return (
    <div className="flex flex-col gap-4">
      <PageHeader kicker="Gestion" title="Paramètres" />
      <SettingsForm profile={profile} />
    </div>
  );
}
