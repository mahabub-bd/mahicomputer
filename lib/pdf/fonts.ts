import { Font } from "@react-pdf/renderer";
import path from "node:path";

/**
 * Default PDF fonts have no Bengali glyphs, so every document registers
 * Hind Siliguri (bundled in /public/fonts) and uses it exclusively.
 * Hind Siliguri is used instead of Noto Sans Bengali because its conjunct
 * lookups (প্র, ক্ষ, স্ট …) are applied correctly by the PDF renderer's
 * shaping engine — Noto's cjct lookups are silently skipped, breaking Bangla.
 */
let registered = false;

export function registerPdfFonts() {
  if (registered) return;
  const dir = path.join(process.cwd(), "public", "fonts");
  Font.register({
    family: "HindSiliguri",
    fonts: [
      { src: path.join(dir, "HindSiliguri-Regular.ttf") },
      { src: path.join(dir, "HindSiliguri-SemiBold.ttf"), fontWeight: 600 },
      { src: path.join(dir, "HindSiliguri-Bold.ttf"), fontWeight: 700 },
    ],
  });
  registered = true;
}
