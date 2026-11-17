// =====================================================================
// SERVICES STORE (frontend-only for now)
// Starts from the content in servicesData.js. Edits made in the admin are
// kept in this browser's localStorage. Fields the admin does not edit (FAQs,
// CTAs, tools, "why" points) are kept as they are when a service is edited,
// and empty for new services.
// =====================================================================
import { useSyncExternalStore } from "react";
import { servicesData } from "./servicesData";
import { slugify } from "./blogStore";

const STORAGE_KEY = "tephron-services-v1";
const CHANGE_EVENT = "tephron-services-change";

let cache = null;

// Every field the detail page reads gets a value, so no record can break it
const normalize = (s) => ({
  ...s,
  capabilities: s.capabilities || [],
  faqs: s.faqs || [],
  cta: s.cta || [],
  tools: s.tools || [],
  why: s.why || [],
  toolsTitle: s.toolsTitle || "",
  whyTitle: s.whyTitle || "",
  capTitle: s.capTitle || "Core capabilities",
  published: s.published !== false,
  updatedAt: s.updatedAt || null,
});

const seed = () => servicesData.map((s) => normalize({ ...s, published: true }));

const readStorage = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map(normalize);
    }
  } catch {
    /* unreadable data: fall back to the original content */
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

const cleanList = (rows) =>
  (rows || [])
    .map(({ t, d }) => [String(t || "").trim(), String(d || "").trim()])
    .filter(([t, d]) => t || d);

// Only the fields the admin edits. Everything else is kept from the old record.
const editable = (input) => ({
  title: input.title.trim(),
  description: input.description.trim(),
  request: input.request,
  eyebrow: input.eyebrow.trim(),
  heading: [input.headingLine1.trim(), input.headingLine2.trim()],
  lead: input.lead.trim(),
  capTitle: input.capTitle.trim() || "Core capabilities",
  capabilities: cleanList(input.capabilities),
  published: Boolean(input.published),
});

export const getServices = () => load();

export const getServiceBySlug = (slug) => load().find((s) => s.slug === slug);

const assertSlugFree = (list, slug, exceptSlug) => {
  if (list.some((s) => s.slug === slug && s.slug !== exceptSlug)) {
    throw new Error("Another service already uses this URL. Change the name slightly.");
  }
};

export const createService = (input) => {
  const list = load();
  const data = editable(input);
  const slug = slugify(data.title);
  assertSlugFree(list, slug);
  const now = new Date().toISOString();
  const service = normalize({ slug, ...data, faqs: [], cta: [], tools: [], why: [], toolsTitle: "", whyTitle: "", updatedAt: now });
  save([...list, service]);
  return service;
};

export const updateService = (originalSlug, input) => {
  const list = load();
  const index = list.findIndex((s) => s.slug === originalSlug);
  if (index === -1) throw new Error("This service no longer exists.");
  const data = editable(input);
  // The page address stays the same when a service is renamed, so existing links keep working
  const slug = originalSlug;
  const service = normalize({ ...list[index], ...data, slug, updatedAt: new Date().toISOString() });
  const next = list.slice();
  next[index] = service;
  save(next);
  return service;
};

export const deleteService = (slug) => save(load().filter((s) => s.slug !== slug));

export const setServicePublished = (slug, published) => {
  const list = load();
  save(list.map((s) => (s.slug === slug ? { ...s, published, updatedAt: new Date().toISOString() } : s)));
};

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

export const useServices = () => useSyncExternalStore(subscribe, getServices, getServices);
