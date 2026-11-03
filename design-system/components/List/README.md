# List

La liste groupée façon Réglages d'iOS : des lignes (`ListRow`) dans un bloc arrondi, avec un en-tête et une note de bas facultatifs.

**Props :**
- `header` : titre au-dessus du bloc, en gris.
- `footer` : explication courte en dessous.
- `inset` : `false` pour des séparateurs pleine largeur (lignes sans icône).
- `plain` : sans fond ni arrondi, pour une liste posée dans une `Card`.

**Règles :**
- Les séparateurs commencent au niveau du texte, pas au bord (comme sur iOS).
- 7 lignes maximum dans un bloc. Au-delà, ajouter « Voir tout » ou découper en groupes.
