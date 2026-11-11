// Blog photos: save one image per article in src/assets/blog/ named after the
// article slug, e.g. scaling-offshore-support.jpg. Articles without a photo
// keep the brand gradient cover.
const photos = import.meta.glob("../assets/blog/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  query: "?url",
  import: "default",
});

export const blogPhotoFor = (slug) =>
  Object.entries(photos).find(([p]) => p.split("/").pop().replace(/\.[^.]+$/, "") === slug)?.[1];
