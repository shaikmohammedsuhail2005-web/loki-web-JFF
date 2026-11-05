# LOKI — Cinematic TVA Experience

A React + Vite cinematic Loki experience with a video hero, TVA archive, and variant list.

## 1. Open in VS Code

1. Download and extract `loki-hero-starter.zip`.
2. Open VS Code.
3. Choose **File → Open Folder**.
4. Select the extracted `loki_hero_starter` folder (the folder containing `package.json`).

## 2. Check Node.js

In VS Code, choose **Terminal → New Terminal** and run:

```bash
node -v
npm -v
```

If those commands are not recognized, install Node.js LTS from https://nodejs.org/ and reopen VS Code.

## 3. Install and run

Run these commands in the VS Code terminal, one at a time:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173/`.

## 4. Media assets

The supplied Loki clip is included at:

```text
public/videos/loki-hero.mp4
```

The archive cards currently reuse this clip because no archive-specific images or videos have been added yet. Add the final archive media under `public/` and update the video source in `src/ArchiveSection.jsx`. Variant portrait slots are intentionally placeholders until the corresponding character images are provided.

The hero video autoplays muted and loops behind the title. Keep its source in `App.jsx` unchanged if you only want to update the lower-section media.

## 5. Build for deployment

```bash
npm run build
```

The production files will be created in the `dist/` folder.

## Fonts

The page loads Anton for display headings, Manrope for UI text, and IBM Plex Mono for small TVA-style labels. An internet connection is needed to load these Google Fonts; system fallbacks are included.
