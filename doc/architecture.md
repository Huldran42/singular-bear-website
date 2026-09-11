# Architecture du site Singular Bear

Le projet suit l'App Router de Next.js avec une séparation stricte entre les routes, les composants partagés et les fonctionnalités métier. Le runtime cible Vercel. Le code source vit sur GitHub.

## Structure

- `src/app` contient uniquement les routes, les métadonnées SEO et les états globaux.
- `src/features` regroupe les composants propres à l'accueil, au catalogue, aux packs et à la documentation.
- `src/components` contient les briques partagées de navigation, média, thème et interface.
- `src/lib` contient les données produits, les manuels, la résolution d'URL et la détection des builds WebGL.
- `src/webplayer` contient la configuration et l'interface des démos vidéo, galerie et Unity WebGL.
- `public/assets` contient les visuels utilisés par le site.
- `public/webplayer` reçoit les exports Unity WebGL prêts à être servis.
- `doc` rassemble la documentation interne du projet.
- `libraries` documente les dépendances externes ou bibliothèques déposées manuellement.

## Principes

Les pages restent des Server Components par défaut. Les filtres, galeries, thèmes et animations sont isolés dans de petits Client Components. Les produits sont décrits dans une source unique, `src/lib/products.ts`, afin que le catalogue, les fiches, le sitemap et les manuels restent synchronisés.

Les builds Unity WebGL sont détectés au moment du rendu Node en scannant `public/webplayer`. Le bouton `Launch Web Player` n'apparaît que si un `index.html` est présent.

Les achats restent finalisés sur Unity Asset Store. Le site sert de vitrine, de centre de démonstration et de documentation.

## Environnement

`src/lib/site.ts` résout l'origine publique dans cet ordre :

1. `NEXT_PUBLIC_SITE_URL`
2. URL de production Vercel
3. URL de preview Vercel
4. `http://localhost:3000`
