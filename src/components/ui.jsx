import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import {
  gsap,
  useMotion,
  revealPageHeader,
  revealHeadings,
  smooth,
  prefersReducedMotion,
} from "../lib/motion";

// ---------------------------------------------------------------------
// BUTTON
// Renders a router <Link>, an external <a>, or a <button>.
// ---------------------------------------------------------------------
const variants = {
  primary: "btn btn-primary",
  secondary: "btn btn-secondary",
  ghost: "btn btn-ghost",
  light: "btn btn-light",
};

export const Btn = ({
  to,
  href,
  variant = "primary",
  small = false,
  arrow = false,
  className = "",
  children,
  ...rest
}) => {
  const ref = useRef(null);
  const cls = `${variants[variant]} ${small ? "btn-sm" : ""} ${className}`;
  const content = (
    <>
      {children}
      {arrow && <FiArrowRight aria-hidden="true" className="shrink-0" />}
    </>
  );

  if (to)
    return (
      <Link ref={ref} to={to} className={cls} {...rest}>
        {content}
      </Link>
    );
  if (href)
    return (
      <a
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        {...rest}
      >
        {content}
      </a>
    );
  return (
    <button ref={ref} className={cls} {...rest}>
      {content}
    </button>
  );
};

// ---------------------------------------------------------------------
// MASKED HEADING: each line slides up out of its own clipped mask
// ---------------------------------------------------------------------
export const MaskLines = ({
  lines,
  as: Tag = "h2",
  className = "",
  lineClass = "ph-line",
  lastClass = "",
}) => (
  <Tag className={className}>
    {lines.map((line, i) => (
      <span key={i} className="mask">
        <span
          className={`${lineClass} block ${i === lines.length - 1 ? lastClass : ""}`}
        >
          {line}
        </span>
      </span>
    ))}
  </Tag>
);

// ---------------------------------------------------------------------
// PAGE HEADER: shared opener for inner pages
// ---------------------------------------------------------------------
export const PageHeader = ({ lines, lead, lastClass = "", children }) => {
  const ref = useRef(null);

  useMotion(() => {
    const tl = revealPageHeader();
    // the glow behind the title drifts very slowly
    const drift = gsap.to(".ph-glow", { x: 70, y: 24, duration: 11, ease: "sine.inOut", repeat: -1, yoyo: true });
    return () => {
      tl.kill();
      drift.kill();
    };
  }, ref);

  return (
    <header
      ref={ref}
      className="relative overflow-hidden pt-[calc(var(--header-h)+2rem)] sm:pt-[calc(var(--header-h)+3rem)] md:pt-[calc(var(--header-h)+4rem)] pb-10 sm:pb-14 md:pb-20 text-center"
    >
      {/* soft brand glow behind the title */}
      <div
        aria-hidden="true"
        className="ph-glow pointer-events-none absolute left-1/2 top-0 h-[520px] w-[920px] max-w-[160vw] -translate-x-1/2 opacity-70"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%)",
        }}
      />
      <div className="wrap relative">
        <MaskLines
          as="h1"
          lines={lines}
          lastClass={lastClass}
          className="t-display text-balance mx-auto max-w-4xl"
        />
        {lead && (
          <p className="ph-fade t-lead text-muted mx-auto mt-6 max-w-2xl text-pretty">
            {lead}
          </p>
        )}
        {children && <div className="ph-fade mt-9">{children}</div>}
      </div>
    </header>
  );
};

// ---------------------------------------------------------------------
// SECTION HEADING (left or centre aligned)
// ---------------------------------------------------------------------
export const SectionHead = ({
  title,
  lead,
  center = false,
  className = "",
  titleClass = "t-title",
}) => (
  <div className={`${center ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
    <h2 className={`${titleClass} text-balance sec-title`}>{title}</h2>
    {lead && (
      <p className="t-lead sec-lead mt-5 text-muted text-pretty">{lead}</p>
    )}
  </div>
);

// ---------------------------------------------------------------------
// CTA BAND: dark closing panel used at the bottom of inner pages
// ---------------------------------------------------------------------
export const CtaBand = ({ title, text, children }) => {
  const root = useRef(null);

  useMotion(() => {
    gsap.from(".cta-panel", {
      scale: 0.94,
      borderRadius: 72,
      ease: "none",
      scrollTrigger: { trigger: ".cta-panel", start: "top 100%", end: "top 45%", scrub: 0.5 },
    });
    revealHeadings(root.current);
    gsap.from(".cta-in", {
      opacity: 0,
      duration: 1.5,
      ease: "sine.out",
      stagger: 0.15,
      scrollTrigger: { trigger: ".cta-panel", start: "top 60%", once: true },
    });
  }, root);

  return (
    <section ref={root} className="pb-[clamp(3rem,6vw,6rem)]">
      <div className="wrap">
        <div
          className="cta-panel relative isolate overflow-hidden rounded-[28px] sm:rounded-[36px] md:rounded-[40px] border border-white/10 bg-[#070b14] px-6 py-12 text-center text-white sm:px-10 sm:py-16 md:py-24"
          style={{ willChange: "transform" }}
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div
              className="absolute -right-20 -top-32 h-[520px] w-[520px] rounded-full"
              style={{ background: "radial-gradient(closest-side, rgba(10,132,255,0.5), transparent 70%)" }}
            />
            <div
              className="absolute -bottom-40 -left-20 h-[480px] w-[480px] rounded-full"
              style={{ background: "radial-gradient(closest-side, rgba(255,121,0,0.25), transparent 70%)" }}
            />
          </div>
          <h2 className="sec-title t-display mx-auto max-w-3xl text-balance">{title}</h2>
          {text && (
            <p className="cta-in t-lead mx-auto mt-6 max-w-2xl text-white/70 text-pretty">{text}</p>
          )}
          <div className="cta-in mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// ANIMATED CHECKMARK: circle and tick draw themselves
// ---------------------------------------------------------------------
export const AnimatedCheck = ({ size = 76, className = "" }) => {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const parts = ref.current.querySelectorAll("[data-draw]");
    if (prefersReducedMotion()) {
      gsap.set(parts, { strokeDashoffset: 0 });
      return;
    }
    const tl = gsap.timeline();
    tl.fromTo(parts[0], { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, ease: smooth })
      .fromTo(parts[1], { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.55, ease: smooth }, 0.45)
      .fromTo(ref.current, { scale: 0.85 }, { scale: 1, duration: 0.9, ease: smooth }, 0);
    return () => tl.kill();
  }, []);

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 52 52"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle data-draw cx="26" cy="26" r="23" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
      <path data-draw d="M15 27l8 8 14-17" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
    </svg>
  );
};
