import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { FiSun, FiMoon } from "react-icons/fi";
import { prefersReducedMotion } from "../lib/motion";

// Light / dark switch. On browsers with the View Transitions API the new
// theme expands out of the button as a circle (like iOS). Elsewhere it
// simply cross-fades through the CSS colour transitions.
const ThemeToggle = () => {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const btn = useRef(null);

  const apply = (next) => {
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* storage can be blocked; the toggle still works for this visit */
    }
    setDark(next);
  };

  const toggle = () => {
    const next = !dark;

    if (!document.startViewTransition || prefersReducedMotion()) {
      apply(next);
      return;
    }

    const r = btn.current.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const root = document.documentElement;
    root.classList.add("vt");
    const t = document.startViewTransition(() => {
      flushSync(() => apply(next));
    });

    t.ready.then(() => {
      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 750,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
    t.finished.finally(() => root.classList.remove("vt"));
  };

  return (
    <button
      ref={btn}
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      onClick={toggle}
      className="relative flex h-8 w-[64px] shrink-0 items-center rounded-full border border-line bg-bg-alt p-[3px] transition-colors duration-300 active:scale-95"
    >
      {/* sliding thumb */}
      <span
        aria-hidden="true"
        className="absolute left-[3px] top-[3px] h-[24px] w-[28px] rounded-full bg-surface shadow-[0_1px_4px_rgba(0,0,0,0.25)] transition-transform duration-500"
        style={{
          transform: dark ? "translateX(29px)" : "translateX(0)",
          transitionTimingFunction: "cubic-bezier(0.34, 1.35, 0.64, 1)",
        }}
      />
      <span className="relative z-10 flex h-[24px] w-[28px] items-center justify-center">
        <FiSun
          size={15}
          className={`transition-colors duration-300 ${dark ? "text-faint" : "text-spark"}`}
        />
      </span>
      <span className="relative z-10 flex h-[24px] w-[28px] items-center justify-center">
        <FiMoon
          size={15}
          className={`transition-colors duration-300 ${dark ? "text-accent" : "text-faint"}`}
        />
      </span>
    </button>
  );
};

export default ThemeToggle;
