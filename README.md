# HarunOS — Portfolio of Harun Geçit

Personal website of **Harun Geçit — Senior AI Engineer & Full Stack Developer**, live at
[harungecit.com](https://harungecit.com) / [harungecit.dev](https://harungecit.dev).

The site is **HarunOS**: a retro phosphor-amber "desktop OS" that runs in the browser — draggable
windows, a start menu, a shell, a lock screen, roaming ASCII bots — built with **zero dependencies**
(plain HTML + CSS + vanilla JS, no bundler, no framework). Without JavaScript it degrades to a plain,
fully indexable single page (`<main id="seo-content">`).

[![Live](https://img.shields.io/badge/live-harungecit.com-ffb000?style=flat-square)](https://harungecit.com)
[![Version](https://img.shields.io/badge/HarunOS-v18.8-ffb000?style=flat-square)]()
[![Deploy](https://img.shields.io/badge/deploy-Netlify-00c7b7?style=flat-square)](https://www.netlify.com/)

## What's inside

| Window / app | Content |
| :-- | :-- |
| `welcome.txt` | Hero: Senior AI Engineer & Full Stack Developer, roles (AI Engineer · LLM Agents, Forward-Deployed AI Engineer, Full Stack · Python · Go · PHP · Node.js, DevOps & Security), CTAs (view projects · get in touch · **start a project ↗**) |
| `about.txt` | Bio (forward-deployed AI work, polyglot backend) + gauges (years coding, AI engineering, AI systems shipped, companies, projects) |
| `ai_engine` | Forward-deployed method (Discover → Design → Build → Operate) + 9 modules: agents & tool calling, RAG & PageIndex, guardrails, multi-provider routing & cost, conversation/persona/decision design, self-hosted LLMs, MCP & integrations, workflow automation, AI-driven engineering |
| `Projects` | Featured projects — Atlas PM, DevBox, Turkish Payment Gateways AI Agent Docs, AI Infra Academy, OSS (Smart Changelists, PHP Email Validator, Vigilon, UBL Viewer)… |
| `skills.json` | Stack manifest — AI/LLM, models & platforms (Claude, Gemini, OpenRouter, Groq, NVIDIA NIM, llama.cpp, MCP), languages incl. Python & Node.js, Edge & Serverless, Laravel, Go, DevOps, security… |
| `career.log` | Experience timeline |
| `cv_reel.mp4` | 15s motion-graphics CV reel (`/media/cv-reel.mp4`, autoplays on open, pauses on minimize) — rendered from the `cv` repo's `video/` folder |
| `shell` | Mini terminal (answers in EN or TR): `help about ai projects skills career contact social cv reel hire whoami neofetch open <app> clear` |
| `mail` | Contact details + Netlify Forms contact form (KVKK/GDPR consent), channels, CV links |
| `privacy.txt` | Privacy policy |
| desktop icons | `resume.pdf` → `/cv.pdf`, `hire_me` → basvuru.harungecit.dev, `blog` → echo.harungecit.dev, `ai_lab` → ai-lab.harungecit.dev, `trash` (easter egg) |

Language toggle **EN / TR** in the taskbar (`?lang=tr` or `localStorage['harunos-lang']`). `/?lang=tr` is declared as the Turkish
variant with `hreflang` (in `<head>` and `sitemap.xml`) and becomes self-canonical at runtime.

Accessibility: once JS runs, the shell is exposed to assistive tech (`aria-hidden` removed, windows are
`role="dialog"`), desktop icons open with **Enter / Space**, window controls are real buttons, the start menu
reports `aria-expanded`, and **Esc** closes the focused window and returns focus to what opened it.

## Related services

| URL | What |
| :-- | :-- |
| [basvuru.harungecit.dev](https://basvuru.harungecit.dev) | **Project intake form** — anyone who wants to commission a project fills this in; it lands in the panel below. `harungecit.com/basvuru`, `/hire`, `/apply` redirect here. |
| [echo.harungecit.dev](https://echo.harungecit.dev) | Blog |
| [ai-lab.harungecit.dev](https://ai-lab.harungecit.dev) | AI Infra Academy |
| `/cv.pdf` · `/cv-ats.pdf` | Designed CV · ATS-friendly CV (published from the `cv` repo via `build.ps1 -Publish`) |

## Project structure

```
index.html                 # single source of truth: all content (EN) + HarunOS shell markup
assets/css/harunos.css     # theme (phosphor-amber), @font-face, windows, desktop, responsive rules
assets/fonts/*.woff2       # self-hosted IBM Plex Mono + VT323 (latin + latin-ext, SIL OFL) — no Google Fonts requests
assets/js/harunos.js       # window manager, terminal, i18n switch, contact form, lock screen, bots
assets/js/harunos-i18n.js  # Turkish dictionary (window.HARUNOS_TR) keyed by data-i18n
assets/sounds/button.mp3   # UI click
media/og-image.png         # 1200×630 social preview (source: prototypes/og-image.html)
404.html                   # real 404 page (no SPA catch-all)
cv.pdf, cv-ats.pdf         # CVs (generated elsewhere, copied here on publish)
netlify.toml               # headers (no-cache for CVs, immutable for assets), redirects
robots.txt, sitemap.xml
prototypes/                # design prototypes + og-image source — kept in the repo, served as 404
```

## Editing content

- **English text lives in `index.html`** inside `<section class="appsrc" id="sec-…">` blocks. HarunOS clones these into windows.
- **Turkish text lives in `assets/js/harunos-i18n.js`**; every translatable node carries a `data-i18n="key"`.
- New window: add a `<section class="appsrc" id="sec-xyz" data-title="…" data-gl="…" data-w="…" data-h="…">`,
  a desktop icon (`<button class="icon" data-app="xyz">`) and a start-menu item (`<button class="sm-item" data-app="xyz">`).
  External links use `data-href="https://…"` instead of `data-app`.
- After changing CSS/JS bump the `?v=` query string on the asset tags in `index.html` and `404.html` (and the version strings in `harunos.js` boot log / `neofetch`).
- Social image: edit `prototypes/og-image.html`, then
  `chrome --headless=new --hide-scrollbars --window-size=1200,630 --screenshot=media/og-image.png prototypes/og-image.html`.

## Run locally

No build step.

```bash
npx http-server -p 8080     # or just open index.html
node --check assets/js/harunos.js assets/js/harunos-i18n.js   # syntax check
```

## Deployment

Netlify, branch `harungecit.com`, `publish = "."`, no build command. Custom headers and redirects are in `netlify.toml`
(`/cv.pdf` and `/cv-ats.pdf` are served with `max-age=0, must-revalidate`; `/basvuru`, `/hire`, `/apply` → basvuru.harungecit.dev;
`/prototypes/*`, `/README.md`, `/package.json` → 404). There is no SPA catch-all, so unknown paths return a real 404.

### Security headers

All paths: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`
(HSTS comes from Netlify). The HTML page also gets a strict **Content-Security-Policy** (`script-src 'self'` + the hash of the one
inline script). If you change that inline `<script>` in `index.html`, recompute the hash and update both CSP entries in `netlify.toml`:

```bash
node -e "const h=require('fs').readFileSync('index.html','utf8');const s=/<script>([\s\S]*?)<\/script>/.exec(h)[1];console.log('sha256-'+require('crypto').createHash('sha256').update(s).digest('base64'))"
```

## Author

**Harun Geçit** — [harungecit.com](https://harungecit.com) · [github.com/harungecit](https://github.com/harungecit) · [linkedin.com/in/harungecit](https://linkedin.com/in/harungecit) · [echo.harungecit.dev](https://echo.harungecit.dev) · [bio.link/harungecit](https://bio.link/harungecit) · info@harungecit.com

## License

© 2026 Harun Geçit. All rights reserved. Content and design may not be reused without permission.
