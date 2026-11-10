import { useRef } from "react";
import { Link } from "react-router-dom";
import { FiArrowUp, FiArrowUpRight } from "react-icons/fi";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
} from "react-icons/fa6";

import logo from "../assets/tephron-logo.jpg";
import { gsap, SplitText, useMotion } from "../lib/motion";

const year = new Date().getFullYear();
const phone = "918300378470";
const displayPhone = "+91 83003 78470";
const email = "tephronglobal@gmail.com";
const address =
  "1st West Street, Mangammal Salai, Pothigai Nagar, Tenkasi - 627811, Tamil Nadu, India";

const socialLinks = [
  { name: "LinkedIn", icon: FaLinkedinIn, url: "https://www.linkedin.com/company/tephron-global/" },
  { name: "Instagram", icon: FaInstagram, url: "https://www.instagram.com/tephron_global/" },
  { name: "Facebook", icon: FaFacebookF, url: "https://www.facebook.com/" },
  { name: "X", icon: FaXTwitter, url: "https://x.com/" },
];

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "About us", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Careers", path: "/careers" },
  { name: "Gallery", path: "/gallery" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

const capabilities = [
  "Customer support outsourcing",
  "Flight booking chat support",
  "Back-office and data entry",
  "Medical billing operations",
  "Semi-voice and voice BPO",
  "High-performance staffing",
];

const Footer = () => {
  const root = useRef(null);

  useMotion(() => {
    const st = { trigger: root.current, start: "top 85%", once: true };
    // links slide in from the left, column by column
    gsap.from(".foot-link", { x: -22, opacity: 0, duration: 1.1, ease: "power3.out", stagger: 0.045, scrollTrigger: st });
    gsap.from(".foot-brand", { opacity: 0, duration: 1.4, ease: "sine.out", scrollTrigger: st });
    // social icons spring in
    gsap.from(".foot-social", { scale: 0, duration: 1.2, ease: "elastic.out(1, 0.55)", stagger: 0.1, delay: 0.3, scrollTrigger: st });
    gsap.from(".foot-legal", { opacity: 0, duration: 1.2, delay: 0.5, ease: "sine.out", scrollTrigger: st });

    // giant wordmark: letters rise out of a mask as the footer scrolls in
    const split = SplitText.create(".foot-mark", { type: "chars", mask: "chars" });
    gsap.from(split.chars, {
      yPercent: 110,
      ease: "none",
      stagger: 0.05,
      scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom bottom", scrub: 0.6 },
    });
    return () => split.revert();
  }, root);

  const colHead = "text-[0.8125rem] font-semibold text-fg";
  const link =
    "t-small text-muted transition-colors duration-200 hover:text-fg";

  return (
    <footer ref={root} className="relative overflow-hidden bg-bg-alt">
      <div className="wrap pt-12 sm:pt-16 md:pt-20">
        <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-[1.4fr_1fr_1.1fr_1.3fr]">
          {/* BRAND */}
          <div className="foot-brand">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img src={logo} alt="" width="36" height="36" className="h-9 w-9 rounded-[10px]" />
              <span className="text-[1.125rem] font-semibold tracking-[-0.02em]">
                Tephron <span className="font-medium text-muted">Global</span>
              </span>
            </Link>
            <p className="t-small mt-4 md:mt-5 max-w-[34ch] text-muted">
              Dependable business support workflows, IT pipelines and
              high-scale voice and non-voice operations, delivered with
              rigorous compliance and human empathy.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="foot-social flex h-10 w-10 items-center justify-center rounded-full bg-bg text-muted transition-[color,background-color,transform] duration-200 hover:bg-accent hover:text-white active:scale-90"
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* NAVIGATE */}
          <nav aria-label="Footer">
            <h3 className={colHead}>Navigate</h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.path} className="foot-link">
                  <Link to={l.path} className={link}>
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* CAPABILITIES */}
          <div>
            <h3 className={colHead}>Capabilities</h3>
            <ul className="mt-4 space-y-2.5">
              {capabilities.map((c) => (
                <li key={c} className="foot-link t-small text-muted">
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className={colHead}>Contact</h3>
            <ul className="mt-4 space-y-2.5">
              <li className="foot-link">
                <a href={`mailto:${email}`} className={link}>
                  {email}
                </a>
              </li>
              <li className="foot-link">
                <a href={`tel:+${phone}`} className={link}>
                  {displayPhone}
                </a>
              </li>
              <li className="foot-link t-small max-w-[30ch] text-muted">{address}</li>
            </ul>
            <a
              href={`https://wa.me/${phone}?text=${encodeURIComponent(
                "Hello Tephron Global, I would like to connect with your operations team."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm mt-6 bg-[#25D366] text-white hover:bg-[#1fb957]"
            >
              <FaWhatsapp size={16} aria-hidden="true" />
              Chat on WhatsApp
              <FiArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* LEGAL ROW */}
        <div className="foot-legal mt-12 md:mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-center sm:flex-row sm:text-left">
          <p className="t-caption text-faint">
            © {year} Tephron Global. All rights reserved.
          </p>
          <div className="t-caption flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-muted">
            <Link to="/about" className="hover:text-fg">
              Privacy policy
            </Link>
            <Link to="/about" className="hover:text-fg">
              Terms of service
            </Link>
            <Link to="/careers" className="hover:text-fg">
              We’re hiring
            </Link>
          </div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="t-caption inline-flex items-center gap-1.5 rounded-full bg-bg px-3.5 py-2 font-medium text-muted transition-[color,transform] hover:text-fg active:scale-95"
          >
            Back to top <FiArrowUp aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* decorative wordmark */}
      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden pt-6">
        <p
          className="foot-mark whitespace-nowrap text-center font-bold leading-[0.9] tracking-[-0.055em]"
          style={{
            fontSize: "clamp(2.5rem, 12vw, 11.5rem)",
            color: "var(--line-strong)",
            paddingBottom: "0.1em",
          }}
        >
          Tephron Global
        </p>
      </div>
    </footer>
  );
};

export default Footer;
