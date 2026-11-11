// Plain JS so both the app and scripts/prerender.mjs can use it.
import { posts } from "./posts.js";

export const SITE_URL = "https://www.tephronglobal.com";
export const SITE_NAME = "Tephron Global";
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const pages = {
  "/": {
    title: "Tephron Global | Premium IT & Non-IT Business Services",
    description:
      "Tephron Global provides IT and non-IT business support: customer support, data operations, recruitment and technology services for companies worldwide.",
    h1: "Powering Businesses. Empowering People.",
    summary:
      "Premium, scalable IT and non-IT, customer support, recruitment and technology operations.",
  },
  "/about": {
    title: "About Tephron Global | Our Story, Values and Founder",
    description:
      "Tephron Global is a business process outsourcing company founded in 2025 and based in Tenkasi, India. Read about our values, mission and founder.",
    h1: "About Tephron Global.",
    summary:
      "We build, deploy and manage dedicated outsourcing teams that help growing brands protect margins and keep customers happy.",
  },
  "/services": {
    title: "Services | Tephron Global",
    description:
      "Customer support, data entry, virtual assistants, eBook conversion, healthcare administration and bookkeeping support from dedicated Tephron Global teams.",
    h1: "Premium IT and Non-IT operations.",
    summary:
      "Customer support, data operations, virtual assistance, eBook conversion, healthcare administration and bookkeeping support.",
  },
  "/careers": {
    title: "Careers | Tephron Global",
    description:
      "See open roles at Tephron Global and apply online. Customer support and operations positions in Tenkasi and Chennai.",
    h1: "Careers at Tephron Global.",
    summary: "Open roles in customer support and operations. Apply online.",
  },
  "/gallery": {
    title: "Gallery | Tephron Global",
    description:
      "Photos of the Tephron Global team and workplace in Tenkasi, India.",
    h1: "Inside Tephron Global.",
    summary: "A look at our workplace and the people who run it.",
  },
  "/blog": {
    title: "Blog | Tephron Global",
    description:
      "Practical guidance on outsourcing, customer support and running business operations well, from the Tephron Global team.",
    h1: "Insights and leadership.",
    summary:
      "Practical guidance on outsourcing, customer support and running business operations well.",
  },
  "/contact": {
    title: "Contact Tephron Global | Talk to Our Team",
    description:
      "Talk to Tephron Global about customer support, data operations or a dedicated team. Send an inquiry, call or message us on WhatsApp.",
    h1: "Let’s build your dedicated team.",
    summary:
      "Tell us what you need and our team will get back to you. Email tephronglobal@gmail.com or call +91 83003 78470.",
  },
  "/privacy": {
    title: "Privacy Policy | Tephron Global",
    description:
      "How Tephron Global collects, uses and protects personal information, and the rights you have over your data.",
    h1: "Privacy Policy",
    summary: "How we collect, use and protect your personal information.",
  },
  "/terms": {
    title: "Terms of Service | Tephron Global",
    description: "The terms that apply when you use the Tephron Global website.",
    h1: "Terms of Service",
    summary: "The terms that apply when you use this website.",
  },
};

// one entry per blog article
for (const p of posts) {
  pages[`/blog/${p.slug}`] = {
    title: `${p.title} | Tephron Global`,
    description: p.summary,
    h1: p.title,
    summary: p.summary,
  };
}

export const notFound = {
  title: "Page not found | Tephron Global",
  description: "This page could not be found.",
};
