import { PageHeader } from "./ui";

// Shared layout for the Privacy Policy and Terms of Service pages.
// `sections` is [{ h: "Heading", p: ["paragraph", ...], list: ["item", ...] }]
const LegalPage = ({ title, updated, intro, sections }) => (
  <div>
    <PageHeader lines={[title]} lead={intro} />

    <section className="pb-[clamp(4rem,8vw,8rem)]">
      <div className="wrap-narrow">
        <p className="t-caption text-muted">Last updated: {updated}</p>

        <div className="mt-8 space-y-10 md:space-y-12">
          {sections.map((s, i) => (
            <section key={s.h} aria-labelledby={`legal-${i}`}>
              <h2 id={`legal-${i}`} className="t-h3">
                {s.h}
              </h2>
              {s.p?.map((para) => (
                <p key={para} className="t-body mt-3 max-w-[68ch] text-muted">
                  {para}
                </p>
              ))}
              {s.list && (
                <ul className="t-body mt-3 max-w-[68ch] list-disc space-y-2 pl-5 text-muted marker:text-faint">
                  {s.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default LegalPage;
