/* Kartlarda kullanılan küçük kopyaları üretir: src/img/... -> src/img/kucuk/... (en fazla 600 piksel, webp)
   Yeni fotoğraf ekleyince çalıştır:  npm run kucult  */
import sharp from 'sharp';
import { readdirSync, statSync, mkdirSync, existsSync } from 'fs';
import { join, relative, dirname, extname } from 'path';

const IMG = 'src/img';
const OUT = join(IMG, 'kucuk');
const KLASORLER = ['', 'meyve', 'fidan', 'galeri', 'tesis'];
let yeni = 0;

for (const k of KLASORLER) {
  const dir = join(IMG, k);
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir)) {
    const src = join(dir, f);
    if (!statSync(src).isFile() || !/\.(webp|jpe?g|png|avif)$/i.test(f)) continue;
    const dst = join(OUT, relative(IMG, src)).replace(extname(f), '.webp');
    if (existsSync(dst) && statSync(dst).mtimeMs >= statSync(src).mtimeMs) continue; // zaten güncel
    mkdirSync(dirname(dst), { recursive: true });
    await sharp(src).resize(600, 600, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 72 }).toFile(dst);
    yeni++;
  }
}
console.log(`${yeni} küçük kopya üretildi (${OUT})`);
