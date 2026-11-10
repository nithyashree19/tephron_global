import { useEffect, useLayoutEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";
import IntroLoader from "./components/IntroLoader";
import SocialSidebar from "./components/SocialSidebar";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import AboutPage from "./components/AboutPage";
import ServicesPage from "./components/ServicesPage";
import Career from "./components/Career";
import GalleryPage from "./components/GalleryPage";
import BlogPage from "./components/BlogPage";
import ContactPage from "./components/ContactPage";
import Footer from "./components/Footer";

import { gsap, ScrollTrigger, prefersReducedMotion } from "./lib/motion";

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
            <Route path="/careers" element={<Career />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<Home />} />
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
