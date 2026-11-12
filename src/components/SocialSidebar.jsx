import { useRef } from "react";
import { FaLinkedinIn, FaInstagram, FaWhatsapp } from "react-icons/fa6";
import { gsap, useMotion, smooth, bouncy, whenIntroDone } from "../lib/motion";

const WA =
  "https://wa.me/918300378470?text=Hello%20Tephron%20Global%2C%20I%20would%20like%20to%20connect%20with%20your%20team.";

const socials = [
  { name: "LinkedIn", icon: FaLinkedinIn, url: "https://www.linkedin.com/company/tephron-global/",size:23 },
  { name: "Instagram", icon: FaInstagram, url: "https://www.instagram.com/tephron_global/",size:40 },
  { name: "WhatsApp", icon: FaWhatsapp, url: WA , size:45},
];

// Wide screens: a slim glass dock on the left edge.
// Smaller screens: a single WhatsApp button, bottom right.
const SocialSidebar = () => {
  const root = useRef(null);

  useMotion(() => {
    let stop = () => {};
    const tl = gsap.timeline({ paused: true });
    tl.from(".dock", { x: -50, opacity: 0, duration: 1.1, ease: smooth })
      .from(".dock-btn", { scale: 0.5, opacity: 0, stagger: 0.08, duration: 0.9, ease: bouncy }, 0.2)
      .from(".wa-fab", { scale: 0.4, opacity: 0, duration: 1, ease: bouncy }, 0.3);
    stop = whenIntroDone(() => tl.delay(0.4).play());
    return () => {
      stop();
      tl.kill();
    };
  }, root);

  return (
    <div ref={root}>
      <aside
        aria-label="Social media links"
        className="dock material fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-1 rounded-full p-1.5 shadow-[var(--shadow-card)] xl:flex"
      >
        {socials.map((s) => {
          const Icon = s.icon;
          return (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Connect on ${s.name}`}
              className="dock-btn group relative flex h-11 w-11 items-center justify-center rounded-full text-muted transition-[background-color,color,transform] duration-200 hover:bg-accent-soft hover:text-accent active:scale-90"
            >
              <Icon size={s.size} />
              <span className="t-caption pointer-events-none absolute left-full ml-3 translate-x-[-4px] whitespace-nowrap rounded-lg bg-fg px-2.5 py-1 font-medium text-bg opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                {s.name}
              </span>
            </a>
          );
        })}
      </aside>

      <a
        href={WA}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="wa-fab fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-30 flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-6px_rgba(37,211,102,0.65)] transition-transform duration-200 active:scale-90 xl:hidden"
      >
        <FaWhatsapp size={26} />
      </a>
    </div>
  );
};

export default SocialSidebar;
