// =====================================================================
// GALLERY STORE (frontend-only for now)
// The gallery starts from the photos in src/assets/gallery. Photos added
// in the admin are kept in this browser's localStorage as resized JPEGs,
// so keep the photo count modest until a backend exists.
// =====================================================================
import { useSyncExternalStore } from "react";
import { galleryImages } from "./gallery";

const STORAGE_KEY = "tephron-gallery-v1";
const CHANGE_EVENT = "tephron-gallery-change";

let cache = null;

const seed = () =>
  galleryImages.map((g, i) => ({
    id: `seed-${i}`,
    title: g.title,
    image: g.image,
    span: g.span,
    createdAt: null,
    updatedAt: null,
  }));

const readStorage = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    /* unreadable data: fall back to the bundled photos */
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
    throw new Error("Could not save in this browser. The photo may be too large or storage may be full.");
  }
  cache = next;
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

const newId = () => `g-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const cleanInput = (input) => ({
  title: input.title.trim(),
  image: input.image,
});

export const getGallery = () => load();

export const getGalleryItem = (id) => load().find((g) => g.id === id);

// New photos go to the end of the gallery
export const addGalleryItem = (input) => {
  const data = cleanInput(input);
  const now = new Date().toISOString();
  const item = { id: newId(), ...data, span: "", createdAt: now, updatedAt: now };
  save([...load(), item]);
  return item;
};

export const updateGalleryItem = (id, input) => {
  const list = load();
  const index = list.findIndex((g) => g.id === id);
  if (index === -1) throw new Error("This photo no longer exists.");
  const data = cleanInput({ ...list[index], ...input });
  const item = { ...list[index], ...data, updatedAt: new Date().toISOString() };
  const next = list.slice();
  next[index] = item;
  save(next);
  return item;
};

export const deleteGalleryItem = (id) => save(load().filter((g) => g.id !== id));

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

export const useGallery = () => useSyncExternalStore(subscribe, getGallery, getGallery);
