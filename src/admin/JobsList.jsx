import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2, FiPlus, FiMapPin, FiBriefcase, FiClock } from "react-icons/fi";
import { useJobs, updateJob, deleteJob } from "../lib/jobsStore";
import { gsap, smooth, prefersReducedMotion, useMotion } from "../lib/motion";
import { PageHeader, Group, SearchField, Segmented, Switch, EmptyState, btnClass, revealSections } from "./adminUi";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
];

const JobsList = () => {
  const jobs = useJobs();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const listRef = useRef(null);
  const scopeRef = useRef(null);

  useMotion(() => revealSections(scopeRef.current), scopeRef, []);

  const q = query.trim().toLowerCase();
  const visible = jobs.filter((j) => {
    if (filter === "open" && !j.open) return false;
    if (filter === "closed" && j.open) return false;
    if (!q) return true;
    return [j.title, j.department, j.location].some((v) => v?.toLowerCase().includes(q));
  });

  // Rows rise in a stagger whenever the list changes
  const listKey = visible.map((j) => j.id).join("|");
  useLayoutEffect(() => {
    if (prefersReducedMotion() || !listRef.current) return;
    const rows = listRef.current.querySelectorAll("[data-row]");
    if (!rows.length) return;
    gsap.fromTo(rows, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: smooth, stagger: 0.035, clearProps: "transform" });
  }, [listKey]);

  const toggleOpen = (job) => updateJob(job.id, { ...job, open: !job.open });

  const handleDelete = (job) => {
    if (window.confirm(`Delete “${job.title}”? It will disappear from the careers page.`)) {
      deleteJob(job.id);
    }
  };

  return (
    <div ref={scopeRef}>
      <PageHeader
        title="Job openings"
        text="Open roles appear on the careers page. Closed roles are kept here."
        action={
          <Link to="/admin/jobs/new" className={btnClass("primary")}>
            <FiPlus aria-hidden="true" size={15} /> New opening
          </Link>
        }
      />

      <div data-reveal className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <SearchField label="Search openings" placeholder="Search openings" value={query} onChange={setQuery} />
        <Segmented label="Filter openings" options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      <Group data-section>
        {jobs.length === 0 ? (
          <EmptyState
            title="No openings yet"
            text="Add a job opening and it will show on the careers page."
            action={<Link to="/admin/jobs/new" className={btnClass("primary")}>New opening</Link>}
          />
        ) : visible.length === 0 ? (
          <EmptyState title="No openings match" text="Try a different search or show all openings." />
        ) : (
          <ul ref={listRef} className="divide-y divide-line">
            {visible.map((job) => (
              <li key={job.id} data-row className="flex flex-col gap-4 px-5 py-4 transition-colors hover:bg-accent-soft/40 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.75rem] font-medium ${
                        job.open ? "bg-accent-soft text-accent" : "bg-bg-alt text-muted"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${job.open ? "bg-accent" : "bg-faint"}`} />
                      {job.open ? "Open" : "Closed"}
                    </span>
                    <span className="text-[0.8125rem] text-faint">{job.department}</span>
                  </div>
                  <p className="mt-2 truncate text-[1rem] font-medium">{job.title}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.8125rem] text-muted">
                    <span className="inline-flex items-center gap-1.5"><FiMapPin size={13} aria-hidden="true" />{job.location}</span>
                    <span className="inline-flex items-center gap-1.5"><FiBriefcase size={13} aria-hidden="true" />{job.type}</span>
                    <span className="inline-flex items-center gap-1.5"><FiClock size={13} aria-hidden="true" />{job.experience}</span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-3">
                  <Switch label={`Accept applications for ${job.title}`} checked={job.open} onChange={() => toggleOpen(job)} />
                  <Link to={`/admin/jobs/${job.id}/edit`} className={btnClass("edit")}>
                    <FiEdit2 aria-hidden="true" size={14} /> Edit
                  </Link>
                  <button type="button" onClick={() => handleDelete(job)} aria-label={`Delete ${job.title}`} className={btnClass("delete")}>
                    <FiTrash2 aria-hidden="true" size={15} /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Group>

      {jobs.length > 0 && (
        <p className="mt-3 px-1 text-[0.8125rem] text-faint">
          Showing {visible.length} of {jobs.length} {jobs.length === 1 ? "opening" : "openings"}
        </p>
      )}
    </div>
  );
};

export default JobsList;
