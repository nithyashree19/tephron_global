import { useEffect } from "react";
import { Btn, PageHeader } from "./ui";

// Shown for any address that is not a real page. Search engines are told
// not to index it.
const NotFound = () => {
  useEffect(() => {
    const tag = document.createElement("meta");
    tag.name = "robots";
    tag.content = "noindex";
    document.head.appendChild(tag);
    return () => tag.remove();
  }, []);

  return (
    <PageHeader
      lines={["That page", "doesn’t exist."]}
      lastClass="grad-text"
      lead="The link may be out of date or mistyped. Head back home, or tell us what you were looking for."
    >
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        <Btn to="/" arrow>
          Back to home
        </Btn>
        <Btn to="/contact" variant="secondary">
          Contact us
        </Btn>
      </div>
    </PageHeader>
  );
};

export default NotFound;
