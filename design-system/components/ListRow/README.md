# ListRow

Une ligne de liste : un repère à gauche (pictogramme dans une pastille teintée ou icône d'app), un titre, un sous-titre, une valeur à droite et un chevron si la ligne est cliquable.

**Props :**
- `title`, `subtitle`.
- `app` : couleur du repère et de la valeur `tone: 'app'`.
- `icon` : pictogramme dans une pastille ronde `<app>-bg`. `appIcon: true` affiche à la place l'icône d'app complète.
- `value` : la donnée à droite (« 45 min », « −650 € »).
- `tone` : couleur de la valeur. `positive` (vert, revenus), `negative` (texte noir en gras, dépenses : jamais en rouge, réservé aux erreurs), `app` (couleur de l'app, échéances), `strong` (texte normal en gras : soldes, totaux).
- `onClick` : rend la ligne cliquable et affiche le chevron (`chevron: false` pour le masquer).
- `href` : la ligne devient un lien (`<a>`, ou le composant de lien de l'app : voir `setLinkComponent` dans le README général). Mêmes styles, survol et focus qu'en bouton. Le chevron s'affiche aussi.

**Règles :**
- Hauteur minimum 44 px.
- Le séparateur au-dessus d'une ligne commence au niveau de son texte : décalé quand il y a un repère, au bord sinon.
- Titre sur une ligne, coupé avec « … » s'il est trop long.
- Montants : signe « − » ou « + » toujours visible, pour ne pas compter sur la couleur seule.
