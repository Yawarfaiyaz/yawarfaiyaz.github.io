# Yawar Faiyaz · Portfolio

Live site: **https://yawarfaiyaz.github.io/**

A cinematic single-page portfolio built with React 19, TypeScript, Vite, Tailwind CSS, GSAP (ScrollTrigger), Framer Motion, Lenis smooth scrolling, and Three.js via React Three Fiber.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173 (includes the "Customize (dev)" panel)
npm run build    # type-checks and writes static files to dist/
```

## Where to edit your content

All personal details live in **`src/data/portfolio.config.ts`**:

| Field | What it controls |
| --- | --- |
| `name`, `tagline`, `bio` | Hero, about section, and page metadata |
| `email`, `links` | Contact section, footer, and resume header |
| `photo` | Hero portrait (defaults to your GitHub avatar) |
| `qualities` | The "Qualities I bring" bento grid |
| `skillGroups` | Technical skill tiles |
| `skillMeters` | Animated proficiency bars (**placeholder levels; set your own**) |
| `projects` | Projects & case studies (cards plus the modal view) |
| `education`, `certifications`, `resumeSummary` | Resume page |

The dev-only **Customize** panel previews name, tagline, and bio edits live. Changes are not saved; copy the final text into the config file.

## Movie scenes, theme, and cursor

- **Scenes:** `movieScenes` in `portfolio.config.ts` drives the scroll-linked background. Scene 1 covers Hero and About, Scene 2 covers Skills and Projects, and Scene 3 covers Learning, Resume, and Contact. Put clips in `public/videos/scene-1.mp4` (and 2 and 3). Playback is clamped to 0–13 seconds. Until a file exists, a built-in animated silhouette plays.
- **Cursor colour:** `cursorColorMode: 'live-video'` samples the active scene; `'theme-accent'` uses the theme gold.
- **Theme:** the sun/moon button switches Dark and Day Mode and is remembered in `localStorage`. The FX button turns the movie layer, grain, and particles on or off.
- Only use footage you own or have licence to publish. Copyrighted film clips should not be committed to a public repository.

## Photos

1. Put image files in **`public/images/`** (for example `public/images/portrait.jpg`).
2. Reference them with a leading slash:
   - Hero portrait: `photo.src: '/images/portrait.jpg'`
   - Project cover: `image: '/images/ebs-cover.jpg'` on a project
3. Recommended sizes: portrait 1200×1500 px (4:5), project cover 1600×900 px (16:9). Keep files under about 500 KB, using JPG or WebP.

## Deploying to GitHub Pages

This repository is a **user site**: the repo name must be `yawarfaiyaz.github.io`.

1. Create the repository `yawarfaiyaz/yawarfaiyaz.github.io` on GitHub (public, empty).
2. Push this code to `main`:
   ```bash
   git init -b main
   git add .
   git commit -m "Initial portfolio"
   git remote add origin https://github.com/Yawarfaiyaz/yawarfaiyaz.github.io.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
4. Each push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it.

## Project structure

```
src/
  data/portfolio.config.ts   ← edit your content here
  components/                 Hero, About, Skills, Projects, Resume, Contact, …
  context/                    Config and toast providers
  styles/index.css            Theme tokens, grain overlay, print styles
public/                       Static assets (favicon, 404 redirect, images/)
.github/workflows/deploy.yml  Build & deploy to GitHub Pages
```

## Notes

- The resume page prints cleanly: **Download PDF Resume** opens the browser print dialog with only the resume visible. Choose "Save as PDF".
- The custom cursor is disabled on touch devices and reduced-motion is not yet special-cased; add a `prefers-reduced-motion` check in `App.tsx` if you need it.
