# AppIcon

L'icône d'une app, dessinée comme une icône iOS 26 : forme de squircle Apple, fond en dégradé, pictogramme en couches avec une ombre portée, un reflet en haut et un liseré lumineux sur le bord.

**Les couches, du fond vers l'avant :**
1. Fond en dégradé de la couleur de l'app : plus clair en haut à gauche, plus profond en bas.
2. Reflet doux en haut (« sheen »).
3. Couche arrière du pictogramme, translucide (le billet derrière le portefeuille, la vapeur du bol, la page de derrière).
4. Couche avant en verre dépoli blanc, avec une ombre portée qui la détache du fond.
5. Détails dans une teinte foncée de l'app (fermoir, lignes, bandeau).
6. Liseré : lumière en haut du bord, ombre en bas.

**Les pictogrammes :**
- **Portail** : quatre tuiles aux couleurs des apps (carrées et rondes en alternance) sur un fond blanc nacré.
- **Finances** : un portefeuille avec un billet qui dépasse.
- **Sport** : un haltère.
- **Alternance** : une mallette.
- **Alimentation** : un bol fumant.
- **Notes** : un bloc-notes au bandeau foncé, avec une page derrière.

**Props :**
- `app` : `portail` · `finances` · `sport` · `alternance` · `alimentation` · `notes`.
- `size` : côté en px (40 par défaut). 20 px dans la barre latérale, 44 px dans les tuiles, 64 px et plus dans un en-tête ou l'écran d'accueil.
- `appearance` :
  - `auto` (par défaut) : suit le thème. En clair, fond coloré et pictogramme blanc. En sombre, fond graphite et pictogramme à la couleur de l'app, comme les icônes sombres d'iOS 26.
  - `light` ou `dark` : force une apparence.
  - `clear` : verre transparent qui laisse voir le fond d'écran, pictogramme blanc. Seulement sur une image ou un fond coloré.
- `label` : texte lu par les lecteurs d'écran quand l'icône est seule. Sans `label`, elle est décorative.

**Règles :**
- Toujours accompagnée du nom de l'app, sauf sur une tuile qui l'affiche déjà.
- Une seule apparence par écran : ne pas mélanger `auto` et `clear`.
- Ne jamais redessiner une icône ponctuellement. Pour une nouvelle app, ajouter son pictogramme avec la même structure : une couche arrière translucide, une couche avant pleine et un ou deux détails foncés.
