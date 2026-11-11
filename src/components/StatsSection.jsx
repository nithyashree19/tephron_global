import { useRef } from "react";
import { SectionHead } from "./ui";
import { gsap, useMotion, revealHeadings } from "../lib/motion";
import { stats } from "../lib/company";

const StatsSection = () => {
  const root = useRef(null);

  useMotion(() => {
    revealHeadings(root.current);

    // Count each number up the first time it scrolls into view.
    // The real figure is already in the HTML (search engines, no-JS and
    // slow connections see it); it only restarts from 0 at the moment the
    // count begins, so a "0+" is never shown on load.
    const nums = gsap.utils.toArray(".stat-num", root.current);
    nums.forEach((el) => {
      const end = Number(el.dataset.end);
      const obj = { v: 0 };
      gsap.to(obj, {
        v: end,
        duration: 2.4,
        ease: "power3.out",
        snap: { v: 1 },
        paused: true,
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: (self) => {
            el.firstChild.nodeValue = "0";
            self.animation.play();
          },
        },
        onUpdate: () => {
          el.firstChild.nodeValue = String(obj.v);
        },
      });
    });

    // SVG path animation: each ring draws clockwise to its value
    gsap.utils.toArray(".stat-ring-fill", root.current).forEach((ring, i) => {
      gsap.fromTo(
        ring,
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 1 - Number(ring.dataset.fill),
          duration: 2.6,
          delay: i * 0.12,
          ease: "power3.inOut",
          scrollTrigger: { trigger: ring, start: "top 90%", once: true },
        }
      );
    });

    return () => nums.forEach((el) => (el.firstChild.nodeValue = el.dataset.end));
  }, root);

  return (
    <section ref={root} className="section">
      <div className="wrap">
        <SectionHead center title="Numbers that define our growth." />

        <div className="stat-grid card-flat mt-10 md:mt-14 grid grid-cols-2 overflow-hidden lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.id}
              className={`stat-item px-3 py-7 sm:px-6 sm:py-10 md:py-14 text-center ${
                i % 2 === 1 ? "border-l border-line" : ""
              } ${i > 1 ? "border-t border-line lg:border-t-0" : ""} ${
                i > 0 ? "lg:border-l lg:border-line" : ""
              }`}
            >
              <div className="relative mx-auto grid aspect-square w-full max-w-[124px] place-items-center sm:max-w-[148px] md:max-w-[168px]">
                <svg viewBox="0 0 120 120" aria-hidden="true" className="absolute inset-0 h-full w-full -rotate-90" fill="none" strokeWidth="3" strokeLinecap="round">
                  <circle cx="60" cy="60" r="56" stroke="var(--line)" />
                  <circle
                    className="stat-ring-fill"
                    data-fill={1}
                    cx="60" cy="60" r="56"
                    stroke="var(--accent)"
                    pathLength="1"
                    strokeDasharray="1"
                    strokeDashoffset={0}
                  />
                </svg>
                <p className="t-title tabular-nums">
                  {s.text ? (
                    <span>{s.text}</span>
                  ) : (
                    <>
                      <span className="stat-num" data-end={s.n}>
                        {s.n}
                      </span>
                      <span className="text-accent">{s.suffix}</span>
                    </>
                  )}
                </p>
              </div>
              <p className="t-small mt-3 md:mt-4 text-muted text-balance">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
