import LegalPage from "./LegalPage";
import { company } from "../lib/company";

const sections = [
  {
    h: "About these terms",
    p: [
      `These terms apply when you use the ${company.name} website. By using the site you agree to them. If you do not agree, please do not use the site.`,
    ],
  },
  {
    h: "Our services",
    p: [
      "The information on this website is general and is not a binding offer. Any services we provide to a client are set out in a separate written agreement, which takes priority over these terms.",
    ],
  },
  {
    h: "Using the website",
    p: ["When you use the site, you agree that you will not:"],
    list: [
      "break the law or help anyone else to do so;",
      "try to disrupt, overload or gain unauthorised access to the site or its systems;",
      "use automated tools to copy or scrape the site, or to send spam through our forms;",
      "give false or misleading information in our forms.",
    ],
  },
  {
    h: "Our content",
    p: [
      `The text, design, logos and images on this site belong to ${company.name} or are used with permission. You may view and share links to the site, but you may not copy or reuse our content without our written permission.`,
    ],
  },
  {
    h: "Job listings",
    p: [
      "A job listing is not an offer of employment. We may change or close a role at any time, and we are not obliged to reply to every application.",
    ],
  },
  {
    h: "Accuracy and availability",
    p: [
      "We take reasonable care to keep the site accurate and running, but we cannot promise it will always be error-free or available.",
    ],
  },
  {
    h: "Our responsibility to you",
    p: [
      "Nothing in these terms limits liability for death or personal injury caused by negligence, for fraud, or for anything else the law does not allow us to limit.",
      "Subject to that, we are not responsible for loss that was not a reasonably foreseeable result of your use of this website. Responsibility for our services is covered by the agreement for those services.",
    ],
  },
  {
    h: "Links to other websites",
    p: ["The site may link to other websites. We do not control them and are not responsible for their content."],
  },
  {
    h: "Privacy",
    p: ["How we handle personal information is explained in our Privacy Policy."],
  },
  {
    h: "Changes and contact",
    p: [
      "We may update these terms from time to time. The date at the top shows the latest version.",
      `Questions about these terms? Email ${company.email}.`,
    ],
  },
];

const TermsPage = () => (
  <LegalPage
    title="Terms of Service"
    updated="11 November 2026"
    intro="The simple rules for using the Tephron Global website."
    sections={sections}
  />
);

export default TermsPage;
