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

**Liste libre :** pour des lignes qui ne sont pas des `ListRow` (ligne à glisser pour supprimer, ligne de formulaire), mettre la classe `pt-list-inset` sur le `<ul>`. Les séparateurs de 0,5 px commencent au niveau du texte, comme pour `ListRow`, à `--sep-inset` (58 px par défaut, `0px` pour la pleine largeur).
