import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  FiArrowRight,
  FiMapPin,
  FiBriefcase,
  FiClock,
  FiX,
  FiUploadCloud,
  FiUsers,
  FiTrendingUp,
  FiAward,
  FiSearch,
} from "react-icons/fi";

import { Btn, PageHeader, SectionHead, AnimatedCheck } from "./ui";
import {
  gsap,
  clip,
  wipe,
  Draggable,
  InertiaPlugin,
  useMotion,
  smooth,
  prefersReducedMotion,
  revealHeadings,
} from "../lib/motion";

// =====================================
// JOB DATA: add new vacancies here
// =====================================
const jobs = [
  {
    id: 1,
    title: "Tamil Voice Process",
    department: "Call Support",
    location: "Tenkasi",
    type: "Remote",
    experience: "0–1 Year",
    experienceLevel: "Fresher",
    description:
      "We are looking for enthusiastic candidates with excellent Tamil communication skills to support customer interactions and deliver outstanding service experiences.",
    skills: ["Tamil Communication", "Customer Support", "Communication"],
  },
  {
    id: 2,
    title: "Senior Customer Support Executive",
    department: "Call Support",
    location: "Chennai",
    type: "On-site",
    experience: "2–4 Years",
    experienceLevel: "Experienced",
    description:
      "Looking for experienced customer support professionals with strong communication, problem-solving and customer relationship skills.",
    skills: ["Customer Support", "Communication", "Problem Solving"],
  },
];

const perks = [
  { icon: FiTrendingUp, title: "Learn and develop", text: "Build professional knowledge and strengthen your capabilities." },
  { icon: FiUsers, title: "Grow together", text: "Work in a collaborative environment focused on shared success." },
  { icon: FiAward, title: "Create impact", text: "Contribute to meaningful operations and business outcomes." },
];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  location: "",
  skills: "",
  description: "",
  resume: null,
};

// =====================================================================
// APPLICATION SHEET
// Bottom sheet on phones, centred dialog on larger screens.
//   - springs in, and can be dismissed at any moment (interruptible)
//   - phones: drag the handle down; the release velocity is projected
//     forward (Apple's 0.998 deceleration) to decide dismiss vs. snap back
//   - the backdrop fades in step with the sheet position
// =====================================================================
const ApplySheet = ({ job, onClose }) => {
  const sheet = useRef(null);
  const backdrop = useRef(null);
  const handle = useRef(null);
  const closing = useRef(false);
  const dragRef = useRef(null);

  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [resumeError, setResumeError] = useState("");

  const isPhone = () => window.matchMedia("(max-width: 639px)").matches;

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    const reduce = prefersReducedMotion();
    const phone = isPhone();
    gsap.killTweensOf([sheet.current, backdrop.current]);
    gsap.to(backdrop.current, { opacity: 0, duration: reduce ? 0 : 0.4, ease: "power2.out" });
    gsap.to(sheet.current, {
      ...(phone ? { y: "110%" } : { y: 30, scale: 0.97, opacity: 0 }),
      duration: reduce ? 0 : 0.55,
      ease: smooth,
      onComplete: onClose,
    });
  };

  // open animation + body lock + focus handling + phone drag
  useLayoutEffect(() => {
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";
    const reduce = prefersReducedMotion();
    const phone = isPhone();

    gsap.fromTo(backdrop.current, { opacity: 0 }, { opacity: 1, duration: reduce ? 0 : 0.5 });
    gsap.fromTo(
      sheet.current,
      phone ? { y: "100%" } : { y: 40, scale: 0.96, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: reduce ? 0 : 0.9, ease: smooth }
    );
    sheet.current.focus();

    if (phone) {
      dragRef.current = Draggable.create(sheet.current, {
        type: "y",
        trigger: handle.current,
        bounds: { minY: 0, maxY: window.innerHeight },
        onPress() {
          gsap.killTweensOf(sheet.current); // grab it mid-animation
        },
        onDrag() {
          const h = sheet.current.offsetHeight;
          gsap.set(backdrop.current, { opacity: Math.max(0, 1 - this.y / h) });
        },
        onRelease() {
          const h = sheet.current.offsetHeight;
          const v = InertiaPlugin.getVelocity(sheet.current, "y"); // px / second
          // project where the sheet would come to rest (decel rate 0.998)
          const projected = this.y + (v / 1000) * (0.998 / (1 - 0.998));
          if (projected > h * 0.55) {
            close();
          } else {
            gsap.to(sheet.current, { y: 0, duration: 0.8, ease: smooth });
            gsap.to(backdrop.current, { opacity: 1, duration: 0.4 });
          }
        },
      })[0];
    }

    const sheetEl = sheet.current;
    const backdropEl = backdrop.current;
    return () => {
      dragRef.current?.kill();
      gsap.killTweensOf([sheetEl, backdropEl]);
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Escape closes; Tab stays inside the dialog
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab") return;
      const nodes = sheet.current.querySelectorAll(
        'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'
      );
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleResume = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ok = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!ok.includes(file.type)) {
      setResumeError("Upload a PDF, DOC or DOCX file.");
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setResumeError("Your resume is over 5 MB. Upload a smaller file.");
      e.target.value = "";
      return;
    }
    setResumeError("");
    setForm((f) => ({ ...f, resume: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Job Application:", { ...form, jobTitle: job.title });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6" role="presentation">
      <div
        ref={backdrop}
        onPointerDown={close}
        className="absolute inset-0 bg-black/50 backdrop-blur-[6px]"
        aria-hidden="true"
      />

      <div
        ref={sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-title"
        tabIndex={-1}
        className="relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[28px] bg-surface shadow-[var(--shadow-lift)] outline-none sm:max-h-[88vh] sm:max-w-[640px] sm:rounded-[28px]"
      >
        {/* grab handle (phones) + header */}
        <div ref={handle} className="shrink-0 cursor-grab touch-none px-7 pt-3 sm:cursor-auto sm:px-9 sm:pt-7">
          <div aria-hidden="true" className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-line-strong sm:hidden" />
          <div className="flex items-start justify-between gap-4 pb-5">
            <div>
              <h2 id="apply-title" className="t-h3">Apply for this role</h2>
              <p className="t-small mt-1 text-muted">{job.title}</p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bg-alt text-muted transition-[transform,color] hover:text-fg active:scale-90"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto overscroll-contain border-t border-line px-7 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-6 sm:px-9">
          {submitted ? (
            <div className="py-10 text-center" role="status" aria-live="polite">
              <AnimatedCheck className="mx-auto text-[#30d158]" />
              <h3 className="t-title mt-6">Thank you.</h3>
              <p className="t-body mt-3 text-muted">
                Your demo application has been captured successfully.
              </p>
              <Btn className="mt-8" onClick={close}>Close</Btn>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="a-name" className="label">Full name</label>
                  <input id="a-name" className="field" type="text" name="name" autoComplete="name" required
                    value={form.name} onChange={handleChange} placeholder="Your full name" />
                </div>
                <div>
                  <label htmlFor="a-email" className="label">Email address</label>
                  <input id="a-email" className="field" type="email" name="email" autoComplete="email" required
                    value={form.email} onChange={handleChange} placeholder="you@email.com" />
                </div>
                <div>
                  <label htmlFor="a-phone" className="label">Phone number</label>
                  <input id="a-phone" className="field" type="tel" name="phone" autoComplete="tel" required
                    pattern="[0-9+\-\s]{7,15}" value={form.phone} onChange={handleChange} placeholder="Phone number" />
                </div>
                <div>
                  <label htmlFor="a-loc" className="label">Current location</label>
                  <input id="a-loc" className="field" type="text" name="location" required
                    value={form.location} onChange={handleChange} placeholder="City, State" />
                </div>
              </div>

              <div>
                <label htmlFor="a-skills" className="label">Skills</label>
                <input id="a-skills" className="field" type="text" name="skills" required
                  value={form.skills} onChange={handleChange} placeholder="Communication, Excel, Customer Support" />
              </div>

              <div>
                <label htmlFor="a-desc" className="label">Describe yourself</label>
                <textarea id="a-desc" className="field resize-none" name="description" rows={4} required
                  value={form.description} onChange={handleChange}
                  placeholder="Tell us about your experience and career interests." />
              </div>

              <div>
                <span className="label">Resume</span>
                {/* the input stays focusable (sr-only) so native validation can point at it */}
                <label className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line-strong bg-bg-alt px-5 py-7 text-center transition-colors hover:border-accent has-[:focus-visible]:border-accent has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent-soft">
                  <FiUploadCloud className="mb-2 text-3xl text-accent" aria-hidden="true" />
                  <span className="t-small font-medium">
                    {form.resume ? form.resume.name : "Choose your resume"}
                  </span>
                  <span className="t-caption mt-1 text-muted">PDF, DOC or DOCX, up to 5 MB</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    required
                    className="sr-only"
                    onChange={handleResume}
                  />
                </label>
                {resumeError && (
                  <p role="alert" className="t-small mt-2 text-[#ff453a]">{resumeError}</p>
                )}
              </div>

              <div className="pt-1">
                <button type="submit" className="btn btn-primary w-full">
                  Submit application <FiArrowRight aria-hidden="true" />
                </button>
                <p className="t-caption mt-3 text-center text-muted">
                  Your information will be used for recruitment purposes only.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// PAGE
// =====================================================================
const Career = () => {
  const root = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);

  const categories = ["All", ...new Set(jobs.map((j) => j.department))];

  useMotion(() => {
    revealHeadings(root.current);
    wipe(".perk", clip.left, {
      duration: 1.5,
      stagger: 0.14,
      scrollTrigger: { trigger: ".perks", start: "top 86%", once: true },
    });
  }, root);

  const search = searchTerm.toLowerCase().trim();
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !search ||
      job.title.toLowerCase().includes(search) ||
      job.department.toLowerCase().includes(search) ||
      job.description.toLowerCase().includes(search) ||
      job.skills.some((s) => s.toLowerCase().includes(search));
    return (
      matchesSearch &&
      (experienceFilter === "All" || job.experienceLevel === experienceFilter) &&
      (categoryFilter === "All" || job.department === categoryFilter)
    );
  });

  const clearFilters = () => {
    setSearchTerm("");
    setExperienceFilter("All");
    setCategoryFilter("All");
  };

  // new rows slide in when filters change
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const rows = root.current?.querySelectorAll(".job-row");
    if (rows?.length)
      gsap.fromTo(rows, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: smooth, stagger: 0.05, clearProps: "all" });
  }, [search, experienceFilter, categoryFilter]);

  return (
    <div ref={root}>
      <PageHeader
        lines={["Talent meets", "opportunity."]}
        lastClass="grad-text"
        lead="Build meaningful experiences, grow your skills and create your future with a team that believes in professional excellence."
      >
        <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
          <Btn  arrow
            onClick={() => document.getElementById("openings")?.scrollIntoView({ behavior: "smooth" })}
          >
            Explore open roles
          </Btn>
          <Btn variant="ghost" arrow onClick={() => document.getElementById("why-join")?.scrollIntoView({ behavior: "smooth" })}>
            Why join us
          </Btn>
        </div>
      </PageHeader>

      {/* WHY JOIN */}
      <section id="why-join" className="section pt-6">
        <div className="wrap">
          <SectionHead center title="Make your mark." />
          <div className="perks mt-14 grid gap-4 md:grid-cols-3">
            {perks.map((p) => {
              const Icon = p.icon;
              return (
                <article key={p.title} className="perk card-flat p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                    <Icon size={24} aria-hidden="true" />
                  </div>
                  <h3 className="t-h3 mt-6 text-[1.25rem]">{p.title}</h3>
                  <p className="t-small mt-3 text-muted">{p.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* OPENINGS */}
      <section id="openings" className="section bg-bg-alt">
        <div className="wrap">
          <SectionHead
            title="Find your role."
            lead="Search opportunities that match your skills and experience."
          />

          {/* search panel */}
          <div className="card mt-10 p-5 sm:p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="job-search" className="label">Search jobs</label>
                <div className="relative">
                  <FiSearch className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-lg text-faint" aria-hidden="true" />
                  <input
                    id="job-search"
                    type="search"
                    className="field field-icon"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Job title, keyword or skill"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="job-exp" className="label">Experience level</label>
                <select id="job-exp" className="field" value={experienceFilter} onChange={(e) => setExperienceFilter(e.target.value)}>
                  <option value="All">All experience</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Experienced">Experienced</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Category">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={categoryFilter === c}
                    onClick={() => setCategoryFilter(c)}
                    className={`t-small rounded-full px-4 py-2 font-medium transition-[background-color,color,transform] duration-200 active:scale-95 ${
                      categoryFilter === c ? "bg-fg text-bg" : "bg-bg-alt text-muted hover:text-fg"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <button type="button" onClick={clearFilters} className="t-small font-medium text-accent hover:underline">
                Clear filters
              </button>
            </div>
          </div>

          <p className="t-small mb-4 mt-8 text-muted" aria-live="polite">
            Showing <span className="font-semibold text-fg">{filteredJobs.length}</span>{" "}
            {filteredJobs.length === 1 ? "opportunity" : "opportunities"}
          </p>

          {/* listings */}
          <div className="card overflow-hidden">
            <div className="t-caption hidden grid-cols-[1.6fr_1fr_0.8fr_0.8fr_auto] gap-4 border-b border-line bg-bg-alt px-7 py-3.5 font-medium text-muted md:grid">
              <span>Position</span>
              <span>Location</span>
              <span>Work mode</span>
              <span>Experience</span>
              <span className="w-[112px]" />
            </div>

            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="job-row grid gap-4 border-b border-line px-5 py-5 transition-colors last:border-b-0 hover:bg-bg-alt/60 sm:px-6 sm:py-6 md:grid-cols-[1.6fr_1fr_0.8fr_0.8fr_auto] md:items-center md:px-7"
              >
                <div>
                  <div className="t-caption mb-2 flex flex-wrap items-center gap-2.5">
                    <span className="flex items-center gap-1.5 font-medium text-[#1f9d55] dark:text-[#30d158]">
                      <span className="live-dot" aria-hidden="true" /> Currently hiring
                    </span>
                    <span className="rounded-full bg-accent-soft px-2.5 py-0.5 font-medium text-accent">
                      {job.experienceLevel}
                    </span>
                  </div>
                  <h3 className="t-h3 text-[1.25rem]">{job.title}</h3>
                  <p className="t-caption mt-1 text-muted">{job.department}</p>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:contents">
                  <p className="t-small flex items-center gap-2 text-muted">
                    <FiMapPin className="shrink-0 text-accent" aria-hidden="true" />
                    <span className="sr-only">Location:</span>
                    {job.location}
                  </p>
                  <p className="t-small flex items-center gap-2 text-muted">
                    <FiBriefcase className="shrink-0 text-accent" aria-hidden="true" />
                    <span className="sr-only">Work mode:</span>
                    {job.type}
                  </p>
                  <p className="t-small flex items-center gap-2 text-muted">
                    <FiClock className="shrink-0 text-accent" aria-hidden="true" />
                    <span className="sr-only">Experience:</span>
                    {job.experience}
                  </p>
                </div>

                <Btn small onClick={() => setSelectedJob(job)} className="w-full sm:w-auto md:w-[112px]">
                  Apply now
                </Btn>
              </div>
            ))}

            {filteredJobs.length === 0 && (
              <div className="px-6 py-16 text-center">
                <FiSearch className="mx-auto text-4xl text-faint" aria-hidden="true" />
                <h3 className="t-h3 mt-4">No jobs found</h3>
                <p className="t-small mt-2 text-muted">Try a different search or experience level.</p>
                <Btn variant="secondary" small className="mt-6" onClick={clearFilters}>
                  Reset search
                </Btn>
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedJob && <ApplySheet key={selectedJob.id} job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
};

export default Career;
