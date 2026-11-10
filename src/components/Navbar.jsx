import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import logo from "../assets/tephron-logo.jpg";
import ThemeToggle from "./ThemeToggle";
import { Btn } from "./ui";
import {
  gsap,
  clip,
  ScrollTrigger,
  smooth,
  prefersReducedMotion,
  whenIntroDone,
} from "../lib/motion";

const links = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Careers", path: "/careers" },
  { name: "Gallery", path: "/gallery" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  const headerRef = useRef(null);
  const navRef = useRef(null);
  const indicatorRef = useRef(null);
  const barRef = useRef(null);
  const menuRef = useRef(null);
  const menuTl = useRef(null);

  // ---- glass background appears once the page has scrolled -----------
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ---- entrance (after the intro loader) -----------------------------
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    let stop = () => {};
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: smooth } });
      tl.from(".nav-logo", { clipPath: clip.left, duration: 1.3, ease: "expo.out", clearProps: "clipPath" })
        .from(".nav-item", { opacity: 0, y: -10, duration: 0.8, stagger: 0.04 }, 0.05)
        .from(".nav-right", { opacity: 0, y: -10, duration: 0.9 }, 0.1);
      stop = whenIntroDone(() => tl.play());
    }, headerRef);
    return () => {
      stop();
      ctx.revert();
    };
  }, []);

  // ---- scroll progress hairline --------------------------------------
  useEffect(() => {
    const set = gsap.quickSetter(barRef.current, "scaleX");
    set(0);
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => set(self.progress),
    });
    return () => st.kill();
  }, []);

  // ---- gliding indicator under the links -----------------------------
  useEffect(() => {
    const nav = navRef.current;
    const ind = indicatorRef.current;
    if (!nav || !ind) return;
    const instantOnly = prefersReducedMotion();

    const active = () => nav.querySelector('[aria-current="page"]');
    const moveTo = (el, instant = false) => {
      if (!el) {
        gsap.to(ind, { opacity: 0, duration: 0.3, overwrite: "auto" });
        return;
      }
      const nr = nav.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      gsap.to(ind, {
        x: r.left - nr.left,
        width: r.width,
        opacity: 1,
        duration: instant || instantOnly ? 0 : 0.7,
        ease: smooth,
        overwrite: "auto",
      });
    };

    moveTo(active(), true);
    document.fonts?.ready.then(() => moveTo(active(), true));

    const items = [...nav.querySelectorAll("a")];
    const enter = (e) => moveTo(e.currentTarget);
    const leave = () => moveTo(active());
    const resize = () => moveTo(active(), true);

    items.forEach((l) => l.addEventListener("pointerenter", enter));
    items.forEach((l) => l.addEventListener("focus", enter));
    nav.addEventListener("pointerleave", leave);
    window.addEventListener("resize", resize);
    return () => {
      items.forEach((l) => l.removeEventListener("pointerenter", enter));
      items.forEach((l) => l.removeEventListener("focus", enter));
      nav.removeEventListener("pointerleave", leave);
      window.removeEventListener("resize", resize);
    };
  }, [pathname]);

  // ---- mobile menu: ONE reversible timeline, so it is interruptible ---
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: smooth } });
      tl.fromTo(
        menuRef.current,
        { display: "none", opacity: 0, clipPath: "inset(0 0 100% 0)" },
        {
          display: "flex",
          opacity: 1,
          clipPath: "inset(0 0 0% 0)",
          duration: 0.75,
        }
      )
        .from(".m-link", { y: 34, opacity: 0, stagger: 0.05, duration: 0.8 }, 0.12)
        .from(".m-foot", { y: 18, opacity: 0, duration: 0.7 }, 0.4);
      menuTl.current = tl;
    }, menuRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const tl = menuTl.current;
    if (!tl) return;
    const fast = prefersReducedMotion() ? 60 : 1;
    if (open) tl.timeScale(fast).play();
    else tl.timeScale(fast * 1.7).reverse();
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // close on navigation and on Escape
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const solid = scrolled || open;

  return (
    <>
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 h-[var(--header-h)]"
      >
        {/* background material fades in when scrolled */}
        <div
          aria-hidden="true"
          className="nav-bg absolute inset-0 transition-opacity duration-500"
          style={{ opacity: solid ? 1 : 0 }}
        />

        <div className="wrap relative flex h-full items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr]">
          {/* LOGO */}
          <NavLink
            to="/"
            aria-label="Tephron Global home"
            className="nav-logo flex items-center gap-2.5 justify-self-start"
          >
            <img
              src={logo}
              alt=""
              width="32"
              height="32"
              className="h-8 w-8 rounded-[9px] object-cover shadow-[0_1px_6px_rgba(0,0,0,0.25)]"
            />
            <span className="text-[17px] font-semibold tracking-[-0.02em]">
              Tephron <span className="font-medium text-muted">Global</span>
            </span>
          </NavLink>

          {/* DESKTOP LINKS */}
          <nav
            ref={navRef}
            aria-label="Main"
            className="relative hidden items-center lg:flex"
          >
            <span
              ref={indicatorRef}
              aria-hidden="true"
              className="absolute left-0 top-1/2 h-8 w-0 -translate-y-1/2 rounded-full bg-accent-soft opacity-0"
            />
            {links.map((l) => (
              <NavLink
                key={l.path}
                to={l.path}
                className={({ isActive }) =>
                  `nav-item relative z-10 rounded-full px-3.5 py-1.5 text-[14px] font-medium tracking-[-0.005em] transition-colors duration-300 ${
                    isActive ? "text-fg" : "text-muted hover:text-fg"
                  }`
                }
              >
                {l.name}
              </NavLink>
            ))}
          </nav>

          {/* RIGHT SIDE */}
          <div className="nav-right flex items-center gap-3 justify-self-end">
            <ThemeToggle />
            <Btn to="/contact" small className="hidden sm:inline-flex">
              Let’s talk
            </Btn>

            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="relative -mr-2 flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
            >
              <span
                className="absolute h-[1.5px] w-[18px] rounded bg-fg transition-transform duration-500"
                style={{
                  transform: open ? "rotate(45deg)" : "translateY(-4px)",
                  transitionTimingFunction: "var(--ease-out)",
                }}
              />
              <span
                className="absolute h-[1.5px] w-[18px] rounded bg-fg transition-transform duration-500"
                style={{
                  transform: open ? "rotate(-45deg)" : "translateY(4px)",
                  transitionTimingFunction: "var(--ease-out)",
                }}
              />
            </button>
          </div>
        </div>

        {/* scroll progress hairline */}
        <div
          ref={barRef}
          aria-hidden="true"
          className="absolute bottom-[-1px] left-0 h-[2px] w-full origin-left bg-accent"
          style={{ transform: "scaleX(0)", opacity: scrolled ? 1 : 0, transition: "opacity .4s" }}
        />
      </header>

      {/* MOBILE MENU: full-screen sheet below the header */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className="fixed inset-0 z-40 hidden flex-col justify-between overflow-y-auto overscroll-contain bg-bg px-[clamp(1.25rem,4vw,2rem)] pb-[max(2rem,env(safe-area-inset-bottom))] pt-[calc(var(--header-h)+1.5rem)] lg:hidden"
        style={{ display: "none" }}
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {links.map((l) => (
            <NavLink
              key={l.path}
              to={l.path}
              className={({ isActive }) =>
                `m-link border-b border-line py-3 text-[clamp(1.5rem,6vw,2.25rem)] font-semibold leading-tight tracking-[-0.03em] transition-colors active:text-accent ${
                  isActive ? "text-accent" : "text-fg"
                }`
              }
            >
              {l.name}
            </NavLink>
          ))}
        </nav>

        <div className="m-foot pt-6">
          <Btn to="/contact" arrow className="w-full">
            Let’s talk
          </Btn>
          <p className="t-caption mt-4 text-center text-muted">
            24/7/365 dedicated client operations
          </p>
        </div>
      </div>
    </>
  );
};

export default Navbar;
