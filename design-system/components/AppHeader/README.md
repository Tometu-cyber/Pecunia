# AppHeader

L'en-tête d'une app.

**Sur mobile**, il a deux parties :
- **le grand titre**, dans le contenu : une petite ligne colorée au-dessus (« Cette semaine »), le titre en 34 px et un sous-titre ;
- **la barre du haut**, qui reste fixée : bouton retour en verre à gauche, actions en verre à droite.

Quand on fait défiler et que le grand titre disparaît, le titre réapparaît en petit au centre de la barre. Un flou doux apparaît derrière, qui s'estompe vers le bas sans trait de séparation, comme dans iOS 26.

**Sur ordi** (`platform: 'mac'`), c'est une barre d'outils façon macOS :
- titre et sous-titre à gauche ;
- un contrôle au centre (par exemple un `SegmentedControl` de période) ;
- les actions en petites capsules à droite.

Le flou apparaît dès qu'on fait défiler.

**Props :**
- `title`, `subtitle`, `eyebrow` (mobile : la petite ligne colorée au-dessus du titre).
- `app` : couleur de l'eyebrow et du bouton d'action principal.
- `back` : `{ label, onClick }`, bouton retour (vers le portail).
- `actions` : liste de props de `GlassButton` (`{ icon, label, prominent?, children?, onClick }`), ou `{ menu: {…props de Menu} }` pour un menu « … ». Une seule action `prominent` (pleine, à la couleur de l'app).
- `platform` : `'ios'` (par défaut) ou `'mac'`. `center` : élément au centre de la barre d'outils (ordi).

**Mise en place :**
- Mettre l'en-tête en premier dans la zone qui défile : il détecte tout seul le défilement.
- La zone de l'heure et de la batterie est gérée par `env(safe-area-inset-top)`. La variable `--pt-safe-top` permet de la forcer.

**Règles :**
- 2 actions maximum à droite sur mobile. Le reste va dans un menu « … ».
- Le titre est le nom de l'app ou de la vue, jamais une phrase.
