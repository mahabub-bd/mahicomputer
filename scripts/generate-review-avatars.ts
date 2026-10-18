/**
 * Generates initial-based avatar PNGs (Google-style letter circles) for the
 * Google reviews in public/images/reviews/. Run: npx tsx scripts/generate-review-avatars.ts
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const avatars: { file: string; initial: string; color: string }[] = [
  { file: "jarin-subah", initial: "J", color: "#1a73e8" },
  { file: "md-mamum-or-rashid", initial: "M", color: "#e37400" },
  { file: "monira", initial: "M", color: "#7b1fa2" },
  { file: "tarak-mahmud", initial: "T", color: "#0b8043" },
  { file: "faysal-opu", initial: "F", color: "#c5221f" },
  { file: "ranver-arafat", initial: "R", color: "#00838f" },
  { file: "nova-khatun", initial: "N", color: "#3949ab" },
];

const outDir = path.join(__dirname, "..", "public", "images", "reviews");

async function main() {
  await mkdir(outDir, { recursive: true });
  for (const { file, initial, color } of avatars) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">
      <circle cx="48" cy="48" r="48" fill="${color}"/>
      <text x="48" y="50" text-anchor="middle" dominant-baseline="central"
        font-family="Arial, sans-serif" font-size="44" font-weight="500" fill="#ffffff">${initial}</text>
    </svg>`;
    await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, `${file}.png`));
    console.log("wrote", `${file}.png`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
