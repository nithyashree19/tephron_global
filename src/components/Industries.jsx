import { useRef } from "react";
import {
  FiShoppingBag,
  FiNavigation,
  FiBookOpen,
  FiHeart,
  FiPieChart,
} from "react-icons/fi";
import { SectionHead } from "./ui";
import { gsap, ScrollTrigger, useMotion, revealHeadings } from "../lib/motion";

const industries = [
  {
    icon: FiShoppingBag,
    title: "E-commerce and retail",
    text: "Shopify SKU creation, Amazon listing syncs, variant uploads and catalog data updates.",
  },
  {
    icon: FiNavigation,
    title: "Logistics and airlines",
    text: "Amadeus and Sabre flight ticketing campaigns, scheduling logs and itinerary updates.",
  },
  {
    icon: FiBookOpen,
    title: "Publishing and media",
    text: "W3C EPUB eBook conversions, handwritten archive extraction and OCR digitisation.",
  },
  {
    icon: FiHeart,
    title: "Healthcare admin",
    text: "Patient directory mapping and healthcare log entry support.",
  },
  {
    icon: FiPieChart,
    title: "Financial ledgering",
    text: "Billing support, receipt mapping and ledger sorting campaigns.",
  },
];

const Tile = ({ item, hidden }) => {
  const Icon = item.icon;
  return (
    <li
      aria-hidden={hidden || undefined}
      className="card mx-2 min-h-[190px] w-[260px] shrink-0 p-5 sm:mx-2.5 sm:min-h-[220px] sm:w-[290px] sm:p-7 md:w-[330px]"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
        <Icon size={20} aria-hidden="true" />
      </div>
      <h3 className="t-h3 mt-5 text-[1.25rem]">{item.title}</h3>
      <p className="t-small mt-2 text-muted">{item.text}</p>
    </li>
  );
};

const Industries = () => {
  const root = useRef(null);
  useMotion(() => {
    revealHeadings(root.current);

    // The marquee drifts on its own; scrolling speeds it up, and scrolling
    // back up reverses it. It settles back to a calm drift afterwards.
    const track = root.current.querySelector(".mq-track");
    const loop = gsap.to(track, { xPercent: -50, ease: "none", duration: 70, repeat: -1 });
    let hovering = false;

    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        if (hovering) return;
        const v = gsap.utils.clamp(-2400, 2400, self.getVelocity());
        gsap.to(loop, {
          timeScale: 1 + v / 350,
          duration: 0.25,
          overwrite: true,
          onComplete: () => gsap.to(loop, { timeScale: 1, duration: 1.6, ease: "power3.out" }),
        });
      },
    });

    const wrap = root.current.querySelector(".mq-wrap");
    const enter = () => {
      hovering = true;
      gsap.to(loop, { timeScale: 0, duration: 0.7, overwrite: true });
    };
    const leave = () => {
      hovering = false;
      gsap.to(loop, { timeScale: 1, duration: 1, overwrite: true });
    };
    wrap.addEventListener("pointerenter", enter);
    wrap.addEventListener("pointerleave", leave);

    return () => {
      wrap.removeEventListener("pointerenter", enter);
      wrap.removeEventListener("pointerleave", leave);
      st.kill();
      loop.kill();
      gsap.set(track, { clearProps: "transform" });
    };
  }, root);

  return (
    <section ref={root} className="section overflow-hidden bg-bg-alt">
      <div className="wrap">
        <SectionHead
          center
          title="Tailored for global industries."
          lead="We configure IT and Non-IT pipelines around the compliance, systems and speed your sector requires."
        />
      </div>

      {/* infinite marquee: pauses on hover, edges fade out */}
      <div
        className="mq-wrap mt-14 [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)]"
        role="region"
        aria-label="Industries we serve"
      >
        <ul className="mq-track flex w-max py-4">
          {/* two identical groups (the loop point is -50%); each group repeats
              the set twice so it is always wider than very large screens */}
          {[0, 1].map((group) =>
            [...industries, ...industries].map((i, n) => (
              <Tile key={`${group}-${n}`} item={i} hidden={group === 1 || n >= industries.length} />
            ))
          )}
        </ul>
      </div>
    </section>
  );
};

export default Industries;
