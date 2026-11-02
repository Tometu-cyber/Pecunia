# Source

Copie du design system « Portail » (artefact claude.ai `44c0cef9-b97d-4032-a302-10f19c14dc84`, version 1793633927-22f6, 2 novembre 2026), gardée ici comme référence.

- `README.md` : le guide (principes, couleurs, verre, typographie, règles).
- `tokens.json` : les tokens. Ils sont transcrits en variables CSS dans `src/app/globals.css`.
- `components/bundle.css` : les styles des composants, repris dans `src/components/ui/design-system.css`.
- `components/bundle.js`, `components/index.d.ts` : l'implémentation de référence (React, global `window.Portail`). L'app utilise les composants React/TypeScript de `src/components/ui/`.
- `components/*/README.md` : les règles de chaque composant.
- `components/FinancesMobile/preview.html`, `components/FinancesDesktop/preview.html` : les écrans de référence de l'accueil de Pecunia.

Ne pas modifier ces fichiers à la main : les mettre à jour depuis l'artefact.
