import { useRef } from "react";
import { FiTrendingUp, FiUsers, FiAward } from "react-icons/fi";
import { Btn } from "./ui";
import { gsap, useMotion, revealHeadings } from "../lib/motion";

const perks = [
  { icon: FiTrendingUp, title: "Career growth", text: "Develop your skills and professional potential." },
  { icon: FiUsers, title: "Team culture", text: "Collaborate, contribute and grow together." },
  { icon: FiAward, title: "New opportunities", text: "Discover ways to showcase your talent." },
];

// A deliberately dark panel in both themes: strong contrast to close the page.
const CareerSection = () => {
  const root = useRef(null);

  useMotion(() => {
    // panel grows into place as it enters
    gsap.from(".career-panel", {
      scale: 0.93,
      borderRadius: 72,
      ease: "none",
      scrollTrigger: { trigger: ".career-panel", start: "top 100%", end: "top 40%", scrub: 0.5 },
    });

    // aurora layers drift at different speeds while scrolling (parallax)
    gsap.to(".aurora-a", {
      yPercent: 35,
      ease: "none",
      scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
    });
    gsap.to(".aurora-b", {
      yPercent: -30,
      ease: "none",
      scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
    });

    revealHeadings(root.current);
    gsap.from(".career-in", {
      opacity: 0,
      duration: 1.5,
      ease: "sine.out",
      stagger: 0.15,
      scrollTrigger: { trigger: ".career-panel", start: "top 60%", once: true },
    });
    // perks glide in from the right, one after another
    gsap.from(".career-perk", {
      x: 80,
      opacity: 0,
      duration: 1.4,
      ease: "power4.out",
      stagger: 0.14,
      scrollTrigger: { trigger: ".career-panel", start: "top 55%", once: true },
    });
  }, root);

  return (
    <section ref={root} className="pb-[clamp(3rem,6vw,6rem)]">
      <div className="wrap">
        <div
          className="career-panel relative isolate overflow-hidden rounded-[28px] sm:rounded-[36px] md:rounded-[40px] border border-white/10 bg-[#070b14] px-6 py-10 text-white sm:px-10 sm:py-14 md:py-18 lg:px-16 lg:py-20"
          style={{ willChange: "transform" }}
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div
              className="aurora-a absolute -right-24 -top-32 h-[560px] w-[560px] rounded-full"
              style={{ background: "radial-gradient(closest-side, rgba(10,132,255,0.55), transparent 70%)" }}
            />
            <div
              className="aurora-b absolute -bottom-40 -left-24 h-[520px] w-[520px] rounded-full"
              style={{ background: "radial-gradient(closest-side, rgba(255,121,0,0.28), transparent 70%)" }}
            />
            <div
              className="absolute left-1/3 top-1/4 h-[420px] w-[420px] rounded-full"
              style={{ background: "radial-gradient(closest-side, rgba(0,213,245,0.22), transparent 70%)" }}
            />
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div>
              <h2 className="sec-title t-display text-balance">
                Build your future. Grow with us.
              </h2>
              <p className="career-in t-lead mt-6 max-w-[34em] text-white/70">
                Your talent can make a difference. Join our growing team,
                explore new opportunities and take the next step in your
                professional journey.
              </p>
              <div className="career-in mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
                <Btn to="/careers" variant="light"  arrow>
                  Explore careers
                </Btn>
              </div>
            </div>

            <ul className="divide-y divide-white/10">
              {perks.map((p) => {
                const Icon = p.icon;
                return (
                  <li key={p.title} className="career-perk flex items-start gap-4 py-5 first:pt-0 last:pb-0">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#5ac8fa]">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-[1.0625rem] font-semibold tracking-[-0.015em]">{p.title}</h3>
                      <p className="t-small mt-1 text-white/60">{p.text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerSection;
