// frontend/src/data/verseData.js
// 🧩 AYET TAMAMLAMA — kısa ve çok bilinen surelerin meallerinden
// "devamı hangisi?" soruları. Mealler yaygın Türkçe meallere dayalı
// yaklaşık çevirilerdir; her maddede sure/ayet referansı vardır.
// Çeldiriciler havuzdaki diğer devamlardan deterministik seçilir.

export const VERSE_ITEMS = [
  // Fatiha
  { part: 'Hamd, âlemlerin Rabbi Allah\'a mahsustur', next: 'O, Rahmân\'dır, Rahîm\'dir', ref: 'Fatiha 2-3' },
  { part: '(Rabbimiz!) Yalnız sana ibadet ederiz', next: 've yalnız senden yardım dileriz', ref: 'Fatiha 5' },
  { part: 'Bizi dosdoğru yola ilet', next: 'Kendilerine nimet verdiklerinin yoluna', ref: 'Fatiha 6-7' },
  // İhlas
  { part: 'De ki: O, Allah\'tır, bir tektir', next: 'Allah Samed\'dir (her şey O\'na muhtaçtır)', ref: 'İhlas 1-2' },
  { part: 'O, doğurmamış ve doğmamıştır', next: 'O\'nun hiçbir dengi yoktur', ref: 'İhlas 3-4' },
  // Asr
  { part: 'Asra yemin olsun ki', next: 'insan gerçekten ziyan içindedir', ref: 'Asr 1-2' },
  { part: 'Ancak iman edip salih amel işleyenler', next: 'birbirine hakkı ve sabrı tavsiye edenler müstesna', ref: 'Asr 3' },
  // Kevser
  { part: 'Şüphesiz biz sana Kevser\'i verdik', next: 'O halde Rabbin için namaz kıl ve kurban kes', ref: 'Kevser 1-2' },
  // Fil
  { part: 'Rabbinin fil sahiplerine ne yaptığını görmedin mi?', next: 'Onların tuzaklarını boşa çıkarmadı mı?', ref: 'Fil 1-2' },
  { part: 'Üzerlerine sürü sürü kuşlar gönderdi', next: 'Onlara pişkin çamurdan taşlar atıyorlardı', ref: 'Fil 3-4' },
  // Kureyş
  { part: 'Öyleyse bu evin (Kâbe\'nin) Rabbine kulluk etsinler', next: 'O ki onları açlıktan doyurdu ve korkudan güvene kavuşturdu', ref: 'Kureyş 3-4' },
  // Maun
  { part: 'Dini yalanlayanı gördün mü? İşte o', next: 'yetimi itip kakan kimsedir', ref: 'Maun 1-2' },
  { part: 'Vay o namaz kılanların haline ki', next: 'onlar namazlarından gafildirler', ref: 'Maun 4-5' },
  // Nasr
  { part: 'Allah\'ın yardımı ve fetih geldiğinde', next: 'insanların akın akın Allah\'ın dinine girdiğini gördüğünde', ref: 'Nasr 1-2' },
  { part: '(Fetih gelince) Rabbini hamd ile tesbih et', next: 've O\'ndan bağışlanma dile; O tevbeleri çokça kabul edendir', ref: 'Nasr 3' },
  // Kafirun
  { part: 'De ki: Ey kâfirler!', next: 'Ben sizin taptıklarınıza tapmam', ref: 'Kafirun 1-2' },
  { part: 'Sizin dininiz size', next: 'benim dinim banadır', ref: 'Kafirun 6' },
  // Felak
  { part: 'De ki: Sabahın Rabbine sığınırım', next: 'yarattığı şeylerin şerrinden', ref: 'Felak 1-2' },
  { part: '(Sığınırım) düğümlere üfleyenlerin şerrinden', next: 've haset ettiğinde hasetçinin şerrinden', ref: 'Felak 4-5' },
  // Nas
  { part: 'De ki: İnsanların Rabbine sığınırım', next: 'İnsanların Melikine, insanların İlahına', ref: 'Nas 1-3' },
  { part: 'O sinsi vesvesecinin şerrinden ki', next: 'insanların göğüslerine vesvese verir', ref: 'Nas 4-5' },
  // Duha
  { part: 'Kuşluk vaktine andolsun', next: 've sükûna erdiğinde geceye', ref: 'Duha 1-2' },
  { part: 'Rabbin seni terk etmedi', next: 've sana darılmadı', ref: 'Duha 3' },
  { part: 'Seni yetim bulup', next: 'barındırmadı mı?', ref: 'Duha 6' },
  { part: 'Öyleyse yetimi sakın ezme', next: 've isteyeni sakın azarlama', ref: 'Duha 9-10' },
  // İnşirah
  { part: 'Biz senin göğsünü açıp genişletmedik mi?', next: 'Yükünü üzerinden almadık mı?', ref: 'İnşirah 1-2' },
  { part: 'Şüphesiz zorlukla beraber', next: 'bir kolaylık vardır', ref: 'İnşirah 5-6' },
  // Tin
  { part: 'İncire ve zeytine andolsun', next: 'Sina Dağı\'na ve bu güvenli şehre', ref: 'Tin 1-3' },
  { part: 'Biz insanı en güzel biçimde', next: 'yarattık', ref: 'Tin 4' },
  // Kadir
  { part: 'Biz onu (Kur\'an\'ı) Kadir Gecesi\'nde indirdik', next: 'Kadir Gecesi\'nin ne olduğunu sen ne bileceksin?', ref: 'Kadir 1-2' },
  { part: 'Kadir Gecesi', next: 'bin aydan daha hayırlıdır', ref: 'Kadir 3' },
  { part: 'O gece esenlik doludur', next: 'tan yeri ağarıncaya kadar', ref: 'Kadir 5' },
  // Zilzal
  { part: 'Yer o şiddetli sarsıntısıyla sarsıldığında', next: 've yer ağırlıklarını dışarı çıkardığında', ref: 'Zilzal 1-2' },
  { part: 'Kim zerre kadar hayır işlerse', next: 'onu görür', ref: 'Zilzal 7' },
  // Tekasür
  { part: 'Çoklukla övünmek sizi oyaladı', next: 'ta ki kabirleri ziyaret edinceye kadar', ref: 'Tekasür 1-2' },
  // Ayetel Kürsi
  { part: 'Allah, kendisinden başka ilah olmayandır', next: 'O Hayy\'dır (diridir), Kayyûm\'dur (her şeyi ayakta tutandır)', ref: 'Bakara 255' },
];

/** Deterministik çeldiricilerle 4 şıklı soru üret */
export function buildVerseQuestions(count = 10) {
  const shuffled = [...VERSE_ITEMS].sort(() => Math.random() - 0.5).slice(0, count);
  return shuffled.map((item, k) => {
    const i = VERSE_ITEMS.indexOf(item);
    const distractors = [7, 15, 23].map(off => VERSE_ITEMS[(i + off) % VERSE_ITEMS.length].next);
    const options = [item.next, ...distractors];
    // Karıştır
    for (let j = options.length - 1; j > 0; j--) {
      const r = Math.floor(Math.random() * (j + 1));
      [options[j], options[r]] = [options[r], options[j]];
    }
    return {
      id: `v_${i}_${k}`,
      type: 'mc',
      category: item.ref.split(' ')[0] + ' Suresi',
      points: 15,
      question: `“${item.part}...” — mealin devamı hangisidir?`,
      options,
      correct_index: options.indexOf(item.next),
      explanation: `“${item.part}, ${item.next}” (${item.ref}).`,
    };
  });
}

export default VERSE_ITEMS;
