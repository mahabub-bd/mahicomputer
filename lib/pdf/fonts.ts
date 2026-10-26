import { Font } from "@react-pdf/renderer";
import path from "node:path";

/**
 * Default PDF fonts have no Bengali glyphs, so every document registers
 * Noto Sans Bengali (bundled in /public/fonts) and uses it exclusively.
 */
let registered = false;

export function registerPdfFonts() {
  if (registered) return;
  const dir = path.join(process.cwd(), "public", "fonts");
  Font.register({
    family: "NotoSansBengali",
    fonts: [
      { src: path.join(dir, "NotoSansBengali-Regular.ttf") },
      { src: path.join(dir, "NotoSansBengali-Bold.ttf"), fontWeight: 700 },
    ],
  });
  registered = true;
}
