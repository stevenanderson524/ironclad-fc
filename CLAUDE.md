# Ironclad FC — Claude Code Context

## What this project is
AEM Edge Delivery Services (EDS) demo site for a fictitious football club called **Ironclad FC**.
Built to demonstrate Adobe AEM to sports organizations.

## Architecture
- **Code layer:** This GitHub repo — blocks, styles, scripts only
- **Content layer:** DA (Document Authoring) at da.live — do NOT create content files here
- **Preview:** https://main--ironclad-fc--stevenanderson524.aem.page/
- **Live:** https://main--ironclad-fc--stevenanderson524.aem.live/
- **DA edit base:** https://da.live/edit#/stevenanderson524/ironclad-fc/

## Brand tokens
- `--background-color: #0D0D0D` — Iron Black
- `--text-color: #F5F4F0` — Forge White
- `--highlight-color: #FF4500` — Iron Orange
- `--secondary-color: #3A3A3A` — Steel
- `--hover-color: #FF6B35` — Ember

## Typography
- Headings: Roboto Slab 900 (Google Fonts)
- Body: Roboto 400 (Google Fonts)
- Eyebrow: Roboto 500, uppercase, tracked, color #FF4500

## Pages (all content lives in DA, not this repo)
- `/` — Homepage: hero, match cards, news cards, captain quote
- `/brand` — Brand guidelines: colors, typography, logo, voice, Content Hub link
- `/news` — Newsroom: 6 news cards
- `/roster` — Squad: GK, DEF, MID, FWD sections
- `/schedule` — Fixtures, results, standings

## Blocks in use
Standard ise-boilerplate blocks only: hero, cards, columns, quote

## Key demo narrative
"I built this entire site in a document editor. No developer needed."
The DA authoring story is the primary sales motion — keep the code layer clean.

## Rules
- Only modify styles, blocks, scripts — never create .html content files
- Dark-first always: Iron Black bg, Forge White text, Iron Orange accents
- Commit with clear messages — the commit history is visible during demos
- After any style change, remind user to Preview/Publish in da.live
