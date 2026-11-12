"use client";

/**
 * File de toasts de Pecunia : 3 au plus, chacun affiché 3,3 s puis sorti par le même chemin.
 * L'affichage vient du design system (Toast, ToastRegion de @portail/ui).
 */
import { Toast, ToastRegion } from "@portail/ui";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type Tone = "success" | "error";

interface ToastItem {
  id: number;
  message: string;
  tone: Tone;
  leaving?: boolean;
}

const ToastContext = createContext<(message: string, tone?: Tone) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const push = useCallback((message: string, tone: Tone = "success") => {
    const id = Date.now() + Math.random();
    setToasts((list) => [...list.slice(-2), { id, message, tone }]);
    // sortie par le même chemin que l'entrée (220 ms), puis retrait
    setTimeout(() => setToasts((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t))), 3300);
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 3550);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <ToastRegion>
        {toasts.map((t) => (
          <Toast key={t.id} tone={t.tone} leaving={t.leaving}>
            {t.message}
          </Toast>
        ))}
      </ToastRegion>
    </ToastContext.Provider>
  );
}
