import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiDatabase,
  FiUsers,
  FiHeadphones,
  FiBookOpen,
  FiHeart,
  FiFileText,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { SectionHead } from "./ui";
import {
  gsap,
  clip,
  Draggable,
  useMotion,
  revealHeadings,
  smooth,
} from "../lib/motion";

// =====================================================================
// SERVICES RAIL
// A horizontally draggable card rail, the way Apple builds its product
// rails:
//   - cards follow the pointer 1:1 while dragging
//   - on release the throw is PROJECTED forward (InertiaPlugin) and the
//     nearest card edge is chosen as the landing point
//   - it can be grabbed again mid-flight; nothing ever locks input
//   - beyond the ends it resists like a rubber band
//   - images drift slightly against the drag for depth
// =====================================================================

const services = [
  {
    title: "Data entry and processing",
    request: "Data entry and back-office operations",
    description:
      "Accurate data entry, large-scale record updates, and cleaning up messy data and product catalogues.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=75",
    icon: FiDatabase,
    tint: "from-[#0a3a8a] to-[#0a1d4a]",
  },
  {
    title: "Customer support by phone, chat and email",
    request: "Customer support (phone, chat and email)",
    description:
      "Round-the-clock support for your customers in any time zone, including airline and travel booking support.",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=75",
    icon: FiUsers,
    tint: "from-[#07607a] to-[#06283a]",
  },
  {
    title: "Virtual assistants and sales support",
    request: "Virtual assistants and sales support",
    description:
      "Assistants who build prospect lists, keep your CRM up to date and manage your product listings.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=75",
    icon: FiHeadphones,
    tint: "from-[#8a3d05] to-[#3a1a05]",
  },
  {
    title: "Digital eBook conversions",
    request: "eBook conversion and document digitisation",
    description:
      "Turning manuscripts, scans and handwritten pages into properly formatted eBooks.",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=75",
    icon: FiBookOpen,
    tint: "from-[#1d4f9a] to-[#0b1f40]",
  },
  {
    title: "Healthcare administration",
    request: "Healthcare administration and billing",
    description:
      "Back-office help for healthcare providers, such as keeping directories and records up to date.",
    image: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&w=900&q=75",
    icon: FiHeart,
    tint: "from-[#0a6a6a] to-[#082f35]",
  },
  {
    title: "Bookkeeping support",
    request: "Bookkeeping support",
    description:
      "Matching transactions to receipts and organising expense records so your books stay tidy.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=75",
    icon: FiFileText,
    tint: "from-[#4a2a9a] to-[#1a1040]",
  },
];

const Services = ({ title = "Premium IT and Non-IT operations.", lead }) => {
  const root = useRef(null);
  const viewport = useRef(null);
  const track = useRef(null);
  const bar = useRef(null);
  const goToRef = useRef(() => {});
  const [index, setIndex] = useState(0);
  const [max, setMax] = useState(services.length - 1);

  useMotion(() => {
    revealHeadings(root.current);
    gsap.from(".svc-card", {
      clipPath: clip.right,
      duration: 1.6,
      ease: "expo.out",
      stagger: 0.1,
      clearProps: "clipPath",
      scrollTrigger: { trigger: viewport.current, start: "top 85%", once: true },
    });
  }, root);

  // The rail itself runs for everyone (it is user-driven, not decorative).
  useLayoutEffect(() => {
    const view = viewport.current;
    const trackEl = track.current;
    const cards = [...trackEl.children];
    const imgSetters = cards.map((c) =>
      gsap.quickSetter(c.querySelector(".svc-img"), "x", "px")
    );

    let dead = false;
    let wheelTimer;
    let minX = 0;
    let snaps = [0];
    let lefts = [];
    let widths = [];
    let moved = false;
    let current = 0;

    const nearest = (v) =>
      snaps.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a), snaps[0]);

    const measure = () => {
      const vw = view.clientWidth;
      const padLeft = parseFloat(getComputedStyle(trackEl).paddingLeft) || 0;
      minX = Math.min(0, vw - trackEl.scrollWidth);
      lefts = cards.map((c) => c.offsetLeft);
      widths = cards.map((c) => c.offsetWidth);
      // each card's "aligned" position, clamped so the last card can't over-scroll
      snaps = [...new Set(lefts.map((l) => Math.max(minX, -(l - padLeft))))];
    };

    // keep progress bar, active index and image parallax in sync with x
    const sync = (x) => {
      gsap.set(bar.current, { scaleX: minX ? Math.min(1, Math.max(0, x / minX)) : 0 });
      const i = snaps.indexOf(nearest(x));
      if (i !== current) {
        current = i;
        setIndex(i);
      }
      const vw = view.clientWidth;
      cards.forEach((_, n) => {
        const centre = lefts[n] + x + widths[n] / 2 - vw / 2;
        imgSetters[n](-centre * 0.06);
      });
    };

    measure();
    setMax(snaps.length - 1);

    const drag = Draggable.create(trackEl, {
      type: "x",
      trigger: view,
      inertia: true,
      edgeResistance: 0.75,
      minimumMovement: 6,
      bounds: { minX, maxX: 0 },
      // InertiaPlugin projects the resting point; we pick the nearest card edge
      snap: { x: (v) => nearest(v) },
      onPress() {
        gsap.killTweensOf(trackEl); // grab it mid-flight
        moved = false;
      },
      onDrag() {
        moved = true;
        sync(this.x);
      },
      onThrowUpdate() {
        sync(this.x);
      },
      onThrowComplete() {
        sync(this.x);
      },
    })[0];

    const goTo = (i) => {
      const target = snaps[Math.max(0, Math.min(snaps.length - 1, i))];
      gsap.to(trackEl, {
        x: target,
        duration: 1.1,
        ease: smooth,
        overwrite: true,
        onUpdate: () => {
          drag.update();
          sync(Number(gsap.getProperty(trackEl, "x")));
        },
      });
    };
    goToRef.current = (dir) => goTo(current + dir);

    // links inside the rail must not fire after a drag
    const swallowClick = (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    trackEl.addEventListener("click", swallowClick, true);

    // trackpad / shift+wheel: horizontal gestures scroll the rail, then
    // settle on the nearest card once the gesture pauses
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // vertical = page scroll
      e.preventDefault();
      gsap.killTweensOf(trackEl);
      const x = Math.min(0, Math.max(minX, Number(gsap.getProperty(trackEl, "x")) - e.deltaX));
      gsap.set(trackEl, { x });
      drag.update();
      sync(x);
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        const target = nearest(Number(gsap.getProperty(trackEl, "x")));
        goTo(snaps.indexOf(target));
      }, 120);
    };
    view.addEventListener("wheel", onWheel, { passive: false });

    // keyboard: arrows move one card
    const onKey = (e) => {
      if (e.key === "ArrowRight") goTo(current + 1);
      if (e.key === "ArrowLeft") goTo(current - 1);
    };
    view.addEventListener("keydown", onKey);

    // tabbing to an off-screen link brings its card into view
    const onFocus = (e) => {
      const card = e.target.closest(".svc-card");
      view.scrollLeft = 0;
      if (card) goTo(cards.indexOf(card));
    };
    trackEl.addEventListener("focusin", onFocus);

    const onResize = () => {
      if (dead) return;
      measure();
      setMax(snaps.length - 1);
      drag.applyBounds({ minX, maxX: 0 });
      gsap.set(trackEl, { x: snaps[Math.min(current, snaps.length - 1)] });
      drag.update();
      sync(Number(gsap.getProperty(trackEl, "x")));
    };
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(onResize);

    sync(0);

    return () => {
      dead = true;
      clearTimeout(wheelTimer);
      view.removeEventListener("wheel", onWheel);
      drag.kill();
      gsap.killTweensOf(trackEl);
      trackEl.removeEventListener("click", swallowClick, true);
      trackEl.removeEventListener("focusin", onFocus);
      view.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      gsap.set(trackEl, { clearProps: "transform" });
    };
  }, []);

  return (
    <section ref={root} className="section overflow-hidden">
      <div className="wrap">
        <SectionHead
          title={title}
          lead={
            lead ??
            "Intelligent IT and Non-IT solutions designed to streamline operations, improve productivity and accelerate growth."
          }
        />
      </div>

      <div
        ref={viewport}
        role="region"
        aria-roledescription="carousel"
        aria-label="Our services"
        tabIndex={0}
        className="mt-10 md:mt-12 cursor-grab select-none overflow-hidden active:cursor-grabbing touch-pan-y"
      >
        <ul
          ref={track}
          className="relative flex w-max gap-4 pb-6 pt-2 will-change-transform sm:gap-5"
          style={{
            paddingLeft: "max(clamp(1rem, 3.5vw, 2rem), calc((100% - 1200px) / 2 + clamp(1rem, 3.5vw, 2rem)))",
            paddingRight: "clamp(1rem, 3.5vw, 2rem)",
          }}
        >
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <li
                key={s.title}
                className={`svc-card group relative h-[450px] w-[82vw] max-w-[340px] shrink-0 overflow-hidden rounded-[24px] bg-gradient-to-br ${s.tint} shadow-[var(--shadow-card)] sm:h-[490px] sm:max-w-[360px] md:h-[520px] md:w-[380px] md:max-w-[380px] md:rounded-[28px]`}
              >
                {/* image is wider than the card so it can drift (parallax) */}
                <img
                  src={s.image}
                  alt=""
                  loading="lazy"
                  draggable="false"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                  className="svc-img absolute -left-[12%] top-0 h-full w-[124%] max-w-none object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10"
                />

                <div className="material absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-full text-fg">
                  <Icon size={21} aria-hidden="true" className="transition-transform duration-500 group-hover:scale-110" />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                  <h3 className="t-h3">{s.title}</h3>
                  <p className="t-small mt-3 max-w-[34ch] text-white/80">{s.description}</p>
                  <Link
                    to={`/contact?service=${encodeURIComponent(s.request)}`}
                    aria-label={`Request this service: ${s.title}`}
                    className="t-small mt-5 inline-flex items-center gap-1.5 font-medium text-white transition-[gap] duration-300 hover:gap-2.5"
                  >
                    Request this service <FiArrowRight aria-hidden="true" />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* progress + arrows */}
      <div className="wrap mt-4 flex items-center justify-between gap-6">
        <div
          aria-hidden="true"
          className="h-[3px] w-28 overflow-hidden rounded-full bg-line sm:w-40"
        >
          <div
            ref={bar}
            className="h-full w-full origin-left rounded-full bg-fg"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            aria-label="Previous service"
            disabled={index === 0}
            onClick={() => goToRef.current(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-bg-alt text-fg transition-[opacity,transform,background-color] duration-200 hover:bg-line active:scale-90 disabled:opacity-30"
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="Next service"
            disabled={index >= max}
            onClick={() => goToRef.current(1)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-bg-alt text-fg transition-[opacity,transform,background-color] duration-200 hover:bg-line active:scale-90 disabled:opacity-30"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
