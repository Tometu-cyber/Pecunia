# Sidebar

La barre latérale en verre épais, à gauche de la fenêtre sur ordi, façon macOS. Elle liste les apps du portail et sert de navigation principale au-delà de 768 px.

**Props :**
- `sections` : `[{ title?, items: [{ id, label, app?, icon?, badge? }] }]`. Avec `app`, la ligne affiche l'icône colorée de l'app. Sans `app`, elle affiche un pictogramme `icon` en bleu.
- `active` / `defaultActive` / `onSelect` : ligne sélectionnée.
- `windowControls` : affiche les trois boutons de fenêtre macOS en haut (`true` par défaut). Mettre `false` dans un navigateur, où ils ne servent à rien.
- `badge` : un compteur discret à droite (notes non lues, séances restantes).
- `footer` : contenu collé en bas de la barre (patrimoine, profil, version).

**Mise en page :**
- Largeur `sidebar-width` (240 px), décollée de 8 px des bords de la fenêtre, hauteur pleine.
- Le contenu passe dessous : il commence à `sidebar-width` + `space-5`, mais les images et fonds colorés peuvent s'étendre sous le verre.

**Règles :**
- Ordre : Accueil et Rechercher, puis le groupe « Apps », puis « Portail » (Réglages).
- Raccourcis : ⌘1 à ⌘5 pour les apps, dans l'ordre de la liste.
- Survol en `fill-tertiary`, sélection en `fill-secondary`, texte toujours `label`.
