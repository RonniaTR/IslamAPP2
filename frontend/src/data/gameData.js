// frontend/src/data/gameData.js
// Oyun modları için yerel içerik. Emoji/SVG temalı, dış görsel yok.

// ─── Kelime Tamamlama (adam asmaca benzeri) ───
// Türkçe İslami terimler + ipucu. Harfler Türk alfabesiyle tahmin edilir.
export const WORD_PUZZLES = [
  { word: 'TEVHİD', hint: "Allah'ın bir ve tek olduğuna inanmak", cat: 'İtikat' },
  { word: 'ABDEST', hint: 'Namaz öncesi alınan temizlik', cat: 'Fıkıh' },
  { word: 'ORUÇ', hint: 'İmsaktan iftara yeme-içmeyi bırakmak', cat: 'İbadet' },
  { word: 'ZEKAT', hint: "İslam'ın beş şartından mali ibadet", cat: 'İbadet' },
  { word: 'HİCRET', hint: "Mekke'den Medine'ye göç", cat: 'Siyer' },
  { word: 'MİRAÇ', hint: "Peygamberimizin göğe yükselişi", cat: 'Siyer' },
  { word: 'KABE', hint: 'Müslümanların kıblesi', cat: 'İbadet' },
  { word: 'SÜNNET', hint: "Peygamberimizin söz ve davranışları", cat: 'Hadis' },
  { word: 'İHLAS', hint: 'İbadeti yalnız Allah rızası için yapmak', cat: 'Ahlak' },
  { word: 'SABIR', hint: 'Zorluklara Allah için katlanmak', cat: 'Ahlak' },
  { word: 'BESMELE', hint: '"Rahman ve Rahim olan Allah\'ın adıyla"', cat: 'Kuran' },
  { word: 'CENNET', hint: 'Salih kulların ahiretteki ödülü', cat: 'İtikat' },
  { word: 'MELEK', hint: 'Nurdan yaratılmış, günahsız varlıklar', cat: 'İtikat' },
  { word: 'FATİHA', hint: "Kur'an'ın ilk suresi", cat: 'Kuran' },
  { word: 'HELAL', hint: 'Dinen yapılmasına izin verilen', cat: 'Fıkıh' },
  { word: 'SADAKA', hint: 'Karşılıksız yardım, hayır', cat: 'Ahlak' },
];

// ─── Eşleştirme (terim ↔ anlam) ───
export const MATCH_PAIRS = [
  { a: 'Salât', b: 'Namaz' },
  { a: 'Savm', b: 'Oruç' },
  { a: 'Sadaka', b: 'Yardım' },
  { a: 'Hac', b: 'Kâbe ziyareti' },
  { a: 'Tevbe', b: 'Pişmanlık' },
  { a: 'Şükür', b: 'Nimete minnet' },
  { a: 'İman', b: 'İnanç' },
  { a: 'Rızık', b: 'Nasip' },
  { a: 'İlim', b: 'Bilgi' },
  { a: 'Cömertlik', b: 'Sehâvet' },
];

// ─── Çarkıfelek kategorileri (renkli segmentler) ───
export const WHEEL_CATEGORIES = [
  { name: 'Kuran', color: '#10B981' },
  { name: 'Siyer', color: '#3B82F6' },
  { name: 'Fıkıh', color: '#F59E0B' },
  { name: 'Hadis', color: '#8B5CF6' },
  { name: 'Ahlak', color: '#EF4444' },
  { name: 'İtikat', color: '#06B6D4' },
];

// Türk alfabesi (kelime oyunu klavyesi)
export const TR_ALPHABET = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.split('');
