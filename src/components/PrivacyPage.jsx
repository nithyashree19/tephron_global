import LegalPage from "./LegalPage";
import { company, hasUk } from "../lib/company";

// Retention periods: change here if your policy differs.
const KEEP_ENQUIRIES = "24 months";
const KEEP_APPLICATIONS = "12 months";

const PrivacyPage = () => {
  const sections = [
    {
      h: "Who we are",
      p: [
        `${company.name} (“we”, “us”) is a business process outsourcing company based in Tenkasi, Tamil Nadu, India. We are responsible for the personal information collected through this website.`,
        `Our address is ${company.india.address}. You can contact us about privacy at ${company.email}.`,
        ...(hasUk
          ? [
              [
                company.uk.address && `UK office: ${company.uk.address}.`,
                company.uk.companyNumber && `Company number: ${company.uk.companyNumber}.`,
              ]
                .filter(Boolean)
                .join(" "),
            ]
          : []),
      ].filter(Boolean),
    },
    {
      h: "What we collect",
      p: ["We only collect information you choose to give us, plus a small amount of technical data."],
      list: [
        "Contact form: your name, email address, phone number, company name, the service you are interested in, and your message.",
        "Job applications: your name, email address, phone number, location, skills, a short description of yourself, and the resume you upload.",
        "Technical data: your IP address and browser details are recorded in the server logs of our hosting provider when you visit the site.",
        "Your light or dark theme choice is stored in your browser on your own device. It is never sent to us.",
        "If you contact us by email, phone or WhatsApp, we receive whatever you send us.",
      ],
    },
    {
      h: "Cookies",
      p: [
        "This website does not use advertising or analytics cookies. If that changes, we will update this page and ask for your consent where the law requires it.",
      ],
    },
    {
      h: "How we use your information, and why",
      p: ["Under UK data protection law we need a lawful basis for each use. Ours are:"],
      list: [
        "To reply to your enquiry and prepare a proposal. This is in our legitimate interests and takes steps you ask for before entering a contract.",
        "To assess your job application and contact you about it. This takes steps at your request before entering a contract, and is in our legitimate interests.",
        "To keep the website secure and prevent spam or abuse. This is in our legitimate interests.",
        "To meet legal obligations, for example responding to a lawful request from an authority.",
      ],
    },
    {
      h: "Who we share it with",
      p: [
        "We do not sell your personal information. We use a small number of service providers who handle it on our behalf:",
      ],
      list: [
        "Google (Gmail), which delivers form submissions to our email inbox.",
        "Our website hosting provider, which serves the site and keeps server logs.",
        "Google Fonts: when a page loads, your browser requests the font files from Google, which therefore receives your IP address.",
      ],
    },
    {
      h: "Transfers outside the UK",
      p: [
        "Our team works from India, and some providers store data in other countries, including the United States. Where information leaves the UK, we make sure appropriate safeguards required by UK data protection law are in place.",
      ],
    },
    {
      h: "How long we keep it",
      list: [
        `Enquiries: up to ${KEEP_ENQUIRIES} after our last contact with you.`,
        `Job applications: up to ${KEEP_APPLICATIONS} after the role is filled or closed.`,
        "After that we delete the information, unless the law requires us to keep it longer.",
      ],
    },
    {
      h: "Your rights",
      p: [
        `You can ask us at ${company.email} to see the information we hold about you, correct it, delete it, restrict or object to how we use it, or give you a copy in a portable format. We will respond within one month.`,
        "If you are unhappy with how we handle your information, you have the right to complain to the UK Information Commissioner’s Office (ico.org.uk, 0303 123 1113). We would appreciate the chance to put things right first.",
      ],
    },
    {
      h: "Security",
      p: [
        "We use reasonable technical and organisational measures to protect your information. No method of sending data over the internet is completely secure, so we cannot guarantee absolute security.",
      ],
    },
    {
      h: "Children",
      p: ["This website is for businesses and job applicants. It is not directed at children under 18."],
    },
    {
      h: "Changes to this policy",
      p: ["We may update this policy from time to time. The date at the top shows when it last changed."],
    },
  ];

  return (
    <LegalPage
      title="Privacy Policy"
      updated="11 November 2026"
      intro="What we collect, why we collect it, and the rights you have over your information."
      sections={sections}
    />
  );
};

export default PrivacyPage;
