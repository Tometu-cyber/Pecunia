# Select

La liste déroulante du design system, à la place du `<select>` natif. Le déclencheur a l'apparence d'un `TextField`. La liste s'ouvre dans le menu en verre épais, avec une coche devant le choix courant. Sur mobile, les lignes font 44 px et le texte 17 px. Sur ordi, c'est le menu compact façon macOS, en 13 px avec un survol bleu.

**Quand l'utiliser :** dans un formulaire, pour choisir une valeur parmi une liste (catégorie, compte, unité). Pour une action ou un filtre posé dans une barre, utiliser `Menu`. Pour 2 à 5 choix toujours visibles, utiliser `SegmentedControl`.

**Props :**
- `options` : `[{ value, label, disabled? }]`.
- `value` / `defaultValue` / `onChange(value)` : la valeur est toujours une chaîne.
- `name` : ajoute un champ caché, pour que la valeur parte avec le formulaire.
- `placeholder` (« Choisir… » par défaut), en `label-tertiary` tant que rien n'est choisi.
- `disabled`, `required`, `id` (pour un `<label for>`), `aria-label`, `aria-invalid` (contour rouge).
- `app` : couleur du contour et de l'anneau de focus.
- `variant` : `field` (par défaut) ou `cell`, compacte et sans fond, pour une cellule de tableau.
- `size` : forcer `regular` ou `small`. Par défaut, regular sur mobile et small à partir de 768 px.

**Exemple :**

```js
h(P.Select, {
  id: 'categorie', app: 'finances', name: 'categorie', placeholder: 'Choisir une catégorie',
  value: cat, onChange: setCat,
  options: [{ value: 'courses', label: 'Courses' }, { value: 'loyer', label: 'Loyer' }, { value: 'old', label: 'Archivée', disabled: true }]
})
```

**Comportement :**
- La liste se place sous le champ, ou au-dessus s'il manque de place, et suit le défilement.
- Elle est rendue à la racine du document : jamais coupée par un conteneur qui défile, jamais sous une barre flottante.
- Un clic ou un toucher à côté la ferme.

**Clavier :**
- Les flèches ouvrent la liste puis se déplacent, en sautant les choix désactivés. Début et Fin vont au premier et au dernier.
- Entrée ou Espace choisit.
- Échap ferme la liste sans fermer la `Sheet` autour, et Tab la ferme aussi.
- Taper des lettres à la suite va au premier choix qui commence par elles.

**Accessibilité :**
- Le déclencheur est un `role="combobox"`, avec `aria-expanded`, `aria-controls` et `aria-activedescendant` (le choix actif). Le focus reste sur le champ pendant la navigation au clavier.
- La liste est un `role="listbox"`, et chaque choix un `role="option"` avec `aria-selected`.
- Sur mobile, le champ fait 44 px de haut.

**Règles :**
- Libellés courts. Une valeur trop longue est coupée avec « … » dans le champ.
- Au-delà d'une vingtaine de choix, préférer une `Sheet` avec recherche.
