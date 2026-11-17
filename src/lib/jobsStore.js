// =====================================================================
// JOBS STORE (frontend-only for now)
// Job openings live in this browser's localStorage. The first visit seeds
// the two current openings. The admin writes here and the careers page
// reads only the open roles, so changes show up straight away.
// Swap these functions for API calls when a backend exists.
// =====================================================================
import { useSyncExternalStore } from "react";
import { slugify } from "./blogStore";

const STORAGE_KEY = "tephron-jobs-v1";
const CHANGE_EVENT = "tephron-jobs-change";

let cache = null;

const seed = () => [
  {
    id: "tamil-voice-process",
    title: "Tamil Voice Process",
    department: "Call Support",
    location: "Tenkasi",
    type: "Remote",
    experience: "0–1 Year",
    experienceLevel: "Fresher",
    description:
      "We are looking for enthusiastic candidates with excellent Tamil communication skills to support customer interactions and deliver outstanding service experiences.",
    skills: ["Tamil Communication", "Customer Support", "Communication"],
    responsibilities: [],
    requirements: [],
    open: true,
    createdAt: null,
    updatedAt: null,
  },
  {
    id: "senior-customer-support-executive",
    title: "Senior Customer Support Executive",
    department: "Call Support",
    location: "Chennai",
    type: "On-site",
    experience: "2–4 Years",
    experienceLevel: "Experienced",
    description:
      "Looking for experienced customer support professionals with strong communication, problem-solving and customer relationship skills.",
    skills: ["Customer Support", "Communication", "Problem Solving"],
    responsibilities: [],
    requirements: [],
    open: true,
    createdAt: null,
    updatedAt: null,
  },
];

const readStorage = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    /* unreadable data: fall back to the seeded openings */
  }
  return seed();
};

const load = () => {
  if (!cache) cache = readStorage();
  return cache;
};

const save = (next) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    throw new Error("Could not save in this browser. Storage may be full or turned off.");
  }
  cache = next;
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

const cleanList = (list) =>
  (list || [])
    .map((s) => String(s).trim())
    .filter(Boolean);

const cleanInput = (input) => ({
  title: input.title.trim(),
  department: input.department.trim(),
  location: input.location.trim(),
  type: input.type.trim(),
  experience: input.experience.trim(),
  experienceLevel: input.experienceLevel,
  description: input.description.trim(),
  skills: cleanList(input.skills),
  responsibilities: cleanList(input.responsibilities),
  requirements: cleanList(input.requirements),
  open: Boolean(input.open),
});

export const getJobs = () => load();

export const getJobById = (id) => load().find((j) => j.id === id);

const assertIdFree = (list, id, exceptId) => {
  if (list.some((j) => j.id === id && j.id !== exceptId)) {
    throw new Error("Another opening already uses this URL. Change the job title slightly.");
  }
};

// New openings go to the top of the list
export const createJob = (input) => {
  const list = load();
  const data = cleanInput(input);
  const id = slugify(data.title);
  assertIdFree(list, id);
  const now = new Date().toISOString();
  const job = { id, ...data, createdAt: now, updatedAt: now };
  save([job, ...list]);
  return job;
};

export const updateJob = (originalId, input) => {
  const list = load();
  const index = list.findIndex((j) => j.id === originalId);
  if (index === -1) throw new Error("This opening no longer exists.");
  const data = cleanInput(input);
  const id = slugify(data.title);
  assertIdFree(list, id, originalId);
  const job = { ...list[index], ...data, id, updatedAt: new Date().toISOString() };
  const next = list.slice();
  next[index] = job;
  save(next);
  return job;
};

export const deleteJob = (id) => save(load().filter((j) => j.id !== id));

const subscribe = (callback) => {
  const onStorage = (e) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      callback();
    }
  };
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
};

export const useJobs = () => useSyncExternalStore(subscribe, getJobs, getJobs);
