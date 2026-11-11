import { useRef } from "react";
import { Link } from "react-router-dom";
import { FiClock, FiArrowRight } from "react-icons/fi";
import { PageHeader } from "./ui";
import BlogCover from "./BlogCover";
import { gsap, clip, wipe, useMotion } from "../lib/motion";
import { posts } from "../lib/posts";

const Article = ({ item, featured }) => (
  <article
    className={`article card group overflow-hidden ${
      featured ? "grid md:col-span-2 md:grid-cols-2" : "flex flex-col"
    }`}
  >
    <div
      className={`relative overflow-hidden bg-bg-alt ${
        featured ? "aspect-[16/10] md:aspect-auto md:min-h-[380px]" : "aspect-[16/10]"
      }`}
    >
      <BlogCover
        slug={item.slug}
        className="article-img absolute inset-0 transition-transform duration-[1200ms] ease-[var(--ease-out)] group-hover:scale-[1.05]"
      />
    </div>

    <div className={`flex flex-1 flex-col ${featured ? "justify-center p-6 sm:p-8 md:p-12" : "p-6 sm:p-7"}`}>
      <div className="t-caption flex items-center gap-3 text-muted">
        <span className="rounded-full bg-accent-soft px-2.5 py-1 font-medium text-accent">{item.tag}</span>
        <span className="flex items-center gap-1">
          <FiClock aria-hidden="true" /> {item.readTime}
        </span>
      </div>

      <h2 className={`${featured ? "t-title" : "t-h3"} mt-4 text-balance`}>{item.title}</h2>
      <p className={`${featured ? "t-body" : "t-small"} mt-3 text-muted`}>{item.summary}</p>

      <div className="mt-auto flex items-center justify-between pt-6">
        <span className="t-caption text-faint">{item.date}</span>
        <Link
          to={`/blog/${item.slug}`}
          aria-label={`Read article: ${item.title}`}
          className="t-small inline-flex items-center gap-1.5 font-medium text-accent transition-[gap] duration-300 hover:gap-2.5"
        >
          Read article <FiArrowRight aria-hidden="true" />
        </Link>
      </div>
    </div>
  </article>
);

const BlogPage = () => {
  const root = useRef(null);

  useMotion(() => {
    gsap.utils.toArray(".article", root.current).forEach((el, i) => {
      const st = { trigger: el, start: "top 90%", once: true };
      wipe(el, i === 0 ? clip.left : clip.bottom, { scrollTrigger: st });
      gsap.from(el.querySelector(".article-img"), { scale: 1.3, duration: 2.2, ease: "expo.out", scrollTrigger: st });
    });
  }, root);

  return (
    <div ref={root}>
      <PageHeader
        lines={["Insights and", "leadership."]}
        lead="Practical guidance on outsourcing, customer support and running business operations well."
      />
      <section className="pb-[clamp(4rem,8vw,8rem)]">
        <div className="wrap grid gap-5 md:grid-cols-2">
          {posts.map((p, i) => (
            <Article key={p.slug} item={p} featured={i === 0} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
