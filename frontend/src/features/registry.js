// frontend/src/features/registry.js
// 🧭 ÖZELLİK KAYDI — uygulamadaki her özelliğin tek listesi.
//
// NEDEN: Yeni bir özellik eklendiğinde ana ekrana, Keşfet'e ve "Tüm özellikler" sayfasına ayrı ayrı bağlamak
// gerekiyordu; bazıları yalnız adresini bilenin ulaşabildiği yerlerde kalıyordu.
// Artık yeni özellik = bu listeye BİR satır. Bkz. docs/GELISTIRME.md.
//
//   id · route · title/desc (Türkçe; i18n anahtarı) · emoji · group (GROUPS anahtarı)
//   quran: true → Kur'an içeriği; Diyanet onayı gelene kadar "onay sürecinde" notuyla görünür
//   flag:  FLAGS anahtarı; kapalıysa hiçbir yerde görünmez
//   home:  true → ana ekran kısayollarında yer alır
import { QURAN_PUBLIC } from '../config/quranAccess';

export const GROUPS = {
  kuran: { title: "Kur'an", emoji: '📖' },
  ibadet: { title: 'İbadet ve zikir', emoji: '🤲' },
  ilim: { title: 'İlim', emoji: '📚' },
  yol: { title: 'Yolculuk', emoji: '🧭' },
  oyun: { title: 'Oyun', emoji: '🎮' },
  aile: { title: 'Aile', emoji: '🏡' },
  ayar: { title: 'Uygulama', emoji: '⚙️' },
};

// Deneysel özellikler buradan açılıp kapatılır.
export const FLAGS = {
  rehber: true,
  husuPerdesi: true,
  kelimeKocu: true,
  aileSofrasi: true,
  // 15.11.2026: ürün sahibinin kararıyla açıldı. Güvenlik: ağır ifadede yapay zekâ çağrılmaz, sabit 112 kartı çıkar
  // (pages/donus/DonusYoldas.jsx + backend/rehber.py). Bir uzmanın metinleri gözden geçirmesi hâlâ ÖNERİLİR.
  dinleyenYoldas: true,
};

export const FEATURES = [
  { id: 'mushaf', route: '/mushaf', title: 'Mushaf', desc: 'Tam sayfa okuma · meal · ikisi birlikte', emoji: '📖', group: 'kuran', quran: true, home: true },
  { id: 'quran', route: '/quran', title: 'Sureler', desc: 'Ayet ayet okuma, meal, tefsir, tilavet', emoji: '🕋', group: 'kuran', quran: true },
  { id: 'hifz', route: '/hifz', title: 'Ezber', desc: 'Aralıklı tekrarla ezber', emoji: '🧠', group: 'kuran', quran: true },
  { id: 'kelime', route: '/kelime', title: 'Kelime Koçu', desc: "Kur'an ibarelerini aralıklı tekrarla öğren", emoji: '🔤', group: 'kuran', flag: 'kelimeKocu', home: true },
  { id: 'hatimplan', route: '/hatim-plani', title: 'Esnek Hatim', desc: 'Hedef tarihe göre günlük pay; kaçan gün dağılır', emoji: '🌙', group: 'kuran' },
  { id: 'defter', route: '/defter', title: 'Hayat Ayetleri', desc: 'Seninle kalan ayetlerin defteri', emoji: '📓', group: 'kuran' },
  { id: 'hatim', route: '/hatim', title: 'Ortak Hatim', desc: 'Birlikte hatim', emoji: '👥', group: 'kuran' },
  { id: 'elifba', route: '/elifba', title: 'Elif-Bâ', desc: 'Harfleri öğren', emoji: '🔡', group: 'kuran' },
  { id: 'tesbihat', route: '/tesbihat', title: 'Gözsüz Tesbihat', desc: 'Ekrana bakmadan, titreşimle', emoji: '📿', group: 'ibadet', home: true },
  { id: 'dhikr', route: '/dhikr', title: 'Zikir ve Dua', desc: 'Günlük dualar ve zikirler', emoji: '🤲', group: 'ibadet' },
  { id: 'qibla', route: '/qibla', title: 'Kıble', desc: 'Kıble yönü', emoji: '🧭', group: 'ibadet' },
  { id: 'rahmet', route: '/rahmet', title: 'Rahmet Defteri', desc: 'Vefat eden yakınların için', emoji: '🕊️', group: 'ibadet', home: true },
  { id: 'kaza', route: '/kaza', title: 'Kaza Planı', desc: 'Borç saymadan, günde bir adım', emoji: '🕊️', group: 'ibadet' },
  { id: 'ramadan', route: '/ramadan', title: 'Ramazan', desc: 'Ramazan rehberi', emoji: '🌙', group: 'ibadet' },
  { id: 'fiqh', route: '/fiqh', title: 'İbadet Rehberi', desc: 'Abdest, namaz, oruç', emoji: '🕌', group: 'ibadet' },
  { id: 'rehber', route: '/rehber', title: 'Rehber', desc: 'Kaynaklı yapay zekâ: sor, doğrula, anlat', emoji: '📚', group: 'ilim', flag: 'rehber', home: true },
  { id: 'hadith', route: '/hadith', title: 'Hadis', desc: 'Kaynaklı hadisler', emoji: '📜', group: 'ilim' },
  { id: 'siyer', route: '/siyer', title: 'Siyer-i Nebî', desc: 'Efendimizin hayatı', emoji: '🌟', group: 'ilim' },
  { id: 'prophets', route: '/prophets', title: 'Peygamberler', desc: "Kur'an'da adı geçen 25 peygamber", emoji: '✨', group: 'ilim' },
  { id: 'library', route: '/library', title: 'Kütüphane', desc: 'Makaleler', emoji: '🏛️', group: 'ilim' },
  { id: 'stories', route: '/stories', title: 'Kıssalar', desc: 'Hikmetli hikâyeler', emoji: '🕯️', group: 'ilim' },
  { id: 'hazine', route: '/hazine', title: 'Hazine', desc: 'Esmâ, dualar, tarih, işaretler', emoji: '💎', group: 'ilim' },
  { id: 'yol', route: '/yol', title: 'Nur Yolu', desc: 'Sana özel günlük plan', emoji: '🧭', group: 'yol' },
  { id: 'donus', route: '/donus', title: 'Dönüş Odası', desc: 'Kırk gün, kırk perde', emoji: '🚪', group: 'yol' },
  { id: 'yoldas', route: '/donus/yoldas', title: 'Dinleyen Yoldaş', desc: 'Günde tek soru; yargılamadan dinler', emoji: '🕯️', group: 'yol', flag: 'dinleyenYoldas' },
  { id: 'journal', route: '/journal', title: 'Amel Defteri', desc: 'Akşam muhasebesi', emoji: '📔', group: 'yol' },
  { id: 'halvet', route: '/halvet', title: 'Halvet', desc: 'Sessiz odak', emoji: '🌫️', group: 'yol' },
  { id: 'night', route: '/night', title: 'Gece', desc: 'Gece modu', emoji: '🌌', group: 'yol' },
  { id: 'games', route: '/games', title: 'Oyun Merkezi', desc: 'Hangi Sure?, Hangi Peygamber?, Hangi İsim? ve diğerleri', emoji: '🎮', group: 'oyun' },
  { id: 'quiz', route: '/quiz', title: 'Bilgi Yarışması', desc: 'Sorularla öğren', emoji: '❓', group: 'oyun' },
  { id: 'sofra', route: '/sofra', title: 'Aile Sofrası', desc: 'Akşam için 5 dakikalık sohbet kartı', emoji: '🍽️', group: 'aile', flag: 'aileSofrasi', home: true },
  { id: 'settings', route: '/settings', title: 'Ayarlar', desc: 'Tema, yazı, konum, bildirimler, dil', emoji: '⚙️', group: 'ayar' },
  { id: 'licenses', route: '/licenses', title: 'Kaynaklar ve lisanslar', desc: 'Her içeriğin kaynağı', emoji: '📄', group: 'ayar' },
  { id: 'supporter', route: '/premium', title: 'Herkese ücretsiz', desc: 'Destek ol: paylaş, hata bildir', emoji: '🤝', group: 'ayar' },
];

/** Görünür özellikler (bayrağı kapalı olanlar hariç). */
export function getFeatures() {
  return FEATURES.filter((f) => !f.flag || FLAGS[f.flag]).map((f) => ({ ...f, pending: !!f.quran && !QURAN_PUBLIC }));
}
export const getHomeFeatures = () => getFeatures().filter((f) => f.home);
export const isEnabled = (flag) => !!FLAGS[flag];
