import { useRef } from "react";
import { PageHeader, CtaBand, Btn } from "./ui";
import { gsap, clip, wipe, useMotion } from "../lib/motion";

const u = (id, w = 1000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

// `span` controls the bento layout on medium screens and up
const galleryImages = [
  { title: "Operations hub and floor", category: "Infrastructure", image: u("photo-1497366216548-37526070297c", 1300), span: "col-span-2 md:row-span-2" },
  { title: "Agile training and onboarding", category: "Culture", image: u("photo-1522071820081-009f0129c71c"), span: "col-span-2" },
  { title: "Global collaboration center", category: "Teamwork", image: u("photo-1531482615713-2afd69097998", 800), span: "" },
  { title: "Technology and data security desk", category: "Security", image: u("photo-1504384308090-c894fdcc538d", 800), span: "" },
  { title: "Leadership strategy session", category: "Leadership", image: u("photo-1556761175-5973dc0f32e7"), span: "col-span-2" },
  { title: "24/7 omnichannel command pod", category: "Operations", image: u("photo-1517245386807-bb43f82c33c4"), span: "col-span-2" },
];

const GalleryPage = () => {
  const root = useRef(null);

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
          {galleryImages.map((g) => (
            <figure
              key={g.title}
              className={`g-item group relative overflow-hidden rounded-[24px] bg-bg-alt md:rounded-[28px] ${g.span}`}
            >
              <div className="g-img-zoom absolute inset-0">
                <img
                  src={g.image}
                  alt={g.title}
                  loading="lazy"
                  draggable="false"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                  className="g-img absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-out)] group-hover:scale-[1.06]"
                />
              </div>
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white md:p-6">
                <p className="t-caption text-white/70">{g.category}</p>
                <p className="mt-0.5 text-[1.0625rem] font-semibold leading-tight tracking-[-0.015em] md:text-[1.25rem]">
                  {g.title}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

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
