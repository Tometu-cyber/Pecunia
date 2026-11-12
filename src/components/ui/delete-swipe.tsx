"use client";

/**
 * Glisser une ligne pour la supprimer (écrans tactiles) : le geste et l'affichage viennent de
 * SwipeActions (@portail/ui) ; ici, l'appel au serveur et le toast de retour.
 */
import { SwipeActions } from "@portail/ui";
import { useTransition, type ReactNode } from "react";
import { useToast } from "@/components/ui/toasts";

export function DeleteSwipe({
  children,
  label,
  onDelete,
  successMessage = "Supprimée",
}: {
  children: ReactNode;
  /** Nom accessible du bouton de suppression (« Supprimer Carrefour ») */
  label: string;
  onDelete: () => Promise<{ ok: true } | { ok: false; error: string }>;
  successMessage?: string;
}) {
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  const remove = () =>
    startTransition(async () => {
      const r = await onDelete();
      startTransition(() => {
        if (!r.ok) toast(r.error, "error");
        else toast(successMessage);
      });
    });

  return (
    <SwipeActions label="Supprimer" ariaLabel={label} icon="trash" pending={pending} onAction={remove}>
      {children}
    </SwipeActions>
  );
}
