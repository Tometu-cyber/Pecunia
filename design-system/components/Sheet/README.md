# Sheet

La feuille modale, pour une tâche courte qui ne mérite pas un écran entier : ajout rapide d'une dépense, d'une séance, d'un repas.

**Sur mobile**, c'est une feuille iOS 26 :
- elle monte du bas et flotte à 8 px des bords, avec des coins de 34 px et une poignée en haut ;
- en en-tête, un bouton rond en verre ✕ à gauche, le titre au centre, et un bouton rond plein ✓ à la couleur de l'app à droite.

**Sur ordi**, c'est une fenêtre centrée façon macOS : titre en haut à gauche, boutons « Annuler » et action principale en bas à droite. La plateforme se choisit seule (768 px et plus = ordi) ou se force avec `platform`.

**Props :**
- `open`, `onClose` : affichage et fermeture (✕, Annuler, Échap, clic sur le fond).
- `title`, `app`.
- `primaryAction` : `{ label, onClick }`, le ✓ sur mobile, le bouton plein sur ordi.
- `cancelLabel` (« Annuler » par défaut).
- `detent` : `'medium'` (par défaut, au moins la moitié de l'écran) ou `'large'` (presque plein écran).
- `dismissible: false` : le clic sur le fond ne ferme plus (formulaire long en cours).
- `contained` : la feuille reste dans son conteneur au lieu de couvrir la page (aperçus, maquettes).
- `noAutoFocus` : ne pas placer le focus à l'ouverture.

**Comportement :**
- À l'ouverture, le focus va dans le premier champ, ou sur l'élément marqué `data-autofocus`.
- La touche Tab reste dans la feuille, et Échap la ferme.
- À la fermeture, le focus revient sur le bouton qui l'avait ouverte.

**Pour le contenu**, utiliser les classes `pt-form-group` (bloc blanc arrondi) et `pt-form-row` (libellé à gauche, contrôle à droite) pour faire des groupes façon Réglages : Catégorie avec un `Menu`, Date avec un `DatePicker`, ou un `Toggle`.

**Règles :**
- Une feuille = une tâche. Jamais de feuille ouverte depuis une autre feuille.
- Le champ principal en premier et en grand (le montant, la durée).
- Valeurs par défaut pour le cas courant (date du jour, dernière catégorie utilisée), pour pouvoir valider en deux gestes.
