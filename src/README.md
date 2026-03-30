# BunkerBuilder 🏗

> Home Shelter Configurator — Interactive wizard for planning underground bunkers and safe rooms, with cost estimates and work overviews.

## Stack
- **Vite + React JSX** — fast builds, component-based
- **Firebase Firestore** — save/load configurations
- **Vercel** — deploy via GitHub push

---

## Local Development

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Add a **Web App** to the project
4. Enable **Firestore Database** (start in test mode for dev)
5. Copy the config values

### 3. Configure environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your Firebase values
```

### 4. Run dev server
```bash
npm run dev
```

---

## Deploy to Vercel

### Option A: GitHub Integration (recommended)
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project → select your repo
3. Vercel auto-detects Vite — no build config needed
4. Add your `VITE_FIREBASE_*` env vars in Vercel project settings
5. Every push to `main` auto-deploys ✓

### Option B: Vercel CLI
```bash
npm install -g vercel
vercel
# Follow prompts, add env vars when asked
```

---

## Firebase Firestore Rules (recommended for production)
In Firebase Console → Firestore → Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bunker_configs/{docId} {
      allow create: if true;          // anyone can save a config
      allow read: if true;            // anyone with an ID can load
      allow update, delete: if false; // no edits or deletes
    }
  }
}
```

---

## Project Structure
```
src/
  components/
    StylePicker.jsx     ← Step 1: Choose Underground or Safe Room
    LotInfo.jsx         ← Step 2: Property details (ZIP, soil, lot size)
    SizeSpecs.jsx       ← Step 3: Dimensions, depth, entry type
    Amenities.jsx       ← Step 4: Systems (ventilation, generator, water...)
    Summary.jsx         ← Step 5: Cost breakdown + work phases
  data/
    bunkerData.js       ← All cost factors, style definitions, work phases
  firebase/
    config.js           ← Firebase init (uses env vars)
  hooks/
    useConfigSave.js    ← Save/load configs to Firestore
  App.jsx               ← Wizard orchestration + step state
  App.css               ← All styles (industrial/utilitarian dark theme)
```

---

## Extending the App

### Add a new bunker style
In `src/data/bunkerData.js`:
1. Add to `BUNKER_STYLES` array
2. Add matching key in `COST_FACTORS`
3. Add matching key in `WORK_PHASES`

### Add regional pricing
Edit `getRegionMultiplier()` in `Summary.jsx` — currently maps ZIP prefixes to rough cost-of-living multipliers.

### Add user auth (save multiple configs)
- Enable Firebase Auth (Anonymous or Google) in Firebase Console
- Use `signInAnonymously(auth)` from `firebase/auth` in `useConfigSave.js`
- Associate saved docs with `user.uid`
