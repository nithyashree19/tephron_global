import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { createJob, updateJob, getJobById } from "../lib/jobsStore";
import { slugify } from "../lib/blogStore";
import { useMotion } from "../lib/motion";
import { PageHeader, Group, SectionHead, FieldError, Label, Switch, btnClass, inputClass, revealSections } from "./adminUi";

const WORK_MODES = ["Remote", "On-site", "Hybrid"];
const LEVELS = [
  { value: "Fresher", label: "Fresher" },
  { value: "Experienced", label: "Experienced" },
];

const toLines = (list) => (list || []).join("\n");
const fromLines = (text) => text.split("\n").map((s) => s.trim()).filter(Boolean);

const validate = (f) => {
  const e = {};
  if (!f.title.trim()) e.title = "Enter the job title.";
  if (!f.department.trim()) e.department = "Enter a department, for example Call Support.";
  if (!f.location.trim()) e.location = "Enter the location.";
  if (!f.experience.trim()) e.experience = "Enter the experience, for example 0–1 Year.";
  if (!f.description.trim()) e.description = "Describe the role in a few sentences.";
  else if (f.description.trim().length < 40) e.description = "Add a little more detail (at least 40 characters).";
  return e;
};

const Editor = ({ existing }) => {
  const navigate = useNavigate();
  const isEdit = Boolean(existing);
  const scopeRef = useRef(null);
  useMotion(() => revealSections(scopeRef.current), scopeRef, []);

  const [form, setForm] = useState(() => ({
    title: existing?.title ?? "",
    department: existing?.department ?? "",
    location: existing?.location ?? "",
    type: existing?.type ?? "On-site",
    experience: existing?.experience ?? "",
    experienceLevel: existing?.experienceLevel ?? "Fresher",
    description: existing?.description ?? "",
    skills: (existing?.skills ?? []).join(", "),
    responsibilities: toLines(existing?.responsibilities),
    requirements: toLines(existing?.requirements),
    open: existing ? existing.open : true,
  }));
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState("");

  const set = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    setSaveError("");
    if (Object.keys(errs).length) {
      document.getElementById(`jf-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    const input = {
      title: form.title,
      department: form.department,
      location: form.location,
      type: form.type,
      experience: form.experience,
      experienceLevel: form.experienceLevel,
      description: form.description,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      responsibilities: fromLines(form.responsibilities),
      requirements: fromLines(form.requirements),
      open: form.open,
    };
    try {
      if (isEdit) updateJob(existing.id, input);
      else createJob(input);
      navigate("/admin/jobs", {
        state: { flash: `“${input.title.trim()}” ${isEdit ? "updated" : form.open ? "published" : "saved"}.` },
      });
    } catch (err) {
      setSaveError(err.message);
    }
  };

  const idPreview = slugify(form.title);
  const submitLabel = isEdit ? "Save changes" : form.open ? "Publish opening" : "Save opening";

  return (
    <div ref={scopeRef}>
      <Link to="/admin/jobs" className="inline-flex items-center gap-1.5 text-[0.875rem] text-accent hover:underline">
        <FiArrowLeft aria-hidden="true" size={15} /> All openings
      </Link>
      <div className="mt-5">
        <PageHeader
          title={isEdit ? "Edit opening" : "New opening"}
          text="Fill in the role. Open roles appear on the careers page straight away."
        />
      </div>

      <form onSubmit={handleSubmit} noValidate className="lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start lg:gap-8">
        <div className="min-w-0 space-y-6">
          <Group data-section className="space-y-6 p-6">
            <SectionHead title="The role" text="What candidates see at the top of the listing." />
            <div>
              <Label htmlFor="jf-title">Job title</Label>
              <input id="jf-title" className={inputClass} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Customer Support Executive" aria-invalid={!!errors.title} aria-describedby={errors.title ? "jf-title-err" : undefined} />
              <FieldError id="jf-title-err" msg={errors.title} />
              {form.title && <p className="mt-1.5 text-[0.8125rem] text-faint">Link: /careers#{idPreview}</p>}
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="jf-department">Department</Label>
                <input id="jf-department" className={inputClass} value={form.department} onChange={(e) => set("department", e.target.value)} placeholder="Call Support" aria-invalid={!!errors.department} aria-describedby={errors.department ? "jf-department-err" : undefined} />
                <FieldError id="jf-department-err" msg={errors.department} />
              </div>
              <div>
                <Label htmlFor="jf-location">Location</Label>
                <input id="jf-location" className={inputClass} value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Chennai" aria-invalid={!!errors.location} aria-describedby={errors.location ? "jf-location-err" : undefined} />
                <FieldError id="jf-location-err" msg={errors.location} />
              </div>
            </div>
            <div>
              <Label htmlFor="jf-description">About the role</Label>
              <textarea id="jf-description" rows={4} className={`${inputClass} resize-y`} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="A short overview of what the person will do and who we are looking for." aria-invalid={!!errors.description} aria-describedby={errors.description ? "jf-description-err" : undefined} />
              <FieldError id="jf-description-err" msg={errors.description} />
            </div>
          </Group>

          <Group data-section className="space-y-6 p-6">
            <SectionHead title="Responsibilities" text="One per line. Shown when someone opens View details." />
            <textarea aria-label="Responsibilities" rows={5} className={`${inputClass} resize-y`} value={form.responsibilities} onChange={(e) => set("responsibilities", e.target.value)} placeholder={"Handle inbound customer calls\nResolve issues within the SLA"} />
          </Group>

          <Group data-section className="space-y-6 p-6">
            <SectionHead title="Requirements" text="One per line. What a candidate needs to apply." />
            <textarea aria-label="Requirements" rows={5} className={`${inputClass} resize-y`} value={form.requirements} onChange={(e) => set("requirements", e.target.value)} placeholder={"Good spoken Tamil and English\nComfortable working in shifts"} />
          </Group>
        </div>

        <aside className="mt-6 self-start lg:sticky lg:top-24 lg:mt-0">
          <Group data-section className="space-y-6 p-6">
            <h2 className="text-[1.0625rem] font-semibold tracking-[-0.01em]">Publishing</h2>

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.9375rem] font-medium">Accept applications</p>
                <p className="mt-1 text-[0.8125rem] text-muted">{form.open ? "Shown on the careers page." : "Hidden from the careers page."}</p>
              </div>
              <Switch label="Accept applications" checked={form.open} onChange={(v) => set("open", v)} />
            </div>

            <div>
              <Label htmlFor="jf-type">Work mode</Label>
              <select id="jf-type" className={inputClass} value={form.type} onChange={(e) => set("type", e.target.value)}>
                {WORK_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div>
              <Label htmlFor="jf-level">Experience level</Label>
              <select id="jf-level" className={inputClass} value={form.experienceLevel} onChange={(e) => set("experienceLevel", e.target.value)}>
                {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>

            <div>
              <Label htmlFor="jf-experience">Experience range</Label>
              <input id="jf-experience" className={inputClass} value={form.experience} onChange={(e) => set("experience", e.target.value)} placeholder="0–1 Year" aria-invalid={!!errors.experience} aria-describedby={errors.experience ? "jf-experience-err" : undefined} />
              <FieldError id="jf-experience-err" msg={errors.experience} />
            </div>

            <div>
              <Label htmlFor="jf-skills">Skills</Label>
              <input id="jf-skills" className={inputClass} value={form.skills} onChange={(e) => set("skills", e.target.value)} placeholder="Communication, Tamil, Problem solving" />
              <p className="mt-1.5 text-[0.8125rem] text-faint">Separate with commas.</p>
            </div>

            {saveError && <p role="alert" className="text-[0.875rem] font-medium text-accent">{saveError}</p>}

            <div className="flex flex-col gap-2">
              <button type="submit" className={btnClass("primary", "h-10 w-full")}>{submitLabel}</button>
              <Link to="/admin/jobs" className={btnClass("secondary", "h-10 w-full")}>Cancel</Link>
            </div>
          </Group>
        </aside>
      </form>
    </div>
  );
};

const JobForm = ({ id }) => {
  const existing = id ? getJobById(id) : null;
  if (id && !existing) {
    return (
      <div>
        <PageHeader title="Opening not found" text="This job opening doesn’t exist. It may have been deleted." />
        <Link to="/admin/jobs" className={btnClass("secondary")}>Back to openings</Link>
      </div>
    );
  }
  return <Editor key={id || "new"} existing={existing} />;
};

export default JobForm;
