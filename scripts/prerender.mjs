// =====================================================================
// POST-BUILD STEP (runs after `vite build`): static HTML for every route.
//
// A single-page app serves the same empty shell for every URL, so Google,
// WhatsApp, LinkedIn and AI crawlers see no page-specific title, description
// or content. This script writes dist/<route>/index.html for each page with:
//   - its own <title>, description, canonical URL, Open Graph + Twitter tags
//   - a short plain-HTML summary inside #root (hidden once JavaScript runs,
//     replaced as soon as React mounts)
// and generates dist/sitemap.xml.
// No dependencies: Node built-ins only.
// =====================================================================
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { pages, SITE_URL, SITE_NAME, OG_IMAGE } from "../src/lib/seo.js";
import { posts } from "../src/lib/posts.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const indexPath = join(dist, "index.html");

if (!existsSync(indexPath)) {
  console.error("prerender: dist/index.html not found. Run `vite build` first.");
  process.exit(1);
}
const template = readFileSync(indexPath, "utf8");

// The Gallery only exists once real photos have been added.
const galleryDir = join(root, "src", "assets", "gallery");
const hasGallery =
  existsSync(galleryDir) &&
  readdirSync(galleryDir).some((f) => /\.(jpe?g|png|webp|avif)$/i.test(f));

const routes = Object.keys(pages).filter((p) => p !== "/gallery" || hasGallery);

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const navLabels = {
  "/": "Home",
  "/about": "About",
  "/services": "Services",
  "/careers": "Careers",
  "/gallery": "Gallery",
  "/blog": "Blog",
  "/contact": "Contact",
  "/privacy": "Privacy Policy",
  "/terms": "Terms of Service",
};

const headTags = (path) => {
  const p = pages[path];
  const url = SITE_URL + path;
  return [
    `<title>${esc(p.title)}</title>`,
    `<meta name="description" content="${esc(p.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta property="og:title" content="${esc(p.title)}" />`,
    `<meta property="og:description" content="${esc(p.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(p.title)}" />`,
    `<meta name="twitter:description" content="${esc(p.description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
  ].join("\n    ");
};

const bodyHtml = (path) => {
  const p = pages[path];
  const links = routes
    .filter((r) => navLabels[r])
    .map((r) => `<li><a href="${r}">${esc(navLabels[r])}</a></li>`)
    .join("");

  // blog articles: include the full text so crawlers can read it
  const post = posts.find((x) => `/blog/${x.slug}` === path);
  const articleHtml = post
    ? post.blocks
        .map((b) =>
          b.t === "h2"
            ? `<h2>${esc(b.text)}</h2>`
            : b.t === "ul"
              ? `<ul>${b.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`
              : `<p>${esc(b.text)}</p>`
        )
        .join("")
    : "";

  // the blog index lists its articles
  const listHtml =
    path === "/blog"
      ? `<ul>${posts.map((x) => `<li><a href="/blog/${x.slug}">${esc(x.title)}</a></li>`).join("")}</ul>`
      : "";

  return (
    `<div id="prerender">` +
    `<nav aria-label="Main"><ul>${links}</ul></nav>` +
    `<main><h1>${esc(p.h1)}</h1><p>${esc(p.summary)}</p>${articleHtml}${listHtml}</main>` +
    `</div>`
  );
};

// remove tags this script owns, so nothing is duplicated
const strip = (html) =>
  html
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+(?:name|property)="(?:description|og:[^"]*|twitter:[^"]*)"[^>]*>/gi, "")
    .replace(/<link\s+rel="canonical"[^>]*>/gi, "");

const render = (path) => {
  let html = strip(template);
  html = html.replace("</head>", `  ${headTags(path)}\n  </head>`);
  if (!html.includes('<div id="root"></div>')) {
    throw new Error('prerender: could not find <div id="root"></div> in dist/index.html');
  }
  return html.replace('<div id="root"></div>', `<div id="root">${bodyHtml(path)}</div>`);
};

for (const path of routes) {
  const html = render(path);
  if (path === "/") {
    writeFileSync(indexPath, html);
  } else {
    const dir = join(dist, path.slice(1));
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), html);
  }
}

const today = new Date().toISOString().slice(0, 10);
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes
    .map(
      (p) =>
        `  <url><loc>${SITE_URL}${p}</loc><lastmod>${today}</lastmod>` +
        `<priority>${p === "/" ? "1.0" : "0.7"}</priority></url>`
    )
    .join("\n") +
  `\n</urlset>\n`;
writeFileSync(join(dist, "sitemap.xml"), sitemap);

console.log(`prerender: wrote ${routes.length} pages + sitemap.xml (${routes.join(", ")})`);
