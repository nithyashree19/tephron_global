import { useLayoutEffect, useRef, useState } from "react";
import logo from "../assets/tephron-logo.jpg";
import {
  gsap,
  smooth,
  prefersReducedMotion,
  markIntroDone,
} from "../lib/motion";

// A short brand moment on the first visit of a session (about 1.8s).
// It is skipped on later visits and when reduced motion is requested.
const KEY = "tephron-intro-seen";

const IntroLoader = () => {
  const seen = (() => {
    try {
      return sessionStorage.getItem(KEY) === "1";
    } catch {
      return true;
    }
  })();
  const skip = seen || prefersReducedMotion();

  const [show, setShow] = useState(!skip);
  const root = useRef(null);

  useLayoutEffect(() => {
    if (skip) {
      markIntroDone();
      return;
    }

    document.body.style.overflow = "hidden";
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {
            /* ignore */
          }
          document.body.style.overflow = "";
          setShow(false);
        },
      });

      tl.from(".ld-icon", { scale: 0.6, opacity: 0, duration: 1, ease: smooth })
        .from(".ld-word", { y: 16, opacity: 0, duration: 0.8, ease: smooth }, 0.2)
        .to(".ld-bar", { scaleX: 1, duration: 1.1, ease: "power2.inOut" }, 0.1)
        .to(".ld-content", { scale: 0.94, opacity: 0, duration: 0.45, ease: "power2.in" }, 1.25)
        .to(root.current, { yPercent: -100, duration: 0.85, ease: "power4.inOut" }, 1.4)
        // let the hero start while the curtain is still lifting
        .call(markIntroDone, null, 1.85);
    }, root);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, [skip]);

  if (!show) return null;

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-bg"
    >
      <div className="ld-content flex flex-col items-center">
        <img
          src={logo}
          alt=""
          width="84"
          height="84"
          className="ld-icon h-[84px] w-[84px] rounded-[22px] shadow-[0_20px_60px_-10px_rgba(0,113,227,0.55)]"
        />
        <p className="ld-word mt-6 text-[22px] font-semibold tracking-[-0.025em]">
          Tephron <span className="font-medium text-muted">Global</span>
        </p>
        <div className="mt-8 h-[2px] w-40 overflow-hidden rounded-full bg-line">
          <div
            className="ld-bar h-full w-full origin-left bg-accent"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
};

export default IntroLoader;
