// Gallery photos are real files dropped into src/assets/gallery/.
// No stock photos: with an empty folder the Gallery page and its menu
// links simply do not appear.
//
// File name becomes the caption and alt text:
//   "team-training-day.jpg"  ->  "Team training day"
// Add a numeric prefix to control order: "01-office-floor.jpg".
const files = import.meta.glob("../assets/gallery/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  query: "?url",
  import: "default",
});

const toTitle = (path) => {
  const base = path.split("/").pop().replace(/\.[^.]+$/, "");
  const words = base.replace(/^\d+[-_ ]*/, "").replace(/[-_]+/g, " ").trim();
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : "Tephron Global team";
};

// bento layout on medium screens and up
const spans = [
  "col-span-2 md:row-span-2",
  "col-span-2",
  "",
  "",
  "col-span-2",
  "col-span-2",
];

export const galleryImages = Object.keys(files)
  .sort()
  .map((path, i) => ({
    title: toTitle(path),
    image: files[path],
    span: spans[i % spans.length],
  }));

export const hasGallery = galleryImages.length > 0;
