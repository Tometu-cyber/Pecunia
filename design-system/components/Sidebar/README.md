# Sidebar

La barre latérale en verre épais, à gauche de la fenêtre sur ordi, façon macOS. Elle liste les apps du portail et sert de navigation principale au-delà de 768 px.

**Props :**
- `sections` : `[{ title?, items: [{ id, label, app?, icon?, badge?, href? }] }]`. Avec `href`, la ligne est un lien. Avec `app`, la ligne affiche l'icône colorée de l'app. Sans `app`, elle affiche un pictogramme `icon` en bleu.
- `active` / `defaultActive` / `onSelect` : ligne sélectionnée.
- `windowControls` : affiche les trois boutons de fenêtre macOS en haut (`true` par défaut). Mettre `false` dans un navigateur, où ils ne servent à rien.
- `badge` : un compteur discret à droite (notes non lues, séances restantes).
- `footer` : contenu collé en bas de la barre (patrimoine, profil, version).
- `app` : la barre d'une app. Les pictogrammes des lignes passent en `<app>-text`.
- `linkAs` : composant de lien pour les `href` de cette barre.

**Mise en page :**
- Largeur `sidebar-width` (240 px), décollée de 8 px des bords de la fenêtre, hauteur pleine.
- Le contenu passe dessous : il commence à `sidebar-width` + `space-5`, mais les images et fonds colorés peuvent s'étendre sous le verre.

**Règles :**
- Ordre : Accueil et Rechercher, puis le groupe « Apps », puis « Portail » (Réglages).
- Raccourcis : ⌘1 à ⌘5 pour les apps, dans l'ordre de la liste.
- Survol en `fill-tertiary`, sélection en `fill-secondary`, texte toujours `label`.

**Contraste :** avec `app`, les pictogrammes au trait sont en `<app>-text`, pas en `<app>`. Un trait fin vert ou jaune sur le verre clair tomberait vers 2:1, alors que `<app>-text` garde 4,5:1. Le portail garde son bleu.

**Dans le layout :** poser la barre dans un conteneur `pt-sidebar-dock` (fixe, décollée de 8 px, pleine hauteur).
