# Pilātis 🌿

A beautiful, offline-capable Pilates workout tracker and exercise library. Built with Next.js. Deployable to **Vercel**, **GitHub Pages**, or any **static host (PWS)**.

---

## Features

- 🏠 **Dashboard** — daily workout suggestions, weekly streak, quick stats
- 📚 **Exercise Library** — 6 beginner exercises with full step-by-step instructions
- 📝 **Workout Logger** — log sessions by plan or custom exercise selection
- 📈 **Progress Tracker** — 28-day chart, streak counter, full history
- 📱 **PWA** — installs on phone like a native app, works offline

---

## Quick Start (local)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel (recommended — 2 minutes)

1. Push this folder to a GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/pilates-app.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your GitHub repo

3. Vercel auto-detects Next.js — just click **Deploy**

4. Your wife gets a live URL like `https://pilates-app.vercel.app` in ~2 minutes ✦

---

## Deploy as a PWA / Static Site (PWS)

This app supports full static export for deployment to any host (GitHub Pages, Netlify, Cloudflare Pages, S3, etc.).

### Build static files:

```bash
EXPORT_STATIC=true npm run build
```

This outputs everything to the `out/` folder — plain HTML/CSS/JS, no server needed.

### Deploy to GitHub Pages:

1. Build the static export (above)
2. Push the `out/` folder contents to the `gh-pages` branch:
   ```bash
   npm install -g gh-pages
   EXPORT_STATIC=true npm run build
   gh-pages -d out
   ```
3. In your GitHub repo → Settings → Pages → set source to `gh-pages` branch
4. Your app is live at `https://YOUR_USERNAME.github.io/pilates-app`

### Deploy to Netlify:

1. Build command: `EXPORT_STATIC=true npm run build`
2. Publish directory: `out`
3. Drop the `out/` folder at [app.netlify.com/drop](https://app.netlify.com/drop), or connect your GitHub repo

### Install as PWA on iPhone/Android:

Once deployed (Vercel or any HTTPS host):

- **iPhone**: Open in Safari → Share → "Add to Home Screen"
- **Android**: Open in Chrome → menu → "Add to Home Screen" / "Install App"

The app will work **offline** after first visit, thanks to the service worker.

---

## Project Structure

```
pilates-app/
├── pages/
│   ├── index.js          # Home dashboard
│   ├── library/
│   │   ├── index.js      # Exercise browser
│   │   └── [id].js       # Exercise detail page
│   ├── log.js            # Workout logger
│   ├── progress.js       # Progress tracker
│   ├── _app.js
│   └── _document.js      # PWA meta + service worker
├── components/
│   ├── Layout.js
│   └── Nav.js
├── data/
│   └── exercises.js      # All exercise & workout data
├── hooks/
│   └── useStorage.js     # localStorage hook
├── styles/
│   └── *.module.css
├── public/
│   ├── manifest.json     # PWA manifest
│   └── sw.js             # Service worker (offline support)
└── next.config.js        # Static export config
```

---

## Customisation

- **Add exercises**: Edit `data/exercises.js` — add a new object to the `exercises` array
- **Change name**: Edit the logo in `components/Nav.js`
- **Change colours**: Edit CSS variables in `styles/globals.css`
- **Add workout plans**: Edit the `workoutPlans` array in `data/exercises.js`

---

## Tech Stack

- [Next.js 14](https://nextjs.org) — React framework
- CSS Modules — scoped styling
- localStorage — no backend, data stays on device
- Service Worker — offline support
- Web App Manifest — installable PWA
