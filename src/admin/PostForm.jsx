import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowUp, FiArrowDown, FiTrash2, FiPlus, FiArrowLeft, FiUpload, FiX } from "react-icons/fi";
import { blogPhotoFor } from "../lib/blogPhotos";
import { fileToCoverDataUrl } from "../lib/imageResize";
import { useMotion } from "../lib/motion";
import {
  createPost,
  updatePost,
  getPostBySlug,
  getPosts,
  slugify,
  readTimeFor,
} from "../lib/blogStore";
import {
  PageHeader,
  Group,
  SectionHead,
  FieldError,
  Label,
  Switch,
  btnClass,
  inputClass,
  revealSections,
} from "./adminUi";

const BLOCK_TYPES = [
  { value: "p", label: "Paragraph" },
  { value: "h2", label: "Heading" },
  { value: "ul", label: "Bullet list" },
];

let rowCounter = 0;
const newRow = (t = "p", text = "") => ({ id: ++rowCounter, t, text });

const monthYear = () => new Date().toLocaleString("en-US", { month: "long", year: "numeric" });

// Stored article blocks <-> editable rows (a bullet list is one item per line)
const toRows = (blocks) =>
  blocks.map((b) => newRow(b.t, b.t === "ul" ? b.items.join("\n") : b.text));

const toBlocks = (rows) =>
  rows
    .map((r) =>
      r.t === "ul"
        ? { t: "ul", items: r.text.split("\n").map((s) => s.trim()).filter(Boolean) }
        : { t: r.t, text: r.text.trim() }
    )
    .filter((b) => (b.t === "ul" ? b.items.length > 0 : b.text.length > 0));

const countWords = (blocks) =>
  blocks
    .map((b) => (b.t === "ul" ? b.items.join(" ") : b.text))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

const validate = (form, blocks) => {
  const errs = {};
  const title = form.title.trim();
  const slug = form.slug.trim();
  const summary = form.summary.trim();

  if (!title) errs.title = "Enter a title.";
  else if (title.length > 160) errs.title = "Keep the title under 160 characters.";

  if (!slug) errs.slug = "Enter a URL slug.";
  else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug))
    errs.slug = "Use lowercase letters, numbers and hyphens only, for example my-article.";

  if (!summary) errs.summary = "Write a short summary.";
  else if (summary.length < 40) errs.summary = "Add a little more detail (at least 40 characters).";
  else if (summary.length > 300) errs.summary = "Keep the summary under 300 characters.";

  if (!form.tag.trim()) errs.tag = "Add a category, for example Customer experience.";
  if (!form.date.trim()) errs.date = "Enter a date, for example November 2026.";
  if (blocks.length === 0) errs.body = "Add at least one paragraph, heading or list.";
  return errs;
};

const MissingPost = () => (
  <div>
    <PageHeader title="Post not found" text="This article doesn’t exist. It may have been deleted." />
    <Link to="/admin/blog" className={btnClass("secondary")}>
      <FiArrowLeft aria-hidden="true" size={15} /> Back to posts
    </Link>
  </div>
);

const BlockRow = ({ row, index, total, onChange, onRemove, onMove }) => {
  const label = `Block ${index + 1}`;
  return (
    <li className="rounded-2xl bg-bg-alt p-4">
      <div className="flex items-center justify-between gap-3">
        <select
          aria-label={`${label} type`}
          className={`${inputClass} w-44 py-2 text-[0.875rem]`}
          value={row.t}
          onChange={(e) => onChange({ t: e.target.value })}
        >
          {BLOCK_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            aria-label={`Move ${label} up`}
            className={btnClass("icon")}
          >
            <FiArrowUp aria-hidden="true" size={15} />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            aria-label={`Move ${label} down`}
            className={btnClass("icon")}
          >
            <FiArrowDown aria-hidden="true" size={15} />
          </button>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${label}`}
            className={btnClass("iconDanger")}
          >
            <FiTrash2 aria-hidden="true" size={15} />
          </button>
        </div>
      </div>

      {row.t === "h2" ? (
        <input
          aria-label={`${label} heading`}
          className={`${inputClass} mt-3`}
          value={row.text}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Section heading"
        />
      ) : (
        <textarea
          aria-label={`${label} text`}
          className={`${inputClass} mt-3 resize-y`}
          rows={row.t === "ul" ? 4 : 5}
          value={row.text}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder={row.t === "ul" ? "One item per line" : "Write a paragraph…"}
        />
      )}
    </li>
  );
};

const Editor = ({ existing }) => {
  const navigate = useNavigate();
  const isEdit = Boolean(existing);
  const tagOptions = [...new Set(getPosts().map((p) => p.tag).filter(Boolean))];

  const [form, setForm] = useState(() => ({
    title: existing?.title ?? "",
    slug: existing?.slug ?? "",
    summary: existing?.summary ?? "",
    tag: existing?.tag ?? "",
    date: existing?.date ?? monthYear(),
    published: existing ? existing.published : false,
    coverImage: existing?.coverImage ?? null,
  }));
  const [rows, setRows] = useState(() =>
    existing ? toRows(existing.blocks) : [newRow("p")]
  );
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState("");
  const [coverError, setCoverError] = useState("");
  const scopeRef = useRef(null);

  useMotion(() => revealSections(scopeRef.current), scopeRef, []);

  const setField = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  };

  const onTitleChange = (value) => {
    setForm((f) => ({ ...f, title: value, slug: slugTouched ? f.slug : slugify(value) }));
    if (errors.title) setErrors((e) => ({ ...e, title: "" }));
  };

  const onSlugChange = (value) => {
    setSlugTouched(true);
    setField("slug", value);
  };

  const updateRow = (id, patch) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const removeRow = (id) => setRows((rs) => rs.filter((r) => r.id !== id));
  const moveRow = (index, dir) =>
    setRows((rs) => {
      const j = index + dir;
      if (j < 0 || j >= rs.length) return rs;
      const next = rs.slice();
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
  const addRow = (t) => setRows((rs) => [...rs, newRow(t)]);

  const handleCoverFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow picking the same file again later
    if (!file) return;
    setCoverError("");
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      setCoverError("Choose a JPG, PNG or WebP image.");
    } else if (file.size > 10 * 1024 * 1024) {
      setCoverError("That image is over 10 MB. Choose a smaller one.");
    } else {
      try {
        const dataUrl = await fileToCoverDataUrl(file);
        setForm((f) => ({ ...f, coverImage: dataUrl }));
      } catch (err) {
        setCoverError(err.message);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const blocks = toBlocks(rows);
    const errs = validate(form, blocks);
    setErrors(errs);
    setSaveError("");
    if (Object.keys(errs).length > 0) {
      const first = Object.keys(errs)[0];
      document.getElementById(`pf-${first}`)?.focus();
      return;
    }

    const input = {
      title: form.title,
      slug: form.slug,
      summary: form.summary,
      tag: form.tag,
      date: form.date,
      published: form.published,
      blocks,
      coverImage: form.coverImage,
    };

    try {
      if (isEdit) updatePost(existing.slug, input);
      else createPost(input);
      const verb = isEdit ? "updated" : form.published ? "published" : "saved as a draft";
      navigate("/admin/blog", { state: { flash: `“${input.title.trim()}” ${verb}.` } });
    } catch (err) {
      setSaveError(err.message);
    }
  };

  const blocks = toBlocks(rows);

  // Uploaded photo first, then the project's own photo for original articles
  const coverPreview = form.coverImage || (existing ? blogPhotoFor(existing.slug) : null);

  // The button names exactly what happens when it is pressed
  const submitLabel = isEdit ? "Save changes" : form.published ? "Publish post" : "Save draft";

  return (
    <div ref={scopeRef}>
      <Link to="/admin/blog" className="inline-flex items-center gap-1.5 text-[0.875rem] text-accent hover:underline">
        <FiArrowLeft aria-hidden="true" size={15} /> All posts
      </Link>
      <div className="mt-5">
        <PageHeader
          title={isEdit ? "Edit post" : "New post"}
          text="Write the article, then save a draft or publish it."
        />
      </div>

      <form onSubmit={handleSubmit} noValidate className="lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start lg:gap-8">
        <div className="min-w-0 space-y-6">
          <Group data-section className="p-6">
            <SectionHead
              title="Cover photo"
              text="A wide landscape photo works best. JPG, PNG or WebP, up to 10 MB."
            />
            <div className="overflow-hidden rounded-2xl">
              {coverPreview ? (
                <img src={coverPreview} alt="Cover photo preview" className="aspect-[16/8] w-full object-cover" />
              ) : (
                <div className="flex aspect-[16/8] items-center justify-center rounded-2xl bg-bg-alt text-[0.9375rem] text-muted">
                  No photo yet. The default cover will be used.
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <label className={`${btnClass("secondary")} cursor-pointer`}>
                <FiUpload aria-hidden="true" size={15} /> {coverPreview ? "Change photo" : "Upload photo"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleCoverFile}
                  className="sr-only"
                />
              </label>
              {form.coverImage && (
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, coverImage: null }))}
                  className={btnClass("quiet")}
                >
                  <FiX aria-hidden="true" size={15} /> Remove uploaded photo
                </button>
              )}
            </div>
            <FieldError msg={coverError} />
          </Group>

          <Group data-section className="space-y-6 p-6">
            <SectionHead title="Details" text="Shown on the article page and in the blog list." />

            <div>
              <Label htmlFor="pf-title">Title</Label>
              <input
                id="pf-title"
                className={inputClass}
                value={form.title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="How to scale offshore customer support"
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "pf-title-err" : undefined}
              />
              <FieldError id="pf-title-err" msg={errors.title} />
            </div>

            <div>
              <Label htmlFor="pf-slug">URL slug</Label>
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-[0.9375rem] text-faint">/blog/</span>
                <input
                  id="pf-slug"
                  className={inputClass}
                  value={form.slug}
                  onChange={(e) => onSlugChange(e.target.value)}
                  placeholder="how-to-scale-support"
                  aria-invalid={!!errors.slug}
                  aria-describedby={errors.slug ? "pf-slug-err" : undefined}
                />
              </div>
              <FieldError id="pf-slug-err" msg={errors.slug} />
            </div>

            <div>
              <Label htmlFor="pf-summary">Summary</Label>
              <textarea
                id="pf-summary"
                className={`${inputClass} resize-none`}
                rows={3}
                value={form.summary}
                onChange={(e) => setField("summary", e.target.value)}
                placeholder="A short description shown on the blog list and in search results."
                aria-invalid={!!errors.summary}
                aria-describedby={errors.summary ? "pf-summary-err" : undefined}
              />
              <div className="mt-1.5 flex items-start justify-between gap-3">
                <FieldError id="pf-summary-err" msg={errors.summary} />
                <span className="shrink-0 text-[0.8125rem] text-faint">{form.summary.length}/300</span>
              </div>
            </div>
          </Group>

          <Group data-section className="p-6">
            <SectionHead title="Article body" text="Blocks appear on the page in the order shown." />

            {rows.length === 0 ? (
              <p className="text-[0.9375rem] text-muted">No blocks yet. Add one below.</p>
            ) : (
              <ol className="space-y-3">
                {rows.map((row, index) => (
                  <BlockRow
                    key={row.id}
                    row={row}
                    index={index}
                    total={rows.length}
                    onChange={(patch) => updateRow(row.id, patch)}
                    onRemove={() => removeRow(row.id)}
                    onMove={(dir) => moveRow(index, dir)}
                  />
                ))}
              </ol>
            )}
            <FieldError id="pf-body-err" msg={errors.body} />

            <div className="mt-5 flex flex-wrap gap-2">
              {BLOCK_TYPES.map((t) => (
                <button key={t.value} type="button" onClick={() => addRow(t.value)} className={btnClass("secondary")}>
                  <FiPlus aria-hidden="true" size={15} /> {t.label}
                </button>
              ))}
            </div>
          </Group>
        </div>

        <aside className="mt-6 self-start lg:sticky lg:top-24 lg:mt-0">
          <Group data-section className="space-y-6 p-6">
            <h2 className="text-[1.0625rem] font-semibold tracking-[-0.01em]">Publishing</h2>

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.9375rem] font-medium">Show on the website</p>
                <p className="mt-1 text-[0.8125rem] text-muted">
                  {form.published ? "Visible to everyone on the blog." : "Only you can see a draft."}
                </p>
              </div>
              <Switch
                label="Show on the website"
                checked={form.published}
                onChange={(v) => setField("published", v)}
              />
            </div>

            <div>
              <Label htmlFor="pf-tag">Category</Label>
              <input
                id="pf-tag"
                className={inputClass}
                list="pf-tag-options"
                value={form.tag}
                onChange={(e) => setField("tag", e.target.value)}
                placeholder="Customer experience"
                aria-invalid={!!errors.tag}
                aria-describedby={errors.tag ? "pf-tag-err" : undefined}
              />
              <datalist id="pf-tag-options">
                {tagOptions.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
              <FieldError id="pf-tag-err" msg={errors.tag} />
            </div>

            <div>
              <Label htmlFor="pf-date">Date shown</Label>
              <input
                id="pf-date"
                className={inputClass}
                value={form.date}
                onChange={(e) => setField("date", e.target.value)}
                placeholder="November 2026"
                aria-invalid={!!errors.date}
                aria-describedby={errors.date ? "pf-date-err" : undefined}
              />
              <FieldError id="pf-date-err" msg={errors.date} />
            </div>

            <dl className="grid grid-cols-2 gap-4 border-t border-line pt-5 text-[0.875rem]">
              <div>
                <dt className="text-muted">Reading time</dt>
                <dd className="mt-0.5 font-medium">{readTimeFor(blocks)}</dd>
              </div>
              <div>
                <dt className="text-muted">Words</dt>
                <dd className="mt-0.5 font-medium tabular-nums">{countWords(blocks)}</dd>
              </div>
            </dl>

            {saveError && <p role="alert" className="text-[0.875rem] text-accent">{saveError}</p>}

            <div className="flex flex-col gap-2">
              <button type="submit" className={btnClass("primary", "h-10 w-full")}>
                {submitLabel}
              </button>
              <Link to="/admin/blog" className={btnClass("secondary", "h-10 w-full")}>
                Cancel
              </Link>
            </div>
          </Group>
        </aside>
      </form>
    </div>
  );
};

// Route wrapper: a key per slug so switching between posts resets the form
const PostForm = ({ slug }) => {
  const existing = slug ? getPostBySlug(slug) : null;
  if (slug && !existing) return <MissingPost />;
  return <Editor key={slug || "new"} existing={existing} />;
};

export default PostForm;
