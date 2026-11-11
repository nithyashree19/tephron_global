import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiClock } from "react-icons/fi";
import { Btn, CtaBand } from "./ui";
import BlogCover from "./BlogCover";
import NotFound from "./NotFound";
import { getPost, posts } from "../lib/posts";

const Block = ({ b }) => {
  if (b.t === "h2") return <h2 className="t-h3 mt-12 text-balance">{b.text}</h2>;
  if (b.t === "ul")
    return (
      <ul className="t-body mt-4 max-w-[68ch] list-disc space-y-2 pl-5 marker:text-faint">
        {b.items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    );
  return <p className="t-body mt-4 max-w-[68ch] text-pretty">{b.text}</p>;
};

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = getPost(slug);
  if (!post) return <NotFound />;

  const others = posts.filter((p) => p.slug !== post.slug);

  return (
    <div>
      <article>
        <header className="wrap-narrow pb-8 pt-[calc(var(--header-h)+2.5rem)] md:pt-[calc(var(--header-h)+4rem)]">
          <Link to="/blog" className="t-small inline-flex items-center gap-1.5 font-medium text-accent">
            <FiArrowLeft aria-hidden="true" /> All articles
          </Link>
          <div className="t-caption mt-8 flex flex-wrap items-center gap-3 text-muted">
            <span className="rounded-full bg-accent-soft px-2.5 py-1 font-medium text-accent">{post.tag}</span>
            <span className="flex items-center gap-1">
              <FiClock aria-hidden="true" /> {post.readTime}
            </span>
            <span>{post.date}</span>
          </div>
          <h1 className="t-display mt-5 text-balance">{post.title}</h1>
          <p className="t-lead mt-5 text-pretty text-muted">{post.summary}</p>
        </header>

        <div className="wrap">
          <BlogCover
            slug={post.slug}
            className="relative mx-auto aspect-[16/8] max-w-[1000px] rounded-[24px] md:rounded-[32px]"
          />
        </div>

        <div className="wrap-narrow pb-14 pt-6 md:pb-20">
          {post.blocks.map((b, i) => (
            <Block key={i} b={b} />
          ))}
          <p className="t-caption mt-14 text-muted">Written by the Tephron Global team.</p>
        </div>
      </article>

      {others.length > 0 && (
        <section className="pb-[clamp(3rem,6vw,6rem)]">
          <div className="wrap-narrow">
            <h2 className="t-h3">Keep reading</h2>
            <ul className="mt-5 divide-y divide-line border-y border-line">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link to={`/blog/${o.slug}`} className="flex items-center justify-between gap-4 py-4 transition-colors hover:text-accent">
                    <span className="t-body font-medium text-balance">{o.title}</span>
                    <span className="t-caption shrink-0 text-muted">{o.readTime}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand
        title="Want a dedicated team like this?"
        text="Tell us what you need and we will come back with a clear plan."
      >
        <Btn to="/contact" variant="light" arrow>
          Talk to our team
        </Btn>
      </CtaBand>
    </div>
  );
};

export default BlogPostPage;
