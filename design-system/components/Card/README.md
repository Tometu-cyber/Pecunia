# Card

Le bloc de contenu de base : un fond blanc (gris foncé en sombre), `radius-lg`, padding `space-4`, avec un titre, un sous-titre et une action « Voir tout » facultatifs.

**Props :** `title`, `subtitle`, `action` (`{ label, onClick }`, affichée comme bouton simple à droite du titre), `app` (couleur de l'action et des éléments colorés dedans), `children`.

**Règles :**
- Une carte = un sujet. Si elle parle de deux choses, en faire deux.
- Jamais de verre sur une carte : c'est du contenu.
- Pas de carte dans une carte. Pour structurer l'intérieur, utiliser une `List` simple ou des espacements.
- Le titre est en sentence case et dit ce qu'on voit (« Dépenses de la semaine »), pas une catégorie vague (« Statistiques »).
