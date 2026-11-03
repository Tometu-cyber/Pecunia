import Link from "next/link";
import { buttonClass } from "@/components/ui/primitives";
import { AuthShell } from "../../auth-shell";

export default function InvalidLinkPage() {
  return (
    <AuthShell title="Ce lien n'est plus valide" subtitle="Il a expiré ou a déjà été utilisé.">
      <div className="flex flex-col gap-3">
        <Link href="/mot-de-passe-oublie" className={buttonClass("primary", "w-full")}>
          Redemander un lien
        </Link>
        <Link href="/login" className="inline-flex min-h-11 items-center justify-center text-body font-semibold text-finances-text hover:underline md:min-h-7">
          ← Retour à la connexion
        </Link>
      </div>
    </AuthShell>
  );
}
