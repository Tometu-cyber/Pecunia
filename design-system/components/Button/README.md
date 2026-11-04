# Button

Le bouton dans le contenu (cartes, formulaires, feuilles). Pour une action qui flotte sur la navigation, utiliser `GlassButton`.

**Variantes, de la plus forte à la plus discrète :**
- `filled` : fond `<app>`, texte `on-<app>`. L'action principale de l'écran. **Un seul par écran.**
- `tinted` : fond `<app>-bg`, texte `<app>-text`. Actions secondaires importantes.
- `gray` : fond `fill-secondary`, texte `label`. Annuler, filtrer, actions neutres.
- `plain` : texte `<app>-text` seul. « Voir tout », liens d'action.

**Tailles :** `large` (52 px, bas de formulaire ou de feuille, souvent `full`), `regular` (44 px), `small` (28 px, ordi et actions dans une carte).

**Props :** `variant`, `size`, `app`, `icon`, `full` (pleine largeur), `disabled`, `onClick`, `children`, `label` (nom lu par les lecteurs d'écran si le bouton n'a qu'un pictogramme).

**Lien :** avec `href`, le bouton se rend en `<a>` (ou le composant de lien de l'app, `linkAs`), avec les mêmes couleurs par variante, sans soulignement, et le même survol, appui et focus. Désactivé, il ne mène nulle part (`aria-disabled`).

**Règles :**
- Libellé court, verbe d'abord : « Ajouter une dépense », « Enregistrer ».
- En `small`, préférer `tinted` ou `gray` au bouton `filled` bleu : le texte blanc en 13 px n'est pas assez contrasté sur le bleu système.
- Éviter `disabled` : mieux vaut laisser le bouton actif et expliquer l'erreur dans le champ.

**Sur mobile :** la taille `small` garde ses 28 px visibles, mais sa zone tactile fait 44 × 44 px.
