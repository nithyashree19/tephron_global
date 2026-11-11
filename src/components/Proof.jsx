import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { SectionHead } from "./ui";
import { company, hasProof } from "../lib/company";

// Testimonials, client names/logos and case studies.
// Renders nothing until real entries are added in src/lib/company.js,
// so the site never shows invented proof.
const Proof = () => {
  if (!hasProof) return null;
  const { testimonials, clients, caseStudies } = company;

  return (
    <section className="section bg-bg-alt">
      <div className="wrap space-y-16 md:space-y-20">
        {testimonials.length > 0 && (
          <div>
            <SectionHead center title="What our clients say." />
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <figure key={`${t.name}-${t.company}`} className="card-flat flex flex-col p-7 md:p-8">
                  <blockquote className="t-body flex-1 text-pretty">“{t.quote}”</blockquote>
                  <figcaption className="mt-6">
                    <p className="font-semibold">{t.name}</p>
                    <p className="t-small text-muted">
                      {[t.role, t.company].filter(Boolean).join(", ")}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}

        {caseStudies.length > 0 && (
          <div>
            <SectionHead center title="Results we have delivered." />
            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {caseStudies.map((c) => (
                <article key={c.title} className="card-flat p-7 md:p-8">
                  <h3 className="t-h3">{c.title}</h3>
                  <p className="t-body mt-3 text-muted">{c.summary}</p>
                  {c.result && <p className="t-body mt-4 font-medium text-accent">{c.result}</p>}
                  {c.href && (
                    <Link to={c.href} className="t-small mt-5 inline-flex items-center gap-1.5 font-medium text-accent">
                      Read the case study <FiArrowRight aria-hidden="true" />
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}

        {clients.length > 0 && (
          <div>
            <p className="t-caption text-center text-muted">Trusted by</p>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
              {clients.map((c) => (
                <li key={c.name}>
                  {c.logo ? (
                    <img src={c.logo} alt={c.name} loading="lazy" className="h-8 w-auto opacity-70 grayscale md:h-10" />
                  ) : (
                    <span className="t-h3 text-muted">{c.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default Proof;
