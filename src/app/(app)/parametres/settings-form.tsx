"use client";

import { Download, LogOut, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import { signOut, updateProfile } from "@/lib/data/actions";
import { deleteMyAccount } from "@/lib/data/planning-actions";
import type { Profile } from "@/lib/domain/types";
import { Button, Card, FieldError, Input, Label, Segmented, Select, buttonClass } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/overlay";
import { useToast } from "@/components/ui/overlay";
import { Spinner } from "@/components/ui/spinner";
import { SubmitButton } from "@/components/ui/submit-button";
import { APP_NAME, copyrightLine, versionLabel } from "@/lib/version";

function Row({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    // ligne de réglage façon Réglages d'iOS : libellé à gauche, contrôle à droite
    <div className="flex min-h-11 flex-wrap items-center justify-between gap-x-3 gap-y-1.5 py-2.5 md:min-h-9 md:py-2">
      <div className="min-w-0">
        <p className="text-body">{label}</p>
        {hint && <p className="text-sub text-label-secondary">{hint}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

export function SettingsForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  function save(patch: Parameters<typeof updateProfile>[0], message = "Préférence enregistrée") {
    startTransition(async () => {
      const r = await updateProfile(patch);
      startTransition(() => {
        toast(r.ok ? message : r.error, r.ok ? "success" : "error");
      });
    });
  }

  // Réponse immédiate : le thème et le contrôle changent tout de suite (fondu court),
  // l'enregistrement suit en arrière-plan, sans message (le changement se voit déjà).
  // En cas d'échec, retour au thème précédent et message d'erreur.
  const [theme, setTheme] = useState(profile.theme);
  function applyTheme(next: Profile["theme"]) {
    const apply = () => {
      document.documentElement.dataset.theme = next;
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if ("startViewTransition" in document && !reduce) document.startViewTransition(apply);
    else apply();
  }
  function changeTheme(next: Profile["theme"]) {
    const previous = theme;
    setTheme(next);
    applyTheme(next);
    void updateProfile({ theme: next }).then((r) => {
      if (r.ok) return;
      setTheme(previous);
      applyTheme(previous);
      toast(r.error, "error");
    });
  }

  const lastBackup = profile.lastBackupAt
    ? new Date(profile.lastBackupAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
    : "jamais";

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <h2 className="mb-1 flex items-center gap-2 text-heading">
          Préférences {pending && <Spinner size={12} label="Enregistrement" />}
        </h2>
        <div className="divide-y-[0.5px] divide-separator">
          <Row label="Devise">
            <span className="text-body text-label-secondary">Euro (€)</span>
          </Row>
          <Row label="Format de date">
            <span className="text-body text-label-secondary">28/09/2026</span>
          </Row>
          <Row label="Début du mois" hint="Découpage des mois budgétaires dans toute l'app">
            <Select
              value={profile.monthStartDay}
              disabled={pending}
              onChange={(e) => save({ monthStartDay: Number(e.target.value) })}
              aria-label="Début du mois"
              className="w-28"
            >
              {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  le {d}
                </option>
              ))}
            </Select>
          </Row>
          <Row label="Thème">
            <Segmented
              value={theme}
              onChange={changeTheme}
              options={[
                { value: "light", label: "Clair" },
                { value: "dark", label: "Sombre" },
              ]}
            />
          </Row>
        </div>
      </Card>

      <Card>
        <h2 className="mb-1 text-heading">Données</h2>
        <div className="divide-y-[0.5px] divide-separator">
          <Row label="Importer un CSV" hint="Historique d'un compte (tableur, export bancaire)">
            <a href="/import" className={buttonClass("secondary")}>
              Importer
            </a>
          </Row>
          <Row label="Export CSV" hint="Toutes les transactions, lisible dans Excel">
            <ExportButton format="csv" label="CSV" />
          </Row>
          <Row label="Sauvegarde JSON" hint={`Dernière sauvegarde : ${lastBackup}`}>
            {/* la date de dernière sauvegarde est rafraîchie une fois le fichier reçu */}
            <ExportButton format="json" label="JSON" onDone={() => router.refresh()} />
          </Row>
        </div>
      </Card>

      <Card>
        <h2 className="mb-1 text-heading">Compte</h2>
        <div className="divide-y-[0.5px] divide-separator">
          <Row label="Utilisateur">
            <span className="text-body text-label-secondary">{profile.email}</span>
          </Row>
          {/* mêmes capsules que les autres actions de la page : retour au toucher immédiat */}
          <Row label="Session" hint="Il faudra te reconnecter sur cet appareil">
            <form action={signOut}>
              <SubmitButton className={buttonClass("secondary")} pendingChildren="Se déconnecter">
                <LogOut size={15} strokeWidth={1.75} aria-hidden /> Se déconnecter
              </SubmitButton>
            </form>
          </Row>
          <Row label="Supprimer le compte" hint="Efface définitivement toutes tes données">
            <DeleteAccountButton email={profile.email} />
          </Row>
        </div>
      </Card>

      <Card>
        <h2 className="mb-1 text-heading">À propos</h2>
        <div className="divide-y-[0.5px] divide-separator">
          <Row label="Version">
            <span className="text-body text-label-secondary tabular-nums">
              {APP_NAME} {versionLabel()}
            </span>
          </Row>
          <Row label="Copyright">
            <span className="text-body text-label-secondary">{copyrightLine()} · Tous droits réservés</span>
          </Row>
        </div>
      </Card>
    </div>
  );
}

/** Téléchargement d'un export : spinner jusqu'à la réception complète du fichier. */
function ExportButton({ format, label, onDone }: { format: "csv" | "json"; label: string; onDone?: () => void }) {
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  function download() {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/export/${format}`);
        if (!res.ok) throw new Error(String(res.status));
        const blob = await res.blob();
        const name = /filename="([^"]+)"/.exec(res.headers.get("Content-Disposition") ?? "")?.[1] ?? `pecunia.${format}`;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        startTransition(() => onDone?.());
      } catch {
        toast("Export impossible, réessaie dans un instant.", "error");
      }
    });
  }

  return (
    <Button onClick={download} loading={pending}>
      {!pending && <Download size={15} />} {label}
    </Button>
  );
}

/** Suppression définitive : confirmation en retapant l'email ou « SUPPRIMER ». */
function DeleteAccountButton({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const valid = confirmation.trim() === "SUPPRIMER" || confirmation.trim().toLowerCase() === email.toLowerCase();

  function submit() {
    setError(null);
    startTransition(async () => {
      const r = await deleteMyAccount(confirmation);
      startTransition(() => {
        // en cas de succès, l'action redirige vers l'écran de connexion
        if (r && !r.ok) setError(r.error);
      });
    });
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={buttonClass("danger")}>
        <Trash2 size={15} strokeWidth={1.75} aria-hidden /> Supprimer
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Supprimer le compte"
        footer={
          <>
            <Button onClick={() => setOpen(false)}>Annuler</Button>
            <Button variant="danger" onClick={submit} loading={pending} disabled={!valid}>
              Supprimer définitivement
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-body">
            Comptes, transactions, catégories, budgets, récurrences et objectifs seront <strong>définitivement effacés</strong>. Pense à
            faire une sauvegarde JSON avant.
          </p>
          <div>
            <Label htmlFor="delete-confirm">
              Pour confirmer, tape ton adresse email ({email}) ou <strong>SUPPRIMER</strong>
            </Label>
            <Input id="delete-confirm" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} autoComplete="off" />
          </div>
          <FieldError>{error}</FieldError>
        </div>
      </Modal>
    </>
  );
}
