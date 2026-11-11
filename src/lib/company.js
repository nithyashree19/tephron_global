// =====================================================================
// COMPANY FACTS: the single place to edit what the site says about
// Tephron Global. Anything left empty ("" or []) is simply not shown, so
// the site never displays a blank placeholder or an invented fact.
// =====================================================================

export const company = {
  name: "Tephron Global",
  founded: 2025,

  email: "tephronglobal@gmail.com",
  phone: { display: "+91 83003 78470", tel: "+918300378470", whatsapp: "918300378470" },

  // Operations headquarters (from the live site)
  india: {
    label: "Operations headquarters",
    address:
      "1st West Street, Mangammal Salai, Pothigai Nagar, Tenkasi - 627811, Tamil Nadu, India",
  },

  // TODO(owner): fill these in to show the UK contact block on the Contact
  // page and in the footer. Leave a field empty to hide just that line.
  uk: {
    address: "", // e.g. "Office 1, 10 Example Street, London, AB1 2CD"
    companyNumber: "", // Companies House registration number
    phone: "", // e.g. "+44 20 0000 0000"
    hours: "", // e.g. "Mon to Fri, 9:00 to 17:30 UK time"
  },

  // Only links that are filled in are rendered (no generic homepages).
  social: {
    linkedin: "https://www.linkedin.com/company/tephron-global/",
    instagram: "https://www.instagram.com/tephron_global/",
  },

  founder: {
    name: "Dinesh G",
    title: "Founder and Chief Executive",
    linkedin: "", // TODO(owner): Dinesh G's personal LinkedIn profile URL
  },

};

// Headline figures. Keep these true and consistent with `founded` above.
// TODO(owner): confirm the two "50+" figures before launch.
export const stats = [
  { id: "clients", n: 50, suffix: "+", label: "Corporate clients" },
  { id: "agents", n: 50, suffix: "+", label: "Active agents" },
  { id: "coverage", n: 24, suffix: "/7", label: "Support coverage" },
  { id: "founded", text: String(company.founded), label: "Year founded" },
];

export const hasUk = Object.values(company.uk).some(Boolean);
