"""
REHBER — kaynaklı yapay zekâ (docs/YENI_OZELLIKLER.md Faz 9, tuval M1–M4)

İlke: yapay zekâ MÜFTÜ değil KÜTÜPHANECİDİR.
  · Cevabı kendisi uydurmaz; uygulamadaki izinli kaynaklardan (QuranEnc meal + Muhtasar Tefsir)
    ilgili ayetleri bulur, gösterir ve yalnız onlardan özetler.
  · Parça bulunamazsa "kaynağım yok" der; tahmin yürütmez.
  · Her cevap üç etiketten birini taşır: acik · fark · yok.

Arama şimdilik anlam vektörüyle değil, kelime kökü örtüşmesiyle (TF-IDF benzeri) yapılır: ek bir
model ya da servis gerektirmez. Vektör araması eklenirse yalnız `search()` değişir.
"""

import json
import logging
import math
import re
from collections import Counter, defaultdict
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

logger = logging.getLogger(__name__)
ROOT_DIR = Path(__file__).parent

AI_LABEL = "Yapay zekâ · kaynaklı · bir âlimin sözü ya da fetva değildir"

_STOP = set("""ve ile bir bu şu o da de ki mi mı mu mü için gibi daha çok en ama fakat ancak ya veya hem ne
nasıl neden niçin kim her hiç ben sen biz siz onlar olan olarak ise değil var yok ben bana beni sana seni
olur oldu olan eder etti diye kadar sonra önce üzere göre kendi onun onu ona bunu buna şey""".split())


def _norm(text: str) -> str:
    return text.replace("I", "ı").replace("İ", "i").lower()


def _tokens(text: str):
    """Türkçe için kaba kökleme: kelimenin ilk 5 harfi. Ekleri büyük ölçüde eler."""
    words = re.findall(r"[a-zçğıöşüâîû]+", _norm(text))
    return [w[:5] for w in words if len(w) > 2 and w not in _STOP]


# KAVRAM GENİŞLETME — soru günlük dille, meal ise kendi kelimeleriyle yazılır ("alkol" ↔ "içki", "dedikodu" ↔ "gıybet").
# Soruda soldaki ifade geçerse sağdaki kelimeler aramaya eklenir. Bu bir anlam modeli DEĞİLDİR; elle tutulan bir
# eş anlamlılar sözlüğüdür. Gerçek vektör araması eklenince bu sözlük küçülür. Yeni satır eklemek serbesttir;
# eklediğin her satır için tests/rehber_eval.json'a bir soru yaz.
EXPAND = {
    "alkol": "içki şarap", "bira": "içki şarap", "sarhoş": "içki şarap",
    "dedikodu": "gıybet çekiştirmek arkasından", "arkasından konuş": "gıybet",
    "seferi": "yolculuk yolcu sefer namazı kısaltmak", "seyahat": "yolculuk sefer",
    "kredi": "faiz riba", "banka": "faiz",
    "zekât": "sadakalar fakirler yoksullar", "zekat": "sadakalar fakirler yoksullar",
    "hac": "kâbe haccetmek yoluna gücü yeten ev", "umre": "hac umre kâbe",
    "şükre": "şükrederseniz artırırım nimet", "şükür": "şükrederseniz nimet",
    "hangi ay": "ramazan ayı indirildi", "kadir": "kadir gecesi indirdik",
    "öfke": "öfkelerini yenen kızgınlık affeden bağışlayan", "sinir": "öfke kızgınlık",
    "susup": "sus dinleyin kulak verin", "dinlemek": "dinleyin kulak verin",
    "başörtü": "örtülerini yakalarının üzerine", "tesettür": "örtülerini zinet",
    "yalan": "yalan iftira doğru söz", "iftira": "iftira bühtan",
    "hırsız": "hırsızlık çalan", "rüşvet": "mallarınızı haksız yere hâkimlere",
    "kıskan": "haset çekemez", "haset": "haset kıskanç",
    "kibir": "büyüklenen böbürlenen", "gurur": "büyüklenen böbürlenen",
    "cimri": "cimrilik eli sıkı", "israf": "israf saçıp savurma",
    "komşu": "komşu yakın akraba iyilik", "akraba": "akraba yakınlar hakkını ver",
    "evlilik": "eşler nikâh evlen", "eş": "eşler sevgi merhamet",
    "ölünce": "ölüm diriliş kıyamet", "ahiret": "ahiret kıyamet hesap",
    "tövbe": "tövbe bağışlayan affeden rahmet", "günah": "günah bağışla tövbe",
    "rızık": "rızık veren geçim", "fakir": "yoksul fakir sadaka",
    "kaygı": "korku üzüntü güven", "korku": "korkmayın üzülmeyin",
    "yalnız": "yakınım dua şah damarı", "dua": "dua edin icabet",
}


def expand(query: str) -> str:
    low = _norm(query)
    extra = [v for k, v in EXPAND.items() if k in low]
    return query + " " + " ".join(extra) if extra else query


class _Index:
    def __init__(self):
        self.docs = []            # {surah, ayah, meal, tafsir}
        self.postings = defaultdict(list)   # token -> [(doc_id, tf)]
        self.idf = {}
        self.norm = []
        self.ready = False

    def build(self):
        from quran_translations import load_by_key
        meal, meal_ed = load_by_key("turkish_rwwad")
        tafsir, tafsir_ed = load_by_key("turkish_mokhtasar")
        if not meal:
            logger.warning("Rehber: meal önbelleği yok; arama kapalı (scripts/fetch_quranenc.py).")
            return
        self.meal_edition, self.tafsir_edition = meal_ed or {}, tafsir_ed or {}
        for si, s in enumerate(meal):
            for ai, a in enumerate(s["ayahs"]):
                t = ""
                try:
                    t = tafsir[si]["ayahs"][ai]["text"] if tafsir else ""
                except Exception:
                    t = ""
                self.docs.append({"surah": s["number"], "ayah": a["numberInSurah"], "meal": a["text"], "tafsir": t})
        df = Counter()
        tfs = []
        for d in self.docs:
            # meal iki kat ağırlıklı: tefsir uzun olduğu için eşleşmeyi domine etmesin
            tf = Counter(_tokens(d["meal"]) * 2 + _tokens(d["tafsir"]))
            tfs.append(tf)
            df.update(tf.keys())
        n = len(self.docs)
        self.idf = {t: math.log(1 + n / c) for t, c in df.items()}
        for i, tf in enumerate(tfs):
            norm = 0.0
            for t, c in tf.items():
                w = (1 + math.log(c)) * self.idf[t]
                self.postings[t].append((i, w))
                norm += w * w
            self.norm.append(math.sqrt(norm) or 1.0)
        self.ready = True
        logger.info("Rehber dizini hazır: %d ayet, %d terim", n, len(self.idf))

    def search(self, query: str, k: int = 5):
        if not self.ready:
            return []
        base = Counter(_tokens(query))          # kapsama oranı YALNIZ kullanıcının kendi kelimeleriyle ölçülür
        q = Counter(_tokens(expand(query)))
        if not q:
            return []
        scores = defaultdict(float)
        qnorm = 0.0
        matched = defaultdict(set)
        for t, c in q.items():
            if t not in self.idf:
                continue
            qw = (1 + math.log(c)) * self.idf[t]
            qnorm += qw * qw
            for doc_id, w in self.postings[t]:
                scores[doc_id] += qw * w
                matched[doc_id].add(t)
        qnorm = math.sqrt(qnorm) or 1.0
        known = [t for t in q if t in self.idf]
        base_known = [t for t in base if t in self.idf] or known
        out = []
        for doc_id, s in scores.items():
            # genişletme kelimeleri de eşleşme sayılır ama payda kullanıcının kelime sayısıdır (en çok 1)
            cover = min(1.0, len(matched[doc_id]) / max(1, len(base_known)))
            out.append((s / (self.norm[doc_id] * qnorm) * (0.5 + cover), cover, doc_id))
        out.sort(reverse=True)
        return [(score, cover, self.docs[i]) for score, cover, i in out[:k]]


INDEX = _Index()

# Bu eşiklerin altında "kaynağım yok" denir. Deneme setiyle ayarlanmalıdır (bkz. Faz 9 güvence).
MIN_SCORE = 0.15
MIN_COVER = 0.5


# "Bugün bana ne söyler?" için ELLE SEÇİLMİŞ konu → ayet listesi. Yapay zekâ seçmez; liste editoryaldir.
# Anahtarlar kelime köküdür (ilk 5 harf eşleşmesi). Önce bu liste, sonra arama sonuçları gösterilir.
THEMES = [
    (("zor", "sıkın", "daral", "bunal", "yorul", "nefes", "üst üste"), [(94, 5), (94, 6), (2, 286)]),
    (("huzur", "sakin", "kalb", "kalp"), [(13, 28)]),
    (("şükür", "şükre", "iyili", "nimet", "sevin", "mutlu"), [(14, 7), (93, 11)]),
    (("yalnız", "kimse", "terk"), [(2, 186), (50, 16)]),
    (("kork", "endiş", "kaygı", "tedir"), [(9, 40), (3, 173)]),
    (("öfke", "sinir", "kızgı", "kırıl"), [(3, 134), (41, 34)]),
    (("günah", "pişma", "tövbe", "hata", "utan"), [(39, 53)]),
    (("hasta", "ağrı", "şifa"), [(26, 80)]),
    (("rızık", "para", "borç", "geçim", "işsiz"), [(65, 2), (65, 3)]),
    (("ölüm", "kayb", "yas", "vefat", "özle"), [(2, 155), (2, 156)]),
    (("sabır", "sabre", "dayan"), [(2, 153), (39, 10)]),
    (("haksı", "zulüm", "adalet"), [(14, 42), (4, 135)]),
]


def themed(text: str):
    t = _norm(text)
    refs = []
    for keys, ayahs in THEMES:
        if any(k in t for k in keys):
            refs.extend(a for a in ayahs if a not in refs)
    by = {(d["surah"], d["ayah"]): d for d in INDEX.docs} if refs else {}
    return [by[r] for r in refs if r in by]


class AskIn(BaseModel):
    question: str


class TextIn(BaseModel):
    text: str


class ExplainIn(BaseModel):
    surah: int
    from_ayah: int = 1
    to_ayah: int = 0
    text: str


def _src(n, d, names):
    name = names.get(d["surah"], ("", ""))[0] if names else ""
    return {
        "n": n, "surah": d["surah"], "ayah": d["ayah"],
        "ref": f"{name} {d['surah']}:{d['ayah']}".strip(),
        "meal": d["meal"], "tafsir": d["tafsir"],
    }


def setup_rehber_routes(router: APIRouter, gemini_generate, surah_names=None):
    try:
        INDEX.build()
    except Exception as e:  # dizin kurulamazsa sunucu yine açılır
        logger.error("Rehber dizini kurulamadı: %s", e)

    def credits():
        from quran_translations import credit
        return {"meal": credit(getattr(INDEX, "meal_edition", {})), "tafsir": credit(getattr(INDEX, "tafsir_edition", {}))}

    @router.post("/rehber/ayet")
    async def nearest_ayahs(body: TextIn):
        """'Bugün bana ne söyler?': cümleye en yakın ayetler. Yapay zekâ YORUM YAPMAZ, yalnız bulur."""
        docs = themed(body.text)
        for score, cover, d in INDEX.search(body.text, 6):
            if score >= 0.3 and cover >= 0.6 and d not in docs:
                docs.append(d)
        return {"results": [_src(i + 1, d, surah_names) for i, d in enumerate(docs[:3])],
                "credits": credits(), "ready": INDEX.ready}

    @router.post("/rehber/sor")
    async def ask(body: AskIn):
        q = (body.question or "").strip()
        if len(q) < 3:
            raise HTTPException(status_code=400, detail="Soru çok kısa")
        hits = INDEX.search(q, 5)
        good = [h for h in hits if h[0] >= MIN_SCORE and h[1] >= MIN_COVER]
        if not good:
            return {
                "label": "yok", "ai_label": AI_LABEL, "sources": [], "credits": credits(),
                "answer": "Bu soruyu karşılayan bir kaynağı uygulamadaki meal ve tefsirde bulamadım. Tahminle cevap "
                          "vermek istemiyorum. Kişisel dini sorular için Diyanet fetva hattını (ALO 190) arayabilirsin.",
            }
        sources = [_src(i + 1, d, surah_names) for i, (_, _, d) in enumerate(good[:4])]
        passages = "\n\n".join(
            f"[{s['n']}] {s['ref']}\nMeal: {s['meal']}\nTefsir: {s['tafsir'][:900]}" for s in sources
        )
        system = (
            "Sen bir kütüphaneci gibi çalışan yapay zekâ rehbersin. KESİN KURALLAR:\n"
            "1. YALNIZ aşağıdaki PARÇALARDA yazanlara dayanarak cevap ver. Parçalarda olmayan hiçbir bilgi, hadis, "
            "hüküm ya da rivayet ekleme.\n"
            "2. Her cümlenin sonuna dayandığı parçanın numarasını köşeli parantezle yaz: [1].\n"
            "3. Parçalar soruyu cevaplamıyorsa ETİKET satırına yok yaz ve bunu açıkça söyle.\n"
            "4. Parçalar farklı görüşler ya da durumlar anlatıyorsa ETİKET fark olsun ve hepsini kısaca belirt.\n"
            "5. Hiçbir kişinin ağzından konuşma. Fetva verme. En çok 5 cümle yaz.\n"
            "ÇIKTI BİÇİMİ (tam olarak):\nETİKET: acik | fark | yok\nCEVAP: ...")
        try:
            raw = await gemini_generate(f"SORU: {q}\n\nPARÇALAR:\n{passages}", system)
        except Exception as e:
            logger.error("Rehber LLM hatası: %s", e)
            raw = ""
        label, answer = "acik", ""
        m = re.search(r"ET[İI]KET:\s*(acik|açık|fark|yok)", raw or "", re.I)
        if m:
            label = {"açık": "acik"}.get(m.group(1).lower(), m.group(1).lower())
        m2 = re.search(r"CEVAP:\s*(.+)", raw or "", re.S)
        if m2:
            answer = m2.group(1).strip()
        if not answer:
            # Model cevap vermediyse uydurma yok: yalnız bulunan ayetler gösterilir.
            label = "acik"
            answer = "Sorunla en ilgili ayetleri aşağıda bulabilirsin. Özet şu an hazırlanamadı; meal ve tefsiri doğrudan okuyabilirsin."
        # Model kaynak göstermeden cevap yazdıysa güvenme.
        elif label != "yok" and not re.search(r"\[\d\]", answer):
            answer += " (Bu özet parça numarası içermiyor; lütfen aşağıdaki kaynaklardan doğrula.)"
        if label == "yok":
            sources = []
        return {"label": label, "answer": answer, "sources": sources, "credits": credits(), "ai_label": AI_LABEL}

    @router.post("/rehber/anlat")
    async def explain_check(body: ExplainIn):
        """'Kendi cümlenle anlat': kullanıcının özeti tefsirle karşılaştırılır. Puan yok."""
        docs = [d for d in INDEX.docs if d["surah"] == body.surah and d["ayah"] >= body.from_ayah
                and (body.to_ayah == 0 or d["ayah"] <= body.to_ayah)][:40]
        if not docs or len((body.text or "").strip()) < 10:
            raise HTTPException(status_code=400, detail="Metin ya da ayet aralığı eksik")
        tafsir = "\n".join(f"({d['ayah']}) {d['tafsir'] or d['meal']}" for d in docs)[:6000]
        system = (
            "Bir okuyucu, okuduğu Kur'an bölümünü kendi cümleleriyle özetledi. Görevin onu TEFSİR METNİYLE "
            "karşılaştırmak. Yalnız tefsir metninde geçenlere dayan; dışarıdan bilgi ekleme. Yargılama, not verme.\n"
            "ÇIKTI BİÇİMİ (tam olarak, her biri tek cümle):\nYAKALADIĞIN: ...\nEKLEYEBİLECEĞİN: ...")
        try:
            raw = await gemini_generate(f"TEFSİR METNİ:\n{tafsir}\n\nOKUYUCUNUN ÖZETİ:\n{body.text}", system)
        except Exception:
            raw = ""
        a = re.search(r"YAKALADIĞIN:\s*(.+)", raw or "")
        b = re.search(r"EKLEYEB[İI]LECEĞ[İI]N:\s*(.+)", raw or "")
        if not a and not b:
            raise HTTPException(status_code=503, detail="Karşılaştırma şu an yapılamadı")
        return {"caught": a.group(1).strip() if a else "", "add": b.group(1).strip() if b else "",
                "credits": credits(), "ai_label": AI_LABEL}

    # ── Dinleyen yoldaş (Dönüş Odası): günde tek soru, kısa ve yargısız karşılık ──
    # GÜVENLİK: Ağır bir işaret sezilirse yapay zekâ ÇAĞRILMAZ; sabit bir yönlendirme kartı döner.
    # Bu liste bilerek geniştir: yanlışlıkla kart göstermek, gerekirken göstermemekten iyidir.
    CRISIS = ("intihar", "ölmek ist", "ölsem", "öldürmek", "kendime zarar", "kendimi kes", "yaşamak istem", "hayatıma son",
              "anlamı yok", "anlamı kalmadı", "dayanamıyorum", "bitsin art", "kurtulmak istiyorum", "yok olmak", "canıma kıy",
              "hiçbir şeyin anlam", "umudum kalmadı", "çaresiz", "nefret ediyorum kendim", "değersiz")

    @router.post("/rehber/yoldas")
    async def companion(body: TextIn):
        text = (body.text or "").strip()
        if len(text) < 2:
            raise HTTPException(status_code=400, detail="Metin boş")
        low = _norm(text)
        if any(k in low for k in CRISIS):
            return {"care": True, "reply": None}
        system = (
            "Bir kullanıcı, dinî hayatına dönmeye çalıştığı kırk günlük bir yolculukta 'Bugün seni en çok ne yordu?' "
            "sorusuna cevap yazdı. Sen dinleyen bir yoldaşsın; terapist, müftü ya da vaiz DEĞİLSİN.\n"
            "KURALLAR: En çok 3 kısa cümle. Önce duyduğunu kendi kelimelerinle yansıt. Yargılama, öğüt verme, teşhis koyma, "
            "ayet ya da hadis UYDURMA (hiç alıntı yapma). Dinî hüküm verme. 'Zorunda', 'yapmalısın' deme. "
            "Sonunda tek bir yumuşak cümleyle yarın yine burada olacağını söyle. Türkçe yaz.")
        try:
            reply = await gemini_generate(text[:800], system)
        except Exception:
            reply = ""
        if not reply or any(k in _norm(reply) for k in ("intihar", "teşhis", "ilaç")):
            reply = "Yazdığını okudum. Bugün ağır geçmiş; bunu söyleyebilmen de bir adım. Yarın yine buradayım."
        return {"care": False, "reply": reply.strip(), "ai_label": "Yapay zekâ · terapi ya da dinî hüküm değildir"}

    # ── Doğrula: yapıştırılan söz hadis veritabanında var mı? ──
    hadiths = []
    try:
        with open(ROOT_DIR / "data" / "hadiths.json", "r", encoding="utf-8") as f:
            hadiths = json.load(f)
    except Exception as e:
        logger.warning("Doğrula: hadis verisi okunamadı: %s", e)
    h_tokens = [set(_tokens(h.get("turkish", ""))) for h in hadiths]

    @router.post("/rehber/dogrula")
    async def verify(body: TextIn):
        q = set(_tokens(body.text))
        if len(q) < 2:
            raise HTTPException(status_code=400, detail="Metin çok kısa")
        best, best_i = 0.0, -1
        for i, ht in enumerate(h_tokens):
            if not ht:
                continue
            overlap = len(q & ht) / len(q)
            if overlap > best:
                best, best_i = overlap, i
        note = ("Arama yalnız uygulamadaki hadis veritabanında (Buhârî'den 500 hadis) yapılır. 'Bulunamadı', sözün "
                "uydurma olduğu anlamına gelmez. Emin olmak için ALO 190.")
        if best_i >= 0 and best >= 0.7:
            h = hadiths[best_i]
            return {"result": "bulundu", "match": round(best, 2), "note": note,
                    "hadith": {"text": h.get("turkish", ""), "source": f"Buhârî, {h.get('bookTr', '')} · no {h.get('number', '')}"}}
        return {"result": "bulunamadi", "match": round(best, 2), "note": note, "hadith": None}
