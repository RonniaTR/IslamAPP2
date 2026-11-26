// 🧭 Alt menü biçimi tercihi (Ayarlar > Menü biçimi). Varsayılan: açılan yelpaze mühür.
import { useSyncExternalStore } from 'react';

export const MENU_BICIMLERI = [
  { id: 'yelpaze', ad: 'Açılan mühür', alt: 'Tek yıldız; dokununca yelpaze gibi açılır' },
  { id: 'kandil', ad: 'Kandil rafı', alt: 'Asılı kandiller; seçilen yanar' },
  { id: 'cini', ad: 'Çini kuşak', alt: 'Seçilen çini döner, altın yüzü çıkar' },
  { id: 'revak', ad: 'Revak', alt: 'Seçilen kemer yükselir, altınla dolar' },
  { id: 'hilal', ad: 'Hilal kızağı', alt: 'Hilal seçilen sekmeye kayar' },
  { id: 'tesbih', ad: 'Tesbih', alt: 'İpe dizili taneler, ortada imame' },
  { id: 'kapsul', ad: 'Sade kapsül', alt: 'En yalın hâli' },
];
const ANAHTAR = 'menu_bicimi_v1';
let deger = (() => { try { const v = localStorage.getItem(ANAHTAR); return MENU_BICIMLERI.some((b) => b.id === v) ? v : 'yelpaze'; } catch { return 'yelpaze'; } })();
const dinleyiciler = new Set();
export function menuBicimi() { return deger; }
export function menuBicimiSec(id) {
  deger = id; try { localStorage.setItem(ANAHTAR, id); } catch { /* kota */ }
  dinleyiciler.forEach((f) => f());
}
function abone(f) { dinleyiciler.add(f); return () => dinleyiciler.delete(f); }
export function useMenuBicimi() { return useSyncExternalStore(abone, menuBicimi, menuBicimi); }
