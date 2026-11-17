import { useRef } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiArrowRight, FiFileText, FiBriefcase, FiImage } from "react-icons/fi";
import { usePosts } from "../lib/blogStore";
import { useJobs } from "../lib/jobsStore";
import { useGallery } from "../lib/galleryStore";
import { gsap, smooth, useMotion } from "../lib/motion";
import { btnClass, StatusDot } from "./adminUi";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// The month a post belongs to: its creation time, otherwise the month in its date field
const monthOf = (post) => {
  if (post.createdAt) {
    const d = new Date(post.createdAt);
    if (!Number.isNaN(d.getTime())) return { year: d.getFullYear(), month: d.getMonth() };
  }
  const match = /([A-Za-z]+)\s+(\d{4})/.exec(post.date || "");
  if (!match) return null;
  const month = MONTHS.findIndex((m) => m.toLowerCase() === match[1].toLowerCase());
  return month < 0 ? null : { year: Number(match[2]), month };
};

const lastSixMonths = (posts) => {
  const now = new Date();
  const buckets = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { label: MONTHS[d.getMonth()].slice(0, 3), year: d.getFullYear(), month: d.getMonth(), count: 0 };
  });
  posts.forEach((p) => {
    const m = monthOf(p);
    if (!m) return;
    const bucket = buckets.find((b) => b.year === m.year && b.month === m.month);
    if (bucket) bucket.count += 1;
  });
  return buckets;
};

// One panel per sidebar section, so the dashboard mirrors the navigation
const Panel = ({ icon: Icon, title, text, to, cta, className = "", children }) => (
  <section data-enter className={`flex flex-col rounded-2xl glass border border-line p-6 ${className}`}>
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <Icon aria-hidden="true" size={19} />
        </span>
        <div>
          <h2 className="text-[1.0625rem] font-semibold tracking-[-0.01em]">{title}</h2>
          <p className="mt-0.5 text-[0.8125rem] text-muted">{text}</p>
        </div>
      </div>
      <Link to={to} className="hidden shrink-0 items-center gap-1.5 text-[0.875rem] font-medium text-accent hover:underline sm:inline-flex">
        {cta} <FiArrowRight aria-hidden="true" size={14} />
      </Link>
    </div>
    <div className="mt-6 flex-1">{children}</div>
    <Link to={to} className="mt-6 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-accent hover:underline sm:hidden">
      {cta} <FiArrowRight aria-hidden="true" size={14} />
    </Link>
  </section>
);

const Mini = ({ label, value }) => (
  <div>
    <p className="text-[0.8125rem] text-muted">{label}</p>
    <p data-count={value} className="mt-1 text-[1.75rem] font-semibold leading-none tracking-[-0.02em] tabular-nums">
      {value}
    </p>
  </div>
);

const DashboardPage = () => {
  const posts = usePosts();
  const jobs = useJobs();
  const gallery = useGallery();

  const published = posts.filter((p) => p.published).length;
  const drafts = posts.length - published;
  const openJobs = jobs.filter((j) => j.open);
  const closedJobs = jobs.length - openJobs.length;
  const months = lastSixMonths(posts);
  const maxMonth = Math.max(1, ...months.map((m) => m.count));
  const recentPosts = posts.slice(0, 3);

  const scopeRef = useRef(null);

  useMotion(() => {
    gsap.from("[data-enter]", { y: 16, opacity: 0, duration: 0.75, ease: smooth, stagger: 0.09, clearProps: "transform" });

    scopeRef.current?.querySelectorAll("[data-count]").forEach((el) => {
      const end = Number(el.dataset.count) || 0;
      const counter = { v: 0 };
      el.textContent = "0";
      gsap.to(counter, {
        v: end,
        duration: 0.9,
        ease: "power2.out",
        delay: 0.2,
        onUpdate: () => {
          el.textContent = String(Math.round(counter.v));
        },
      });
    });

    const columns = scopeRef.current?.querySelectorAll("[data-column]");
    if (columns && columns.length) {
      gsap.from(columns, {
        scaleY: 0,
        transformOrigin: "50% 100%",
        duration: 0.9,
        ease: smooth,
        stagger: 0.07,
        scrollTrigger: { trigger: columns[0], start: "top 92%", once: true },
      });
    }

    const thumbs = scopeRef.current?.querySelectorAll("[data-thumb]");
    if (thumbs && thumbs.length) {
      gsap.from(thumbs, {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        ease: smooth,
        stagger: 0.05,
        scrollTrigger: { trigger: thumbs[0], start: "top 92%", once: true },
      });
    }

    const rows = scopeRef.current?.querySelectorAll("[data-row]");
    if (rows && rows.length) {
      gsap.from(rows, { x: -10, opacity: 0, duration: 0.5, ease: smooth, stagger: 0.06, delay: 0.3, clearProps: "transform" });
    }
  }, scopeRef, []);

  return (
    <div ref={scopeRef} className="space-y-6">
      {/* Header */}
      <div data-enter>
        <h1 className="text-[1.75rem] font-semibold tracking-[-0.02em]">Dashboard</h1>
      </div>

      {/* Blog posts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel
          icon={FiFileText}
          title="Blog posts"
          text={`${posts.length} articles · ${published} live, ${drafts} in draft`}
          to="/admin/blog"
          cta="Open blog posts"
          className="lg:col-span-2"
        >
          <div className="grid grid-cols-3 gap-4 rounded-xl bg-bg-alt/60 p-4">
            <Mini label="Total" value={posts.length} />
            <Mini label="Published" value={published} />
            <Mini label="Drafts" value={drafts} />
          </div>

          <div className="mt-6">
            <p className="text-[0.8125rem] text-muted">Articles in the last six months</p>
            <div className="mt-4 flex h-36 items-end gap-3">
              {months.map((m) => (
                <div key={`${m.year}-${m.month}`} className="flex h-full flex-1 flex-col justify-end gap-2">
                  <span className="text-center text-[0.75rem] tabular-nums text-muted">{m.count || ""}</span>
                  <div className="relative flex-1">
                    <div
                      data-column
                      className="absolute inset-x-0 bottom-0 rounded-t-md bg-accent"
                      style={{ height: m.count ? `${Math.max(10, (m.count / maxMonth) * 100)}%` : "3px", opacity: m.count ? 1 : 0.18 }}
                    />
                  </div>
                  <span className="text-center text-[0.75rem] text-faint">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 divide-y divide-line border-t border-line">
            {recentPosts.length === 0 ? (
              <p className="pt-4 text-[0.875rem] text-muted">No articles yet. Write the first one to see it here.</p>
            ) : (
              recentPosts.map((p) => (
                <div key={p.slug} data-row className="flex items-center justify-between gap-4 py-3.5">
                  <Link to={`/admin/blog/${p.slug}/edit`} className="min-w-0 truncate text-[0.9375rem] font-medium hover:text-accent">
                    {p.title}
                  </Link>
                  <StatusDot published={p.published} />
                </div>
              ))
            )}
          </div>
        </Panel>

        {/* Job openings */}
        <Panel
          icon={FiBriefcase}
          title="Job openings"
          text={`${openJobs.length} open on the careers page`}
          to="/admin/jobs"
          cta="Open job openings"
        >
          <div className="grid grid-cols-2 gap-4 rounded-xl bg-bg-alt/60 p-4">
            <Mini label="Open" value={openJobs.length} />
            <Mini label="Closed" value={closedJobs} />
          </div>

          <ul className="mt-6 divide-y divide-line border-t border-line">
            {jobs.length === 0 ? (
              <li className="pt-4 text-[0.875rem] text-muted">No openings yet.</li>
            ) : (
              jobs.slice(0, 4).map((j) => (
                <li key={j.id} data-row className="flex items-center justify-between gap-4 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-[0.9375rem] font-medium">{j.title}</p>
                    <p className="mt-0.5 text-[0.8125rem] text-faint">{j.location} · {j.type}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[0.75rem] font-medium ${j.open ? "bg-accent-soft text-accent" : "bg-bg-alt text-muted"}`}>
                    {j.open ? "Open" : "Closed"}
                  </span>
                </li>
              ))
            )}
          </ul>
        </Panel>
      </div>

      {/* Gallery */}
      <Panel
        icon={FiImage}
        title="Gallery"
        text={`${gallery.length} ${gallery.length === 1 ? "photo" : "photos"} on the Gallery page`}
        to="/admin/gallery"
        cta="Open gallery"
      >
        {gallery.length === 0 ? (
          <p className="text-[0.875rem] text-muted">No photos yet. Add one to show it on the Gallery page.</p>
        ) : (
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
            {gallery.slice(0, 8).map((g) => (
              <Link key={g.id} to={`/admin/gallery/${g.id}/edit`} data-thumb title={g.title} className="group relative aspect-square overflow-hidden rounded-xl bg-bg-alt">
                <img src={g.image} alt={g.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </Link>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
};

export default DashboardPage;
