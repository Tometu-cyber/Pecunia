"use client";

/**
 * Sheet : feuille modale pour une tâche courte. Sur mobile, feuille iOS 26 qui monte du bas
 * (✕ à gauche, ✓ à la couleur de l'app à droite) ; sur ordi (768 px et plus), fenêtre centrée
 * façon macOS. Échap ferme, Tab reste dans la feuille, le focus revient au bouton d'origine.
 * Contenu : classes pt-form-group et pt-form-row. Voir design-system/components/Sheet/README.md.
 */
import { clsx } from "clsx";
import { Check, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "./button";
import { appClass, type AppId } from "./ds";
import { GlassButton } from "./glass-button";

export interface SheetProps {
  open: boolean;
  onClose?: () => void;
  title: string;
  app?: AppId;
  platform?: "ios" | "mac";
  primaryAction?: { label: string; onClick?: () => void; type?: "button" | "submit" };
  cancelLabel?: string;
  detent?: "medium" | "large";
  /** false : le clic sur le fond ne ferme plus (formulaire long en cours) */
  dismissible?: boolean;
  /** Reste dans son conteneur au lieu de couvrir la page */
  contained?: boolean;
  noAutoFocus?: boolean;
  children?: ReactNode;
  className?: string;
}

const DESKTOP = "(min-width: 768px)";

export function Sheet({
  open,
  onClose,
  title,
  app,
  platform,
  primaryAction,
  cancelLabel = "Annuler",
  detent = "medium",
  dismissible = true,
  contained,
  noAutoFocus,
  children,
  className,
}: SheetProps) {
  const [desktop, setDesktop] = useState(false);
  const mac = platform ? platform === "mac" : desktop;
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });
  const uid = `pts${useId().replace(/[^A-Za-z0-9]/g, "")}`;

  useEffect(() => {
    if (platform) return;
    const m = window.matchMedia(DESKTOP);
    const sync = () => setDesktop(m.matches);
    sync();
    m.addEventListener("change", sync);
    return () => m.removeEventListener("change", sync);
  }, [platform]);

  useEffect(() => {
    if (!open) return;
    const lastFocus = document.activeElement as HTMLElement | null;
    const p = panelRef.current;
    if (p && !noAutoFocus) {
      const f =
        p.querySelector<HTMLElement>("[data-autofocus]") ?? p.querySelector<HTMLElement>("input") ?? p.querySelector<HTMLElement>("button:not(.pt-sheet-close)");
      (f ?? p).focus();
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current?.();
      }
      if (e.key === "Tab" && p) {
        const els = Array.from(p.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input, select, textarea, [tabindex="0"]'));
        const first = els[0];
        const last = els[els.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      lastFocus?.focus?.();
    };
  }, [open, noAutoFocus]);

  if (!open) return null;
  const close = () => onClose?.();
  const head = mac ? (
    <div className="pt-sheet-head pt-sheet-head-mac">
      <h2 id={uid} className="pt-sheet-title">
        {title}
      </h2>
    </div>
  ) : (
    <div className="pt-sheet-head">
      <GlassButton icon={X} label={cancelLabel} onClick={close} className="pt-sheet-close" />
      <h2 id={uid} className="pt-sheet-title">
        {title}
      </h2>
      {primaryAction ? (
        <GlassButton icon={Check} label={primaryAction.label} prominent app={app} type={primaryAction.type} onClick={primaryAction.onClick} />
      ) : (
        <span style={{ width: 44 }} />
      )}
    </div>
  );
  const foot = mac ? (
    <div className="pt-sheet-foot">
      <Button variant="gray" size="small" onClick={close}>
        {cancelLabel}
      </Button>
      {primaryAction && (
        <Button variant="filled" size="small" app={app} type={primaryAction.type} onClick={primaryAction.onClick}>
          {primaryAction.label}
        </Button>
      )}
    </div>
  ) : null;

  const layer = (
    <div className={clsx("pt-root pt-sheet-layer", contained && "is-contained", mac ? "is-mac" : "is-ios", appClass(app))}>
      <div className="pt-sheet-dim" onClick={dismissible ? close : undefined} />
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={uid} tabIndex={-1} className={clsx("pt-sheet", detent === "large" && "is-large", className)}>
        {!mac && <div className="pt-sheet-grabber" aria-hidden />}
        {head}
        <div className="pt-sheet-body">{children}</div>
        {foot}
      </div>
    </div>
  );
  return contained ? layer : createPortal(layer, document.body);
}
