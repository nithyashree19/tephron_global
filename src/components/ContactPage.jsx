import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiMail, FiPhone, FiMapPin, FiClock, FiBriefcase, FiArrowRight } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";

import { Btn, PageHeader, AnimatedCheck } from "./ui";
import { gsap, clip, wipe, useMotion, prefersReducedMotion } from "../lib/motion";
import { serviceOptions } from "../lib/serviceOptions";
import { company } from "../lib/company";
import { sendForm } from "../lib/submit";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: serviceOptions[0],
  message: "",
  website: "", // honeypot: hidden from people, bots fill it in
};

const details = [
  { icon: FiMapPin, label: company.india.label, value: company.india.address },
  {
    icon: FiPhone,
    label: "Phone and calling support",
    value: company.phone.display,
    href: `tel:${company.phone.tel}`,
  },
  {
    icon: FiMail,
    label: "Official inquiries",
    value: company.email,
    href: `mailto:${company.email}`,
  },
  { icon: FiClock, label: "Coverage window", value: "24/7/365 dedicated client operations" },
];

// UK block: each line appears once it is filled in (src/lib/company.js)
const ukDetails = [
  company.uk.address && { icon: FiMapPin, label: "United Kingdom office", value: company.uk.address },
  company.uk.phone && {
    icon: FiPhone,
    label: "UK phone",
    value: company.uk.phone,
    href: `tel:${company.uk.phone.replace(/[^\d+]/g, "")}`,
  },
  company.uk.hours && { icon: FiClock, label: "UK working hours", value: company.uk.hours },
  company.uk.companyNumber && {
    icon: FiBriefcase,
    label: "Company number",
    value: company.uk.companyNumber,
  },
].filter(Boolean);

const ContactPage = () => {
  const root = useRef(null);
  const { search } = useLocation();
  const asked = new URLSearchParams(search).get("service");
  const requested = serviceOptions.includes(asked) ? asked : null;
  const [form, setForm] = useState({ ...emptyForm, service: requested || emptyForm.service });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  useMotion(() => {
    const cards = gsap.utils.toArray(".contact-in", root.current);
    wipe(cards[0], clip.left, { delay: 0.5, duration: 1.6 });
    wipe(cards[1], clip.right, { delay: 0.65, duration: 1.6 });
    gsap.from(".contact-form > *", {
      x: 36,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out",
      stagger: 0.07,
      delay: 1.1,
      clearProps: "transform,opacity", // leave nothing behind on the controls
    });
  }, root);

  // Arriving from a "Request this service" link: bring the form into view
  useEffect(() => {
    if (!requested) return;
    const t = setTimeout(() => {
      document.getElementById("inquiry-form")?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "center",
      });
    }, 900);
    return () => clearTimeout(t);
  }, [requested]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");
    try {
      await sendForm({ type: "inquiry", ...form });
      setStatus("sent");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  return (
    <div ref={root}>
      <PageHeader
        lines={["Let’s build your", "dedicated team."]}
        lastClass="grad-text"
        lead="Whether you are expanding 24/7 customer support, scaling data pipelines or optimising back-office operations, our solutions directors are ready to consult with you."
      />

      <section className="pb-[clamp(4rem,8vw,8rem)]">
        <div className="wrap grid items-start gap-6 lg:grid-cols-12">
          {/* CONTACT DETAILS */}
          <div className="contact-in card-flat p-6 sm:p-8 md:p-10 lg:col-span-5">
            <h2 className="t-h3">Contact information</h2>
            <p className="t-small mt-2 text-muted">
              Reach out directly or send us an inquiry. We typically reply
              within 2 hours during active business hours.
            </p>

            <dl className="mt-8 space-y-6">
              {[...details, ...ukDetails].map((d) => {
                const Icon = d.icon;
                return (
                  <div key={d.label} className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                      <Icon size={19} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <dt className="t-caption text-muted">{d.label}</dt>
                      <dd className="t-body mt-0.5 break-words font-medium">
                        {d.href ? (
                          <a href={d.href} className="transition-colors hover:text-accent">
                            {d.value}
                          </a>
                        ) : (
                          d.value
                        )}
                      </dd>
                    </div>
                  </div>
                );
              })}
            </dl>

            <a
              href={`https://wa.me/${company.phone.whatsapp}?text=Hello%20Tephron%20Global%2C%20I%20would%20like%20to%20discuss%20a%20project.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn mt-9 w-full bg-[#25D366] text-white hover:bg-[#1fb957]"
            >
              <FaWhatsapp size={21} aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </div>

          {/* INQUIRY FORM */}
          <div id="inquiry-form" className="contact-in card scroll-mt-28 p-6 sm:p-8 md:p-10 lg:col-span-7">
            {requested && status !== "sent" && (
              <p className="t-small mb-6 rounded-2xl bg-accent-soft px-4 py-3 text-accent">
                You’re requesting: <strong>{requested}</strong>. Tell us what you need below and we’ll
                reply with a proposal.
              </p>
            )}
            {status === "sent" ? (
              <div className="py-12 text-center" role="status" aria-live="polite">
                <AnimatedCheck className="mx-auto text-[#30d158]" />
                <h2 className="t-title mt-6">
                  Thank you, {form.name.split(" ")[0] || "partner"}.
                </h2>
                <p className="t-body mx-auto mt-4 max-w-md text-muted">
                  Your inquiry has been received. One of our operational leads
                  will review your requirements and reach out within 2
                  business hours.
                </p>
                <Btn
                  variant="secondary"
                  className="mt-8"
                  onClick={() => {
                    setStatus("idle");
                    setForm(emptyForm);
                  }}
                >
                  Send another message
                </Btn>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form space-y-5">
                <div>
                  <h2 className="t-h3">Send us a message</h2>
                  <p className="t-small mt-2 text-muted">
                    Tell us about your team size, workflow requirements or SLAs.
                  </p>
                </div>

                {/* honeypot: invisible to people, tempting to spam bots */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label>
                    Leave this field empty
                    <input type="text" name="website" tabIndex={-1} autoComplete="off"
                      value={form.website} onChange={handleChange} />
                  </label>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="c-name" className="label">Full name</label>
                    <input id="c-name" className="field" type="text" name="name" required autoComplete="name"
                      value={form.name} onChange={handleChange} placeholder="John Doe" />
                  </div>
                  <div>
                    <label htmlFor="c-email" className="label">Business email</label>
                    <input id="c-email" className="field" type="email" name="email" required autoComplete="email"
                      value={form.email} onChange={handleChange} placeholder="john@company.com" />
                  </div>
                  <div>
                    <label htmlFor="c-phone" className="label">Phone number</label>
                    <input id="c-phone" className="field" type="tel" name="phone" autoComplete="tel"
                      value={form.phone} onChange={handleChange} placeholder="+1 555-0199" />
                  </div>
                  <div>
                    <label htmlFor="c-company" className="label">Company name</label>
                    <input id="c-company" className="field" type="text" name="company" autoComplete="organization"
                      value={form.company} onChange={handleChange} placeholder="Acme Global Inc" />
                  </div>
                </div>

                <div>
                  <label htmlFor="c-service" className="label">Primary service interest</label>
                  <select id="c-service" className="field" name="service" value={form.service} onChange={handleChange}>
                    {serviceOptions.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="c-message" className="label">Project details</label>
                  <textarea id="c-message" className="field resize-none" name="message" rows={5} required
                    value={form.message} onChange={handleChange}
                    placeholder="Describe your team structure, expected volumes, target launch date and key expectations." />
                </div>

                {status === "error" && (
                  <p role="alert" className="t-small text-[#ff453a]">
                    {error} You can also email us at{" "}
                    <a href={`mailto:${company.email}`} className="underline">
                      {company.email}
                    </a>
                    .
                  </p>
                )}

                <button type="submit" disabled={status === "sending"} className="btn btn-primary w-full disabled:cursor-wait disabled:opacity-70">
                  {status === "sending" ? "Sending…" : <>Submit inquiry <FiArrowRight aria-hidden="true" /></>}
                </button>
                <p className="t-caption text-center text-muted">
                  By sending this form you agree to our{" "}
                  <a href="/privacy" className="underline">Privacy Policy</a>.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
