import { useEffect, useRef, useState } from "react";
import { PageHeader, CtaBand, Btn } from "./ui";
import { gsap, clip, wipe, useMotion } from "../lib/motion";
import { galleryImages } from "../lib/gallery";

const GalleryPage = () => {
  const root = useRef(null);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    if (open === null) return;
    const n = galleryImages.length;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i + 1) % n);
      if (e.key === "ArrowLeft") setOpen((i) => (i - 1 + n) % n);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useMotion(() => {
    gsap.utils.toArray(".g-item", root.current).forEach((item, i) => {
      // tile rises into place
      const st = { trigger: item, start: "top 92%", once: true };
      wipe(item, i % 2 ? clip.right : clip.left, { duration: 1.6, scrollTrigger: st });
      gsap.from(item.querySelector(".g-img-zoom"), { scale: 1.35, duration: 2.2, ease: "expo.out", scrollTrigger: st });
      // photo drifts inside its tile while scrolling (parallax)
      gsap.fromTo(
        item.querySelector(".g-img"),
        { yPercent: -7 },
        {
          yPercent: 7,
          ease: "none",
          scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    });
  }, root);

  return (
    <div ref={root}>
      <PageHeader
        lines={["Inside", "Tephron Global."]}
        lead="A look at our operational facilities, dedicated delivery pods and the people who run them."
      />

      <section className="pb-[clamp(3rem,6vw,6rem)]">
        <div className="wrap grid auto-rows-[175px] grid-cols-2 gap-3 sm:auto-rows-[210px] md:auto-rows-[250px] lg:auto-rows-[270px] md:grid-cols-4 md:gap-4">
          {galleryImages.map((g, idx) => (
            <figure
              key={g.image}
              onClick={() => setOpen(idx)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setOpen(idx))}
              role="button"
              tabIndex={0}
              aria-label={`View full image: ${g.title}`}
              className={`g-item group relative cursor-zoom-in overflow-hidden rounded-[24px] bg-bg-alt md:rounded-[28px] ${g.span}`}
            >
              <div className="g-img-zoom absolute inset-0">
                <img
                  src={g.image}
                  alt={g.title}
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                  className="g-img absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-out)] group-hover:scale-[1.06]"
                />
              </div>
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white md:p-6">
                <p className="text-[1.0625rem] font-semibold leading-tight tracking-[-0.015em] md:text-[1.25rem]">
                  {g.title}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={galleryImages[open].title}
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-4"
        >
          <img
            src={galleryImages[open].image}
            alt={galleryImages[open].title}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[82vh] max-w-full rounded-lg object-contain"
          />
          <p className="mt-4 text-white">{galleryImages[open].title}</p>
          <button type="button" aria-label="Close" onClick={() => setOpen(null)} className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-2xl text-white">×</button>
          <button type="button" aria-label="Previous image" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + galleryImages.length) % galleryImages.length); }} className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl text-white">‹</button>
          <button type="button" aria-label="Next image" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % galleryImages.length); }} className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl text-white">›</button>
        </div>
      )}

      <CtaBand
        title="Join our growing team."
        text="We are always looking for people who care about doing the work well."
      >
        <Btn to="/careers" variant="light"  arrow>
          See open roles
        </Btn>
      </CtaBand>
    </div>
  );
};

export default GalleryPage;
