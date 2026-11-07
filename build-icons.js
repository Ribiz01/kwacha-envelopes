// Draws the Kwacha Envelopes app icons as PNGs with no dependencies. Usage: node build-icons.js <outDir>
const fs = require("fs"), path = require("path"), zlib = require("zlib");
const out = process.argv[2] || "icons";
fs.mkdirSync(out, { recursive: true });

const GREEN = [24, 24, 26], CREAM = [240, 247, 243], FLAP = [200, 222, 212], COPPER = [232, 160, 92], INK = [27, 14, 4];

function inRoundRect(x, y, x0, y0, x1, y1, r) {
  if (x < x0 || x > x1 || y < y0 || y > y1) return false;
  const cx = Math.min(Math.max(x, x0 + r), x1 - r), cy = Math.min(Math.max(y, y0 + r), y1 - r);
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
}
function distSeg(x, y, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay, t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(x - (ax + t * dx), y - (ay + t * dy));
}

// Returns [r,g,b,a] for a point in unit coordinates.
function shade(x, y, opt) {
  const { maskable, rounded } = opt;
  let col = null, a = 0;
  const put = (c, alpha = 1) => { if (!col) { col = c.slice(); a = alpha; return; }
    col = col.map((v, i) => v * (1 - alpha) + c[i] * alpha); a = a + alpha * (1 - a); };
  const bg = maskable || !rounded ? (x >= 0 && x <= 1 && y >= 0 && y <= 1) : inRoundRect(x, y, 0, 0, 1, 1, 0.22);
  if (!bg) return [0, 0, 0, 0];
  put(GREEN);
  for (let r = 0.75; r > 0.2; r -= 0.07) {
    if (Math.abs(Math.hypot(x - 0.62, y - 0.95) - r) < 0.007) { put([255, 255, 255], 0.09); break; }
  }
  const pad = maskable ? 0.30 : 0.2;
  const x0 = pad, y0 = pad + 0.07, x1 = 1 - pad, y1 = 1 - pad - 0.07, w = 0.035;
  if (inRoundRect(x, y, x0, y0, x1, y1, 0.05)) {
    put(CREAM);
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 + 0.02;
    if (distSeg(x, y, x0 + w, y0 + w, mx, my) < w / 2 || distSeg(x, y, mx, my, x1 - w, y0 + w) < w / 2) put(FLAP);
  }
  const cx = x1 - 0.02, cy = y1 - 0.02, r = maskable ? 0.12 : 0.15;
  const d = Math.hypot(x - cx, y - cy);
  if (d <= r + 0.0125) put(GREEN);
  if (d <= r - 0.0125) {
    put(COPPER);
    const h = r * 1.0, top = cy - h / 2, bot = cy + h / 2;
    if (y >= top && y <= bot) {
      const sx = cx - 0.30 * h;
      const stem = Math.abs(x - sx) <= 0.11 * h;
      const arm = distSeg(x, y, sx + 0.05 * h, cy + 0.08 * h, cx + 0.36 * h, top) <= 0.10 * h;
      const leg = distSeg(x, y, sx + 0.18 * h, cy - 0.06 * h, cx + 0.38 * h, bot) <= 0.105 * h;
      if (stem || arm || leg) put(INK);
    }
  }
  return [...col.map(Math.round), Math.round(a * 255)];
}

function render(size, opt) {
  const S = 4, buf = Buffer.alloc(size * (size * 4 + 1));
  for (let py = 0; py < size; py++) {
    buf[py * (size * 4 + 1)] = 0;
    for (let px = 0; px < size; px++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < S; sy++) for (let sx = 0; sx < S; sx++) {
        const c = shade((px + (sx + 0.5) / S) / size, (py + (sy + 0.5) / S) / size, opt);
        r += c[0] * c[3]; g += c[1] * c[3]; b += c[2] * c[3]; a += c[3];
      }
      const o = py * (size * 4 + 1) + 1 + px * 4;
      if (a) { buf[o] = Math.round(r / a); buf[o + 1] = Math.round(g / a); buf[o + 2] = Math.round(b / a); }
      buf[o + 3] = Math.round(a / (S * S));
    }
  }
  return png(size, buf);
}

const CRC = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
function crc32(b) { let c = 0xffffffff; for (const v of b) c = CRC[(c ^ v) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]); const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(size, raw) {
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}

const jobs = [["icon-192.png", 192, { rounded: true }], ["icon-512.png", 512, { rounded: true }],
  ["maskable-512.png", 512, { maskable: true }], ["apple-touch-icon.png", 180, { rounded: false }]];
for (const [name, size, opt] of jobs) fs.writeFileSync(path.join(out, name), render(size, opt));
console.log("icons written to", out);
