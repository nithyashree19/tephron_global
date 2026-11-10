# Tephron Global — Unslop Audit & Design Brief

## Five-Line Creative Direction

**Product:** A B2B operations outsourcing company based in Tenkasi, India, delivering IT and non-IT business process workflows to international brands.
**Character:** Exact. Instrumental. Confident without shouting. The precision of a Bloomberg terminal, the warmth of a well-run family business.
**World:** Control rooms, clean ops desks, structured workflows. Night-shift call center pods. A team that shows up reliably at 3 AM for a client in London.
**Moments of Richness:** One focal visual per page — the hero background photograph, the 3D service carousel, the live world clock strip in Footer. Everything else stays quiet and serves the data.
**Signature:** A thin 1px horizontal rule as leitmotif throughout — separating sections, the way a disciplined ops team separates one task from the next. No blobs. No neon. Just structure.

---

## Unslop Audit: Signs Found

### COLOR SLOP
- gradient-text-apple: hue-to-purple (blue→purple) — generic rainbow
- Multiple blur-3xl ambient blobs across all sections — visual noise
- Multi-stop hue rainbow gradient on hero headline span
- 5 simultaneous coloured light pillars in Footer background
- #9333ea purple appears only in gradient — zero brand connection

### TYPOGRAPHY SLOP
- .eyebrow class: tracking 0.12em + uppercase — shouting labels
- font-extrabold/font-black used widely — no weight discipline
- Mixed casing patterns inconsistent

### ICON SLOP
- ThemeToggle uses ☀️🌙 emoji as icons
- hover:scale-110 on sidebar icons — overworked micro-interaction

### SPACING SLOP
- Arbitrary JIT values: p-[13px], h-[31px] patterns
- CareerSection: p-8 sm:p-12 lg:p-16 — three breakpoint padding values
- Footer: pt-20 pb-10 — arbitrary asymmetric vertical

### COPY SLOP
- Hero eyebrow: "TEPHRON GLOBAL · INNOVATING OPERATIONS" — shouting
- Multiple emoji decorations in copy (🗓️, ✨)

---

## 9-Pass Implementation Status

- [x] Pass 1: Spacing — 4px grid, unified section padding
- [x] Pass 2: Color — single accent, remove blobs and rainbow gradients
- [x] Pass 3: Icons — emoji removal, standardise icon usage
- [x] Pass 4: Copy — natural voice, remove emoji and shouting
- [x] Pass 5: Typography — weight discipline (400/500/600/700 only)
- [x] Pass 6: Layout — About sticky fix, Services counter clean
- [x] Pass 7: Details — radius consistency, input focus, border discipline
- [x] Pass 8: Visuals — remove decorative blobs, keep focal hero image
- [x] Pass 9: Motion — specific transitions, Lenis scroll, remove pulse

