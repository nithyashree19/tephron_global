import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/motion";

// A soft ring that follows the pointer. The system cursor stays visible
// (accessibility); the ring only adds context:
//   default      small ring
//   links/buttons grows slightly
//   data-cursor="Drag" / "Read" ...  becomes a labelled disc
// Only for mouse / trackpad users who allow motion.
const Cursor = () => {
  const [enabled] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      window.matchMedia("(prefers-reduced-motion: no-preference)").matches
  );
  const ring = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const el = ring.current;
    const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });

    let mode = "";
    const setMode = (next, text = "") => {
      if (next === mode && label.current.textContent === text) return;
      mode = next;
      label.current.textContent = text;
      const big = next === "label";
      gsap.to(el, {
        width: big ? 84 : next === "link" ? 52 : 32,
        height: big ? 84 : next === "link" ? 52 : 32,
        backgroundColor: big ? "rgba(0,113,227,0.92)" : "rgba(0,113,227,0)",
        borderColor: big ? "rgba(255,255,255,0)" : "rgba(0,113,227,0.55)",
        duration: 0.5,
        ease: "expo.out",
        overwrite: "auto",
      });
      gsap.to(label.current, { opacity: big ? 1 : 0, scale: big ? 1 : 0.6, duration: 0.35, overwrite: "auto" });
    };

    const move = (e) => {
      x(e.clientX);
      y(e.clientY);
      gsap.to(el, { opacity: 1, duration: 0.3, overwrite: "auto" });
    };
    const over = (e) => {
      const t = e.target.closest?.("[data-cursor]");
      if (t) return setMode("label", t.dataset.cursor);
      if (e.target.closest?.("a,button,[role=button],input,select,textarea,label")) return setMode("link");
      setMode("");
    };
    const leave = () => gsap.to(el, { opacity: 0, duration: 0.3 });

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div
      ref={ring}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[150] flex h-8 w-8 items-center justify-center rounded-full border"
    >
      <span ref={label} className="text-[13px] font-medium tracking-[-0.01em] text-white opacity-0" />
    </div>
  );
};

export default Cursor;
