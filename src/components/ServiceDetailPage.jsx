import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiChevronDown,
  FiLayers,
  FiShield,
  FiCpu,
  FiCompass,
  FiUsers,
  FiBookOpen,
  FiDatabase,
  FiHeadphones,
  FiHeart,
  FiFileText,
} from "react-icons/fi";
import { Btn, CtaBand, MaskLines, SectionHead } from "./ui";
import NotFound from "./NotFound";
import { getService, servicesData } from "../lib/servicesData";
import { photoFor } from "../lib/servicePhotos";
import { gsap, clip, useMotion, revealPageHeader, revealHeadings } from "../lib/motion";

const heroIcon = {
  "data-operations": FiDatabase,
  "omnichannel-support": FiUsers,
  "virtual-assistance": FiHeadphones,
  "ebook-conversions": FiBookOpen,
  "healthcare-admin": FiHeart,
  "financial-ledger": FiFileText,
};
const capIcons = [FiLayers, FiShield, FiCpu, FiCompass];

const steps = [
  ["Talent screening and training", "We recruit top-tier graduates and seasoned voice and data specialists, then align them with client-specific SOPs and security compliance."],
  ["Secure workstation setup", "Every team member works on encrypted computers with secure VPN connections and multi-factor sign-in, and we monitor work activity for security."],
  ["Weekly performance reviews", "A senior operations manager reviews results with your team every week: issues resolved, customer satisfaction scores and error rates."],
];

const Faq = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="sd-faq overflow-hidden rounded-[22px] bg-bg">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 p-6 text-left text-[1.0625rem] font-semibold"
      >
        {q}
        <FiChevronDown aria-hidden="true" className={`shrink-0 text-muted transition-transform duration-500 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <p className="t-small px-6 pb-6 text-muted">{a}</p>
        </div>
      </div>
    </div>
  );
};

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const svc = getService(slug);
  const root = useRef(null);

  useMotion(
    ({ desktop }) => {
      if (!svc) return;
      const tl = revealPageHeader();
      const drift = gsap.to(".ph-glow", { x: 70, y: 24, duration: 11, ease: "sine.inOut", repeat: -1, yoyo: true });
      revealHeadings(root.current);

      // hero photo: rises in, then drifts and settles while scrolling
      gsap.from(".sd-photo", { clipPath: clip.bottom, y: 60, duration: 1.8, ease: "expo.out", delay: 0.5, clearProps: "clipPath,transform" });
      gsap.fromTo(".sd-photo-img", { scale: 1.18, yPercent: -6 }, {
        scale: 1, yPercent: 6, ease: "none",
        scrollTrigger: { trigger: ".sd-photo", start: "top 90%", end: "bottom top", scrub: true },
      });
      gsap.to(".sd-photo", {
        scale: desktop ? 0.94 : 0.97, ease: "none",
        scrollTrigger: { trigger: ".sd-photo", start: "center 35%", end: "bottom top", scrub: true },
      });

      const rise = (sel, trigger, extra = {}) =>
        gsap.from(sel, {
          opacity: 0, y: 48, duration: 1.2, ease: "expo.out", stagger: 0.12, clearProps: "opacity,transform",
          scrollTrigger: { trigger, start: "top 85%", once: true }, ...extra,
        });
      rise(".sd-cap", ".sd-caps");
      rise(".sd-tool", ".sd-tools", { y: 0, x: -36 });
      rise(".sd-why-item", ".sd-why", { y: 0, x: 36 });
      rise(".sd-step", ".sd-steps");
      rise(".sd-faq", ".sd-faqs", { y: 28 });
      rise(".sd-other", ".sd-others", { y: 28, stagger: 0.08 });
      gsap.from(".sd-why", {
        clipPath: clip.bottom, duration: 1.5, ease: "expo.out", clearProps: "clipPath",
        scrollTrigger: { trigger: ".sd-why", start: "top 88%", once: true },
      });
      gsap.fromTo(".sd-line", { scaleX: 0 }, {
        scaleX: 1, ease: "none", transformOrigin: "left center",
        scrollTrigger: { trigger: ".sd-steps", start: "top 75%", end: "bottom 70%", scrub: true },
      });
      return () => {
        tl.kill();
        drift.kill();
      };
    },
    root,
    [slug]
  );

  if (!svc) return <NotFound />;

  const Icon = heroIcon[svc.slug] || FiLayers;
  const photo = photoFor(svc.slug);
  const contact = `/contact?service=${encodeURIComponent(svc.request)}`;
  const others = servicesData.filter((s) => s.slug !== svc.slug);
  const cta = svc.cta.length
    ? svc.cta
    : ["Talk to us about this service.", "Tell us your volumes and targets and we will design the team around them.", "Start the conversation"];

  return (
    <div ref={root} key={svc.slug}>
      {/* HERO: light, centred, lots of air */}
      <header className="relative overflow-hidden pb-10 pt-[calc(var(--header-h)+2rem)] text-center sm:pt-[calc(var(--header-h)+3rem)] md:pb-16 md:pt-[calc(var(--header-h)+4rem)]">
        <div
          aria-hidden="true"
          className="ph-glow pointer-events-none absolute left-1/2 top-0 h-[520px] w-[920px] max-w-[160vw] -translate-x-1/2 opacity-70"
          style={{ background: "radial-gradient(closest-side, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%)" }}
        />
        <div className="wrap relative">
          <Link to="/services" className="ph-fade t-small inline-flex items-center gap-1.5 font-medium text-accent">
            <FiArrowLeft aria-hidden="true" /> All services
          </Link>
          <div className="ph-fade mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-[20px] bg-accent-soft text-accent">
            <Icon size={28} aria-hidden="true" />
          </div>
          <p className="ph-fade t-caption mt-6 font-semibold uppercase tracking-[0.2em] text-accent">{svc.eyebrow}</p>
          <MaskLines as="h1" lines={svc.heading} lastClass="text-accent" className="t-display mx-auto mt-4 max-w-4xl text-balance" />
          <p className="ph-fade t-lead mx-auto mt-6 max-w-2xl text-pretty text-muted">{svc.lead}</p>
          <div className="ph-fade mt-9 flex flex-wrap justify-center gap-3">
            <Btn to={contact} arrow>Request this service</Btn>
          </div>
        </div>
      </header>

      {photo && (
        <div className="wrap pb-[clamp(3rem,6vw,6rem)]">
          <div className="sd-photo relative mx-auto aspect-[16/8] max-w-4xl overflow-hidden rounded-[28px] bg-bg-alt shadow-[var(--shadow-card)] md:rounded-[36px]">
            <img src={photo} alt={svc.title} loading="lazy" decoding="async" className="sd-photo-img absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
      )}

      {/* CAPABILITIES: bento */}
      <section className="section bg-bg-alt">
        <div className="wrap">
          <SectionHead center title={svc.capTitle} />
          <ul className="sd-caps mt-14 grid gap-4 md:grid-cols-2 md:gap-5">
            {svc.capabilities.map(([t, d], i) => {
              const CapIcon = capIcons[i % capIcons.length];
              return (
                <li
                  key={t}
                  className="sd-cap group relative overflow-hidden rounded-[28px] bg-bg p-8 transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[var(--shadow-card)] md:p-10"
                >
                  <span aria-hidden="true" className="absolute right-7 top-5 text-[4.5rem] font-semibold leading-none text-line transition-transform duration-700 group-hover:scale-110">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                    <CapIcon size={22} aria-hidden="true" />
                  </span>
                  <h3 className="t-h3 mt-8 text-[1.375rem]">{t}</h3>
                  <p className="t-small mt-3 max-w-[44ch] text-muted">{d}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* TOOLS + WHY */}
      {(svc.tools.length > 0 || svc.why.length > 0) && (
        <section className="section">
          <div className="wrap grid items-start gap-12 md:grid-cols-2 md:gap-16">
            {svc.tools.length > 0 && (
              <div>
                <h2 className="t-title sec-title text-balance">{svc.toolsTitle}</h2>
                <ul className="sd-tools mt-10 divide-y divide-line">
                  {svc.tools.map(([t, d]) => (
                    <li key={t} className="sd-tool flex gap-4 py-5">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                        <FiCheck aria-hidden="true" size={15} />
                      </span>
                      <div>
                        <p className="text-[1.0625rem] font-semibold">{t}</p>
                        <p className="t-small text-muted">{d}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {svc.why.length > 0 && (
              <div className={`sd-why rounded-[32px] bg-fg p-8 text-bg md:p-12 ${svc.tools.length ? "" : "md:col-span-2"}`}>
                <h2 className="t-h3 text-[1.625rem]">{svc.whyTitle}</h2>
                <ul className="mt-10 space-y-8">
                  {svc.why.map(([t, d]) => (
                    <li key={t} className="sd-why-item border-t border-bg/15 pt-6">
                      <p className="text-[1.125rem] font-semibold">{t}</p>
                      <p className="t-small mt-2 opacity-70">{d}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* HOW WE WORK */}
      <section className="section bg-bg-alt">
        <div className="wrap">
          <SectionHead center title="How we run your team." />
          <div className="relative mt-14">
            <div aria-hidden="true" className="absolute left-[8%] top-6 hidden h-[2px] w-[84%] bg-line md:block">
              <div className="sd-line h-full w-full bg-accent" />
            </div>
            <ol className="sd-steps relative grid gap-10 md:grid-cols-3 md:gap-8">
              {steps.map(([t, d], i) => (
                <li key={t} className="sd-step md:text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent font-semibold text-white shadow-[0_8px_24px_-6px_var(--accent)] md:mx-auto">
                    {i + 1}
                  </span>
                  <h3 className="t-h3 mt-6 text-[1.25rem]">{t}</h3>
                  <p className="t-small mx-auto mt-3 max-w-[38ch] text-muted">{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {svc.faqs.length > 0 && (
        <section className="section">
          <div className="wrap-narrow">
            <SectionHead center title="Frequently asked questions." />
            <div className="sd-faqs mt-12 space-y-3">
              {svc.faqs.map(([q, a]) => (
                <Faq key={q} q={q} a={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* OTHER SERVICES */}
      <section className="section bg-bg-alt">
        <div className="wrap">
          <SectionHead title="Explore other services." />
          <ul className="sd-others mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug} className="sd-other">
                <Link
                  to={`/services/${o.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-[22px] bg-bg p-6 font-semibold transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
                >
                  {o.title}
                  <FiArrowRight aria-hidden="true" className="shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="pt-[clamp(3rem,6vw,6rem)]">
        <CtaBand title={cta[0]} text={cta[1]}>
          <Btn to={contact} variant="light" arrow>{cta[2]}</Btn>
        </CtaBand>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
