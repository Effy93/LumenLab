# LumenLab

![LumenLab — aperçu du site](docs/screenshots/hero-final.png)

Site vitrine single-page — portail vers AstraLumen, CelestIA, VA-Rebirth et TaskHelper, des univers amenés à devenir des sites indépendants.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## Pages

| Fichier                | Rôle                                        | Statut |
|------------------------|---------------------------------------------|--------|
| `index.html`           | Portail principal (Hero · Projets · Vision) | Live   |
| `celestia.html`        | Page WIP — CelestIA                         | WIP    |
| `va-rebirth.html`      | Page WIP — VA-Rebirth (« la forge astrale se rallume ») | WIP    |
| `taskhelper.html`      | Page WIP — TaskHelper                        | WIP    |
| `mentions-legales.html`| Mentions légales                            | Live   |

> AstraLumen n'a plus de page locale : c'est désormais un site externe (`https://astralumen.lumenforge.me`), atteint via un interstitiel de confirmation depuis le carrousel Projets.

## Sections — index.html

| # | Section | id         |
|---|---------|------------|
| 1 | Hero    | `#accueil` |
| 2 | Projets | `#projets` |
| 3 | Vision  | `#vision`  |

## Structure

```
LumenLab/
├── index.html                ← portail principal
├── celestia.html             ← WIP CelestIA
├── va-rebirth.html           ← WIP VA-Rebirth
├── taskhelper.html           ← WIP TaskHelper
├── mentions-legales.html     ← mentions légales
├── CNAME                     ← domaine GitHub Pages (lumenforge.me)
├── css/
│   ├── main.css              ← point d'entrée (@import) pour index.html
│   ├── base/
│   │   ├── variables.css     ← tokens (couleurs, typo)
│   │   ├── reset.css
│   │   └── typography.css
│   ├── layout/
│   │   ├── header.css
│   │   ├── footer.css
│   │   └── sections.css
│   ├── components/
│   │   ├── buttons.css
│   │   ├── cards.css
│   │   ├── project-card.css
│   │   ├── project-galaxy.css ← carrousel galactique Projets
│   │   ├── navbar.css        ← navbar partagée (pages secondaires)
│   │   ├── leave-modal.css   ← interstitiel de sortie (univers externes)
│   │   └── badges.css
│   ├── pages/
│   │   ├── home.css
│   │   ├── wip.css           ← base commune aux pages WIP
│   │   ├── celestia.css
│   │   ├── va-rebirth.css
│   │   ├── taskhelper.css
│   │   └── legal.css
│   └── utilities/
│       ├── animations.css
│       └── responsive.css
├── js/
│   ├── main.js               ← orchestration
│   ├── nav.js                ← navbar scroll
│   ├── particles.js          ← particules canvas
│   ├── reveal.js             ← animations au scroll
│   ├── projectGalaxy.js      ← logique du carrousel Projets
│   ├── leaveModal.js         ← interstitiel avant sortie externe
│   └── legal.js              ← mentions légales
├── assets/                   ← images et logos (WebP optimisés)
└── docs/
    ├── screenshots/
    └── content/              ← about, archi, rapport
```

## Projets portails

- **AstraLumen** — introspection, mémoire, création (site externe)
- **CelestIA** — IA, agents autonomes, créativité augmentée
- **VA-Rebirth** — renaissance d'un jeu web / RPG : créatures évolutives, forge astrale, runes et artefacts
- **TaskHelper** — outil de productivité visuelle; prototypes et explorations technologiques

## Design

Palette : `#050810` (fond) · `#d9a85a` (or) · `#5fd4d0` (cyan) · `#f1ece1` (encre)  
Typographies : Cormorant Garamond (serif) + Manrope (sans-serif)

## Auteure

Eva Philippo -
