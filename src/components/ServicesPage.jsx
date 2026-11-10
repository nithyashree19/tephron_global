import { useRef } from "react";
import Services from "./Services";
import { Btn, PageHeader, SectionHead, CtaBand } from "./ui";
import { gsap, useMotion, revealHeadings } from "../lib/motion";

// A genuine sequence, so numbering is the structure here.
const steps = [
  {
    title: "Talent screening and training",
    text: "We recruit top-tier graduates and seasoned voice and data specialists, then align them with client-specific SOPs and security compliance.",
  },
  {
    title: "Secure pipeline setup",
    text: "Teams are equipped with enterprise VPNs, encrypted workstations, multi-factor authentication and live screen monitoring software.",
  },
  {
    title: "Weekly SLA optimisation",
    text: "Operations Directors hold weekly KPI reviews with your leadership, reporting resolution rates, CSAT metrics and error rates.",
  },
];

const ServicesPage = () => {
  const root = useRef(null);

  useMotion(({ desktop }) => {
    revealHeadings(root.current);

    if (desktop) {
      // PINNED SEQUENCE: the section holds still while scrolling plays the
      // three steps in order. The line draws between them (SVG-style path
      // animation) and each step lights up as the line reaches it.
      gsap.set(".step", { opacity: 0.2 });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: ".steps-sec",
          start: "top top",
          end: "+=1500",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });
      tl.fromTo(".step-line", { scale: 0 }, { scale: 1, duration: 3 }, 0);
      [0, 1.5, 3].forEach((t, i) => {
        tl.to(`.step-${i}`, { opacity: 1, duration: 0.5 }, Math.max(0, t - 0.2));
        tl.fromTo(`.step-${i} .step-dot`, { scale: 0.7 }, { scale: 1, duration: 0.5, ease: "back.out(2)" }, Math.max(0, t - 0.2));
      });
    } else {
      // phones: the line draws as you scroll, steps wipe in from the left
      gsap.fromTo(
        ".step-line",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".steps", start: "top 75%", end: "bottom 65%", scrub: true } }
      );
      gsap.utils.toArray(".step", root.current).forEach((el) =>
        gsap.from(el, {
          clipPath: "inset(0% 100% 0% 0%)",
          duration: 1.3,
          ease: "expo.out",
          clearProps: "clipPath",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        })
      );
    }
  }, root);

  return (
    <div ref={root}>
      <PageHeader
        lines={["Services built", "for scale."]}
        lead="From 24/7 customer support to data operations, every service is engineered around your SLAs."
      />

      <Services title="Explore what we do." />

      <section className="steps-sec section bg-bg-alt md:flex md:min-h-screen md:items-center">
        <div className="wrap">
          <SectionHead center title="How we structure your remote operations." />

          <ol className="steps relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
            {/* connector */}
            <div
              aria-hidden="true"
              className="absolute left-[23px] top-6 h-[calc(100%-3rem)] w-[2px] bg-line md:left-[8%] md:top-[23px] md:h-[2px] md:w-[84%]"
            >
              <div
                className="step-line h-full w-full bg-accent"
                style={{ transformOrigin: "left top" }}
              />
            </div>

            {steps.map((s, i) => (
              <li key={s.title} className={`step step-${i} relative pl-16 md:pl-0 md:pt-20 md:text-center`}>
                <span className="step-dot absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-[1.0625rem] font-semibold text-white shadow-[0_8px_24px_-6px_var(--accent)] md:left-1/2 md:-translate-x-1/2">
                  {i + 1}
                </span>
                <h3 className="t-h3 text-[1.25rem]">{s.title}</h3>
                <p className="t-small mx-auto mt-3 max-w-[38ch] text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="pt-[clamp(3rem,6vw,6rem)]">
        <CtaBand
          title="Request a custom SLA proposal."
          text="Tell us about your volumes, channels and targets. We will design the team and the pipeline around them."
        >
          <Btn to="/contact" variant="light"  arrow>
            Start the conversation
          </Btn>
        </CtaBand>
      </div>
    </div>
  );
};

export default ServicesPage;
