#!/usr/bin/env node
// frontend/scripts/check-i18n.mjs
// ─────────────────────────────────────────────────────────────
// ÇEVİRİ BÜTÜNLÜĞÜ DENETİMİ — sıfır bağımlılık, `node` ile çalışır.
//
//   npm run check:i18n
//
// Denetlediği şeyler:
//   1) ar.js'teki her anahtar en.js'te de var mı? (ölü anahtar avı)
//   2) Kodda çağrılan tt('...') anahtarları sözlükte var mı? (kapsam)
//   3) Soru bankası İngilizce katmanı: aynı id'ler + aynı şık sayısı
//      (şık sayısı bozulursa correct_index yanlış cevabı işaretler!)
//   4) İçerik overlay'leri (makale/kıssa/esma/duygu): id kapsaması
//   5) Geri Dönüş müfredatı: 40 günün bütünlüğü, Arapça dua, EN overlay, ton
//
// Çıkış kodu 0 = temiz, 1 = hata var (CI'da build'i durdurur).
// ─────────────────────────────────────────────────────────────

import { readFileSync, existsSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');

let errors = 0;
let warnings = 0;
const fail = (msg) => { errors++; console.error(`  ✗ ${msg}`); };
const warn = (msg) => { warnings++; console.warn(`  ! ${msg}`); };
const ok = (msg) => console.log(`  ✓ ${msg}`);

/** `const X = {...}; export default X;` biçimli sözlüğü güvenle okur. */
function loadDict(relPath) {
  const file = join(SRC, relPath);
  if (!existsSync(file)) return null;
  let code = readFileSync(file, 'utf8');
  code = code
    .replace(/^\s*import[^\n]*$/gm, '')
    .replace(/^\s*export\s+default\s+\w+\s*;?\s*$/gm, '')
    .replace(/\bexport\s+(const|default)\s+/g, '$1 ');
  const ctx = { module: {}, exports: {} };
  vm.createContext(ctx);
  try {
    vm.runInContext(`${code}\n; globalThis.__D = (typeof EN!=='undefined'&&EN) || (typeof AR!=='undefined'&&AR) || null;`, ctx, { timeout: 5000 });
    return ctx.__D || null;
  } catch (e) {
    fail(`${relPath} okunamadı: ${e.message}`);
    return null;
  }
}

/** src altındaki tüm js/jsx dosyaları */
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(js|jsx)$/.test(name)) out.push(p);
  }
  return out;
}

console.log('\n🌍 i18n bütünlük denetimi\n');

// ── 1) Sözlükler ──────────────────────────────────────────────
console.log('1) Sözlükler');
const EN = loadDict('i18n/en.js');
const AR = loadDict('i18n/ar.js');
if (!EN) fail('en.js yüklenemedi');
if (!AR) fail('ar.js yüklenemedi');

if (EN && AR) {
  ok(`en.js: ${Object.keys(EN).length} anahtar · ar.js: ${Object.keys(AR).length} anahtar`);
  const dead = Object.keys(AR).filter(k => !(k in EN));
  if (dead.length) {
    fail(`ar.js'te en.js'te olmayan ${dead.length} anahtar (yazım hatası olabilir):`);
    dead.slice(0, 15).forEach(k => console.error(`      · ${JSON.stringify(k)}`));
  } else {
    ok("ar.js'teki tüm anahtarlar en.js'te mevcut");
  }
  // Boş değer kontrolü
  const empties = [...Object.entries(EN), ...Object.entries(AR)].filter(([, v]) => !String(v || '').trim());
  if (empties.length) fail(`${empties.length} anahtarın karşılığı boş`);
  else ok('Boş çeviri yok');
}

// ── 2) Kod kapsamı: tt('...') çağrıları ──────────────────────
console.log('\n2) Kod kapsamı');
const files = walk(SRC);
const CALL = /\btt\(\s*(['"])((?:[^'"\\]|\\.)*?)\1\s*\)/g;
const used = new Map(); // key -> [files]
for (const f of files) {
  const s = readFileSync(f, 'utf8');
  let m;
  while ((m = CALL.exec(s))) {
    const key = m[2].replace(/\\'/g, "'").replace(/\\"/g, '"');
    if (!used.has(key)) used.set(key, []);
    used.get(key).push(f.replace(SRC + '/', ''));
  }
}
ok(`Kodda ${used.size} benzersiz tt() anahtarı bulundu`);
if (EN) {
  const missingEn = [...used.keys()].filter(k => !(k in EN));
  if (missingEn.length) {
    warn(`${missingEn.length} anahtarın İngilizcesi yok (Türkçe görünecek):`);
    missingEn.slice(0, 20).forEach(k => console.warn(`      · ${JSON.stringify(k)}  ← ${used.get(k)[0]}`));
  } else {
    ok('Tüm tt() anahtarlarının İngilizcesi var');
  }
}
if (AR) {
  const missingAr = [...used.keys()].filter(k => !(k in AR));
  const pct = Math.round(((used.size - missingAr.length) / Math.max(1, used.size)) * 100);
  ok(`Arapça kapsam: %${pct} (${used.size - missingAr.length}/${used.size}) — eksikler İngilizce'ye düşer`);
}

// ── 3) Soru bankası İngilizce katmanı ────────────────────────
console.log('\n3) Soru bankası');
const bigPath = join(SRC, 'data/quizQuestionsBig.json');
const bigEnPath = join(SRC, 'data/quizQuestionsBig.en.json');
if (existsSync(bigPath) && existsSync(bigEnPath)) {
  const big = JSON.parse(readFileSync(bigPath, 'utf8'));
  const bigEn = JSON.parse(readFileSync(bigEnPath, 'utf8'));
  const qs = big.questions || [];
  const missing = qs.filter(q => !bigEn[q.id]);
  const mismatch = qs.filter(q => bigEn[q.id] && bigEn[q.id].o?.length !== q.o.length);
  const extra = Object.keys(bigEn).filter(id => !qs.some(q => q.id === id));
  if (missing.length) fail(`${missing.length} sorunun İngilizcesi yok`);
  else ok(`${qs.length} sorunun tamamı çevrildi`);
  if (mismatch.length) {
    fail(`${mismatch.length} soruda şık sayısı uyuşmuyor — correct_index YANLIŞ cevabı işaretler:`);
    mismatch.slice(0, 10).forEach(q => console.error(`      · ${q.id}: tr=${q.o.length} en=${bigEn[q.id].o.length}`));
  } else ok('Tüm sorularda şık sayısı eşleşiyor (correct_index güvenli)');
  if (extra.length) warn(`${extra.length} fazladan İngilizce kayıt (kaynakta yok)`);
  // Boş alan kontrolü
  const blank = Object.entries(bigEn).filter(([, v]) => !v.q?.trim() || !Array.isArray(v.o) || v.o.some(o => !String(o).trim()));
  if (blank.length) fail(`${blank.length} İngilizce soruda boş metin/şık var`);
  else ok('Boş soru metni veya şık yok');
} else {
  warn('Soru bankası dosyaları bulunamadı, atlanıyor');
}

// ── 4) İçerik overlay kapsaması ──────────────────────────────
console.log('\n4) İçerik overlay\'leri');
function countIds(file, re) {
  if (!existsSync(join(SRC, file))) return null;
  const s = readFileSync(join(SRC, file), 'utf8');
  const set = new Set();
  let m;
  while ((m = re.exec(s))) set.add(m[1]);
  return set;
}
const pairs = [
  ['makaleler', 'data/articles.js', /\bid:\s*'([a-z0-9_]+)'/g, 'data/articles.en.js', /^\s{2}'?([a-z0-9_]+)'?:\s*[{'"]/gm],
  ['kıssalar', 'data/stories.js', /\bid:\s*'([a-z0-9_]+)'/g, 'data/stories.en.js', /^\s{2}'?([a-z0-9_]+)'?:\s*[{'"]/gm],
];
for (const [label, srcFile, srcRe, enFile, enRe] of pairs) {
  const a = countIds(srcFile, srcRe);
  const b = countIds(enFile, enRe);
  if (!a || !b) { warn(`${label}: dosya bulunamadı, atlanıyor`); continue; }
  const miss = [...a].filter(id => !b.has(id));
  if (miss.length) warn(`${label}: ${miss.length} kayıt çevrilmemiş (${miss.slice(0, 5).join(', ')})`);
  else ok(`${label}: ${a.size} kaydın tamamı çevrilmiş`);
}

// ── 5) Geri Dönüş müfredatı (40 gün) ─────────────────────────
console.log('\n5) Geri Dönüş müfredatı');
{
  const trFile = join(SRC, 'data/returnPath.js');
  const enFile = join(SRC, 'data/returnPath.en.js');
  if (!existsSync(trFile) || !existsSync(enFile)) {
    warn('returnPath dosyaları bulunamadı, atlanıyor');
  } else {
    const tr = readFileSync(trFile, 'utf8');
    const en = readFileSync(enFile, 'utf8');
    const trDays = [...tr.matchAll(/^\s{4}day:\s*(\d+),/gm)].map(m => +m[1]);
    const enDays = [...en.matchAll(/^\s{2}(\d+):\s*\{/gm)].map(m => +m[1]);

    // Gün numaraları 1..N kesintisiz mi?
    const expected = Array.from({ length: trDays.length }, (_, i) => i + 1);
    const bad = expected.filter((d, i) => trDays[i] !== d);
    if (bad.length) fail(`Gün numaraları sıralı değil (ilk sorun: ${bad[0]})`);
    else ok(`${trDays.length} gün sıralı ve eksiksiz`);

    // Her günün zorunlu alanları var mı?
    const blocks = tr.split(/^\s{4}day:\s*\d+,/m).slice(1);
    const required = ['title:', 'lead:', 'reading:', 'source:', 'dua:', 'step:', 'question:'];
    const incomplete = [];
    blocks.forEach((blk, i) => {
      const missing = required.filter(k => !blk.includes(k));
      if (missing.length) incomplete.push(`${i + 1}. gün (${missing.join(', ')})`);
    });
    if (incomplete.length) fail(`Eksik alanlı gün: ${incomplete.slice(0, 3).join(' · ')}`);
    else ok('Her günde okuma, kaynak, dua, adım ve soru var');

    // Her duanın Arapça metni var mı?
    const arCount = (tr.match(/^\s{6}ar:\s*`/gm) || []).length;
    if (arCount !== trDays.length) fail(`${trDays.length} günden ${arCount}'inde Arapça dua metni var`);
    else ok(`${arCount} duanın tamamında Arapça metin var`);

    // İngilizce overlay kapsaması
    const missEn = trDays.filter(d => !enDays.includes(d));
    if (missEn.length) warn(`İngilizce: ${missEn.length} gün çevrilmemiş (${missEn.slice(0, 5).join(', ')})`);
    else ok(`İngilizce: ${trDays.length} günün tamamı çevrilmiş`);

    // Ton denetimi — suçlayıcı ifadeler dönüş içeriğinde yasak
    // Yorum satırları hariç: kuralın kendisi dosyanın başında yazılı.
    const BANNED = ['geride kaldın', 'kaçırdın', 'telafi et', 'kaybettiğin yıllar', 'boşa geçen'];
    const low = tr.split('\n').filter(l => !l.trim().startsWith('//')).join('\n').toLowerCase();
    const hits = BANNED.filter(w => low.includes(w));
    if (hits.length) fail(`Ton kuralı ihlali: "${hits.join('", "')}"`);
    else ok('Ton kuralı temiz (suçlayıcı ifade yok)');
  }
}

// ── Özet ─────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(50)}`);
if (errors) {
  console.error(`❌ ${errors} hata, ${warnings} uyarı\n`);
  process.exit(1);
}
console.log(`✅ Denetim temiz${warnings ? ` (${warnings} uyarı)` : ''}\n`);
