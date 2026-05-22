# 🚀 Allyjoph · Alluriel Business

> Plateforme personnelle de distribution logicielle, portfolio et espace de travail professionnel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 🌐 Site en ligne

**URL** : [allyjoph-alluriel.vercel.app](https://allyjoph-alluriel.vercel.app)

---

## ✨ Fonctionnalités

### Site public
- 🏠 **Page d'accueil** — Hero animé, stats, avatars membres
- 👤 **À propos** — Compétences, expérience, technologies
- 💾 **Logiciels** — Distribution avec changelog versionné
- 🗂️ **Portfolio** — Projets filtrés par technologie
- ⚙️ **Services** — Offres de développement
- 📧 **Contact** — Formulaire de contact

### Système d'authentification
- 🔐 Inscription / Connexion membres
- 👥 Profil utilisateur avec avatar
- 🎫 Rôles : Membre / VIP

### Panneau Admin (privé)
- 📊 **Dashboard** — Stats en temps réel
- 📦 **Logiciels** — Publish, versioning, changelog
- 💻 **Projets & Code** — Éditeur Monaco (VS Code)
- 📤 Import de fichiers depuis l'ordinateur
- ⬇️ Export de projets en `.zip`
- 📬 Messages des visiteurs

---

## 🛠️ Stack technique

| Technologie | Usage |
|---|---|
| React 19 | Interface utilisateur |
| TypeScript | Typage statique |
| Tailwind CSS 4 | Styles |
| Framer Motion | Animations |
| Monaco Editor | Éditeur de code |
| JSZip | Export de projets |
| Vite 7 | Build tool |

---

## 🚀 Installation locale

```bash
# Cloner le projet
git clone https://github.com/allyjoph/alluriel-business.git
cd alluriel-business

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build production
npm run build
```

---

## 🔐 Accès Admin

- URL : `votresite.com/#/admin`
- Mot de passe : **privé** (encodé en base64 dans `AdminLogin.tsx`)

---

## 📦 Déploiement

### Vercel (recommandé)
1. Push sur GitHub
2. Importer sur [vercel.com](https://vercel.com)
3. Build command : `npm run build`
4. Output directory : `dist`

### Netlify
1. Push sur GitHub
2. Importer sur [netlify.com](https://netlify.com)
3. Build command : `npm run build`
4. Publish directory : `dist`

---

## 📄 Licence

© 2025 Allyjoph Alluriel Business. Tous droits réservés.
