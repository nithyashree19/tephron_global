import { useEffect, useLayoutEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";
import IntroLoader from "./components/IntroLoader";
import SocialSidebar from "./components/SocialSidebar";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import AboutPage from "./components/AboutPage";
import ServicesPage from "./components/ServicesPage";
import ServiceDetailPage from "./components/ServiceDetailPage";
import Career from "./components/Career";
import GalleryPage from "./components/GalleryPage";
import BlogPage from "./components/BlogPage";
import BlogPostPage from "./components/BlogPostPage";
import PrivacyPage from "./components/PrivacyPage";
import TermsPage from "./components/TermsPage";
import NotFound from "./components/NotFound";
import ContactPage from "./components/ContactPage";
import Footer from "./components/Footer";

import { gsap, ScrollTrigger, prefersReducedMotion } from "./lib/motion";
import { hasGallery } from "./lib/gallery";
import { pages, notFound, SITE_URL } from "./lib/seo";

// Soft cross-fade whenever the route changes, then re-measure every
// ScrollTrigger because the page height has just changed.
const PageTransition = ({ children }) => {
  const ref = useRef(null);
  const { pathname } = useLocation();
  const first = useRef(true);

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
    } else if (!prefersReducedMotion()) {
      gsap.fromTo(
        ref.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: "power2.out", clearProps: "opacity" }
      );
    }
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return <div ref={ref}>{children}</div>;
};

// Keeps the tab title, description and share tags in step with the page
// when people move around without a full reload. (The same values are
// written into each page's static HTML at build time by scripts/prerender.mjs.)
const PageMeta = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const key = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
    const page = pages[key] || notFound;
    const set = (selector, attr, value) =>
      document.head.querySelector(selector)?.setAttribute(attr, value);

    document.title = page.title;
    set('meta[name="description"]', "content", page.description);
    set('meta[property="og:title"]', "content", page.title);
    set('meta[property="og:description"]', "content", page.description);
    set('meta[name="twitter:title"]', "content", page.title);
    set('meta[name="twitter:description"]', "content", page.description);
    if (pages[key]) {
      set('link[rel="canonical"]', "href", SITE_URL + key);
      set('meta[property="og:url"]', "content", SITE_URL + key);
    }
  }, [pathname]);

  return null;
};

const Shell = () => {
  // fonts and images change layout after first paint: re-measure triggers
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2.5 focus:text-white"
      >
        Skip to content
      </a>
      <PageMeta />
      <IntroLoader />
      <ScrollToTop />
      <Navbar />
      <SocialSidebar />

      <main id="main" className="min-h-screen">
        <PageTransition>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/careers" element={<Career />} />
            {hasGallery && <Route path="/gallery" element={<GalleryPage />} />}
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </main>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
