const photos = import.meta.glob("../assets/services/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  query: "?url",
  import: "default",
});
export const photoFor = (slug) =>
  Object.entries(photos).find(([p]) => p.split("/").pop().startsWith(slug))?.[1];
