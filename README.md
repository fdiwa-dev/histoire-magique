# ✨ Histoire Magique

Générateur d'histoires illustrées personnalisées pour enfants (3-10 ans).  
Avec narration audio, mode non-voyant, et export PDF.

## 🚀 Déploiement

### Vercel (recommandé — 1 clic)

```bash
npx vercel
```

Ou connecter le dépôt GitHub directement sur [vercel.com/new](https://vercel.com/new).

### GitHub Pages

1. `npm run build`
2. Push le dossier `dist/` sur la branche `gh-pages`
3. Activer GitHub Pages dans les settings du repo (source: gh-pages)

## 🧞 Commandes

```bash
npm run dev       # Dev server
npm run build     # Production build
npm run preview   # Preview build
```

## 📦 Fonctionnalités

- **Flipbook 3D** avec animations de page
- **Narration audio** (Web Speech API + ElevenLabs optionnel)
- **Mode accessibilité** (non-voyants, contraste, dyslexie)
- **Téléchargement PDF** avec illustrations
- **8 histoires pré-écrites** en 5 thèmes (espace, pirates, dragon, robot, forêt)
- **Personnalisation** par âge (2-4 / 5-7 / 8-10 ans) et style d'illustration
- **Responsive** + PWA-ready
- **Dark mode** (design nuit violet/bleu)

## 🗺️ Roadmap

- [x] MVP web (Vite + React + Tailwind)
- [x] Flipbook 3D illustré
- [x] Synthèse vocale
- [x] Accessibilité non-voyants
- [x] Export PDF
- [ ] Vraies illustrations IA (DALL-E/Midjourney API)
- [ ] Paiement Stripe
- [ ] Livre imprimé (impression à la demande)
- [ ] App mobile (React Native)

## 📄 Licence

Propriétaire — Histoire Magique © 2026
