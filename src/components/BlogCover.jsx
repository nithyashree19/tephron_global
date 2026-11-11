import { FiTrendingUp, FiNavigation, FiHeart, FiBookOpen } from "react-icons/fi";
import { blogPhotoFor } from "../lib/blogPhotos";

// Brand-coloured cover for each article (no stock photos).
const covers = {
  "scaling-offshore-support": { icon: FiTrendingUp, tint: "from-[#0a3a8a] to-[#0a1d4a]" },
  "24-7-airline-travel-booking-chat-desk": { icon: FiNavigation, tint: "from-[#07607a] to-[#06283a]" },
  "ai-needs-human-empathy": { icon: FiHeart, tint: "from-[#8a3d05] to-[#3a1a05]" },
  default: { icon: FiBookOpen, tint: "from-[#1d4f9a] to-[#0b1f40]" },
};

// Position it with className (for example "absolute inset-0" or "relative aspect-[16/8]").
const BlogCover = ({ slug, className = "" }) => {
  const c = covers[slug] || covers.default;
  const Icon = c.icon;
  const photo = blogPhotoFor(slug);
  if (photo) {
    return (
      <div className={`overflow-hidden bg-bg-alt ${className}`}>
        <img
          src={photo}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-out)] group-hover:scale-[1.04]"
        />
      </div>
    );
  }
  return (
    <div aria-hidden="true" className={`overflow-hidden bg-gradient-to-br ${c.tint} ${className}`}>
      <div
        className="absolute -right-10 -top-10 h-64 w-64 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(90,200,250,0.35), transparent 70%)" }}
      />
      <div
        className="absolute -bottom-16 -left-10 h-56 w-56 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(255,121,0,0.18), transparent 70%)" }}
      />
      <Icon className="absolute bottom-6 left-6 text-white/90 md:bottom-8 md:left-8" size={44} />
    </div>
  );
};

export default BlogCover;
