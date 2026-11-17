import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2, FiEye, FiPlus } from "react-icons/fi";
import { usePosts, deletePost } from "../lib/blogStore";
import { gsap, smooth, prefersReducedMotion, useMotion } from "../lib/motion";
import {
  PageHeader,
  Group,
  StatusDot,
  SearchField,
  Segmented,
  EmptyState,
  Toast,
  btnClass,
  revealSections,
} from "./adminUi";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
];

const BlogList = () => {
  const posts = usePosts();
  const { state, pathname } = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  // Keep the save message for this visit only, then clear it from history
  const [toast, setToast] = useState(() => state?.flash ?? null);
  const listRef = useRef(null);
  const scopeRef = useRef(null);

  useMotion(() => revealSections(scopeRef.current), scopeRef, []);

  useEffect(() => {
    if (state?.flash) navigate(pathname, { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const q = query.trim().toLowerCase();
  const visible = posts.filter((p) => {
    if (filter === "published" && !p.published) return false;
    if (filter === "draft" && p.published) return false;
    if (!q) return true;
    return [p.title, p.tag, p.slug].some((v) => v?.toLowerCase().includes(q));
  });

  // Rows rise in a stagger whenever the list changes
  const listKey = visible.map((p) => p.slug).join("|");
  useLayoutEffect(() => {
    if (prefersReducedMotion() || !listRef.current) return;
    const rows = listRef.current.querySelectorAll("[data-row]");
    if (!rows.length) return;
    gsap.fromTo(
      rows,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.6, ease: smooth, stagger: 0.035, clearProps: "transform" }
    );
  }, [listKey]);

  const handleDelete = (post) => {
    if (window.confirm(`Delete “${post.title}”? This cannot be undone.`)) {
      deletePost(post.slug);
    }
  };

  const clearFilters = () => {
    setQuery("");
    setFilter("all");
  };

  return (
    <div ref={scopeRef}>
      {toast && <Toast key={toast} onClose={() => setToast(null)}>{toast}</Toast>}

      <PageHeader
        title="Blog posts"
        text="Published posts appear on the website. Drafts stay here."
        action={
          <Link to="/admin/blog/new" className={btnClass("primary")}>
            <FiPlus aria-hidden="true" size={15} /> New post
          </Link>
        }
      />

      <div data-reveal className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <SearchField label="Search posts" placeholder="Search posts" value={query} onChange={setQuery} />
        <Segmented label="Filter posts" options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      <Group data-section>
        {posts.length === 0 ? (
          <EmptyState
            title="No articles yet"
            text="Create your first article to start the blog."
            action={
              <Link to="/admin/blog/new" className={btnClass("primary")}>
                New post
              </Link>
            }
          />
        ) : visible.length === 0 ? (
          <EmptyState
            title="No posts match"
            text="Try a different search, or show all posts."
            action={
              <button type="button" onClick={clearFilters} className={btnClass("secondary")}>
                Show all posts
              </button>
            }
          />
        ) : (
          <ul ref={listRef} className="divide-y divide-line">
            {visible.map((p) => (
              <li
                key={p.slug}
                data-row
                className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-bg-alt/50"
              >
                <div className="min-w-0">
                  <p className="truncate text-[1rem] font-medium">{p.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <StatusDot published={p.published} />
                    <span className="text-[0.8125rem] text-muted">{p.tag}</span>
                    <span className="hidden text-[0.8125rem] text-faint sm:inline">{p.date}</span>
                    <span className="hidden text-[0.8125rem] text-faint md:inline">{p.readTime}</span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {p.published && (
                    <a
                      href={`/blog/${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View ${p.title} on the website`}
                      title="View on website"
                      className={btnClass("outline")}
                    >
                      <FiEye aria-hidden="true" size={15} /> View
                    </a>
                  )}
                  <Link to={`/admin/blog/${p.slug}/edit`} className={btnClass("edit")}>
                    <FiEdit2 aria-hidden="true" size={14} /> Edit
                  </Link>
                  <button type="button" onClick={() => handleDelete(p)} aria-label={`Delete ${p.title}`} className={btnClass("delete")}>
                    <FiTrash2 aria-hidden="true" size={15} /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Group>

      {posts.length > 0 && (
        <p className="mt-3 px-1 text-[0.8125rem] text-faint">
          Showing {visible.length} of {posts.length} {posts.length === 1 ? "post" : "posts"}
        </p>
      )}
    </div>
  );
};

export default BlogList;
