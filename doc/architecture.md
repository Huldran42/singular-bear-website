# Architecture du site Singular Bear

Le projet suit l'App Router de Next.js avec une séparation stricte entre les routes, les composants partagés et les fonctionnalités métier.

## Structure

- `src/app` contient uniquement les routes, les métadonnées SEO et les états globaux.
- `src/features` regroupe les composants propres à l'accueil, au catalogue et à la documentation.
- `src/components` contient les briques partagées de navigation, média, mouvement et interface.
- `src/lib` contient les données produits, les manuels et les utilitaires sans interface.
- `src/webplayer` contient la configuration et l'interface des démos vidéo, galerie et Unity WebGL.
- `public/assets` contient les visuels optimisés utilisés par le site.
- `public/webplayer` reçoit les exports Unity WebGL prêts à être servis.
- `doc` rassemble la documentation interne du projet.
- `libraries` documente les dépendances externes ou bibliothèques déposées manuellement.

## Principes

Les pages restent des Server Components par défaut. Les filtres, galeries, thèmes et animations sont isolés dans de petits Client Components. Les produits sont décrits dans une source unique, `src/lib/products.ts`, afin que le catalogue, les fiches, le sitemap et les manuels restent synchronisés.

Les achats restent finalisés sur Unity Asset Store. Le site sert de vitrine, de centre de démonstration et de documentation.
