# Barely Worn — Concept Website

A high-fidelity, **Awwwards-minded editorial fashion concept** for *Barely Worn*, a curated premium thrift boutique in Silver Lakes, Pretoria. Built as a static, backend-free site ready to drop onto **GitHub Pages**.

> This is a design concept & interaction prototype — not a production store. There is no cart, checkout, account, or payment gateway. The only conversion path is a personal **WhatsApp enquiry**.

---

## Design system — A-R-C Opener Sequence (literal)

The visual language is taken literally from `uploads/a-r-c-opener-sequence-DESIGN.md`, applied to the Barely Worn brand:

| Token (from `.md`)            | Value        | Used as                                   |
|-------------------------------|--------------|-------------------------------------------|
| `primary / accent / bg`       | `#FFB86C`    | Page canvas · WhatsApp pills · accents    |
| `secondary`                   | `#000000`    | Inverted story/footer sections            |
| `surface`                     | `#FFFFFF`    | Store-info & philosophy panels            |
| `text-primary`                | `#111827`    | Headlines, body, masthead                 |
| `text-secondary`              | `#4B5563`    | Supporting copy on white                  |
| `border`                      | `#E5E7EB`    | Hairlines on white surfaces               |
| display — `ui-sans-serif`     | 500 / 1.04   | Inter — oversized headlines               |
| body — `Helvetica Neue`       | 400 / 1.6    | Inter — body copy                         |
| label — `JetBrains Mono`      | 600 / 1.2    | Metadata, `[01]` sequences, nav, prices   |
| spacing                       | 8 / 16 / 24 / 80 px | base / gap / card / section       |
| radius                        | 8 / 8 / 9999 | card / control / pill buttons             |

Editorial devices borrowed from the reference: numbered `[01]…[06]` sequences, mono metadata labels, masked/staggered scroll reveals, hover-lift, depth parallax, and the full-bleed peach canvas with black/white rhythm sections.

---

## File structure

```
index.html            Home — parallax masthead hero, featured arrivals, brand story, store info
new-arrivals.html     The Showroom — filterable archive + per-item WhatsApp ordering
about.html            Editorial story — manifesto, pull-quote, philosophy pillars, process
contact.html          Minimal contact — stylised SVG map, hours, WhatsApp CTA, social
css/style.css         Full design system + responsive (desktop / tablet / mobile)
js/main.js            Nav, mobile menu, reveals, hero + depth parallax, filters
assets/images/        Generated cinematic editorial photography (10 images)
```

---

## Motion architecture (progressive enhancement)

The site is engineered to look correct **with zero external dependencies**, then upgrade when libraries load (e.g. on GitHub Pages):

- **Reveals** — `IntersectionObserver` + CSS (masked lines, staggered fade/scale). Works everywhere.
- **Lenis** smooth scroll — loaded via CDN; native scroll fallback otherwise.
- **Hero parallax** — `BARELY` drifts left/up, `WORN` drifts right/down via GSAP `ScrollTrigger` (scrub) when available, else a lightweight `requestAnimationFrame` handler.
- **Depth parallax** — `[data-speed]` cards/words move at differing rates (GSAP or rAF).
- All motion respects `prefers-reduced-motion`; touch devices skip pointer-only effects.

If CDN scripts are blocked (e.g. sandboxed preview), the site still animates and is fully usable.

---

## Imagery

All 10 photographs are **AI-generated** cinematic editorial shots, warm-graded to harmonise with the `#FFB86C` canvas (camel/cream/olive/stone/tone garments + a boutique interior + a hero figure). Swap any file in `assets/images/` to use real photography.

---

## Content notes

- **Products:** 8 curated pieces shown (grid scales to 50). Each has image, name, category, size, price, condition, and a dynamic WhatsApp link: `wa.me/27836035404?text=…[PRODUCT_NAME]…`.
- **Contact:** Stocks Centre, Graham Road, Silver Lakes, Pretoria · +27 83 603 5404 · full business hours.
- **Social:** Instagram `@barelyworndclothing`, Facebook `barelywornclothingsilverlakes`.

---

## Deploy to GitHub Pages

1. Push these files to a repository (root level).
2. Repo **Settings → Pages → Source: Deploy from a branch → `main` / root**.
3. Site live at `https://<user>.github.io/<repo>/`.

No build step, no server, no backend.
