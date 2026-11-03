import type { ReactNode } from "react";
import { AppVersion } from "@/components/app/app-version";
import { AppIcon } from "@/components/ui/app-icon";
import { PECUNIA_APP } from "@/components/ui/ds";

/**
 * Mise en page des écrans d'authentification (design system) : icône de l'app, nom et
 * promesse, puis le formulaire. Sur ordi, le formulaire est une fenêtre façon macOS posée
 * sur le fond de fenêtre (bg-window).
 */
export function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="pt-app-finances flex min-h-dvh items-start justify-center bg-bg-grouped px-4 pt-[calc(env(safe-area-inset-top,0px)+48px)] pb-10 md:items-center md:bg-bg-window md:p-10">
      <div className="w-full max-w-sm md:max-w-[420px] md:rounded-lg md:bg-bg-primary md:p-8 md:shadow-window">
        <div className="flex flex-col items-center text-center">
          <AppIcon app={PECUNIA_APP} size={72} />
          <p className="mt-3 text-[22px] leading-7 font-bold tracking-[-0.26px] md:text-[17px] md:leading-[22px]">Pecunia</p>
          <p className="text-sub text-label-secondary">Chaque euro à sa place.</p>
        </div>
        <h1 className="mt-8 text-[28px] leading-[34px] font-bold tracking-[0.38px] md:mt-7 md:text-[22px] md:leading-[26px] md:tracking-[-0.26px]">{title}</h1>
        {subtitle && <p className="mt-1 text-sub text-label-secondary">{subtitle}</p>}
        <div className="mt-6">{children}</div>
        <AppVersion className="mt-10 text-center" full />
      </div>
    </div>
  );
}
