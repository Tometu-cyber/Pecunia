"use client";

import { Button, Card } from "@/components/ui/primitives";

/** Échec de chargement : message sans jargon + nouvelle tentative sans recharger l'app. */
export default function AppError({ reset }: { error: Error; reset: () => void }) {
  return (
    <Card className="mx-auto mt-16 max-w-md text-center md:mt-10">
      <p className="text-heading">Impossible de charger</p>
      <p className="mt-1 text-sub text-label-secondary">Vérifie ta connexion puis relance le chargement.</p>
      <Button variant="primary" onClick={reset} className="mt-4">
        Réessayer
      </Button>
    </Card>
  );
}
