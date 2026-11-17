import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { FiGrid, FiFileText, FiLayers, FiBriefcase, FiImage, FiPlus, FiGlobe, FiMenu, FiX, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import logo from "../assets/tephron-logo.jpg";
import heroImg from "../assets/tephron-hero.webp";
import ThemeToggle from "../components/ThemeToggle";
import { gsap, smooth, prefersReducedMotion } from "../lib/motion";
import { btnClass } from "./adminUi";
import "./admin.css";

const links = [
  { to: "/admin", label: "Dashboard", icon: FiGrid, end: true },
  { to: "/admin/blog", label: "Blog posts", icon: FiFileText, end: true },
  { to: "/admin/services", label: "Services", icon: FiLayers, end: true },
  { to: "/admin/jobs", label: "Job openings", icon: FiBriefcase, end: true },
  { to: "/admin/gallery", label: "Gallery", icon: FiImage, end: true },
];

const titleFor = (pathname) => {
  if (pathname === "/admin") return "Dashboard";
  if (pathname === "/admin/blog") return "Blog posts";
  if (pathname === "/admin/blog/new") return "New post";
  if (pathname === "/admin/services") return "Services";
  if (pathname === "/admin/services/new") return "New service";
  if (pathname.startsWith("/admin/services/") && pathname.endsWith("/edit")) return "Edit service";
  if (pathname === "/admin/gallery") return "Gallery";
  if (pathname === "/admin/gallery/new") return "Add photo";
  if (pathname.startsWith("/admin/gallery/") && pathname.endsWith("/edit")) return "Edit photo";
  if (pathname === "/admin/jobs") return "Job openings";
  if (pathname === "/admin/jobs/new") return "New opening";
  if (pathname.startsWith("/admin/jobs/") && pathname.endsWith("/edit")) return "Edit opening";
  if (pathname.endsWith("/edit")) return "Edit post";
  return "Admin";
};

// Sidebar links. The desktop version glides a highlight behind the active
// link (GSAP). The drawer uses a plain highlight.
const NavList = ({ compact = false, glide = false, navRef, indicatorRef, onNavigate }) => (
  <nav aria-label="Admin" ref={navRef} className="relative flex flex-col gap-1">
    {glide && (
      <span
        ref={indicatorRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 rounded-xl bg-accent-soft opacity-0"
        style={{ height: 0 }}
      />
    )}
    {links.map(({ to, label, icon: Icon, end }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        title={compact ? label : undefined}
        onClick={onNavigate}
        className={({ isActive }) =>
          `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.9375rem] transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
            compact ? "justify-center" : ""
          } ${
            isActive
              ? glide
                ? "font-medium text-accent"
                : "bg-accent-soft font-medium text-accent"
              : "text-muted hover:bg-bg-alt hover:text-fg"
          }`
        }
      >
        <Icon aria-hidden="true" size={18} className="shrink-0" />
        <span
          className={`whitespace-nowrap transition-[opacity,width] duration-300 ${
            compact ? "w-0 overflow-hidden opacity-0" : "opacity-100"
          }`}
        >
          {label}
        </span>
      </NavLink>
    ))}
  </nav>
);

const AdminLayout = () => {
  const { pathname } = useLocation();
  // The sidebar is always full width and fixed in place
  const collapsed = false;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const asideRef = useRef(null);
  const spacerRef = useRef(null);
  const navRef = useRef(null);
  const indicatorRef = useRef(null);
  const contentRef = useRef(null);
  const drawerRef = useRef(null);
  const scrimRef = useRef(null);

  // Keep the admin out of search results and give it its own tab title
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Admin · Tephron Global";
    let robots = document.querySelector('meta[name="robots"]');
    const created = !robots;
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    const previousContent = robots.content;
    robots.content = "noindex, nofollow";
    return () => {
      document.title = previousTitle;
      if (created) robots.remove();
      else robots.content = previousContent;
    };
  }, []);

  // Page enter: each route fades and rises in
  useLayoutEffect(() => {
    if (prefersReducedMotion() || !contentRef.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.8, ease: smooth, clearProps: "transform" }
      );
    }, contentRef);
    return () => ctx.revert();
  }, [pathname]);

  // Glide the highlight to the active link
  useLayoutEffect(() => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    if (!nav || !indicator) return;
    const reduce = prefersReducedMotion();
    const active = nav.querySelector('[aria-current="page"]');
    if (!active) {
      gsap.to(indicator, { opacity: 0, duration: reduce ? 0 : 0.3 });
      return;
    }
    gsap.to(indicator, {
      y: active.offsetTop,
      height: active.offsetHeight,
      opacity: 1,
      duration: reduce ? 0 : 0.7,
      ease: smooth,
    });
  }, [pathname, collapsed]);

  // Mobile drawer slides in from the left
  useLayoutEffect(() => {
    const panel = drawerRef.current;
    const scrim = scrimRef.current;
    if (!panel || !scrim) return;
    const reduce = prefersReducedMotion();
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
      gsap.set(panel, { display: "flex" });
      gsap.set(scrim, { display: "block" });
      gsap.fromTo(panel, { xPercent: -100 }, { xPercent: 0, duration: reduce ? 0 : 0.6, ease: smooth });
      gsap.to(scrim, { opacity: 1, duration: reduce ? 0 : 0.4 });
    } else {
      document.body.style.overflow = "";
      gsap.to(panel, {
        xPercent: -100,
        duration: reduce ? 0 : 0.45,
        ease: "power2.in",
        onComplete: () => gsap.set(panel, { display: "none" }),
      });
      gsap.to(scrim, {
        opacity: 0,
        duration: reduce ? 0 : 0.35,
        onComplete: () => gsap.set(scrim, { display: "none" }),
      });
    }
  }, [drawerOpen]);

  // Close the drawer on navigation and on Escape
  useEffect(() => setDrawerOpen(false), [pathname]);
  useEffect(() => {
    if (!drawerOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  return (
    <div className="admin-theme isolate relative flex min-h-screen bg-bg text-fg">
      {/* Tephron hero as the admin background, softened for readability */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: `url(${heroImg})` }} />
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-white/60 dark:bg-[#05080f]/75" />
      {/* Desktop sidebar */}
      {/* Spacer keeps the content clear of the fixed sidebar; it animates with the sidebar */}
      <div ref={spacerRef} aria-hidden="true" className="hidden shrink-0 md:block" style={{ width: 264 }} />

      <aside
        ref={asideRef}
        style={{ width: 264 }}
        className="fixed inset-y-0 left-0 z-40 hidden h-screen flex-col overflow-hidden border-r border-line glass md:flex"
      >
        <div className="flex items-center justify-between gap-2 px-4 pb-4 pt-5">
          <Link to="/admin" className="flex min-w-0 items-center gap-3">
            <img src={logo} alt="" className="h-9 w-9 shrink-0 rounded-xl object-cover" />
            <span className={`min-w-0 transition-opacity duration-300 ${collapsed ? "opacity-0" : "opacity-100"}`}>
              <span className="block truncate text-[0.9375rem] font-semibold tracking-[-0.01em]">Tephron</span>
              <span className="block truncate text-[0.8125rem] text-faint">Admin</span>
            </span>
          </Link>
        </div>

        <div className="px-3">
          <NavList compact={collapsed} glide navRef={navRef} indicatorRef={indicatorRef} />
        </div>

        <div className="mt-auto px-3 pb-5">
          <Link
            to="/"
            title={collapsed ? "View website" : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.9375rem] text-muted transition-colors hover:bg-bg-alt hover:text-fg ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <FiGlobe aria-hidden="true" size={18} className="shrink-0" />
            <span className={`whitespace-nowrap transition-opacity duration-300 ${collapsed ? "w-0 opacity-0" : "opacity-100"}`}>
              View website
            </span>
          </Link>
        </div>
      </aside>

      {/* Mobile drawer */}
      <div
        ref={scrimRef}
        onClick={() => setDrawerOpen(false)}
        className="fixed inset-0 z-40 bg-fg/20 opacity-0 md:hidden"
        style={{ display: "none" }}
        aria-hidden="true"
      />
      <div
        ref={drawerRef}
        style={{ display: "none", transform: "translateX(-100%)" }}
        className="fixed inset-y-0 left-0 z-50 w-[17rem] flex-col border-r border-line bg-glass backdrop-blur-xl md:hidden"
      >
        <div className="flex items-center justify-between px-4 pb-4 pt-5">
          <span className="flex items-center gap-3">
            <img src={logo} alt="" className="h-9 w-9 rounded-xl object-cover" />
            <span className="text-[0.9375rem] font-semibold">Tephron Admin</span>
          </span>
          <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close menu" className={btnClass("icon")}>
            <FiX size={18} />
          </button>
        </div>
        <div className="px-3">
          <NavList onNavigate={() => setDrawerOpen(false)} />
        </div>
        <div className="mt-auto px-3 pb-6">
          <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.9375rem] text-muted hover:bg-bg-alt hover:text-fg">
            <FiGlobe aria-hidden="true" size={18} /> View website
          </Link>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-line glass">
          <div className="flex h-14 items-center gap-3 px-4 md:px-10">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className={btnClass("icon", "md:hidden")}
            >
              <FiMenu size={18} />
            </button>
            <p className="text-[0.9375rem] font-semibold tracking-[-0.01em]">{titleFor(pathname)}</p>

            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 px-5 pb-24 pt-10 md:px-10 md:pt-12">
          <div ref={contentRef} className="mx-auto max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
