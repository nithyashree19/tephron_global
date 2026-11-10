// =====================================================================
// MOTION LIBRARY
// One place for every animation helper, so the whole site shares the
// same physics. Based on Apple's "fluid interfaces" principles:
//   - springs instead of fixed-duration curves
//   - critically damped (no overshoot) by default
//   - a little bounce only where the user's gesture carried momentum
//   - everything interruptible (GSAP re-targets from the live value)
// =====================================================================
import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin);
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, SplitText, Draggable, InertiaPlugin };

// ---------------------------------------------------------------------
// SPRING EASING
// Returns an easing function (progress 0..1 -> value) that follows a
// damped spring and is normalised to finish exactly at 1.
//   zeta = 1    -> critically damped: settles with no overshoot (default)
//   zeta < 1    -> under-damped: small overshoot (use for flicks / pops)
//   k           -> stiffness; higher settles earlier inside the duration
// ---------------------------------------------------------------------
export const spring = (zeta = 1, k = 9) => {
  if (zeta >= 1) {
    const end = 1 - (1 + k) * Math.exp(-k);
    return (p) => (1 - (1 + k * p) * Math.exp(-k * p)) / end;
  }
  const wd = k * Math.sqrt(1 - zeta * zeta);
  const f = (p) =>
    1 -
    Math.exp(-zeta * k * p) *
      (Math.cos(wd * p) + ((zeta * k) / wd) * Math.sin(wd * p));
  const end = f(1);
  return (p) => f(p) / end;
};

export const smooth = spring(1, 8); // default for almost everything
export const snappy = spring(1, 11); // quick UI feedback
export const bouncy = spring(0.68, 9); // gesture-with-momentum feel

// ---------------------------------------------------------------------
// REDUCED MOTION
// ---------------------------------------------------------------------
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------------------------------------------------------------------
// useMotion(setup, scopeRef, deps)
// Runs `setup` inside gsap.matchMedia() so that:
//   - it only runs when the visitor has NOT asked for reduced motion
//   - every tween / ScrollTrigger is cleaned up automatically
//   - selectors inside `setup` are scoped to `scopeRef`
// `setup` receives { desktop, fine } flags and may return a cleanup fn.
// ---------------------------------------------------------------------
export function useMotion(setup, scopeRef, deps = []) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(scopeRef?.current ?? undefined);
    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 768px)",
        fine: "(hover: hover) and (pointer: fine)",
      },
      (ctx) => {
        const { motion, desktop, fine } = ctx.conditions;
        if (!motion) return;
        return setup({ desktop, fine });
      }
    );
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// ---------------------------------------------------------------------
// INTRO HANDSHAKE
// The intro loader announces when it is finished so the hero can start
// its entrance at exactly the right moment.
// ---------------------------------------------------------------------
export const INTRO_EVENT = "tephron:intro-done";
export const introIsDone = () =>
  typeof window === "undefined" || window.__tephronIntroDone === true;
export const markIntroDone = () => {
  window.__tephronIntroDone = true;
  window.dispatchEvent(new Event(INTRO_EVENT));
};

// Starts `fn` once the intro is finished (or after a safety timeout).
export function whenIntroDone(fn) {
  if (introIsDone()) {
    fn();
    return () => {};
  }
  let called = false;
  const run = () => {
    if (called) return;
    called = true;
    fn();
  };
  window.addEventListener(INTRO_EVENT, run, { once: true });
  const t = setTimeout(run, 4000);
  return () => {
    window.removeEventListener(INTRO_EVENT, run);
    clearTimeout(t);
  };
}

// ---------------------------------------------------------------------
// MASKED PAGE-TITLE ENTRANCE
// Slides every `.mask-line` up out of its mask. Used by page headers.
// ---------------------------------------------------------------------
export function revealPageHeader(scope = "") {
  const tl = gsap.timeline({ defaults: { ease: smooth } });
  tl.from(`${scope} .ph-line`, { yPercent: 115, duration: 1.15, stagger: 0.1 })
    .from(`${scope} .ph-fade`, { opacity: 0, y: 16, duration: 0.9, stagger: 0.08 }, 0.3);
  return tl;
}

// ---------------------------------------------------------------------
// CLIP-PATH WIPES
// Starting shapes for directional reveals. Animate `from` one of these
// to nothing, and clear the property afterwards (a clip-path would
// otherwise cut off the element's box-shadow).
// ---------------------------------------------------------------------
export const clip = {
  left: "inset(0% 100% 0% 0%)", // wipes in from the left edge
  right: "inset(0% 0% 0% 100%)", // wipes in from the right edge
  bottom: "inset(100% 0% 0% 0%)", // rises from the bottom
  top: "inset(0% 0% 100% 0%)", // drops from the top
};

export function wipe(el, from, vars = {}) {
  return gsap.from(el, {
    clipPath: from,
    duration: 1.5,
    ease: "expo.out",
    clearProps: "clipPath",
    ...vars,
  });
}

// ---------------------------------------------------------------------
// HEADING REVEAL
// Titles are split into lines; each line rises out of its own mask.
// Leads simply fade in, so the two never compete. `scope` limits the
// search to one component.
// ---------------------------------------------------------------------
export function revealHeadings(scope) {
  if (!scope) return;
  scope.querySelectorAll(".sec-title").forEach((el) => {
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
      autoSplit: true, // re-splits on resize / font load
      onSplit(self) {
        return gsap.from(self.lines, {
          yPercent: 108,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      },
    });
  });
  scope.querySelectorAll(".sec-lead").forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      duration: 1.6,
      delay: 0.15,
      ease: "sine.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });
}
