import { useLayoutEffect, useRef } from "react";
import { FiCheck, FiSearch, FiAlertCircle } from "react-icons/fi";
import { gsap, smooth, prefersReducedMotion } from "../lib/motion";

// Tephron admin kit. Only white and the Tephron blue are used for colour;
// the greys are white tints for text and hairlines. Dark mode comes from the
// site's own tokens, so it follows the public site's theme toggle.

const shadowSoft = "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_14px_36px_-14px_rgba(0,0,0,0.12)]";

const base =
  "inline-flex items-center justify-center gap-1.5 rounded-full text-[0.875rem] font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40";

const variants = {
  primary: "admin-grad h-9 px-4 text-white hover:brightness-95",
  secondary: "h-9 px-4 bg-surface border border-line text-fg hover:bg-bg-alt",
  quiet: "h-8 px-3 text-accent hover:bg-accent-soft",
  danger: "h-8 px-3 text-muted hover:text-fg hover:bg-bg-alt",
  icon: "h-8 w-8 px-0 text-muted hover:bg-bg-alt hover:text-fg",
  iconDanger: "h-8 w-8 px-0 text-muted hover:bg-bg-alt hover:text-fg",
  edit: "h-9 px-4 admin-grad text-white hover:brightness-95",
  outline: "h-9 px-3.5 border border-line-strong bg-surface text-fg hover:bg-bg-alt",
  delete: "h-9 px-3.5 border border-[#d92d20]/30 bg-surface text-[#d92d20] hover:bg-[#d92d20]/10",
};

// Row actions sit together in one rounded pill, so every row lines up the same way
export const actionGroup =
  "inline-flex shrink-0 items-center gap-0.5 rounded-full border border-line bg-surface p-1 shadow-[0_1px_2px_rgba(0,0,0,0.04)]";

export const btnClass = (variant = "secondary", extra = "") => `${base} ${variants[variant]} ${extra}`;

export const inputClass =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[0.9375rem] text-fg placeholder:text-faint transition-shadow focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent-soft aria-invalid:border-accent";

export const PageHeader = ({ title, text, action }) => (
  <div data-reveal className="flex flex-wrap items-end justify-between gap-6 pb-8">
    <div>
      <h1 className="text-[2.5rem] font-semibold leading-[1.1] tracking-[-0.03em]">{title}</h1>
      {text && <p className="mt-2 text-[1.0625rem] text-muted">{text}</p>}
    </div>
    {action}
  </div>
);

// A grouped, rounded panel. Rows inside are divided by hairlines.
export const Group = ({ children, className = "", ...rest }) => (
  <div {...rest} className={`glass overflow-hidden rounded-[20px] border ${className}`}>
    {children}
  </div>
);

const toneBar = { blue: "bg-accent", cyan: "bg-cyan", spark: "bg-faint" };
// Tinted fills so each tile carries its colour, in light and dark mode
const toneFill = {
  blue: "bg-gradient-to-br from-[#ffe6d1] to-white dark:from-[#4a2204] dark:to-[#1e140b]",
  cyan: "bg-gradient-to-br from-[#dcebff] to-white dark:from-[#0e2b52] dark:to-[#1e140b]",
  spark: "bg-gradient-to-br from-[#fff1c4] to-white dark:from-[#4a3a06] dark:to-[#1e140b]",
};
const toneText = { blue: "text-accent", cyan: "text-cyan", spark: "text-muted" };

export const Tile = ({ label, value, hint, tone = "blue" }) => (
  <div data-reveal className={`relative overflow-hidden rounded-[20px] border border-line p-6 ${toneFill[tone]} ${shadowSoft}`}>
    <p className="text-[0.9375rem] text-muted">{label}</p>
    <p
      data-count={value}
      className={`mt-3 text-[2.75rem] font-semibold leading-none tracking-[-0.03em] tabular-nums ${toneText[tone]}`}
    >
      {value}
    </p>
    <p className="mt-3 text-[0.8125rem] text-faint">{hint}</p>
  </div>
);

export const SectionHead = ({ title, text }) => (
  <div className="mb-6">
    <h2 className="text-[1.0625rem] font-semibold tracking-[-0.01em]">{title}</h2>
    {text && <p className="mt-1 text-[0.875rem] text-muted">{text}</p>}
  </div>
);

export const StatusDot = ({ published }) => (
  <span className="inline-flex items-center gap-1.5 text-[0.8125rem] text-muted">
    <span
      aria-hidden="true"
      className={`h-2.5 w-2.5 rounded-full ${published ? "bg-accent shadow-[0_0_0_3px_var(--accent-soft)]" : "border-2 border-faint"}`}
    />
    {published ? <span className="font-medium text-accent">Published</span> : <span className="font-medium text-muted">Draft</span>}
  </span>
);

export const FieldError = ({ id, msg }) =>
  msg ? (
    <p id={id} role="alert" className="mt-1.5 flex items-center gap-1.5 text-[0.8125rem] font-medium text-fg">
      <FiAlertCircle aria-hidden="true" size={14} className="shrink-0 text-accent" />
      {msg}
    </p>
  ) : null;

export const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="mb-1.5 block text-[0.875rem] font-medium">
    {children}
  </label>
);

export const Switch = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-[31px] w-[51px] shrink-0 items-center rounded-full transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
      checked ? "bg-accent" : "bg-line-strong"
    }`}
  >
    <span
      aria-hidden="true"
      className={`absolute left-[2px] top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2)] transition-transform duration-300 ${
        checked ? "translate-x-5" : ""
      }`}
    />
  </button>
);

export const Segmented = ({ options, value, onChange, label }) => (
  <div role="radiogroup" aria-label={label} className="inline-flex rounded-full bg-bg-alt p-0.5">
    {options.map((o) => (
      <button
        key={o.value}
        type="button"
        role="radio"
        aria-checked={value === o.value}
        onClick={() => onChange(o.value)}
        className={`h-7 rounded-full px-3.5 text-[0.8125rem] font-medium transition-all focus-visible:outline-2 focus-visible:outline-accent ${
          value === o.value ? "bg-surface text-fg shadow-[0_1px_3px_rgba(0,0,0,0.12)]" : "text-muted hover:text-fg"
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

export const SearchField = ({ value, onChange, placeholder, label }) => (
  <label className="relative block w-full max-w-xs">
    <span className="sr-only">{label}</span>
    <FiSearch aria-hidden="true" size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-9 w-full rounded-full bg-bg-alt pl-9 pr-4 text-[0.9375rem] text-fg placeholder:text-faint transition-shadow focus:outline-none focus:ring-4 focus:ring-accent-soft"
    />
  </label>
);

export const EmptyState = ({ title, text, action }) => (
  <div className="px-6 py-16 text-center">
    <p className="text-[1.0625rem] font-semibold">{title}</p>
    <p className="mx-auto mt-1.5 max-w-sm text-[0.9375rem] text-muted">{text}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);

// Confirmation pill. Springs in with GSAP, fades out by itself, then calls onClose.
export const Toast = ({ children, duration = 3500, onClose }) => {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const reduce = prefersReducedMotion();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: -16, opacity: 0, scale: 0.94 },
        { y: 0, opacity: 1, scale: 1, duration: reduce ? 0 : 0.7, ease: smooth }
      );
    }, el);
    const timer = setTimeout(() => {
      gsap.to(el, {
        y: -10,
        opacity: 0,
        duration: reduce ? 0 : 0.45,
        ease: "power2.in",
        onComplete: () => closeRef.current?.(),
      });
    }, duration);
    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [duration]);

  return (
    <div
      ref={ref}
      role="status"
      className="fixed left-1/2 top-20 z-50 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-[0.875rem] font-medium shadow-[0_12px_36px_-10px_rgba(0,0,0,0.25)]"
    >
      <FiCheck aria-hidden="true" size={16} className="text-accent" />
      {children}
    </div>
  );
};

// Every [data-section] inside `scope` rises in as it scrolls into view
export const revealSections = (scope) => {
  if (!scope) return;
  scope.querySelectorAll("[data-section]").forEach((el) => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: smooth,
      clearProps: "transform",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });
};
