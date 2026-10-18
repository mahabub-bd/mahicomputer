import type { CategoryView } from "@/lib/types";

export type Category = CategoryView;

export const categories: Category[] = [
  {
    img: "/images/webdesign.png",
    title: "Web Development",
    alt: "web",
  },
  {
    img: "/images/development.png",
    title: "App Development",
    alt: "app",
  },
  {
    img: "/images/ui.png",
    title: "UI/UX Design",
    alt: "ui",
  },
  {
    img: "/images/graphics.png",
    title: "Graphics Design",
    alt: "graphics",
  },
  {
    img: "/images/auto-cad.webp",
    title: "Auto CAD 2D/3D",
    alt: "cad",
  },
  {
    img: "/images/computer.png",
    title: "Computer Hardware ",
    alt: "hardware",
  },
  {
    img: "/images/seo.png",
    title: "Digital Marketing",
    alt: "digital",
  },
  {
    img: "/images/office.png",
    title: "Office Application",
    alt: "office",
  },
  {
    img: "/images/teacher.png",
    title: "Language Course",
    alt: "english",
  },
  {
    img: "/images/textbook.png",
    title: "ICT HSC & SSC",
    alt: "ict",
  },
];

// Added 2026-10-18 — extra categories for the training center (kept in seed).
export const extraCategories: Category[] = [
  { img: "/images/videoediting.jpg", title: "Video Editing", alt: "video" },
  { img: "/images/freelancing.png", title: "Freelancing", alt: "freelancing" },
  { img: "/images/max.png", title: "3D Animation (3ds Max)", alt: "3dsmax" },
  { img: "/images/sketchup.png", title: "Sketch Up 3D Design", alt: "sketchup" },
  { img: "/images/spokenenglish.jpg", title: "Spoken English", alt: "english" },
  { img: "/images/japani.png", title: "Japanese Language", alt: "japanese" },
  { img: "/images/local-area-network.png", title: "Networking", alt: "network" },
  { img: "/images/seo.png", title: "SEO", alt: "seo" },
];
