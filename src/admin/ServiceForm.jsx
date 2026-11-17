import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiArrowUp, FiArrowDown, FiTrash2, FiPlus } from "react-icons/fi";
import { createService, updateService, getServiceBySlug } from "../lib/servicesStore";
import { serviceOptions } from "../lib/serviceOptions";
import { slugify } from "../lib/blogStore";
import { useMotion } from "../lib/motion";
import { PageHeader, Group, SectionHead, FieldError, Label, Switch, btnClass, inputClass, revealSections } from "./adminUi";

let rowId = 0;
const newCap = (t = "", d = "") => ({ id: ++rowId, t, d });

const validate = (f) => {
  const e = {};
  if (!f.title.trim()) e.title = "Enter the service name.";
  if (!f.description.trim()) e.description = "Add a short description for the Services page card.";
  if (!f.eyebrow.trim()) e.eyebrow = "Add a short label, for example Digital Data Services.";
  if (!f.headingLine1.trim()) e.headingLine1 = "Enter the first line of the heading.";
  if (!f.lead.trim()) e.lead = "Write the paragraph under the heading.";
  if (!f.request) e.request = "Choose the service a visitor requests in the contact form.";
  if (!f.capabilities.some((c) => c.t.trim())) e.capabilities = "Add at least one capability.";
  return e;
};

const Editor = ({ existing }) => {
  const navigate = useNavigate();
  const isEdit = Boolean(existing);
  const scopeRef = useRef(null);
  useMotion(() => revealSections(scopeRef.current), scopeRef, []);

  const [form, setForm] = useState(() => ({
    title: existing?.title ?? "",
    description: existing?.description ?? "",
    request: existing?.request ?? "",
    eyebrow: existing?.eyebrow ?? "",
    headingLine1: existing?.heading?.[0] ?? "",
    headingLine2: existing?.heading?.[1] ?? "",
    lead: existing?.lead ?? "",
    capTitle: existing?.capTitle ?? "Core capabilities",
    capabilities: (existing?.capabilities ?? []).map(([t, d]) => newCap(t, d)),
    published: existing ? existing.published : true,
  }));
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState("");

  const set = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  };

  const updateCap = (id, patch) =>
    setForm((f) => ({ ...f, capabilities: f.capabilities.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
  const removeCap = (id) => setForm((f) => ({ ...f, capabilities: f.capabilities.filter((c) => c.id !== id) }));
  const moveCap = (index, dir) =>
    setForm((f) => {
      const j = index + dir;
      if (j < 0 || j >= f.capabilities.length) return f;
      const next = f.capabilities.slice();
      [next[index], next[j]] = [next[j], next[index]];
      return { ...f, capabilities: next };
    });
  const addCap = () => setForm((f) => ({ ...f, capabilities: [...f.capabilities, newCap()] }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    setSaveError("");
    if (Object.keys(errs).length) {
      document.getElementById(`sf-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    const input = { ...form, capabilities: form.capabilities.map(({ t, d }) => ({ t, d })) };
    try {
      if (isEdit) updateService(existing.slug, input);
      else createService(input);
      navigate("/admin/services", {
        state: { flash: `“${form.title.trim()}” ${isEdit ? "updated" : form.published ? "published" : "saved"}.` },
      });
    } catch (err) {
      setSaveError(err.message);
    }
  };

  const linkPreview = slugify(form.title);
  const submitLabel = isEdit ? "Save changes" : form.published ? "Publish service" : "Save service";

  return (
    <div ref={scopeRef}>
      <Link to="/admin/services" className="inline-flex items-center gap-1.5 text-[0.875rem] text-accent hover:underline">
        <FiArrowLeft aria-hidden="true" size={15} /> All services
      </Link>
      <div className="mt-5">
        <PageHeader
          title={isEdit ? "Edit service" : "New service"}
          text="The name, card, page heading and capabilities. Other sections of the service page are kept as they are."
        />
      </div>

      <form onSubmit={handleSubmit} noValidate className="lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start lg:gap-8">
        <div className="min-w-0 space-y-6">
          <Group data-section className="space-y-6 p-6">
            <SectionHead title="Service" text="Shown on the Services card and at the top of its page." />
            <div>
              <Label htmlFor="sf-title">Service name</Label>
              <input id="sf-title" className={inputClass} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Data Operations & Processing" aria-invalid={!!errors.title} />
              <FieldError id="sf-title-err" msg={errors.title} />
              {isEdit ? (
                <p className="mt-1.5 text-[0.8125rem] text-faint">Page address stays /services/{existing.slug}</p>
              ) : (
                form.title && <p className="mt-1.5 text-[0.8125rem] text-faint">Page address: /services/{linkPreview}</p>
              )}
            </div>
            <div>
              <Label htmlFor="sf-description">Card description</Label>
              <textarea id="sf-description" rows={2} className={`${inputClass} resize-none`} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="High-accuracy database entry, bulk indexing and catalog updates." aria-invalid={!!errors.description} />
              <FieldError id="sf-description-err" msg={errors.description} />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="sf-eyebrow">Label above the heading</Label>
                <input id="sf-eyebrow" className={inputClass} value={form.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} placeholder="Digital Data Services" aria-invalid={!!errors.eyebrow} />
                <FieldError id="sf-eyebrow-err" msg={errors.eyebrow} />
              </div>
              <div>
                <Label htmlFor="sf-request">Requested in contact form</Label>
                <select id="sf-request" className={inputClass} value={form.request} onChange={(e) => set("request", e.target.value)} aria-invalid={!!errors.request}>
                  <option value="">Choose a service</option>
                  {serviceOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                <FieldError id="sf-request-err" msg={errors.request} />
              </div>
            </div>
          </Group>

          <Group data-section className="space-y-6 p-6">
            <SectionHead title="Page heading" text="Two lines. The second line is shown in the accent colour." />
            <div>
              <Label htmlFor="sf-headingLine1">Line 1</Label>
              <input id="sf-headingLine1" className={inputClass} value={form.headingLine1} onChange={(e) => set("headingLine1", e.target.value)} placeholder="Data Operations &" aria-invalid={!!errors.headingLine1} />
              <FieldError id="sf-headingLine1-err" msg={errors.headingLine1} />
            </div>
            <div>
              <Label htmlFor="sf-headingLine2">Line 2</Label>
              <input id="sf-headingLine2" className={inputClass} value={form.headingLine2} onChange={(e) => set("headingLine2", e.target.value)} placeholder="Intelligent Processing" />
            </div>
            <div>
              <Label htmlFor="sf-lead">Paragraph under the heading</Label>
              <textarea id="sf-lead" rows={4} className={`${inputClass} resize-y`} value={form.lead} onChange={(e) => set("lead", e.target.value)} placeholder="Unlock the value of unstructured business data…" aria-invalid={!!errors.lead} />
              <FieldError id="sf-lead-err" msg={errors.lead} />
            </div>
          </Group>

          <Group data-section className="space-y-6 p-6">
            <SectionHead title="Capabilities" text="Each one is a title and a short explanation. Shown in the order listed." />
            <div>
              <Label htmlFor="sf-capTitle">Section title</Label>
              <input id="sf-capTitle" className={inputClass} value={form.capTitle} onChange={(e) => set("capTitle", e.target.value)} placeholder="Core processing capabilities" />
            </div>

            {form.capabilities.length === 0 ? (
              <p className="text-[0.9375rem] text-muted">No capabilities yet. Add one below.</p>
            ) : (
              <ol className="space-y-3">
                {form.capabilities.map((c, index) => (
                  <li key={c.id} className="rounded-2xl bg-bg-alt p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[0.8125rem] font-medium text-muted">Capability {index + 1}</span>
                      <div className="flex items-center gap-0.5">
                        <button type="button" onClick={() => moveCap(index, -1)} disabled={index === 0} aria-label={`Move capability ${index + 1} up`} className={btnClass("icon")}>
                          <FiArrowUp aria-hidden="true" size={15} />
                        </button>
                        <button type="button" onClick={() => moveCap(index, 1)} disabled={index === form.capabilities.length - 1} aria-label={`Move capability ${index + 1} down`} className={btnClass("icon")}>
                          <FiArrowDown aria-hidden="true" size={15} />
                        </button>
                        <button type="button" onClick={() => removeCap(c.id)} aria-label={`Remove capability ${index + 1}`} className={btnClass("iconDanger")}>
                          <FiTrash2 aria-hidden="true" size={15} />
                        </button>
                      </div>
                    </div>
                    <input aria-label={`Capability ${index + 1} title`} className={`${inputClass} mt-3`} value={c.t} onChange={(e) => updateCap(c.id, { t: e.target.value })} placeholder="High-precision data entry" />
                    <textarea aria-label={`Capability ${index + 1} description`} rows={3} className={`${inputClass} mt-3 resize-y`} value={c.d} onChange={(e) => updateCap(c.id, { d: e.target.value })} placeholder="What this covers, in a sentence or two." />
                  </li>
                ))}
              </ol>
            )}
            <FieldError id="sf-capabilities-err" msg={errors.capabilities} />
            <button type="button" onClick={addCap} className={btnClass("secondary")}>
              <FiPlus aria-hidden="true" size={15} /> Add capability
            </button>
          </Group>
        </div>

        <aside className="mt-6 self-start lg:sticky lg:top-24 lg:mt-0">
          <Group data-section className="space-y-6 p-6">
            <h2 className="text-[1.0625rem] font-semibold tracking-[-0.01em]">Publishing</h2>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.9375rem] font-medium">Show on the website</p>
                <p className="mt-1 text-[0.8125rem] text-muted">{form.published ? "Listed on the Services page." : "Hidden from the Services page."}</p>
              </div>
              <Switch label="Show on the website" checked={form.published} onChange={(v) => set("published", v)} />
            </div>
            {saveError && <p role="alert" className="text-[0.875rem] font-medium text-accent">{saveError}</p>}
            <div className="flex flex-col gap-2">
              <button type="submit" className={btnClass("primary", "h-10 w-full")}>{submitLabel}</button>
              <Link to="/admin/services" className={btnClass("secondary", "h-10 w-full")}>Cancel</Link>
            </div>
          </Group>
        </aside>
      </form>
    </div>
  );
};

const ServiceForm = ({ slug }) => {
  const existing = slug ? getServiceBySlug(slug) : null;
  if (slug && !existing) {
    return (
      <div>
        <PageHeader title="Service not found" text="This service doesn’t exist. It may have been deleted." />
        <Link to="/admin/services" className={btnClass("secondary")}>Back to services</Link>
      </div>
    );
  }
  return <Editor key={slug || "new"} existing={existing} />;
};

export default ServiceForm;
