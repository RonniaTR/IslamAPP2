"""
Phase 4: Core Islamic Features
- Fiqh System (Hanafi-based structured knowledge)
- AI Mufti (enhanced with Quran/Hadith references)
- Advanced Tafsir (6 interpretation styles)
- Hadith AI Explanation
- Daily Hadith  
- Dhikr Tracking & Stats
- Personal AI Guide (daily suggestions based on activity)
- Worship Streak System
"""

from fastapi import APIRouter, HTTPException, Request, Cookie
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, date, timedelta, timezone
import uuid
import json
import logging
import random

logger = logging.getLogger(__name__)

# ===================== MODELS =====================

class FiqhQueryRequest(BaseModel):
    question: str
    category: Optional[str] = None
    language: str = "tr"

class TafsirAdvancedRequest(BaseModel):
    surah: int
    verse: int
    style: str = "simple"  # simple, classical, deep, modern, psychological, wisdom
    language: str = "tr"

class HadithExplainRequest(BaseModel):
    hadith_text: str
    hadith_source: Optional[str] = None
    language: str = "tr"

class DhikrLogRequest(BaseModel):
    dhikr_id: str
    count: int
    duration_seconds: Optional[int] = 0

class GuideRequest(BaseModel):
    user_id: Optional[str] = None

# ===================== FIQH DATA =====================

FIQH_CATEGORIES = [
    {
        "id": "abdest",
        "title": "Abdest",
        "arabic": "الوضوء",
        "icon": "💧",
        "description": "Abdest almanın farzları, sünnetleri ve abdestin bozulma halleri",
        "topics": [
            {
                "id": "abdest_farzlari",
                "title": "Abdestin Farzları",
                "content": """Hanefi mezhebine göre abdestin 4 farzı vardır:

1. **Yüzü yıkamak** — Alnın üstündeki saç bitim yerinden çene altına, bir kulak memesinden diğerine kadar olan kısmı yıkamak.

2. **İki kolu dirseklerle birlikte yıkamak** — Parmak uçlarından dirseklere kadar, dirsekler dahil yıkamak.

3. **Başın dörtte birini meshetmek** — Islak elle başın en az dörtte birini meshetmek.

4. **Ayakları topuklarla birlikte yıkamak** — Parmak uçlarından topuklara kadar, topuklar dahil yıkamak.

**Kaynak:** Ömer Nasuhi Bilmen, Büyük İslam İlmihali; Diyanet İşleri Başkanlığı""",
            },
            {
                "id": "abdest_sunnetleri",
                "title": "Abdestin Sünnetleri",
                "content": """Abdestin başlıca sünnetleri:

1. Niyet etmek (kalben)
2. Besmele çekmek
3. Elleri bileklere kadar üç kez yıkamak
4. Misvak/fırça kullanmak
5. Ağza su almak (mazmaza) — üç kez
6. Burna su çekmek (istinşak) — üç kez
7. Sakalı hilallemek
8. Parmak aralarını hilallemek
9. Her uzvu üçer kez yıkamak
10. Sırayla (tertip üzere) yapmak
11. Ara vermeden (muvalat) yapmak
12. Kulakları meshetmek
13. Enseyi meshetmek

**Kaynak:** Diyanet İşleri Başkanlığı, İlmihal""",
            },
            {
                "id": "abdest_bozanlar",
                "title": "Abdesti Bozan Durumlar",
                "content": """Hanefi mezhebine göre abdesti bozan haller:

**Kesin Bozanlar:**
1. Önden veya arkadan herhangi bir şeyin çıkması
2. Vücuttan kan, irin gibi sıvı çıkması (çıktığı yeri aşacak kadar)
3. Ağız dolusu kusmak
4. Bayılmak veya aklını kaybetmek
5. Uyumak (yere yaslanarak — oturarak hafif uyuklama bozmaz)
6. Namazda sesli gülmek (kahkaha)
7. Cinsel temas (cima)

**Bozmayan Durumlar:**
- Az miktarda kan (çıktığı yeri aşmıyorsa)
- Ağlamak
- Öpmek (şehvetsiz)
- Karşı cinse dokunmak (Hanefi mezhebine göre)

**Kaynak:** Ömer Nasuhi Bilmen, Büyük İslam İlmihali""",
            },
        ],
    },
    {
        "id": "namaz",
        "title": "Namaz",
        "arabic": "الصلاة",
        "icon": "🕌",
        "description": "Namazın farzları, vacipleri, sünnetleri ve namaz kılma rehberi",
        "topics": [
            {
                "id": "namaz_farzlari",
                "title": "Namazın Farzları",
                "content": """Namazın toplam 12 farzı vardır (6 şart + 6 rükün):

**Namazın Şartları (6):**
1. **Hadesten taharet** — Abdestli olmak
2. **Necasetten taharet** — Beden, elbise ve namaz kılınacak yerin temiz olması
3. **Setr-i avret** — Örtülmesi gereken yerlerin örtülü olması
4. **İstikbal-i kıble** — Kıbleye yönelmek
5. **Vakit** — Namazı vaktinde kılmak
6. **Niyet** — Hangi namazı kılacağını kalben belirlemek

**Namazın Rükünleri (6):**
1. **İftitah tekbiri** — "Allahu Ekber" diyerek namaza başlamak
2. **Kıyam** — Ayakta durmak
3. **Kıraat** — Kur'an'dan bir miktar okumak
4. **Rükû** — Eğilmek
5. **Secde** — Yere kapanmak (her rekatta iki kez)
6. **Ka'de-i ahire** — Son oturuşta teşehhüd miktarı oturmak

**Kaynak:** Diyanet İşleri Başkanlığı; Hanefi Fıkhı""",
            },
            {
                "id": "namaz_vakitleri",
                "title": "Namaz Vakitleri",
                "content": """Günlük 5 vakit namazın süreleri:

🌅 **İmsak / Sabah Namazı (Fecr)**
Fecr-i sadık (tan ağarması) ile güneşin doğması arasında. 2 rekat sünnet + 2 rekat farz.

☀️ **Öğle Namazı (Zuhr)**
Güneşin tam tepeden meyletmesiyle başlar, ikindi vaktine kadar. 4 rekat sünnet + 4 rekat farz + 2 rekat son sünnet.

🌤️ **İkindi Namazı (Asr)**
Her şeyin gölgesi iki misli olunca başlar, güneşin batmasına kadar. 4 rekat farz.

🌆 **Akşam Namazı (Mağrib)**
Güneş battıktan sonra başlar, şafağın kaybolmasına kadar. 3 rekat farz + 2 rekat sünnet.

🌙 **Yatsı Namazı (İşa)**
Şafağın kaybolmasından fecre kadar. 4 rekat farz + 2 rekat sünnet + 3 rekat vitir vacib.

**Kaynak:** Diyanet İşleri Başkanlığı Namaz Vakitleri""",
            },
            {
                "id": "namaz_nasil_kilinir",
                "title": "Namaz Nasıl Kılınır?",
                "content": """İki rekatlık sabah namazı örneğiyle:

**1. Niyet** — "Niyet ettim Allah rızası için sabah namazının farzını kılmaya"

**2. İftitah Tekbiri** — Eller kulaklara kaldırılır, "Allahu Ekber" denir

**3. Kıyam** — Eller göbek altında bağlanır (sağ el sol elin üzerinde)
- Sübhaneke okunur
- Eûzu-Besmele çekilir
- Fatiha suresi okunur
- Zamm-ı sure okunur (kısa bir sure)

**4. Rükû** — "Allahu Ekber" diyerek eğilinir
- 3 kez "Sübhane Rabbiyel Azim" denir
- "Semiallahu limen hamideh" diyerek kalkılır
- "Rabbena lekel hamd" denir

**5. Secde** — "Allahu Ekber" diyerek secdeye gidilir
- 3 kez "Sübhane Rabbiyel A'la" denir
- Kalkılır, kısa oturma
- İkinci secde yapılır

**6. İkinci Rekat** — Ayağa kalkılır, aynı şekilde tekrarlanır

**7. Ka'de** — Son oturuşta:
- Ettehiyyatu okunur
- Allahümme salli & barik okunur
- Rabbena atina... duası okunur

**8. Selam** — Sağa "Esselamu aleyküm ve rahmetullah", sola aynı şekilde

**Kaynak:** Diyanet İlmihali""",
            },
        ],
    },
    {
        "id": "oruc",
        "title": "Oruç",
        "arabic": "الصوم",
        "icon": "🌙",
        "description": "Oruç tutmanın farzları, sünnetleri ve orucu bozan haller",
        "topics": [
            {
                "id": "oruc_farzlari",
                "title": "Orucun Şartları",
                "content": """**Orucun Farz Olma Şartları:**
1. Müslüman olmak
2. Akıllı olmak (akıl baliğ)
3. Ergenlik çağına ulaşmış olmak

**Orucun Geçerlilik Şartları:**
1. Niyet etmek — Ramazan orucu için gece niyet etmek yeterli
2. Hayız (adet) ve nifas (lohusalık) halinde olmamak

**Oruç Tutmanın Hükmü:**
- Ramazan ayında oruç tutmak farzdır (Bakara 183)
- "Ey iman edenler! Oruç sizden öncekilere farz kılındığı gibi, size de farz kılındı."

**Kaynak:** Kur'an, Bakara Suresi 183-185; Diyanet İlmihali""",
            },
            {
                "id": "oruc_bozanlar",
                "title": "Orucu Bozan ve Bozmayan Haller",
                "content": """**Orucu Bozan Haller (Kaza gerektirir):**
1. Yanlışlıkla yiyip içmek (Hanefi: kaza gerekir)
2. İlaç almak (ağız yoluyla)
3. Bilerek kusmak (ağız dolusu)
4. Burun veya kulak damlası
5. Niyet etmeden oruca devam etmemek

**Hem Kaza Hem Kefaret Gerektiren:**
1. Bilerek ve isteyerek yemek-içmek
2. Bilerek cinsel ilişkide bulunmak
*(Kefaret: 60 gün peş peşe oruç veya 60 fakir doyurma)*

**Orucu Bozmayan Haller:**
- Unutarak yiyip içmek (hatırladığında bırakır, orucu devam eder)
- Uyurken ihtilam olmak
- Göze sürme çekmek
- Misvak kullanmak
- Kan aldırmak, kan vermek
- Rüyada cünüp olmak
- Denize/havuza girmek (su yutmamak kaydıyla)

**Kaynak:** Ömer Nasuhi Bilmen, İlmihal; Hanefi Fıkhı""",
            },
            {
                "id": "oruc_sunnetleri",
                "title": "Sahur ve İftar Adabı",
                "content": """**Sahur:**
- Sahura kalkmak sünnettir
- İmsak vaktine yakın yemek faziletlidir
- Hz. Peygamber: "Sahur yemeği yiyin, çünkü sahurda bereket vardır." (Buhari)

**İftar:**
- İftarı acele etmek sünnettir (vakti girince)
- Hurma veya su ile açmak sünnettir
- İftar duası: "Allahümme leke sumtü ve bike amentü ve aleyke tevekkeltü ve alâ rızkıke eftartü"
- "Allah'ım! Senin için oruç tuttum, sana iman ettim, sana tevekkül ettim ve senin rızkınla orucumu açtım."

**Teravih Namazı:**
- Ramazan gecelerinde kılınan sünnet-i müekkede
- 20 rekat (Hanefi) ikişer ikişer kılınır
- Hatimle kılınması faziletlidir

**Kaynak:** Buhari, Müslim; Diyanet İlmihali""",
            },
        ],
    },
    {
        "id": "gunluk_ibadet",
        "title": "Günlük İbadetler",
        "arabic": "العبادات اليومية",
        "icon": "📿",
        "description": "Günlük dua, zikir ve ibadet rehberi",
        "topics": [
            {
                "id": "sabah_akşam_dualari",
                "title": "Sabah ve Akşam Duaları",
                "content": """**Sabah Duaları:**

1. **Uyanınca:** "Elhamdulillahillezi ahyana ba'de ma ematena ve ileyhinnüşur"
   *Bizi öldükten (uyuduktan) sonra dirilten (uyandıran) Allah'a hamdolsun.*

2. **Ayetü'l-Kürsi** (Bakara 255) — Sabah okuyan akşama kadar korunur

3. **3 İhlas + 1 Felak + 1 Nas** — Sabah ve akşam 3'er kez

4. **Seyyidü'l-İstiğfar:**
   "Allahümme ente Rabbi, la ilahe illa ente, halakteni ve ene abduke..."
   *Dua ve istiğfarların en faziletlisi*

**Akşam Duaları:**

1. **Yatarken:** "Bismikellahümme emutu ve ahya"
   *Allah'ım! Senin adınla ölür ve dirilirim.*

2. **Ayetü'l-Kürsi** — Yatmadan önce okuyan sabaha kadar melekler korur

3. **Bakara Suresi son 2 ayet** (285-286) — Gece okuyana yeter

**Kaynak:** Buhari, Müslim, Tirmizi""",
            },
            {
                "id": "tesbihat",
                "title": "Namaz Sonrası Tesbihat",
                "content": """Farz namazdan sonra yapılan tesbihat:

1. **3 kez Estağfirullah** — Bağışlanma dileme
2. **Ayetü'l-Kürsi** — Bakara 255
3. **33 kez Sübhanallah** — سُبْحَانَ اللَّهِ
4. **33 kez Elhamdülillah** — الْحَمْدُ لِلَّهِ
5. **33 kez Allahu Ekber** — اللَّهُ أَكْبَرُ
6. **1 kez Kelime-i Tevhid:**
   "La ilahe illallahu vahdehu la şerike leh, lehul mulku ve lehul hamdu ve huve ala kulli şey'in kadir"

**Toplam: 99 tesbih + 1 = 100**

Hz. Peygamber (s.a.v.): "Kim her namazdan sonra 33 kez sübhanallah, 33 kez elhamdülillah, 33 kez Allahu ekber der ve yüzüncüyü kelime-i tevhid ile tamamlarsa, günahları deniz köpüğü kadar olsa bile affedilir." (Müslim)

**Kaynak:** Müslim, Tirmizi""",
            },
        ],
    },
    {
        "id": "temizlik",
        "title": "Temizlik (Taharet)",
        "arabic": "الطهارة",
        "icon": "🚿",
        "description": "Gusül, teyemmüm ve temizlik hükümleri",
        "topics": [
            {
                "id": "gusul",
                "title": "Gusül (Boy Abdesti)",
                "content": """**Guslün Farzları (Hanefi):**
1. Ağzın içini yıkamak (mazmaza)
2. Burnun içini yıkamak (istinşak)  
3. Bütün vücudu yıkamak (kuru yer kalmaması)

**Guslü Gerektiren Haller:**
1. Cünüplük (cinsel ilişki veya meninin gelmesi)
2. Hayız (adet) halinin sona ermesi
3. Nifas (lohusalık) halinin sona ermesi

**Guslün Sünneti:**
- Niyet etmek
- Besmele çekmek
- Önce elleri yıkamak
- Avret yerlerini yıkamak
- Abdest almak
- Baştan 3 kez su dökmek
- Sağdan başlamak

**Kaynak:** Hanefi Fıkhı; İlmihal""",
            },
            {
                "id": "teyemmum",
                "title": "Teyemmüm",
                "content": """Su bulunamadığında veya kullanılamadığında teyemmüm yapılır.

**Teyemmümün Farzları:**
1. Niyet etmek
2. İki eli temiz toprağa/taşa vurup yüzü meshetmek
3. İki eli tekrar vurup kolları dirseklerle meshetmek

**Ne Zaman Yapılır:**
- Su bulunmadığında (1 mil mesafede su yoksa)
- Hastalık nedeniyle su kullanılamadığında
- Suyun başkasının hakkı olduğu durumlarda

**Kaynak:** Kur'an, Maide 6; Hanefi Fıkhı""",
            },
        ],
    },
]

# ===================== TAFSIR STYLES =====================

TAFSIR_STYLES = {
    "simple": {
        "name": "Basit Açıklama",
        "icon": "📖",
        "description": "Herkesin anlayabileceği sade bir dille açıklama",
        "prompt": """Bu ayeti basit, sade ve herkesin anlayabileceği bir dille açıkla. 
Kısa cümleler kullan. Günlük hayattan örnekler ver. 
Teknik terimlerden kaçın. Sanki bir arkadaşına anlatıyormuş gibi yaz.
Türkçe yanıtla.""",
    },
    "classical": {
        "name": "Klasik Tefsir",
        "icon": "📜",
        "description": "Geleneksel İslam alimleri tarzında detaylı tefsir",
        "prompt": """Bu ayeti klasik İslam tefsir geleneğine uygun şekilde açıkla.
İbn Kesir, Taberi, Kurtubi gibi büyük müfessirlerin yaklaşımını benimse.
Sebeb-i nüzul (iniş sebebi) varsa belirt.
Arapça kelime tahlili yap. Diğer ayetlerle bağlantı kur.
Hadislerle destekle. Türkçe yanıtla.""",
    },
    "deep": {
        "name": "Derin Analiz",
        "icon": "🔬",
        "description": "Kelime kelime, detaylı dilbilimsel ve teolojik analiz",
        "prompt": """Bu ayetin derin bir analizini yap.
Her kelimenin Arapça kök anlamını açıkla. Sarf ve nahiv tahlili yap.
Belagat (edebiyat) açısından incele. Teşbih, mecaz, kinaye var mı belirt.
Akaid (inanç) boyutunu ele al. Farklı mezheplerin yorumlarını karşılaştır.
Tarihsel bağlamı detaylı anlat. Türkçe yanıtla.""",
    },
    "modern": {
        "name": "Modern Yorum",
        "icon": "🌍",
        "description": "Günümüz dünyasına uyarlanan çağdaş yorum",
        "prompt": """Bu ayeti modern dünya ve günümüz koşullarına göre yorumla.
Bilimsel keşiflerle uyumunu göster (varsa).
Toplumsal meselelere ışık tutan yönlerini vurgula.
Güncel etik tartışmalarla bağlantı kur.
İnsan hakları, eşitlik, adalet perspektifinden ele al.
Türkçe yanıtla.""",
    },
    "psychological": {
        "name": "Psikolojik Tefekkür",
        "icon": "🧠",
        "description": "Ayetin insanın iç dünyasına etkisi ve psikolojik boyutu",
        "prompt": """Bu ayeti psikolojik ve ruhsal açıdan yorumla.
İnsan psikolojisine etkisini analiz et.
Korku, umut, sevgi, sabır gibi duyguları ele al.
Nefis terbiyesi açısından değerlendir.
Stres, kaygı, depresyon gibi modern sorunlara çözüm sunup sunmadığını incele.
Tasavvufi perspektif ekle. Türkçe yanıtla.""",
    },
    "wisdom": {
        "name": "Hikmet (Bilgelik)",
        "icon": "💎",
        "description": "Ayetin derin hikmetleri ve hayat dersleri",
        "prompt": """Bu ayetteki derin hikmetleri ve hayat derslerini çıkar.
Her hikmetin pratik hayata nasıl uygulanabileceğini göster.
Peygamber kıssalarıyla zenginleştir.
Sufi büyüklerinin bu ayetle ilgili sözlerini paylaş.
Kısa, öz ve etkileyici bir üslupla yaz.
Madde madde hikmetler listele. Türkçe yanıtla.""",
    },
}

# ===================== DAILY HADITH POOL =====================

DAILY_HADITH_POOL = [
    {
        "arabic": "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
        "turkish": "Ameller niyetlere göredir. Her kişi için ancak niyet ettiği şey vardır.",
        "source": "Buhari, Müslim",
        "narrator": "Hz. Ömer (r.a.)",
        "topic": "Niyet",
    },
    {
        "arabic": "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
        "turkish": "Sizin en hayırlınız Kur'an'ı öğrenen ve öğretendir.",
        "source": "Buhari",
        "narrator": "Hz. Osman (r.a.)",
        "topic": "Kur'an",
    },
    {
        "arabic": "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
        "turkish": "Müslüman, dilinden ve elinden diğer Müslümanların güvende olduğu kimsedir.",
        "source": "Buhari, Müslim",
        "narrator": "Hz. Abdullah b. Amr (r.a.)",
        "topic": "Ahlak",
    },
    {
        "arabic": "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
        "turkish": "Sizden biriniz, kendisi için istediğini din kardeşi için de istemedikçe gerçek mümin olamaz.",
        "source": "Buhari, Müslim",
        "narrator": "Hz. Enes (r.a.)",
        "topic": "Kardeşlik",
    },
    {
        "arabic": "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
        "turkish": "Allah'a ve ahiret gününe iman eden ya hayır söylesin ya da sussun.",
        "source": "Buhari, Müslim",
        "narrator": "Hz. Ebu Hüreyre (r.a.)",
        "topic": "Konuşma Adabı",
    },
    {
        "arabic": "الطُّهُورُ شَطْرُ الإِيمَانِ",
        "turkish": "Temizlik imanın yarısıdır.",
        "source": "Müslim",
        "narrator": "Hz. Ebu Malik el-Eş'ari (r.a.)",
        "topic": "Temizlik",
    },
    {
        "arabic": "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ",
        "turkish": "Kardeşine gülümsemen senin için sadakadır.",
        "source": "Tirmizi",
        "narrator": "Hz. Ebu Zerr (r.a.)",
        "topic": "İyilik",
    },
    {
        "arabic": "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
        "turkish": "Kim ilim öğrenmek için bir yola girerse, Allah ona cennetin yolunu kolaylaştırır.",
        "source": "Müslim",
        "narrator": "Hz. Ebu Hüreyre (r.a.)",
        "topic": "İlim",
    },
    {
        "arabic": "الدُّعَاءُ هُوَ الْعِبَادَةُ",
        "turkish": "Dua ibadetin ta kendisidir.",
        "source": "Tirmizi",
        "narrator": "Hz. Nu'man b. Beşir (r.a.)",
        "topic": "Dua",
    },
    {
        "arabic": "مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ",
        "turkish": "Sadaka malı eksiltmez.",
        "source": "Müslim",
        "narrator": "Hz. Ebu Hüreyre (r.a.)",
        "topic": "Sadaka",
    },
    {
        "arabic": "الْجَنَّةُ تَحْتَ أَقْدَامِ الأُمَّهَاتِ",
        "turkish": "Cennet annelerin ayakları altındadır.",
        "source": "Nesai",
        "narrator": "Hz. Enes (r.a.)",
        "topic": "Anne",
    },
    {
        "arabic": "إِنَّ اللَّهَ جَمِيلٌ يُحِبُّ الْجَمَالَ",
        "turkish": "Allah güzeldir, güzelliği sever.",
        "source": "Müslim",
        "narrator": "Hz. Abdullah b. Mesud (r.a.)",
        "topic": "Güzellik",
    },
    {
        "arabic": "مَا مَلأَ آدَمِيٌّ وِعَاءً شَرًّا مِنْ بَطْنِهِ",
        "turkish": "İnsan, midesinden daha şerli bir kab doldurmamıştır.",
        "source": "Tirmizi, İbn Mace",
        "narrator": "Hz. Mikdam b. Ma'dikerib (r.a.)",
        "topic": "Sağlık",
    },
    {
        "arabic": "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ",
        "turkish": "Nerede olursan ol Allah'tan kork (takva sahibi ol).",
        "source": "Tirmizi",
        "narrator": "Hz. Ebu Zerr (r.a.)",
        "topic": "Takva",
    },
    {
        "arabic": "خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ",
        "turkish": "İnsanların en hayırlısı insanlara en faydalı olanıdır.",
        "source": "Taberani",
        "narrator": "Hz. Cabir (r.a.)",
        "topic": "Fayda",
    },
    {
        "arabic": "الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ",
        "turkish": "Güzel söz sadakadır.",
        "source": "Buhari, Müslim",
        "narrator": "Hz. Ebu Hüreyre (r.a.)",
        "topic": "Söz",
    },
    {
        "arabic": "الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ",
        "turkish": "Merhamet edenlere Rahman olan Allah merhamet eder.",
        "source": "Tirmizi",
        "narrator": "Hz. Abdullah b. Amr (r.a.)",
        "topic": "Merhamet",
    },
    {
        "arabic": "إِنَّ اللَّهَ لا يَنْظُرُ إِلَى صُوَرِكُمْ وَلا إِلَى أَمْوَالِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ",
        "turkish": "Allah sizin suretlerinize ve mallarınıza bakmaz, fakat kalplerinize ve amellerinize bakar.",
        "source": "Müslim",
        "narrator": "Hz. Ebu Hüreyre (r.a.)",
        "topic": "Kalp",
    },
    {
        "arabic": "مَنْ صَلَّى عَلَيَّ صَلاةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا",
        "turkish": "Kim bana bir salavat getirirse, Allah ona on rahmet eder.",
        "source": "Müslim",
        "narrator": "Hz. Ebu Hüreyre (r.a.)",
        "topic": "Salavat",
    },
    {
        "arabic": "الصَّبْرُ ضِيَاءٌ",
        "turkish": "Sabır bir ışıktır (aydınlıktır).",
        "source": "Müslim",
        "narrator": "Hz. Ebu Malik el-Eş'ari (r.a.)",
        "topic": "Sabır",
    },
    {
        "arabic": "مَنْ لَا يَرْحَمُ لَا يُرْحَمُ",
        "turkish": "Merhamet etmeyene merhamet edilmez.",
        "source": "Buhari, Müslim",
        "narrator": "Hz. Cerir b. Abdullah (r.a.)",
        "topic": "Merhamet",
    },
]

# ===================== SETUP FUNCTION =====================

def setup_phase4_routes(api_router, db, gemini_generate):
    """Register all Phase 4 endpoints"""

    # ── Fiqh System ──

    @api_router.get("/fiqh/categories")
    async def get_fiqh_categories():
        return [
            {
                "id": c["id"],
                "title": c["title"],
                "arabic": c["arabic"],
                "icon": c["icon"],
                "description": c["description"],
                "topic_count": len(c["topics"]),
            }
            for c in FIQH_CATEGORIES
        ]

    @api_router.get("/fiqh/category/{category_id}")
    async def get_fiqh_category(category_id: str):
        for c in FIQH_CATEGORIES:
            if c["id"] == category_id:
                return c
        raise HTTPException(404, "Kategori bulunamadı")

    @api_router.get("/fiqh/topic/{category_id}/{topic_id}")
    async def get_fiqh_topic(category_id: str, topic_id: str):
        for c in FIQH_CATEGORIES:
            if c["id"] == category_id:
                for t in c["topics"]:
                    if t["id"] == topic_id:
                        return {"category": c["title"], **t}
        raise HTTPException(404, "Konu bulunamadı")

    @api_router.post("/fiqh/ask")
    async def ask_fiqh_question(req: FiqhQueryRequest):
        """AI Mufti - Hanafi-based fiqh Q&A with Quran & Hadith references"""
        if not req.question or len(req.question.strip()) < 3:
            raise HTTPException(400, "Soru çok kısa")
        if len(req.question) > 2000:
            raise HTTPException(400, "Soru çok uzun (max 2000 karakter)")

        system_prompt = """Sen bir İslam fıkıh uzmanısın. Hanefi mezhebine göre cevap veriyorsun.

KURALLAR:
1. Her cevabında mutlaka Kur'an ayeti referansı ver (sure adı ve ayet numarası)
2. Mümkünse hadis kaynağı belirt (Buhari, Müslim, Tirmizi vb.)
3. Hanefi mezhebinin görüşünü esas al, diğer mezheplerin farklı görüşünü kısaca belirt
4. Cevapların güvenilir, doğru ve net olsun
5. Karmaşık konularda "Bu konuda bir alime danışmanızı tavsiye ederiz" de
6. Cevabı Türkçe ver
7. Yapılandırılmış ve okunaklı format kullan (başlıklar, maddeler)
8. Uydurma hadis veya ayet ASLA kullanma

FORMAT:
📖 CEVAP: [Ana cevap]
📕 KUR'AN REFERANSl: [Ayet ve sure]
📗 HADİS REFERANSI: [Hadis ve kaynak]
⚖️ HANEFİ GÖRÜŞÜ: [Detay]
📌 NOT: [Varsa ek bilgi]"""

        try:
            response = await gemini_generate(
                f"Soru: {req.question}",
                system_prompt
            )
            return {
                "answer": response,
                "category": req.category,
                "madhab": "Hanefi",
                "sources": ["Kur'an-ı Kerim", "Hadis-i Şerif", "Hanefi Fıkhı"],
            }
        except Exception as e:
            logger.error(f"Fiqh AI error: {e}")
            raise HTTPException(503, "AI servisi şu an meşgul, lütfen tekrar deneyin")

    # ── Advanced Tafsir (6 styles) ──

    @api_router.post("/tafsir/advanced")
    async def get_advanced_tafsir(req: TafsirAdvancedRequest):
        """Generate tafsir in one of 6 interpretation styles"""
        style_config = TAFSIR_STYLES.get(req.style)
        if not style_config:
            raise HTTPException(400, f"Geçersiz tefsir stili: {req.style}")

        # Get the verse text
        verse_text = ""
        verse_turkish = ""
        if 1 <= req.surah <= 114:
            from server import QURAN_ARABIC, QURAN_TURKISH
            if QURAN_ARABIC:
                for s in QURAN_ARABIC:
                    if s["number"] == req.surah:
                        for a in s.get("ayahs", []):
                            if a["numberInSurah"] == req.verse:
                                verse_text = a["text"]
                                break
                        break
            if QURAN_TURKISH:
                for s in QURAN_TURKISH:
                    if s["number"] == req.surah:
                        for a in s.get("ayahs", []):
                            if a["numberInSurah"] == req.verse:
                                verse_turkish = a["text"]
                                break
                        break

        prompt = f"""Sure {req.surah}, Ayet {req.verse}

Arapça: {verse_text if verse_text else '(Metin yüklenemedi)'}
Meal: {verse_turkish if verse_turkish else '(Meal yüklenemedi)'}

Bu ayeti aşağıdaki tarzda yorumla:
{style_config['prompt']}"""

        try:
            response = await gemini_generate(prompt)
            return {
                "surah": req.surah,
                "verse": req.verse,
                "style": req.style,
                "style_name": style_config["name"],
                "style_icon": style_config["icon"],
                "arabic": verse_text,
                "turkish": verse_turkish,
                "tafsir": response,
            }
        except Exception as e:
            logger.error(f"Advanced tafsir error: {e}")
            raise HTTPException(503, "Tefsir oluşturulamadı, lütfen tekrar deneyin")

    @api_router.get("/tafsir/styles")
    async def get_tafsir_styles():
        return [
            {
                "id": k,
                "name": v["name"],
                "icon": v["icon"],
                "description": v["description"],
            }
            for k, v in TAFSIR_STYLES.items()
        ]

    # ── Hadith AI Explanation ──

    @api_router.post("/hadith/explain")
    async def explain_hadith(req: HadithExplainRequest):
        """AI-powered hadith explanation in simple Turkish"""
        if not req.hadith_text or len(req.hadith_text.strip()) < 5:
            raise HTTPException(400, "Hadis metni çok kısa")

        system_prompt = """Sen bir hadis uzmanısın. Verilen hadisi Türkçe olarak açıklayacaksın.

FORMAT:
📖 HADİS AÇIKLAMASI: [Hadisin ne anlattığını basit dille açıkla]
🔍 BAĞLAM: [Hadisin söylendiği ortam ve sebep]
💡 PRATİK ANLAM: [Günlük hayatta nasıl uygulanır]
📚 İLGİLİ AYETLER: [Konuyla ilgili Kur'an ayetleri varsa]
🌟 HİKMET: [Hadisten çıkarılacak dersler]

Kısa, öz ve anlaşılır bir dille yaz. Herkesin anlayabileceği seviyede ol."""

        try:
            source_info = f"\nKaynak: {req.hadith_source}" if req.hadith_source else ""
            response = await gemini_generate(
                f"Hadis: {req.hadith_text}{source_info}",
                system_prompt
            )
            return {"explanation": response}
        except Exception as e:
            logger.error(f"Hadith explain error: {e}")
            raise HTTPException(503, "Açıklama oluşturulamadı")

    # ── Daily Hadith ──

    @api_router.get("/hadith/daily")
    async def get_daily_hadith():
        """Get a daily hadith based on the current date"""
        today = date.today()
        day_index = today.toordinal() % len(DAILY_HADITH_POOL)
        hadith = DAILY_HADITH_POOL[day_index]
        return {
            "date": today.isoformat(),
            **hadith,
        }

    # ── Dhikr Tracking ──

    @api_router.post("/dhikr/log")
    async def log_dhikr(req: DhikrLogRequest, request: Request, session_token: Optional[str] = Cookie(None)):
        """Log a dhikr session"""
        user = None
        try:
            token = session_token or request.cookies.get("session_token")
            if token:
                session = await db.sessions.find_one({"session_token": token})
                if session:
                    user = await db.users.find_one({"user_id": session["user_id"]})
        except Exception:
            pass

        user_id = user["user_id"] if user else "guest"
        today = date.today().isoformat()

        try:
            await db.dhikr_logs.insert_one({
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "dhikr_id": req.dhikr_id,
                "count": req.count,
                "duration_seconds": req.duration_seconds,
                "date": today,
                "created_at": datetime.now(timezone.utc),
            })
        except Exception as e:
            logger.warning(f"DB unavailable for dhikr log: {e}")

        return {"status": "ok", "count": req.count, "date": today}

    @api_router.get("/dhikr/stats")
    async def get_dhikr_stats(request: Request, session_token: Optional[str] = Cookie(None)):
        """Get user's dhikr statistics"""
        user_id = "guest"
        try:
            token = session_token or request.cookies.get("session_token")
            if token:
                session = await db.sessions.find_one({"session_token": token})
                if session:
                    user_id = session["user_id"]
        except Exception:
            pass

        today = date.today().isoformat()
        stats = {"today_total": 0, "today_sessions": 0, "weekly_total": 0, "streak": 0, "by_dhikr": {}}

        try:
            # Today stats
            cursor = db.dhikr_logs.find({"user_id": user_id, "date": today})
            async for log in cursor:
                stats["today_total"] += log.get("count", 0)
                stats["today_sessions"] += 1
                did = log.get("dhikr_id", "unknown")
                stats["by_dhikr"][did] = stats["by_dhikr"].get(did, 0) + log.get("count", 0)

            # Weekly total
            week_ago = (date.today() - timedelta(days=7)).isoformat()
            cursor = db.dhikr_logs.find({"user_id": user_id, "date": {"$gte": week_ago}})
            async for log in cursor:
                stats["weekly_total"] += log.get("count", 0)

            # Streak calculation
            streak = 0
            for i in range(30):
                d = (date.today() - timedelta(days=i)).isoformat()
                count = await db.dhikr_logs.count_documents({"user_id": user_id, "date": d})
                if count > 0:
                    streak += 1
                else:
                    break
            stats["streak"] = streak

        except Exception as e:
            logger.warning(f"DB unavailable for dhikr stats: {e}")

        return stats

    # ── Personal AI Guide ──

    @api_router.post("/guide/daily")
    async def get_daily_guide(request: Request, session_token: Optional[str] = Cookie(None)):
        """Generate personalized daily Islamic guidance"""
        user_id = "guest"
        user_data = {}
        try:
            token = session_token or request.cookies.get("session_token")
            if token:
                session = await db.sessions.find_one({"session_token": token})
                if session:
                    user_id = session["user_id"]
                    user_data = await db.users.find_one({"user_id": user_id}) or {}
        except Exception:
            pass

        # Gather activity data
        activity_summary = "Yeni kullanıcı"
        try:
            today = date.today().isoformat()
            week_ago = (date.today() - timedelta(days=7)).isoformat()

            dhikr_count = await db.dhikr_logs.count_documents({"user_id": user_id, "date": {"$gte": week_ago}})
            worship_count = await db.worship_logs.count_documents({"user_id": user_id, "date": {"$gte": week_ago}})
            chat_count = await db.chat_history.count_documents({"user_id": user_id})

            parts = []
            if dhikr_count > 0:
                parts.append(f"Bu hafta {dhikr_count} zikir seansı yaptı")
            if worship_count > 0:
                parts.append(f"Bu hafta {worship_count} ibadet kaydı var")
            if chat_count > 0:
                parts.append(f"Toplam {chat_count} soru sormuş")
            if parts:
                activity_summary = ". ".join(parts)
        except Exception:
            pass

        system_prompt = """Sen kişisel bir İslami rehbersin. Kullanıcının aktivitelerine göre günlük öneriler oluştur.

FORMAT (JSON):
{
  "greeting": "Kişisel selamlama",
  "daily_verse": {"surah": "Sure adı", "verse": "Ayet numarası", "text": "Ayetin meali"},
  "daily_hadith": "Günün hadisi",
  "suggestions": [
    {"type": "prayer", "title": "Başlık", "description": "Açıklama"},
    {"type": "reading", "title": "Başlık", "description": "Açıklama"},
    {"type": "dhikr", "title": "Başlık", "description": "Açıklama"}
  ],
  "motivation": "Motivasyon cümlesi"
}

Türkçe yanıtla. JSON formatında ver."""

        try:
            import datetime as dt
            hour = dt.datetime.now().hour
            time_of_day = "sabah" if 5 <= hour < 12 else "öğle" if 12 <= hour < 17 else "akşam" if 17 <= hour < 21 else "gece"

            prompt = f"""Kullanıcı bilgileri:
- Zaman: {time_of_day}
- Aktivite: {activity_summary}
- Dil: Türkçe

Bu kullanıcı için kişiselleştirilmiş günlük İslami rehberlik oluştur."""

            response = await gemini_generate(prompt, system_prompt)

            # Try to parse JSON
            import re
            json_match = re.search(r'\{[\s\S]*\}', response)
            if json_match:
                try:
                    guide_data = json.loads(json_match.group())
                    return guide_data
                except json.JSONDecodeError:
                    pass

            # Fallback
            return {
                "greeting": f"Hayırlı {time_of_day}lar! 🌙",
                "daily_verse": {"surah": "İnşirah", "verse": "5-6", "text": "Şüphesiz zorlukla beraber kolaylık vardır."},
                "daily_hadith": DAILY_HADITH_POOL[date.today().toordinal() % len(DAILY_HADITH_POOL)]["turkish"],
                "suggestions": [
                    {"type": "prayer", "title": "Namazını kıl", "description": "Bugün 5 vakit namazını eksiksiz kılmaya çalış."},
                    {"type": "reading", "title": "Kur'an oku", "description": "Bugün en az 1 sayfa Kur'an-ı Kerim oku."},
                    {"type": "dhikr", "title": "Zikir yap", "description": "33 Sübhanallah, 33 Elhamdülillah, 33 Allahu Ekber."},
                ],
                "motivation": "Her yeni gün, yeni bir başlangıçtır. Bugünü ibadetle güzelleştir! 🤲",
                "raw_text": response,
            }
        except Exception as e:
            logger.error(f"Daily guide error: {e}")
            import datetime as dt
            hour = dt.datetime.now().hour
            time_of_day = "sabah" if 5 <= hour < 12 else "öğle" if 12 <= hour < 17 else "akşam" if 17 <= hour < 21 else "gece"
            return {
                "greeting": f"Hayırlı {time_of_day}lar! 🌙",
                "daily_verse": {"surah": "İnşirah", "verse": "5-6", "text": "Şüphesiz zorlukla beraber kolaylık vardır."},
                "daily_hadith": "Ameller niyetlere göredir. (Buhari, Müslim)",
                "suggestions": [
                    {"type": "prayer", "title": "Namazını kıl", "description": "Bugün 5 vakit namazını eksiksiz kılmaya çalış."},
                    {"type": "reading", "title": "Kur'an oku", "description": "Bugün en az 1 sayfa Kur'an-ı Kerim oku."},
                    {"type": "dhikr", "title": "Zikir yap", "description": "33 Sübhanallah, 33 Elhamdülillah, 33 Allahu Ekber."},
                ],
                "motivation": "Her yeni gün, yeni bir başlangıçtır. 🤲",
            }

    # ── Full Surah Audio ──

    @api_router.get("/quran/surah-audio/{surah_number}")
    async def get_surah_audio(surah_number: int, reciter: str = "alafasy"):
        """Get full surah audio URL with multiple reciters"""
        if surah_number < 1 or surah_number > 114:
            raise HTTPException(400, "Geçersiz sure numarası (1-114)")

        from server import QURAN_RECITERS, get_surah_audio_url

        reciter_info = QURAN_RECITERS.get(reciter)
        if not reciter_info:
            reciter = "alafasy"
            reciter_info = QURAN_RECITERS["alafasy"]

        audio_url = get_surah_audio_url(surah_number, reciter)

        # Also provide 3 cloud-based reciter options
        reciters = []
        for key in ["alafasy", "abdulbasit", "husary"]:
            r = QURAN_RECITERS.get(key)
            if r:
                reciters.append({
                    "id": key,
                    "name": r["name"],
                    "name_ar": r["name_ar"],
                    "url": get_surah_audio_url(surah_number, key),
                })

        return {
            "surah": surah_number,
            "reciter": reciter,
            "audio_url": audio_url,
            "reciters": reciters,
        }

    logger.info("Phase 4 routes registered: Fiqh, Tafsir Advanced, Hadith AI, Dhikr, Guide, Surah Audio")
