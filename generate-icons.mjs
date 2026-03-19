import { deflateSync } from 'zlib';
import { writeFileSync, mkdirSync } from 'fs';

function crc32(buf) {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    table[n] = c;
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const d = Buffer.isBuffer(data) ? data : Buffer.from(data);
  const len = Buffer.alloc(4); len.writeUInt32BE(d.length, 0);
  const crcInput = Buffer.concat([t, d]);
  const crcBuf = Buffer.alloc(4); crcBuf.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([len, t, d, crcBuf]);
}

function createPNG(size) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2;

  const rowLen = size * 3;
  const raw = Buffer.alloc((rowLen + 1) * size);

  for (let y = 0; y < size; y++) {
    raw[y * (rowLen + 1)] = 0;
    for (let x = 0; x < size; x++) {
      const off = y * (rowLen + 1) + 1 + x * 3;
      const t = (x + y) / (size * 2);
      // pink #f472b6 -> purple #7c3aed
      raw[off]     = Math.round(244 * (1 - t) + 124 * t);
      raw[off + 1] = Math.round(114 * (1 - t) +  58 * t);
      raw[off + 2] = Math.round(182 * (1 - t) + 237 * t);
    }
  }

  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

try { mkdirSync('public', { recursive: true }); } catch {}

writeFileSync('public/pwa-192x192.png',   createPNG(192));
writeFileSync('public/pwa-512x512.png',   createPNG(512));
writeFileSync('public/apple-touch-icon.png', createPNG(180));
console.log('Icons generated: pwa-192x192.png, pwa-512x512.png, apple-touch-icon.png');
