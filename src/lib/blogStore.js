// =====================================================================
// BLOG STORE (frontend-only for now)
// Articles are kept in this browser's localStorage. The first visit seeds
// the list from src/lib/posts.js. Admin pages write here, and the public
// blog reads from here, so a change shows up on the site straight away.
//
// When a backend exists, replace the functions below with API calls and
// keep the same names, so the admin and public pages need no changes.
// =====================================================================
import { useSyncExternalStore } from "react";
import { posts as seedPosts } from "./posts";

const STORAGE_KEY = "tephron-blog-v1";
const CHANGE_EVENT = "tephron-blog-change";

let cache = null;

const seed = () =>
  seedPosts.map((p) => ({ ...p, published: true, createdAt: null, updatedAt: null }));

const readStorage = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    /* unreadable data: fall back to the original articles */
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

export const slugify = (text) =>
  String(text)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

// About 200 words a minute, never less than 1 minute
export const readTimeFor = (blocks) => {
  const words = blocks
    .map((b) => (b.t === "ul" ? b.items.join(" ") : b.text))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
};

export const getPosts = () => load();

export const getPostBySlug = (slug) => load().find((p) => p.slug === slug);

const cleanInput = (input) => ({
  title: input.title.trim(),
  slug: input.slug.trim(),
  summary: input.summary.trim(),
  tag: input.tag.trim(),
  date: input.date.trim(),
  published: Boolean(input.published),
  blocks: input.blocks,
  coverImage: input.coverImage || null,
});

const assertSlugFree = (list, slug, exceptSlug) => {
  if (list.some((p) => p.slug === slug && p.slug !== exceptSlug)) {
    throw new Error("Another article already uses this URL slug. Please choose a different one.");
  }
};

// New articles go to the top of the list (newest first)
export const createPost = (input) => {
  const list = load();
  const data = cleanInput(input);
  assertSlugFree(list, data.slug);
  const now = new Date().toISOString();
  const post = { ...data, readTime: readTimeFor(data.blocks), createdAt: now, updatedAt: now };
  save([post, ...list]);
  return post;
};

export const updatePost = (originalSlug, input) => {
  const list = load();
  const index = list.findIndex((p) => p.slug === originalSlug);
  if (index === -1) throw new Error("This article no longer exists.");
  const data = cleanInput(input);
  assertSlugFree(list, data.slug, originalSlug);
  const post = {
    ...list[index],
    ...data,
    readTime: readTimeFor(data.blocks),
    updatedAt: new Date().toISOString(),
  };
  const next = list.slice();
  next[index] = post;
  save(next);
  return post;
};

export const deletePost = (slug) => save(load().filter((p) => p.slug !== slug));

export const resetPosts = () => save(seed());

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

// Re-renders the component whenever an article is created, edited or deleted
export const usePosts = () => useSyncExternalStore(subscribe, getPosts, getPosts);
