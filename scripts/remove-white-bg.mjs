// One-off: flood-fill near-white background -> transparent from image borders.
// Usage: npx tsx scripts/remove-white-bg.mjs <file> [tolerance=245]
import sharp from "sharp";

const path = process.argv[2];
const tolerance = Number(process.argv[3] || 245);
if (!path) {
  console.error("usage: tsx scripts/remove-white-bg.mjs <file> [tolerance]");
  process.exit(1);
}

const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h, channels } = info;
const at = (x, y) => (y * w + x) * channels;

const isWhite = new Uint8Array(w * h); // 1 = near-white opaque candidate
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const i = at(x, y);
    const opaque = data[i + 3] > 0;
    const bright = data[i] >= tolerance && data[i + 1] >= tolerance && data[i + 2] >= tolerance;
    if (opaque && bright) isWhite[y * w + x] = 1;
  }
}

const visited = new Uint8Array(w * h);
const queue = [];
const flood = (x, y) => {
  const key = y * w + x;
  if (x < 0 || y < 0 || x >= w || y >= h) return;
  if (visited[key] || !isWhite[key]) return;
  visited[key] = 1;
  data[at(x, y) + 3] = 0;
  queue.push([x, y]);
};
for (let x = 0; x < w; x++) {
  flood(x, 0);
  flood(x, h - 1);
}
for (let y = 0; y < h; y++) {
  flood(0, y);
  flood(w - 1, y);
}
while (queue.length) {
  const [x, y] = queue.pop();
  flood(x + 1, y);
  flood(x - 1, y);
  flood(x, y + 1);
  flood(x, y - 1);
}

const stripped = data[data.length - 1] === 0; // sanity: something was modified
await sharp(data, { raw: info })
  .png()
  .toFile(path);

console.log(`${path}: cleared white background (tolerance ${tolerance}), ${w}x${h}`);
