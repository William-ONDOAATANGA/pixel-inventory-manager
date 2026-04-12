# 🎮 PIXEL INVENTORY MANAGER

> Un gestionnaire de stock intelligent et immersif pour boutiques de jeux vidéo, propulsé par l'API RAWG.

---

## 🌟 Vision du Projet
Pixel Inventory Manager n'est pas qu'un simple tableau de suivi. C'est une application web dynamique conçue pour automatiser la gestion d'un catalogue de gaming. Grâce à l'intégration de l'IA via l'API RAWG, l'ajout de produits devient instantané et fiable.

## 🚀 Fonctionnalités Clés
* **✨ Auto-fill IA (RAWG API)** : Saisie assistée pour les jeux vidéo. En tapant le nom, le système récupère automatiquement les jaquettes, les genres et les plateformes.
* **📦 Gestion Full CRUD** : Contrôle total sur l'ajout, la modification des stocks et la suppression des produits (Jeux, Consoles, Accessoires).
* **💾 Persistance LocalStorage** : Vos données sont sauvegardées localement dans le navigateur. Pas de perte d'inventaire après un rafraîchissement.
* **🔍 Filtres & Tris Avancés** : Recherche dynamique, filtrage par catégorie (et par état pour les jeux) et tri par prix.
* **🌌 Interface "Neon-Night"** : Design responsive avec un code couleur distinctif pour une lisibilité maximale.

## 🛠️ Stack Technique
* **Langages** : HTML5, CSS3 (Variables & Flexbox), JavaScript (ES6+).
* **Stockage** : LocalStorage & Simulation JSON.
* **API Externe** : [RAWG Video Games Database](https://rawg.io/apidocs).

## 👥 L'Équipe
- **William (Lead)** : Architecture & GitHub Management.
- **Team A: Florent & Yohann** : UI/UX & Intégration CSS.
- **Team B: Allan & Patrick** : Logique JavaScript & Manipulation du DOM.
  
## 📁 Structure du Dépôt
```text
├── assets/             # Ressources visuelles et captures
├── data/               # Structure des données (inventory.json)
├── scripts/            # Cœur logique (app.js & appels API)
├── styles/             # Design global (style.css)
└── index.html          # Interface utilisateur principale
