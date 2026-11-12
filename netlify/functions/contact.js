// =====================================================================
// POST /.netlify/functions/contact
// Receives the Contact form and the Careers application form and emails
// them to the Tephron Global inbox through Gmail SMTP.
//
// Secrets live ONLY in Netlify environment variables (never in the repo,
// never in browser code):
//   EMAIL_USER          Gmail address that sends the mail
//   EMAIL_APP_PASSWORD  16-character Google "App password" for that account
//   EMAIL_TO            (optional) where to deliver; defaults to EMAIL_USER
// =====================================================================
const nodemailer = require("nodemailer");

const MAX_RESUME_BYTES = 3 * 1024 * 1024; // keeps the request under Netlify's 6 MB limit
const RESUME_TYPES = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const reply = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// single-line field: strips line breaks (blocks email header injection)
const line = (v, max) => String(v ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, max);
// multi-line field
const block = (v, max) => String(v ?? "").replace(/\r/g, "").trim().slice(0, max);

const rowsToHtml = (rows) =>
  `<table cellpadding="8" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">` +
  rows
    .map(
      ([k, v]) =>
        `<tr><td style="color:#555;vertical-align:top;white-space:nowrap"><b>${esc(k)}</b></td>` +
        `<td style="white-space:pre-wrap">${esc(v)}</td></tr>`
    )
    .join("") +
  `</table>`;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return reply(405, { ok: false, error: "Method not allowed." });

  const user = process.env.EMAIL_USER;
  const pass = (process.env.EMAIL_APP_PASSWORD || "").replace(/\s+/g, "");
  if (!user || !pass) {
    console.error("EMAIL_USER / EMAIL_APP_PASSWORD are not set in the environment.");
    return reply(500, { ok: false, error: "Email is not set up yet. Please email us directly." });
  }

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch {
    return reply(400, { ok: false, error: "Invalid request." });
  }

  // honeypot: real people never fill this hidden field; bots do
  if (data.website) return reply(200, { ok: true });

  const isApplication = data.type === "application";
  const name = line(data.name, 120);
  const email = line(data.email, 160);
  if (!name) return reply(400, { ok: false, error: "Please enter your name." });
  if (!EMAIL_RE.test(email)) return reply(400, { ok: false, error: "Please enter a valid email address." });

  let subject;
  let rows;
  let attachments = [];

  if (isApplication) {
    const job = line(data.jobTitle, 160);
    const message = block(data.description, 4000);
    if (!job || !message) return reply(400, { ok: false, error: "Please complete every field." });

    rows = [
      ["Role", job],
      ["Name", name],
      ["Email", email],
      ["Phone", line(data.phone, 40)],
      ["Location", line(data.location, 120)],
      ["Skills", line(data.skills, 300)],
      ["About the candidate", message],
    ];
    subject = `[Job application] ${job} - ${name}`;

    const r = data.resume;
    if (r && r.data) {
      const ext = RESUME_TYPES[r.type];
      if (!ext) return reply(400, { ok: false, error: "Resume must be a PDF, DOC or DOCX file." });
      const buf = Buffer.from(String(r.data), "base64");
      if (buf.length === 0 || buf.length > MAX_RESUME_BYTES)
        return reply(400, { ok: false, error: "Resume must be under 3 MB." });
      const safe = line(name, 40).replace(/[^\w-]+/g, "_") || "candidate";
      attachments = [{ filename: `Resume_${safe}${ext}`, content: buf, contentType: r.type }];
    }
  } else {
    const companyName = line(data.company, 160);
    if (!companyName) return reply(400, { ok: false, error: "Please enter your company name." });
    const message = block(data.message, 5000);
    if (!message) return reply(400, { ok: false, error: "Please tell us about your project." });

    const service = line(data.service, 120) || "General inquiry";
    rows = [
      ["Name", name],
      ["Email", email],
      ["Phone", line(data.phone, 40)],
      ["Company", companyName],
      ["Service", service],
      ["Message", message],
    ];
    subject = `[Website inquiry] ${service} - ${name}`;
  }

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  try {
    const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
    await transporter.sendMail({
      from: `"Tephron Global website" <${user}>`,
      to: process.env.EMAIL_TO || user,
      replyTo: `"${name.replace(/"/g, "")}" <${email}>`,
      subject,
      text,
      html: rowsToHtml(rows),
      attachments,
    });
    return reply(200, { ok: true });
  } catch (err) {
    console.error("sendMail failed:", err && err.message);
    return reply(502, {
      ok: false,
      error: "We couldn’t send your message just now. Please email us directly.",
    });
  }
};
