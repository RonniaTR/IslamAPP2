export const aiResponses = {
  greetings: [
    "Selamun Aleyküm! Sana nasıl yardımcı olabilirim?",
    "Aleyküm Selam. Dinimizle ilgili aklına takılanları sorabilirsin.",
    "Hoş geldin! Kur'an, Sünnet veya ilmihal konularında buradayım."
  ],
  prompts: [
    "Bugün için bana bir dua önerir misin?",
    "Sabır ile ilgili bir ayet veya hadis söyler misin?",
    "Namazı nasıl daha huşu içinde kılabilirim?",
    "Tevekkül nedir, nasıl uygulanır?",
    "Kadir Gecesinin önemi nedir?"
  ],
  database: [
    {
      keywords: ["dua", "sabah", "akşam", "öneri", "bugün"],
      response: "Bugün güne şu güzel duayla başlayabilirsin:\n\n**'Allahümme bise asbahna ve bike emseyna ve bike nahya ve bike nemutu ve ileykel nusur.'**\n\n*(Allah'ım! Senin yardımınla sabaha erdik, senin yardımınla akşama kavuştuk, senin yardımınla dirilir, senin kudretinle ölürüz ve dönüş yalnız sanadır.)*\n\nBu dua, Peygamber Efendimiz'in (sav) sabahları sıkça okuduğu ve güne Allah'a sığınarak başlamanın en güzel yollarından biridir."
    },
    {
      keywords: ["sabır", "sıkıntı", "zorluk", "ayet", "hadis"],
      response: "Sabır, İslam'ın en büyük erdemlerinden biridir. Zor zamanlarda Allah'a dayanmak kalbe ferahlık verir.\n\n📖 **Kur'an-ı Kerim'den:**\n'Ey iman edenler! Sabır ve namazla Allah'tan yardım dileyin. Şüphesiz Allah, sabredenlerle beraberdir.' *(Bakara, 153)*\n\n✨ **Hadis-i Şerif:**\n'Müminin durumu ne gariptir! Her hâli kendisi için bir hayırdır... Başına bir sevinç gelse şükreder, bu onun için hayır olur. Başına bir musibet gelse sabreder, bu da onun için hayır olur.' *(Müslim, Zühd 64)*"
    },
    {
      keywords: ["namaz", "huşu", "odaklanma", "kılmak", "daha iyi"],
      response: "Namazda huşu (saygı ve odaklanma) yakalamak için şu 3 adımı uygulayabilirsin:\n\n1. **Hazırlık:** Abdest alırken dünyevi düşünceleri suyla birlikte akıtıp attığını hayal et. Namaza durmadan önce birkaç saniye sessizce bekle.\n2. **Manayı Bilmek:** Okuduğun surelerin (Fatiha, İhlas vb.) Türkçe anlamlarını öğren. 'Elhamdülillah' derken gerçekten Allah'a teşekkür ettiğini hisset.\n3. **Huzurda Olma Bilinci:** Peygamberimiz (sav), ihsanı 'Allah'ı görüyormuşçasına ibadet etmendir' şeklinde tanımlar. Sen O'nu görmesen de, O seni görüyor."
    },
    {
      keywords: ["tevekkül", "güven", "çaba", "nasıl"],
      response: "Tevekkül, sadece 'Allah'a bıraktım' demek değildir. Bir bedevî, 'Devemi bağlayıp da mı tevekkül edeyim, yoksa bağlamadan mı?' diye sorduğunda Peygamber Efendimiz (sav):\n\n**'Önce bağla, sonra tevekkül et!'** *(Tirmizi)* buyurmuştur.\n\nYani tevekkül; elinden gelen tüm çabayı gösterdikten, tedbiri aldıktan sonra sonucunu kalbî bir huzurla Allah'a bırakmaktır."
    },
    {
      keywords: ["kadir gecesi", "ramazan", "önem", "bin ay"],
      response: "Kadir Gecesi, Kur'an-ı Kerim'in indirilmeye başlandığı gecedir ve Kur'an'da kendi adını taşıyan bir sure ile övülmüştür.\n\n📖 'Kadir gecesi bin aydan daha hayırlıdır.' *(Kadir Suresi, 3)*\n\nBu geceyi ibadetle, tövbeyle ve tefekkürle geçirmek, bir ömür (yaklaşık 83 yıl) ibadet etmiş gibi sevap kazandırır. Peygamberimiz bu gecede şu duayı çok okumamızı tavsiye etmiştir:\n\n*'Allahümme inneke afüvvün, tuhibbul afve, fa'fu annî'*\n*(Allah'ım! Sen affedicisin, affetmeyi seversin, beni de affet.)*"
    }
  ],
  fallback: "Maalesef bu sorunun cevabını henüz öğrenmedim. Kur'an ayetleri, hadisler, günlük dualar, namaz ve peygamber hayatı hakkında sorular sorabilirsin."
};

// Basit bir kelime eşleştirme algoritması (Simülasyon için)
export function getAiResponse(message) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerMessage = message.toLowerCase();
      let bestMatch = null;
      let maxMatches = 0;

      aiResponses.database.forEach(entry => {
        let matches = 0;
        entry.keywords.forEach(kw => {
          if (lowerMessage.includes(kw)) matches++;
        });

        if (matches > maxMatches) {
          maxMatches = matches;
          bestMatch = entry;
        }
      });

      if (bestMatch && maxMatches > 0) {
        resolve(bestMatch.response);
      } else {
        resolve(aiResponses.fallback);
      }
    }, 1500); // 1.5 saniye düşünme efekti
  });
}
