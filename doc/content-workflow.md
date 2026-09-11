# Mise à jour du contenu

## Ajouter un produit

1. Ajouter les visuels dans `public/assets/products`.
2. Ajouter la fiche dans `src/lib/products.ts`.
3. Ajouter ou adapter le manuel dans `src/lib/manuals.ts`.
4. Ajouter une entrée de pack dans `src/webplayer/config.ts`.
5. Vérifier la fiche produit, le manuel, le sitemap et la prévisualisation sociale.

## Ajouter une vidéo

Renseigner l'identifiant YouTube dans la fiche produit et dans `src/webplayer/config.ts`. La page Packs place automatiquement la vidéo avant les images et utilise le domaine YouTube sans cookies.

## Ajouter un export Unity WebGL

Déposer le build complet sous `public/webplayer/<slug>` en conservant `index.html`, `Build` et `TemplateData`. Le slug du dossier peut être celui du pack ou du produit. Le site détecte automatiquement `index.html` et affiche le bouton `Launch Web Player` uniquement quand le build existe.

## SEO

Chaque produit possède un titre, une description, une image sociale et des données structurées Product. Chaque manuel publie des données structurées TechArticle. Les nouvelles routes produit sont automatiquement ajoutées au sitemap.
