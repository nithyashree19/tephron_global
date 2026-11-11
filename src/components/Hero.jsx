import { useRef } from "react";
import { Btn } from "./ui";
import heroWebp from "../assets/tephron-hero.webp";
import heroWebpSmall from "../assets/tephron-hero-960.webp";
import heroPng from "../assets/tephron-hero.png";
import { gsap, useMotion, smooth, whenIntroDone } from "../lib/motion";

// =====================================================================
// HERO
// The image is landscape (16:9) at every screen size and is never cropped
// into a tall box.
//   lg and up : copy sits on the dark left side of the image
//   below lg  : copy sits above the image, so nothing covers the picture
// Sequence: orbs bloom -> frame rises out of its mask -> headline lines
// rise -> lead + buttons fade in.
// Continuous motion:
//   1. scroll: image parallaxes, copy lifts away, frame corners tighten
//   2. ambient: orbs drift
//   3. pointer: orbs shift by depth and the frame tilts (mouse only)
//
// Copy comes from tephronglobal.com (title + meta description).
// =====================================================================

const Hero = () => {
  const root = useRef(null);

  useMotion(({ fine }) => {
    const cleanups = [];

    // ---------- 1. ENTRANCE TIMELINE (paused until the intro ends) ------
    const intro = gsap.timeline({ paused: true, defaults: { ease: smooth } });
    intro
      .from(".hero-orb", { opacity: 0, scale: 0.55, duration: 2.4, stagger: 0.18, ease: "power2.out" }, 0)
      .from(".hero-frame", { clipPath: "inset(100% 0% 0% 0% round 28px)", y: 70, duration: 1.9, ease: "expo.out", clearProps: "clipPath" }, 0.1)
      .from(".hero-img", { scale: 1.12, duration: 2.6, ease: "power2.out" }, 0.1)
      .from(".hero-line", { yPercent: 118, duration: 1.3, stagger: 0.12 }, 0.9)
      .from(".hero-sub", { opacity: 0, y: 20, duration: 1.1 }, 1.25)
      .from(".hero-cta", { opacity: 0, y: 18, duration: 1, stagger: 0.09 }, 1.4);
    cleanups.push(whenIntroDone(() => intro.play()));
    cleanups.push(() => intro.kill());

    // ---------- 2. SCROLL-LINKED ----------------------------------------
    // copy lifts away slower than the page, adding depth
    gsap.to(".hero-copy", {
      y: -60,
      opacity: 0.15,
      ease: "none",
      scrollTrigger: { trigger: root.current, start: "top top", end: "70% top", scrub: true },
    });
    // frame corners tighten as it leaves
    gsap.to(".hero-frame-scale", {
      borderRadius: 22,
      scale: 0.97,
      ease: "none",
      scrollTrigger: { trigger: root.current, start: "40% top", end: "bottom top", scrub: 0.5 },
    });
    // image drifts inside the frame (parallax); 3.5% stays inside the 4% bleed
    gsap.fromTo(
      ".hero-img-wrap",
      { yPercent: 0 },
      {
        yPercent: 3.5,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      }
    );

    // ---------- 3. AMBIENT LOOPS -----------------------------------------
    gsap.utils.toArray(".hero-orb-drift").forEach((el, i) => {
      gsap.to(el, {
        x: i % 2 ? 70 : -70,
        y: i === 1 ? 50 : -40,
        duration: 9 + i * 2.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });

    // ---------- 4. POINTER (mouse only) ----------------------------------
    if (fine) {
      const stage = root.current.querySelector(".hero-stage");
      const orbs = gsap.utils.toArray(".hero-orb").map((el) => ({
        depth: Number(el.dataset.depth) || 4,
        x: gsap.quickTo(el, "x", { duration: 1.4, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 1.4, ease: "power3.out" }),
      }));
      const tiltX = gsap.quickTo(".hero-tilt", "rotationX", { duration: 1.1, ease: "power3.out" });
      const tiltY = gsap.quickTo(".hero-tilt", "rotationY", { duration: 1.1, ease: "power3.out" });

      const onMove = (e) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        orbs.forEach((o) => {
          o.x(nx * o.depth * 8);
          o.y(ny * o.depth * 8);
        });
        const r = stage.getBoundingClientRect();
        const inside = e.clientY > r.top && e.clientY < r.bottom;
        tiltY(inside ? nx * 3 : 0);
        tiltX(inside ? ny * -2.5 : 0);
      };
      const onLeave = () => {
        tiltX(0);
        tiltY(0);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, root);

  return (
    <section
      ref={root}
      className="relative overflow-x-clip pb-10 pt-[calc(var(--header-h)+1.5rem)] md:pb-16 md:pt-[calc(var(--header-h)+2rem)]"
    >
      {/* AMBIENCE */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="hero-grid absolute inset-0" />
        <div className="hero-orb-drift absolute inset-0">
          <div className="hero-orb orb-a" data-depth="3" />
        </div>
        <div className="hero-orb-drift absolute inset-0">
          <div className="hero-orb orb-b" data-depth="5" />
        </div>
        <div className="hero-orb-drift absolute inset-0">
          <div className="hero-orb orb-c" data-depth="7" />
        </div>
      </div>

      <div className="wrap relative">
        <div
          className="hero-stage relative mx-auto flex max-w-[1280px] flex-col"
          style={{ perspective: "1600px" }}
        >
          {/* COPY
              below lg : centred above the image, normal text colours
              lg and up: laid over the dark left side of the image, white text */}
          <div className="hero-copy relative z-10 mb-8 text-center sm:mb-10 lg:absolute lg:inset-y-0 lg:left-0 lg:mb-0 lg:flex lg:w-[62%] lg:items-center lg:p-12 lg:text-left lg:text-white xl:p-16">
            <div className="mx-auto max-w-[640px] lg:mx-0">
              <h1 className="t-hero text-balance">
                <span className="mask">
                  <span className="hero-line block">Powering Businesses.</span>
                </span>
                <span className="mask">
                  <span className="hero-line grad-text block">Empowering People.</span>
                </span>
              </h1>

              <p className="hero-sub t-lead mx-auto mt-5 max-w-[540px] text-pretty text-muted lg:mx-0 lg:mt-6 lg:text-white/80">
                Premium, scalable IT and Non-IT, customer support,
                recruitment and technology operations.
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 lg:mt-8 lg:justify-start">
                <span className="hero-cta">
                  <Btn
                    to="/services"
                    arrow
                    className="lg:!bg-white lg:!text-[#1d1d1f] lg:!shadow-none lg:hover:!bg-[#f2f2f4]"
                  >
                    Explore services
                  </Btn>
                </span>
                <span className="hero-cta">
                  <Btn to="/contact" variant="ghost" arrow className="lg:!text-white">
                    Talk to our team
                  </Btn>
                </span>
              </div>
            </div>
          </div>

          {/* IMAGE FRAME: always landscape 16:9 */}
          <div className="hero-frame">
            <div className="hero-tilt" style={{ transformStyle: "preserve-3d" }}>
              <div
                className="hero-frame-scale relative aspect-[16/9] overflow-hidden rounded-[20px] border border-line bg-[#06132c] shadow-[var(--shadow-hero)] sm:rounded-[28px] lg:rounded-[32px]"
                style={{ willChange: "transform" }}
              >
                {/* The image is 8% larger than the frame in both directions, so it
                    keeps its 16:9 shape and can drift (parallax) without showing
                    an edge. */}
                <div className="hero-img-wrap absolute -inset-x-[4%] -top-[4%] h-[108%]">
                  <picture>
                    <source
                      type="image/webp"
                      srcSet={`${heroWebpSmall} 960w, ${heroWebp} 1672w`}
                      sizes="(min-width: 1312px) 1280px, 100vw"
                    />
                    <img
                      src={heroPng}
                      alt="Illustration of a modern office building next to a glowing globe that connects cities around the world"
                      width="1672"
                      height="941"
                      fetchPriority="high"
                      decoding="async"
                      draggable="false"
                      className="hero-img h-full w-full object-cover object-center"
                    />
                  </picture>
                </div>

                {/* legibility: only needed where the copy sits on the image */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(to_right,rgba(4,12,30,0.86)_0%,rgba(4,12,30,0.55)_30%,rgba(4,12,30,0)_58%)] lg:block"
                />

                {/* thin inner highlight: glass-edge feel */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
