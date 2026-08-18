# HarunOS — Portfolio of Harun Geçit

Personal website of **Harun Geçit — Senior Full Stack Developer & AI Engineer**, live at
[harungecit.com](https://harungecit.com) / [harungecit.dev](https://harungecit.dev).

The site is **HarunOS**: a retro phosphor-amber "desktop OS" that runs in the browser — draggable
windows, a start menu, a shell, a lock screen, roaming ASCII bots — built with **zero dependencies**
(plain HTML + CSS + vanilla JS, no bundler, no framework). Without JavaScript it degrades to a plain,
fully indexable single page (`<main id="seo-content">`).

[![Live](https://img.shields.io/badge/live-harungecit.com-ffb000?style=flat-square)](https://harungecit.com)
[![Version](https://img.shields.io/badge/HarunOS-v18.6-ffb000?style=flat-square)]()
[![Deploy](https://img.shields.io/badge/deploy-Netlify-00c7b7?style=flat-square)](https://www.netlify.com/)

## What's inside

| Window / app | Content |
| :-- | :-- |
| `welcome.txt` | Hero, roles, CTAs (view projects · get in touch · **start a project ↗**) |
| `about.txt` | Bio + gauges (years coding, AI engineering, tools, projects) |
| `ai_engine` | AI-driven SDLC pipeline + 9 capability modules (RAG, multi-LLM, agents, fine-tuning, AI security…) |
| `Projects` | Featured projects — Atlas PM, AI Infra Academy, RAG Knowledge Engine, OSS (Smart Changelists, PHP Email Validator, Vigilon, UBL Viewer)… |
| `skills.json` | Stack manifest — AI/LLM, Edge & Serverless (Next.js on Cloudflare Workers, D1/R2/KV), Laravel, Go, DevOps, security… |
| `career.log` | Experience timeline |
| `shell` | Mini terminal: `help about ai projects skills career contact social cv hire whoami neofetch open <app> clear` |
| `mail` | Contact details + Netlify Forms contact form (KVKK/GDPR consent), channels, CV links |
| `privacy.txt` | Privacy policy |
| desktop icons | `resume.pdf` → `/cv.pdf`, `hire_me` → basvuru.harungecit.dev, `blog` → echo.harungecit.dev, `ai_lab` → ai-lab.harungecit.dev, `trash` (easter egg) |

Language toggle **EN / TR** in the taskbar (`?lang=tr` or `localStorage['harunos-lang']`).

## Related services

| URL | What |
| :-- | :-- |
| [basvuru.harungecit.dev](https://basvuru.harungecit.dev) | **Project intake form** — anyone who wants to commission a project fills this in; it lands in the panel below. `harungecit.com/basvuru`, `/hire`, `/apply` redirect here. |
| [panel.harungecit.dev](https://panel.harungecit.dev) | Atlas PM — private CRM / project-management panel (Next.js 15 on Cloudflare Workers, D1, R2, KV) |
| [echo.harungecit.dev](https://echo.harungecit.dev) | Blog |
| [ai-lab.harungecit.dev](https://ai-lab.harungecit.dev) | AI Infra Academy |
| `/cv.pdf` · `/cv-ats.pdf` | Designed CV · ATS-friendly CV (published from the `cv` repo via `build.ps1 -Publish`) |

## Project structure

```
index.html                 # single source of truth: all content (EN) + HarunOS shell markup
assets/css/harunos.css     # theme (phosphor-amber), windows, desktop, responsive rules
assets/js/harunos.js       # window manager, terminal, i18n switch, contact form, lock screen, bots
assets/js/harunos-i18n.js  # Turkish dictionary (window.HARUNOS_TR) keyed by data-i18n
assets/sounds/button.mp3   # UI click
cv.pdf, cv-ats.pdf         # CVs (generated elsewhere, copied here on publish)
netlify.toml               # headers (no-cache for CVs, immutable for assets), redirects
robots.txt, sitemap.xml
screensaver-*.html, lifecycle-*.html, hire-section.html   # design prototypes (not linked from the site)
assets/css/styles.css, assets/js/script.js, assets/js/terminal.js   # legacy (pre-HarunOS) — unused
```

## Editing content

- **English text lives in `index.html`** inside `<section class="appsrc" id="sec-…">` blocks. HarunOS clones these into windows.
- **Turkish text lives in `assets/js/harunos-i18n.js`**; every translatable node carries a `data-i18n="key"`.
- New window: add a `<section class="appsrc" id="sec-xyz" data-title="…" data-gl="…" data-w="…" data-h="…">`,
  a desktop icon (`<button class="icon" data-app="xyz">`) and a start-menu item (`<button class="sm-item" data-app="xyz">`).
  External links use `data-href="https://…"` instead of `data-app`.
- After changing CSS/JS bump the `?v=` query string on the three asset tags in `index.html` (and the version strings in `harunos.js` boot log / `neofetch`).

## Run locally

No build step.

```bash
npx http-server -p 8080     # or just open index.html
node --check assets/js/harunos.js assets/js/harunos-i18n.js   # syntax check
```

## Deployment

Netlify, branch `harungecit.com`, `publish = "."`, no build command. Custom headers and redirects are in `netlify.toml`
(`/cv.pdf` and `/cv-ats.pdf` are served with `max-age=0, must-revalidate`; `/basvuru`, `/hire`, `/apply` → basvuru.harungecit.dev; `/panel` → panel.harungecit.dev).

## Author

**Harun Geçit** — [harungecit.com](https://harungecit.com) · [github.com/harungecit](https://github.com/harungecit) · [linkedin.com/in/harungecit](https://linkedin.com/in/harungecit) · [echo.harungecit.dev](https://echo.harungecit.dev) · [bio.link/harungecit](https://bio.link/harungecit) · info@harungecit.com

## License

© 2026 Harun Geçit. All rights reserved. Content and design may not be reused without permission.
