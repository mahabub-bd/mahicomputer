"use client";

import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const AosProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Animate once on first reveal — replaying on every scroll pass
    // wastes main-thread/paint time on a long landing page.
    AOS.init({ once: true, offset: 80 });
  }, []);

  return <>{children}</>;
};

export default AosProvider;
