import { useRef } from "react";
import {
  FiCompass,
  FiUsers,
  FiAward,
  FiStar,
  FiTarget,
  FiEye,
  FiTrendingUp,
  FiCheck,
} from "react-icons/fi";
import { FaWhatsapp, FaLinkedinIn } from "react-icons/fa6";

import founderImg from "../assets/dinesh-founder.jpg";
import { Btn, PageHeader, SectionHead, CtaBand } from "./ui";
import { gsap, clip, wipe, useMotion, smooth, revealHeadings } from "../lib/motion";
import { company, stats } from "../lib/company";

const values = [
  {
    icon: FiCompass,
    title: "Operational precision",
    text: "We follow structured SOPs and logging procedures so every campaign runs cleanly and error-free.",
  },
  {
    icon: FiUsers,
    title: "Human empathy",
    text: "Whether we talk to job applicants or client customers, active listening and problem solving guide us.",
  },
  {
    icon: FiAward,
    title: "Uncompromised integrity",
    text: "We enforce absolute transparency in client dashboard reporting, SLA billing and wage compliance.",
  },
  {
    icon: FiStar,
    title: "Continuous optimisation",
    text: "Our Operations Directors run weekly reviews to spot process bottlenecks and recommend workflow adjustments.",
  },
];

const milestones = [
  {
    year: "2025",
    title: "Company foundation",
    text: "Tephron Global was founded to bridge the gap between high-scale IT and Non-IT services and cost-effective operational management.",
  },
  {
    year: "2026",
    title: "Rapid scaling and expansion",
    text: "We opened specialised delivery operations to offer 24/7/365 coverage for international clients across global markets.",
  },
];

const trust = [
  "24/7/365 global coverage",
  "A dedicated team for each client",
  "Secure, encrypted workstations",
];

// same figures as the home page (src/lib/company.js)
const founderStats = [
  { icon: FiUsers, ...stats[0] },
  { icon: FiTrendingUp, ...stats[1] },
  { icon: FiAward, ...stats[2] },
];

const AboutPage = () => {
  const root = useRef(null);

  useMotion(() => {
    revealHeadings(root.current);

    // values rise from the bottom edge, left to right
    wipe(".value-card", clip.bottom, {
      duration: 1.4,
      stagger: 0.12,
      scrollTrigger: { trigger: ".values-grid", start: "top 85%", once: true },
    });

    // timeline: the line draws as you scroll, each milestone lands in turn
    gsap.fromTo(
      ".tl-line",
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: ".tl", start: "top 70%", end: "bottom 60%", scrub: true },
      }
    );
    gsap.utils.toArray(".tl-item", root.current).forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        x: 40,
        duration: 1.2,
        ease: smooth,
        scrollTrigger: { trigger: el, start: "top 82%", once: true },
      });
    });

    // mission wipes in from the left, vision from the right
    const mv = gsap.utils.toArray(".mv-card", root.current);
    wipe(mv[0], clip.left, { scrollTrigger: { trigger: ".mv-grid", start: "top 85%", once: true } });
    wipe(mv[1], clip.right, { scrollTrigger: { trigger: ".mv-grid", start: "top 85%", once: true } });

    // founder photo: mask opens downward, the picture settles and drifts
    wipe(".founder-photo", clip.top, { duration: 1.7, scrollTrigger: { trigger: ".founder", start: "top 80%", once: true } });
    gsap.from(".founder-photo img", {
      scale: 1.35,
      duration: 2.2,
      ease: "expo.out",
      scrollTrigger: { trigger: ".founder", start: "top 80%", once: true },
    });
    gsap.fromTo(
      ".founder-photo",
      { y: 30 },
      { y: -30, ease: "none", scrollTrigger: { trigger: ".founder", start: "top bottom", end: "bottom top", scrub: true } }
    );
    gsap.from(".founder-in", {
      x: 60,
      opacity: 0,
      duration: 1.4,
      ease: "power4.out",
      stagger: 0.12,
      scrollTrigger: { trigger: ".founder", start: "top 75%", once: true },
    });

    // founder stats count up
    // The real number is in the HTML. Only when the count actually starts
    // (just as it scrolls into view) does it restart from 0.
    const nums = gsap.utils.toArray(".fs-num", root.current);
    nums.forEach((el) => {
      const end = Number(el.dataset.end);
      const obj = { v: 0 };
      gsap.to(obj, {
        v: end,
        duration: 2,
        ease: "power3.out",
        snap: { v: 1 },
        paused: true,
        scrollTrigger: {
          trigger: el,
          start: "top 92%",
          once: true,
          onEnter: (self) => {
            el.firstChild.nodeValue = "0";
            self.animation.play();
          },
        },
        onUpdate: () => (el.firstChild.nodeValue = String(obj.v)),
      });
    });

    return () => nums.forEach((el) => (el.firstChild.nodeValue = el.dataset.end));
  }, root);

  return (
    <div ref={root}>
      <PageHeader
        lines={["About", "Tephron Global."]}
        lastClass="grad-text"
        lead="We build, deploy and manage dedicated outsourcing workflows that help scaling brands protect margins while accelerating customer satisfaction."
      >
        <ul className="t-small flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-muted">
          {trust.map((t) => (
            <li key={t} className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-soft text-accent">
                <FiCheck size={12} strokeWidth={3} aria-hidden="true" />
              </span>
              {t}
            </li>
          ))}
        </ul>
      </PageHeader>

      {/* VALUES */}
      <section className="section pt-8">
        <div className="wrap">
          <SectionHead center title="Our core operating values." />
          <div className="values-grid mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <article key={v.title} className="value-card card-flat p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                    <Icon size={24} aria-hidden="true" />
                  </div>
                  <h3 className="t-h3 mt-6 text-[1.25rem]">{v.title}</h3>
                  <p className="t-small mt-3 text-muted">{v.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* TIMELINE (a genuine sequence, so years are the structure) */}
      <section className="section bg-bg-alt">
        <div className="wrap-narrow">
          <SectionHead center title="The journey of Tephron Global." />
          <div className="tl relative mx-auto mt-16 max-w-3xl pl-8 md:pl-14">
            <div className="absolute bottom-2 left-0 top-2 w-[2px] bg-line">
              <div className="tl-line h-full w-full origin-top bg-accent" />
            </div>
            {milestones.map((m) => (
              <div key={m.year} className="tl-item relative pb-16 last:pb-0">
                <span className="absolute -left-8 top-3 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-[3px] border-accent bg-bg-alt md:-left-14" />
                <p className="t-display text-accent">{m.year}</p>
                <h3 className="t-h3 mt-3">{m.title}</h3>
                <p className="t-body mt-3 max-w-[52ch] text-muted">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="section">
        <div className="mv-grid wrap grid gap-4 md:grid-cols-2">
          <article className="mv-card relative isolate overflow-hidden rounded-[32px] bg-gradient-to-br from-[#0a5fd6] to-[#062a6b] p-9 text-white md:p-12">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-16 -z-10 h-72 w-72 rounded-full"
              style={{ background: "radial-gradient(closest-side, rgba(90,200,250,0.45), transparent 70%)" }}
            />
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <FiTarget size={24} aria-hidden="true" />
            </div>
            <h3 className="t-title mt-8">Our mission</h3>
            <p className="t-body mt-4 text-white/80">
              To deliver operational excellence and process consistency to
              international businesses. We do it by structuring secure IT
              pipelines, training agile customer care experts and enforcing
              strict data security protocols, so our partners can focus on
              core development.
            </p>
          </article>

          <article className="mv-card card-flat p-9 md:p-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
              <FiEye size={24} aria-hidden="true" />
            </div>
            <h3 className="t-title mt-8">Our vision</h3>
            <p className="t-body mt-4 text-muted">
              To establish Tephron Global as the leading bespoke business
              process provider in international markets. We aim to prove that
              outsourcing succeeds best when tech-enabled workflows are
              combined with highly trained, localised team structures.
            </p>
          </article>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="founder section pt-0">
        <div className="wrap grid items-center gap-10 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] md:gap-14 lg:gap-20">
          <figure className="mx-auto text-center md:mx-0 md:text-left">
            <div className="founder-photo mx-auto h-[220px] w-[170px] sm:h-[244px] sm:w-[190px] overflow-hidden rounded-[24px] sm:rounded-[28px] shadow-[var(--shadow-lift)] md:mx-0">
              <img
                src={founderImg}
                alt="Dinesh G, Founder and Chief Executive"
                width="190"
                height="244"
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="mt-5">
              <p className="t-h3 text-[1.375rem]">Dinesh G</p>
              <p className="t-small text-muted">{company.founder.title}</p>
              {company.founder.linkedin && (
                <a
                  href={company.founder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${company.founder.name} on LinkedIn`}
                  className="t-small mt-3 inline-flex items-center gap-2 font-medium text-accent"
                >
                  <FaLinkedinIn aria-hidden="true" /> LinkedIn
                </a>
              )}
            </figcaption>
          </figure>

          <div>
            <h2 className="founder-in t-title text-balance">
              IT and Non-IT business solutions.
            </h2>
            <p className="founder-in t-body mt-5 max-w-[60ch] text-muted">
              At Tephron Global, we deliver reliable and scalable IT and
              Non-IT solutions designed to support businesses across global
              markets. From technology and data-driven services to business
              operations and professional support, we help organisations
              improve efficiency, streamline processes and achieve sustainable
              growth.
            </p>

            <blockquote className="founder-in mt-8 border-l-[3px] border-accent pl-6">
              <p className="t-lead text-pretty">
                “Business process outsourcing is not just about handing off
                tasks; it is about building deep, repeatable trust. By pairing
                modern technology with thorough training, we deliver work that
                consistently improves our clients’ results while creating
                careers for our teams close to home.”
              </p>
            </blockquote>

            <dl className="founder-in mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {founderStats.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="card-flat flex items-center gap-4 p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <div>
                      <dd className="t-h3 tabular-nums">
                        <span className="fs-num" data-end={s.n}>
                          {s.n}
                        </span>
                        {s.suffix}
                      </dd>
                      <dt className="t-caption text-muted">{s.label}</dt>
                    </div>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      </section>

      <CtaBand
        title="Ready to accelerate your business operations?"
        text="Talk to our solutions architects and design a bespoke outsourcing workflow around your metrics, compliance and growth goals."
      >
        <Btn to="/contact" variant="light"  arrow>
          Schedule a consultation
        </Btn>
        <Btn
          href="https://wa.me/918300378470?text=Hello%20Tephron%20Global%2C%20I%20would%20like%20to%20learn%20more%20about%20your%20services."
          className="bg-[#25D366] text-white hover:bg-[#1fb957]"
        >
          <FaWhatsapp size={19} aria-hidden="true" />
          Chat on WhatsApp
        </Btn>
      </CtaBand>
    </div>
  );
};

export default AboutPage;
