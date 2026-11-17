import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2, FiPlus, FiEye } from "react-icons/fi";
import { useServices, deleteService, setServicePublished } from "../lib/servicesStore";
import { gsap, smooth, prefersReducedMotion, useMotion } from "../lib/motion";
import { PageHeader, Group, SearchField, Switch, EmptyState, btnClass, revealSections } from "./adminUi";

const ServicesList = () => {
  const services = useServices();
  const [query, setQuery] = useState("");
  const listRef = useRef(null);
  const scopeRef = useRef(null);

  useMotion(() => revealSections(scopeRef.current), scopeRef, []);

  const q = query.trim().toLowerCase();
  const visible = services.filter((s) => {
    if (!q) return true;
    return [s.title, s.eyebrow, s.description].some((v) => v?.toLowerCase().includes(q));
  });

  // Rows rise in a stagger whenever the list changes
  const listKey = visible.map((s) => s.slug).join("|");
  useLayoutEffect(() => {
    if (prefersReducedMotion() || !listRef.current) return;
    const rows = listRef.current.querySelectorAll("[data-row]");
    if (rows.length) gsap.fromTo(rows, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: smooth, stagger: 0.035, clearProps: "transform" });
  }, [listKey]);

  const handleDelete = (service) => {
    if (window.confirm(`Delete “${service.title}”? Its page will be removed from the website.`)) {
      deleteService(service.slug);
    }
  };

  return (
    <div ref={scopeRef}>
      <PageHeader
        title="Services"
        text="Services appear on the public Services page. Turn one off to hide it without deleting it."
        action={
          <Link to="/admin/services/new" className={btnClass("primary")}>
            <FiPlus aria-hidden="true" size={15} /> Add service
          </Link>
        }
      />

      <div data-reveal className="mb-5">
        <SearchField label="Search services" placeholder="Search services" value={query} onChange={setQuery} />
      </div>

      <Group data-section>
        {services.length === 0 ? (
          <EmptyState
            title="No services yet"
            text="Add a service and it will appear on the Services page."
            action={<Link to="/admin/services/new" className={btnClass("primary")}>Add service</Link>}
          />
        ) : visible.length === 0 ? (
          <EmptyState title="No services match" text="Try a different search." />
        ) : (
          <ul ref={listRef} className="divide-y divide-line">
            {visible.map((s) => (
              <li key={s.slug} data-row className="flex flex-col gap-4 px-5 py-4 transition-colors hover:bg-accent-soft/40 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[0.8125rem] text-faint">{s.eyebrow}</p>
                  <p className="mt-1 truncate text-[1rem] font-medium">{s.title}</p>
                  <p className="mt-1 line-clamp-1 text-[0.8125rem] text-muted">{s.description}</p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-3">
                  <Switch
                    label={`Show ${s.title} on the website`}
                    checked={s.published}
                    onChange={(v) => setServicePublished(s.slug, v)}
                  />
                  {s.published && (
                    <a
                      href={`/services/${s.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View ${s.title} on the website`}
                      title="View on website"
                      className={btnClass("outline")}
                    >
                      <FiEye aria-hidden="true" size={15} /> View
                    </a>
                  )}
                  <Link to={`/admin/services/${s.slug}/edit`} className={btnClass("edit")}>
                    <FiEdit2 aria-hidden="true" size={14} /> Edit
                  </Link>
                  <button type="button" onClick={() => handleDelete(s)} aria-label={`Delete ${s.title}`} className={btnClass("delete")}>
                    <FiTrash2 aria-hidden="true" size={15} /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Group>

      {services.length > 0 && (
        <p className="mt-3 px-1 text-[0.8125rem] text-faint">
          Showing {visible.length} of {services.length} {services.length === 1 ? "service" : "services"}
        </p>
      )}
    </div>
  );
};

export default ServicesList;
