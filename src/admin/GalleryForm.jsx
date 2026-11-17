import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUpload } from "react-icons/fi";
import { addGalleryItem, updateGalleryItem, getGalleryItem } from "../lib/galleryStore";
import { fileToCoverDataUrl } from "../lib/imageResize";
import { useMotion } from "../lib/motion";
import { PageHeader, Group, SectionHead, FieldError, Label, btnClass, inputClass, revealSections } from "./adminUi";

const Editor = ({ existing }) => {
  const navigate = useNavigate();
  const isEdit = Boolean(existing);
  const scopeRef = useRef(null);
  useMotion(() => revealSections(scopeRef.current), scopeRef, []);

  const [title, setTitle] = useState(existing?.title ?? "");
  const [image, setImage] = useState(existing?.image ?? null);
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState("");
  const [saveError, setSaveError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImageError("");
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      setImageError("Choose a JPG, PNG or WebP image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setImageError("That image is over 10 MB. Choose a smaller one.");
      return;
    }
    try {
      setImage(await fileToCoverDataUrl(file, { maxWidth: 1600, maxBytes: 400_000 }));
      setErrors((err) => ({ ...err, image: "" }));
    } catch (err) {
      setImageError(err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!image) errs.image = "Choose a photo for the gallery.";
    if (!title.trim()) errs.title = "Enter a title for the photo.";
    else if (title.trim().length > 80) errs.title = "Keep the title under 80 characters.";
    setErrors(errs);
    setSaveError("");
    if (Object.keys(errs).length) return;

    try {
      const input = { title, image };
      if (isEdit) updateGalleryItem(existing.id, input);
      else addGalleryItem(input);
      navigate("/admin/gallery", {
        state: { flash: `“${title.trim()}” ${isEdit ? "updated" : "added to the gallery"}.` },
      });
    } catch (err) {
      setSaveError(err.message);
    }
  };

  return (
    <div ref={scopeRef}>
      <Link to="/admin/gallery" className="inline-flex items-center gap-1.5 text-[0.875rem] text-accent hover:underline">
        <FiArrowLeft aria-hidden="true" size={15} /> All photos
      </Link>
      <div className="mt-5">
        <PageHeader
          title={isEdit ? "Edit photo" : "Add photo"}
          text="Change the photo or the title. Changes show on the Gallery page straight away."
        />
      </div>

      <form onSubmit={handleSubmit} noValidate className="lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start lg:gap-8">
        <div className="min-w-0 space-y-6">
          <Group data-section className="p-6">
            <SectionHead title="Photo" text="Landscape photos look best. JPG, PNG or WebP, up to 10 MB." />
            <div className="overflow-hidden rounded-2xl bg-bg-alt">
              {image ? (
                <img src={image} alt="Preview" className="aspect-[4/3] w-full object-cover" />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center text-[0.9375rem] text-muted">
                  No photo selected
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <label className={`${btnClass("secondary")} cursor-pointer`}>
                <FiUpload aria-hidden="true" size={15} /> {image ? "Replace photo" : "Choose photo"}
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} className="sr-only" />
              </label>
            </div>
            <FieldError msg={imageError || errors.image} />
          </Group>

          <Group data-section className="p-6">
            <SectionHead title="Title" text="Shown over the photo on the Gallery page." />
            <div>
              <Label htmlFor="gf-title">Photo title</Label>
              <input
                id="gf-title"
                className={inputClass}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Delivery floor, Tenkasi"
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "gf-title-err" : undefined}
              />
              <FieldError id="gf-title-err" msg={errors.title} />
            </div>
          </Group>
        </div>

        <aside className="mt-6 self-start lg:sticky lg:top-24 lg:mt-0">
          <Group data-section className="space-y-5 p-6">
            <h2 className="text-[1.0625rem] font-semibold tracking-[-0.01em]">Save</h2>
            <p className="text-[0.875rem] text-muted">
              {isEdit ? "Your changes replace the current photo and text." : "The photo is added to the end of the gallery."}
            </p>
            {saveError && <p role="alert" className="text-[0.875rem] font-medium text-accent">{saveError}</p>}
            <div className="flex flex-col gap-2">
              <button type="submit" className={btnClass("primary", "h-10 w-full")}>
                {isEdit ? "Save changes" : "Add photo"}
              </button>
              <Link to="/admin/gallery" className={btnClass("secondary", "h-10 w-full")}>Cancel</Link>
            </div>
          </Group>
        </aside>
      </form>
    </div>
  );
};

const GalleryForm = ({ id }) => {
  const existing = id ? getGalleryItem(id) : null;
  if (id && !existing) {
    return (
      <div>
        <PageHeader title="Photo not found" text="This photo doesn’t exist. It may have been deleted." />
        <Link to="/admin/gallery" className={btnClass("secondary")}>Back to gallery</Link>
      </div>
    );
  }
  return <Editor key={id || "new"} existing={existing} />;
};

export default GalleryForm;
