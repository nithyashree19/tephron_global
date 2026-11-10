# Tephron Global (Apple-style redesign)

React 19 + Vite + Tailwind 4 + GSAP 3.15 (SplitText, Draggable, InertiaPlugin, ScrollTrigger).

    npm install
    npm run dev       # local development
    npm run build     # production build in /dist

## Where things live
- `src/index.css`         design tokens (light/dark), type scale, buttons, materials
- `src/lib/motion.js`     spring easings, `useMotion` hook, shared animation helpers
- `src/components/Hero.jsx`      hero sequence, scroll + pointer motion
- `src/components/Services.jsx`  draggable inertia rail
- `src/components/ui.jsx`        Btn, PageHeader, SectionHead, CtaBand, AnimatedCheck

## Notes
- Colours are CSS variables (`--bg`, `--fg`, `--accent` ...). Change the brand colour in one place.
- Reduced-motion visitors get the full content with no animation.
- Forms (contact + job application) log to the console only; connect a backend to send them.

## Animation map (each area has its own identity)
- Headings: line-by-line mask reveal (SplitText), via `revealHeadings`
- Hero: masked headline, clip-path product frame, scroll scale + parallax, pointer depth
- Stats: SVG rings draw while numbers count
- About: scroll-lit statement; pillars wipe in from left / right / bottom
- Industries: marquee speed follows scroll velocity and direction
- Services: draggable inertia rail, clip-path cards, "Drag" cursor
- Services page: pinned, scrubbed 3-step process
- Gallery / Blog / Contact / Careers: directional clip-path wipes, zoom-settle images
- Footer: links slide in, icons spring, wordmark builds letter by letter
- Custom cursor ring (mouse only); everything respects prefers-reduced-motion

## Contributing (GitHub workflow)
- Branch from `main`: `feat/...`, `fix/...`, `chore/...`
- Commit messages follow Conventional Commits: `fix(career): stop search icon overlapping text`
- Open a pull request; CI (`.github/workflows/ci.yml`) runs lint + build and must pass
- Dependabot opens weekly dependency updates
- Hero image lives in `src/assets` (`tephron-hero.webp` is served, `tephron-hero.png` is the fallback)
