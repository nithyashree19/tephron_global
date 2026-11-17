import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useGallery, deleteGalleryItem } from "../lib/galleryStore";
import { gsap, smooth, prefersReducedMotion, useMotion } from "../lib/motion";
import { PageHeader, EmptyState, Toast, btnClass, revealSections } from "./adminUi";

const GalleryList = () => {
  const items = useGallery();
  const { state, pathname } = useLocation();
  const navigate = useNavigate();
  const [toast, setToast] = useState(() => state?.flash ?? null);
  const gridRef = useRef(null);
  const scopeRef = useRef(null);

  useMotion(() => revealSections(scopeRef.current), scopeRef, []);

  // Clear the save message from history so it does not return on refresh
  useEffect(() => {
    if (state?.flash) navigate(pathname, { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Photos fade up in a stagger when the gallery changes
  const key = items.map((g) => g.id).join("|");
  useLayoutEffect(() => {
    if (prefersReducedMotion() || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll("[data-card]");
    if (cards.length) {
      gsap.fromTo(cards, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: smooth, stagger: 0.05, clearProps: "transform" });
    }
  }, [key]);

  const handleDelete = (item) => {
    if (window.confirm(`Delete “${item.title}” from the gallery? This cannot be undone.`)) {
      deleteGalleryItem(item.id);
    }
  };

  return (
    <div ref={scopeRef}>
      {toast && <Toast key={toast} onClose={() => setToast(null)}>{toast}</Toast>}

      <PageHeader
        title="Gallery"
        text="These photos appear on the public Gallery page, in this order."
        action={
          <Link to="/admin/gallery/new" className={btnClass("primary")}>
            <FiPlus aria-hidden="true" size={15} /> Add photo
          </Link>
        }
      />

      {items.length === 0 ? (
        <div className="overflow-hidden rounded-2xl glass border border-line">
          <EmptyState
            title="No photos yet"
            text="Add a photo and it will appear on the Gallery page."
            action={<Link to="/admin/gallery/new" className={btnClass("primary")}>Add photo</Link>}
          />
        </div>
      ) : (
        <div ref={gridRef} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} data-card className="flex flex-col overflow-hidden rounded-2xl glass border border-line">
              <div className="aspect-[4/3] overflow-hidden bg-bg-alt">
                <img src={item.image} alt="" className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="flex flex-1 flex-col gap-1 px-5 pb-4 pt-4">
                <h2 className="truncate text-[0.9375rem] font-semibold">{item.title}</h2>
              </div>
              <div className="flex items-center gap-2 border-t border-line px-4 py-3">
                <Link to={`/admin/gallery/${item.id}/edit`} className={btnClass("outline")}>
                  <FiEdit2 aria-hidden="true" size={14} /> Edit
                </Link>
                <button type="button" onClick={() => handleDelete(item)} className={btnClass("delete")}>
                  <FiTrash2 aria-hidden="true" size={15} /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryList;
