import { useRef } from "react";
import { FiTarget, FiEye, FiShield } from "react-icons/fi";
import { Btn } from "./ui";
import {
  gsap,
  clip,
  wipe,
  SplitText,
  useMotion,
  revealHeadings,
} from "../lib/motion";

const statement =
  "Global scale, customised human workflows. We connect multinational clients with agile outsourcing frameworks, from high-volume customer inquiries to precision recruitment pipelines, engineered to hit your SLAs.";

const pillars = [
  {
    icon: FiTarget,
    title: "Our mission",
    text: "To accelerate client operations by delivering flawless business support pipelines grounded in secure, high-tech infrastructure.",
    className: "md:col-span-2",
  },
  {
    icon: FiEye,
    title: "Our vision",
    text: "To be the globally recognised benchmark for custom business process operations, blending AI efficiency with empathetic human oversight.",
    className: "",
  },
  {
    icon: FiShield,
    title: "Our core values",
    text: "Trust, reliability, quality and absolute transparency shape every customer interaction and every client report we deliver.",
    className: "md:col-span-3",
    values: ["Trust", "Reliability", "Quality", "Transparency"],
  },
];

const About = () => {
  const root = useRef(null);

  useMotion(() => {
    revealHeadings(root.current);

    // SCROLL-LIT STATEMENT: every word brightens as you scroll past it
    const split = SplitText.create(".statement-text", { type: "words" });
    gsap.fromTo(
      split.words,
      { opacity: 0.14 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.12,
        scrollTrigger: {
          trigger: ".statement-text",
          start: "top 82%",
          end: "bottom 52%",
          scrub: true,
        },
      }
    );

    // each pillar wipes in from a different edge
    const dirs = [clip.left, clip.right, clip.bottom];
    gsap.utils.toArray(".pillar", root.current).forEach((el, i) => {
      wipe(el, dirs[i], { scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    });

    return () => split.revert();
  }, root);

  return (
    <section ref={root} className="section pt-0 md:pt-8">
      <div className="wrap-narrow">
        <p className="statement-text t-title text-balance">{statement}</p>
        <div className="mt-8">
          <Btn to="/about" variant="ghost" arrow>
            Our journey and values
          </Btn>
        </div>
      </div>

      <div className="wrap pillars mt-12 sm:mt-16 grid gap-4 md:mt-20 md:grid-cols-3">
        {pillars.map((p) => {
          const Icon = p.icon;
          return (
            <article
              key={p.title}
              className={`pillar card-flat p-6 sm:p-8 md:p-10 ${p.className}`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                <Icon size={24} aria-hidden="true" />
              </div>
              <h3 className="t-h3 mt-6">{p.title}</h3>
              <p className="t-body mt-3 max-w-[56ch] text-muted">{p.text}</p>
              {p.values && (
                <ul className="mt-6 flex flex-wrap gap-2.5">
                  {p.values.map((v) => (
                    <li
                      key={v}
                      className="t-small rounded-full border border-line bg-surface px-4 py-1.5 font-medium"
                    >
                      {v}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default About;
