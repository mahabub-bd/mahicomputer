"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

/** Appears once the visitor has scrolled past the hero — jumps to page top. */
const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="পৃষ্ঠার শুরুতে ফিরে যান"
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[13.5px] font-medium text-slate-300 transition duration-300 hover:border-blue-500/60 hover:bg-blue-600 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
        visible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <ArrowUp size={14} />
      Back to top
    </button>
  );
};

export default BackToTop;
